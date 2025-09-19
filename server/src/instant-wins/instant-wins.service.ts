import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HashChainService } from '../hash-chain/hash-chain.service';
import { PrizeAllocationService } from '../prize-allocation/prize-allocation.service';
import { ChainEntryType, Prisma } from '@prisma/client';
import * as crypto from 'crypto';

export interface CreateInstantWinDto {
  competitionId: string;
  prizeId: string;
  position: number;
}

export interface InstantWinCheckResult {
  isWinner: boolean;
  instantWin?: any;
  prize?: any;
}

@Injectable()
export class InstantWinsService {
  private readonly logger = new Logger(InstantWinsService.name);
  private encryptionKey: Buffer;

  constructor(
    private readonly prisma: PrismaService,
    private readonly hashChainService: HashChainService,
    private readonly prizeAllocationService: PrizeAllocationService,
  ) {
    this.encryptionKey = crypto.scryptSync(
      process.env.INSTANT_WIN_SECRET || 'default-secret-change-in-production',
      'salt',
      32,
    );
  }

  async generateInstantWins(
    competitionId: string,
    totalTickets: number,
    instantWinPercentage: number = 5,
  ) {
    return await this.prisma.$transaction(async (prisma) => {
      const competition = await prisma.competition.findUnique({
        where: { id: competitionId },
        include: {
          prizes: {
            where: { position: { gte: 100 } },
            orderBy: { position: 'asc' },
          },
        },
      });

      if (!competition) {
        throw new Error('Competition not found');
      }

      const numberOfInstantWins = Math.floor(
        (totalTickets * instantWinPercentage) / 100,
      );
      const winningPositions = this.generateRandomPositions(
        numberOfInstantWins,
        totalTickets,
      );

      const instantWins: any[] = [];
      const availablePrizes = [...competition.prizes];

      for (
        let i = 0;
        i < winningPositions.length && i < availablePrizes.length;
        i++
      ) {
        const position = winningPositions[i];
        const prize = availablePrizes[i % availablePrizes.length];

        const encryptedData = this.encryptWinData({
          position,
          prizeId: prize.id,
          competitionId,
          createdAt: new Date().toISOString(),
        });

        const instantWin = await prisma.instantWin.create({
          data: {
            competitionId,
            prizeId: prize.id,
            position,
            encryptedData,
          },
        });

        instantWins.push(instantWin);
      }

      const chainEntry = await this.hashChainService.addEntry({
        type: ChainEntryType.COMPETITION_STATE_CHANGE,
        data: {
          competitionId,
          action: 'INSTANT_WINS_GENERATED',
          instantWinsCount: instantWins.length,
          totalTickets,
          percentage: instantWinPercentage,
        },
        metadata: {
          timestamp: new Date().toISOString(),
          positionsHash: this.hashPositions(winningPositions),
        },
      });

      this.logger.log(
        `Generated ${instantWins.length} instant wins for competition ${competitionId}`,
      );

      return {
        instantWins: instantWins.length,
        chainEntry,
      };
    });
  }

  async checkForInstantWin(
    ticketNumber: string,
    competitionId: string,
  ): Promise<InstantWinCheckResult> {
    const ticketPosition = this.getTicketPosition(ticketNumber);

    const instantWin = await this.prisma.instantWin.findUnique({
      where: {
        competitionId_position: {
          competitionId,
          position: ticketPosition,
        },
      },
      include: {
        prize: true,
      },
    });

    if (!instantWin || instantWin.isClaimed) {
      return { isWinner: false };
    }

    const decryptedData = this.decryptWinData(instantWin.encryptedData);

    if (decryptedData.position !== ticketPosition) {
      this.logger.error(
        `Position mismatch for instant win: expected ${ticketPosition}, got ${decryptedData.position}`,
      );
      return { isWinner: false };
    }

    return {
      isWinner: true,
      instantWin,
      prize: instantWin.prize,
    };
  }

  async claimInstantWin(
    instantWinId: string,
    ticketId: string,
    userId: string,
  ) {
    return await this.prisma.$transaction(
      async (prisma) => {
        const instantWin = await prisma.instantWin.findUnique({
          where: { id: instantWinId },
          include: {
            prize: true,
            competition: true,
          },
        });

        if (!instantWin) {
          throw new Error('Instant win not found');
        }

        if (instantWin.isClaimed) {
          throw new Error('Instant win already claimed');
        }

        const ticket = await prisma.ticket.findUnique({
          where: { id: ticketId },
        });

        if (!ticket) {
          throw new Error('Ticket not found');
        }

        if (ticket.userId !== userId) {
          throw new Error('Unauthorized: ticket does not belong to user');
        }

        const ticketPosition = this.getTicketPosition(ticket.ticketNumber);
        if (ticketPosition !== instantWin.position) {
          throw new Error(
            'Ticket position does not match instant win position',
          );
        }

        const prizeAllocation = await this.prizeAllocationService.allocatePrize(
          {
            competitionId: instantWin.competitionId,
            ticketId,
            prizeId: instantWin.prizeId,
            userId,
            isInstantWin: true,
          },
        );

        const updatedInstantWin = await prisma.instantWin.update({
          where: { id: instantWinId },
          data: {
            isClaimed: true,
            claimedByTicketId: ticketId,
            chainEntryId: prizeAllocation.chainEntry.id,
          },
        });

        await this.revealInstantWin(instantWinId, prisma);

        const chainEntry = await this.hashChainService.addEntry({
          type: ChainEntryType.INSTANT_WIN_REVEAL,
          data: {
            instantWinId,
            ticketId,
            userId,
            prizeId: instantWin.prizeId,
            competitionId: instantWin.competitionId,
            position: instantWin.position,
          },
          metadata: {
            timestamp: new Date().toISOString(),
            prizeName: instantWin.prize.name,
            prizeValue: instantWin.prize.value,
          },
        });

        this.logger.log(
          `Instant win claimed: id=${instantWinId}, ticketId=${ticketId}, chainHash=${chainEntry.hash}`,
        );

        return {
          instantWin: updatedInstantWin,
          prizeAllocation,
          chainEntry,
        };
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );
  }

  private async revealInstantWin(instantWinId: string, prisma: any) {
    await prisma.instantWin.update({
      where: { id: instantWinId },
      data: { isRevealed: true },
    });
  }

  private generateRandomPositions(count: number, max: number): number[] {
    const positions = new Set<number>();
    const seed = crypto.randomBytes(32).toString('hex');
    const prng = this.createPRNG(seed);

    while (positions.size < count) {
      const position = Math.floor(prng() * max) + 1;
      positions.add(position);
    }

    return Array.from(positions).sort((a, b) => a - b);
  }

  private createPRNG(seed: string): () => number {
    let currentSeed = this.hashToNumber(seed);

    return () => {
      currentSeed = (currentSeed * 1103515245 + 12345) % 2147483648;
      return currentSeed / 2147483648;
    };
  }

  private hashToNumber(hash: string): number {
    const hex = hash.substring(0, 8);
    return parseInt(hex, 16);
  }

  private encryptWinData(data: any): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', this.encryptionKey, iv);

    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return iv.toString('hex') + ':' + encrypted;
  }

  private decryptWinData(encryptedData: string): any {
    const [ivHex, encrypted] = encryptedData.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      this.encryptionKey,
      iv,
    );

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return JSON.parse(decrypted);
  }

  private getTicketPosition(ticketNumber: string): number {
    const match = ticketNumber.match(/\d+$/);
    return match ? parseInt(match[0], 10) : 0;
  }

  private hashPositions(positions: number[]): string {
    return crypto
      .createHash('sha256')
      .update(JSON.stringify(positions))
      .digest('hex');
  }

  async getInstantWinsForCompetition(
    competitionId: string,
    includeRevealed: boolean = false,
  ) {
    const where: Prisma.InstantWinWhereInput = {
      competitionId,
    };

    if (!includeRevealed) {
      where.isRevealed = false;
    }

    return await this.prisma.instantWin.findMany({
      where,
      include: {
        prize: true,
      },
      orderBy: { position: 'asc' },
    });
  }

  async getUnclaimedInstantWinsCount(competitionId: string) {
    return await this.prisma.instantWin.count({
      where: {
        competitionId,
        isClaimed: false,
      },
    });
  }
}
