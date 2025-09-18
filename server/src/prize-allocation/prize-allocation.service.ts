import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HashChainService } from '../hash-chain/hash-chain.service';
import { ChainEntryType, CompetitionStatus, Prisma } from '@prisma/client';
import * as crypto from 'crypto';

export interface AllocatePrizeDto {
  competitionId: string;
  ticketId: string;
  prizeId: string;
  userId: string;
  isInstantWin?: boolean;
}

export interface DrawResult {
  competitionId: string;
  seed: string;
  winners: {
    ticketId: string;
    userId: string;
    prizeId: string;
    position: number;
  }[];
  timestamp: Date;
  chainHash?: string;
}

@Injectable()
export class PrizeAllocationService {
  private readonly logger = new Logger(PrizeAllocationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly hashChainService: HashChainService
  ) {}

  async allocatePrize(allocateDto: AllocatePrizeDto) {
    return await this.prisma.$transaction(async (prisma) => {
      const competition = await prisma.competition.findUnique({
        where: { id: allocateDto.competitionId }
      });

      if (!competition) {
        throw new Error('Competition not found');
      }

      const ticket = await prisma.ticket.findUnique({
        where: { id: allocateDto.ticketId },
        include: { winner: true }
      });

      if (!ticket) {
        throw new Error('Ticket not found');
      }

      if (ticket.winner) {
        throw new Error('Prize already allocated for this ticket');
      }

      const prize = await prisma.prize.findUnique({
        where: { id: allocateDto.prizeId }
      });

      if (!prize) {
        throw new Error('Prize not found');
      }

      const winner = await prisma.winner.create({
        data: {
          competitionId: allocateDto.competitionId,
          userId: allocateDto.userId,
          ticketId: allocateDto.ticketId,
          prizeId: allocateDto.prizeId,
          status: 'PENDING'
        }
      });

      await prisma.ticket.update({
        where: { id: allocateDto.ticketId },
        data: { status: 'WINNER' }
      });

      const chainEntry = await this.hashChainService.addEntry({
        type: ChainEntryType.PRIZE_ALLOCATION,
        data: {
          competitionId: allocateDto.competitionId,
          ticketId: allocateDto.ticketId,
          userId: allocateDto.userId,
          prizeId: allocateDto.prizeId,
          winnerId: winner.id,
          isInstantWin: allocateDto.isInstantWin || false
        },
        metadata: {
          timestamp: new Date().toISOString(),
          prizeValue: prize.value,
          prizeName: prize.name
        }
      });

      this.logger.log(`Prize allocated: winnerId=${winner.id}, ticketId=${allocateDto.ticketId}, chainHash=${chainEntry.hash}`);

      return {
        winner,
        chainEntry
      };
    }, {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable
    });
  }

  async executeCompetitionDraw(competitionId: string): Promise<DrawResult> {
    return await this.prisma.$transaction(async (prisma) => {
      const competition = await prisma.competition.findUnique({
        where: { id: competitionId },
        include: {
          prizes: { orderBy: { position: 'asc' } },
          drawSeed: true
        }
      });

      if (!competition) {
        throw new Error('Competition not found');
      }

      if (competition.status !== CompetitionStatus.DRAWING) {
        throw new Error(`Competition must be in DRAWING status. Current status: ${competition.status}`);
      }

      if (!competition.drawSeed || !competition.drawSeed.seedReveal) {
        throw new Error('Draw seed must be revealed before executing draw');
      }

      const eligibleTickets = await prisma.ticket.findMany({
        where: {
          competitionId,
          status: 'ACTIVE'
        },
        orderBy: { ticketNumber: 'asc' }
      });

      if (eligibleTickets.length === 0) {
        throw new Error('No eligible tickets for draw');
      }

      const seed = competition.drawSeed.seedReveal;
      const winners = this.selectWinners(eligibleTickets, competition.prizes, seed);

      const allocatedWinners: any[] = [];
      for (const winner of winners) {
        const allocation = await this.allocatePrize({
          competitionId,
          ticketId: winner.ticket.id,
          prizeId: winner.prize.id,
          userId: winner.ticket.userId,
          isInstantWin: false
        });
        allocatedWinners.push({
          ticketId: winner.ticket.id,
          userId: winner.ticket.userId,
          prizeId: winner.prize.id,
          position: winner.prize.position
        });
      }

      const drawResultEntry = await this.hashChainService.addEntry({
        type: ChainEntryType.DRAW_RESULT,
        data: {
          competitionId,
          seed,
          winnersCount: allocatedWinners.length,
          winners: allocatedWinners.map(w => ({
            ticketId: w.ticketId,
            prizePosition: w.position
          }))
        },
        metadata: {
          timestamp: new Date().toISOString(),
          totalEligibleTickets: eligibleTickets.length,
          totalPrizes: competition.prizes.length
        }
      });

      await prisma.drawSeed.update({
        where: { id: competition.drawSeed.id },
        data: { status: 'USED' }
      });

      await prisma.competition.update({
        where: { id: competitionId },
        data: { status: CompetitionStatus.COMPLETED }
      });

      this.logger.log(`Competition draw executed: competitionId=${competitionId}, winners=${allocatedWinners.length}, chainHash=${drawResultEntry.hash}`);

      return {
        competitionId,
        seed,
        winners: allocatedWinners,
        timestamp: new Date(),
        chainHash: drawResultEntry.hash
      };
    }, {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable
    });
  }

  private selectWinners(tickets: any[], prizes: any[], seed: string): any[] {
    const winners: any[] = [];
    const remainingTickets = [...tickets];

    const prng = this.createPRNG(seed);

    for (const prize of prizes) {
      for (let q = 0; q < prize.quantity; q++) {
        if (remainingTickets.length === 0) break;

        const randomIndex = Math.floor(prng() * remainingTickets.length);
        const winningTicket = remainingTickets.splice(randomIndex, 1)[0];

        winners.push({
          ticket: winningTicket,
          prize: prize
        });
      }
    }

    return winners;
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

  async commitDrawSeed(competitionId: string, seed: string) {
    const seedHash = crypto.createHash('sha256').update(seed).digest('hex');

    return await this.prisma.$transaction(async (prisma) => {
      const existing = await prisma.drawSeed.findUnique({
        where: { competitionId }
      });

      if (existing) {
        throw new Error('Seed already committed for this competition');
      }

      const drawSeed = await prisma.drawSeed.create({
        data: {
          competitionId,
          seedCommit: seedHash,
          commitTimestamp: new Date(),
          status: 'COMMITTED'
        }
      });

      const chainEntry = await this.hashChainService.addEntry({
        type: ChainEntryType.SEED_COMMIT,
        data: {
          competitionId,
          seedCommit: seedHash,
          drawSeedId: drawSeed.id
        },
        metadata: {
          timestamp: new Date().toISOString()
        }
      });

      this.logger.log(`Draw seed committed: competitionId=${competitionId}, seedHash=${seedHash}, chainHash=${chainEntry.hash}`);

      return {
        drawSeed,
        chainEntry
      };
    });
  }

  async revealDrawSeed(competitionId: string, seed: string) {
    const seedHash = crypto.createHash('sha256').update(seed).digest('hex');

    return await this.prisma.$transaction(async (prisma) => {
      const drawSeed = await prisma.drawSeed.findUnique({
        where: { competitionId }
      });

      if (!drawSeed) {
        throw new Error('No seed committed for this competition');
      }

      if (drawSeed.seedReveal) {
        throw new Error('Seed already revealed');
      }

      if (drawSeed.seedCommit !== seedHash) {
        throw new Error('Seed does not match committed hash');
      }

      const updatedSeed = await prisma.drawSeed.update({
        where: { id: drawSeed.id },
        data: {
          seedReveal: seed,
          revealTimestamp: new Date(),
          status: 'REVEALED'
        }
      });

      const chainEntry = await this.hashChainService.addEntry({
        type: ChainEntryType.SEED_REVEAL,
        data: {
          competitionId,
          seedReveal: seed,
          drawSeedId: drawSeed.id
        },
        metadata: {
          timestamp: new Date().toISOString(),
          commitHash: drawSeed.seedCommit
        }
      });

      this.logger.log(`Draw seed revealed: competitionId=${competitionId}, chainHash=${chainEntry.hash}`);

      return {
        drawSeed: updatedSeed,
        chainEntry
      };
    });
  }

  async claimPrize(winnerId: string, userId: string) {
    return await this.prisma.$transaction(async (prisma) => {
      const winner = await prisma.winner.findFirst({
        where: {
          id: winnerId,
          userId: userId
        },
        include: {
          prize: true,
          ticket: true
        }
      });

      if (!winner) {
        throw new Error('Winner record not found or unauthorized');
      }

      if (winner.status !== 'PENDING' && winner.status !== 'NOTIFIED') {
        throw new Error(`Prize cannot be claimed. Current status: ${winner.status}`);
      }

      const updatedWinner = await prisma.winner.update({
        where: { id: winnerId },
        data: {
          status: 'CLAIMED',
          claimedAt: new Date()
        }
      });

      const chainEntry = await this.hashChainService.addEntry({
        type: ChainEntryType.PRIZE_CLAIM,
        data: {
          winnerId,
          userId,
          ticketId: winner.ticketId,
          prizeId: winner.prizeId,
          competitionId: winner.competitionId
        },
        metadata: {
          timestamp: new Date().toISOString(),
          prizeValue: winner.prize.value,
          prizeName: winner.prize.name
        }
      });

      this.logger.log(`Prize claimed: winnerId=${winnerId}, chainHash=${chainEntry.hash}`);

      return {
        winner: updatedWinner,
        chainEntry
      };
    });
  }

  async getCompetitionWinners(competitionId: string) {
    return await this.prisma.winner.findMany({
      where: { competitionId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true
          }
        },
        prize: true,
        ticket: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}