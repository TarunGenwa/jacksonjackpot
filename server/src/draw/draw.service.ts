import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrizeAllocationService } from '../prize-allocation/prize-allocation.service';
import { HashChainService } from '../hash-chain/hash-chain.service';
import { CompetitionStatus } from '@prisma/client';

export interface CommitSeedDto {
  competitionId: string;
  seed: string;
}

export interface RevealSeedDto {
  competitionId: string;
  seed: string;
}

export interface ExecuteDrawDto {
  competitionId: string;
}

@Injectable()
export class DrawService {
  private readonly logger = new Logger(DrawService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly prizeAllocationService: PrizeAllocationService,
    private readonly hashChainService: HashChainService,
  ) {}

  async commitSeed(dto: CommitSeedDto) {
    const competition = await this.prisma.competition.findUnique({
      where: { id: dto.competitionId },
    });

    if (!competition) {
      throw new NotFoundException('Competition not found');
    }

    if (
      competition.status !== CompetitionStatus.ACTIVE &&
      competition.status !== CompetitionStatus.SOLD_OUT
    ) {
      throw new BadRequestException(
        `Cannot commit seed for competition in ${competition.status} status`,
      );
    }

    try {
      const result = await this.prizeAllocationService.commitDrawSeed(
        dto.competitionId,
        dto.seed,
      );
      return {
        success: true,
        drawSeedId: result.drawSeed.id,
        commitHash: result.drawSeed.seedCommit,
        chainHash: result.chainEntry.hash,
        timestamp: result.drawSeed.commitTimestamp,
      };
    } catch (error) {
      if (error.message.includes('already committed')) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  async revealSeed(dto: RevealSeedDto) {
    const competition = await this.prisma.competition.findUnique({
      where: { id: dto.competitionId },
      include: { drawSeed: true },
    });

    if (!competition) {
      throw new NotFoundException('Competition not found');
    }

    if (!competition.drawSeed) {
      throw new BadRequestException('No seed committed for this competition');
    }

    if (competition.status !== CompetitionStatus.DRAWING) {
      await this.prisma.competition.update({
        where: { id: dto.competitionId },
        data: { status: CompetitionStatus.DRAWING },
      });
    }

    try {
      const result = await this.prizeAllocationService.revealDrawSeed(
        dto.competitionId,
        dto.seed,
      );
      return {
        success: true,
        drawSeedId: result.drawSeed.id,
        seedReveal: result.drawSeed.seedReveal,
        chainHash: result.chainEntry.hash,
        timestamp: result.drawSeed.revealTimestamp,
      };
    } catch (error) {
      if (
        error.message.includes('does not match') ||
        error.message.includes('already revealed')
      ) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  async executeDraw(dto: ExecuteDrawDto) {
    const competition = await this.prisma.competition.findUnique({
      where: { id: dto.competitionId },
      include: {
        drawSeed: true,
        prizes: true,
        _count: {
          select: { tickets: true },
        },
      },
    });

    if (!competition) {
      throw new NotFoundException('Competition not found');
    }

    if (!competition.drawSeed || !competition.drawSeed.seedReveal) {
      throw new BadRequestException(
        'Seed must be revealed before executing draw',
      );
    }

    if (competition.prizes.length === 0) {
      throw new BadRequestException(
        'No prizes configured for this competition',
      );
    }

    if (competition._count.tickets === 0) {
      throw new BadRequestException('No tickets sold for this competition');
    }

    try {
      const result = await this.prizeAllocationService.executeCompetitionDraw(
        dto.competitionId,
      );

      return {
        success: true,
        competitionId: result.competitionId,
        winnersCount: result.winners.length,
        winners: result.winners,
        chainHash: result.chainHash,
        timestamp: result.timestamp,
      };
    } catch (error) {
      if (error.message.includes('must be in DRAWING status')) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  async getDrawStatus(competitionId: string) {
    const competition = await this.prisma.competition.findUnique({
      where: { id: competitionId },
      include: {
        drawSeed: true,
        winners: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
              },
            },
            prize: true,
            ticket: true,
          },
        },
        _count: {
          select: {
            tickets: true,
            prizes: true,
            winners: true,
          },
        },
      },
    });

    if (!competition) {
      throw new NotFoundException('Competition not found');
    }

    return {
      competitionId: competition.id,
      status: competition.status,
      drawDate: competition.drawDate,
      seedStatus: competition.drawSeed
        ? competition.drawSeed.status
        : 'NOT_COMMITTED',
      seedCommitted: !!competition.drawSeed,
      seedRevealed: !!(competition.drawSeed && competition.drawSeed.seedReveal),
      statistics: {
        totalTickets: competition._count.tickets,
        totalPrizes: competition._count.prizes,
        winnersSelected: competition._count.winners,
      },
      winners: competition.winners.map((w) => ({
        winnerId: w.id,
        username: w.user.username,
        ticketNumber: w.ticket.ticketNumber,
        prizeName: w.prize.name,
        prizeValue: w.prize.value,
        claimStatus: w.status,
        claimedAt: w.claimedAt,
      })),
    };
  }

  async getUpcomingDraws(limit: number = 10) {
    const competitions = await this.prisma.competition.findMany({
      where: {
        status: {
          in: [CompetitionStatus.ACTIVE, CompetitionStatus.SOLD_OUT],
        },
        drawDate: {
          gte: new Date(),
        },
      },
      include: {
        charity: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            tickets: true,
            prizes: true,
          },
        },
      },
      orderBy: {
        drawDate: 'asc',
      },
      take: limit,
    });

    return competitions.map((c) => ({
      competitionId: c.id,
      title: c.title,
      charityName: c.charity.name,
      drawDate: c.drawDate,
      status: c.status,
      ticketsSold: c._count.tickets,
      maxTickets: c.maxTickets,
      totalPrizes: c._count.prizes,
      soldOutPercentage: Math.round((c._count.tickets / c.maxTickets) * 100),
    }));
  }

  async validateDrawIntegrity(competitionId: string) {
    const competition = await this.prisma.competition.findUnique({
      where: { id: competitionId },
      include: {
        drawSeed: true,
        winners: true,
      },
    });

    if (!competition) {
      throw new NotFoundException('Competition not found');
    }

    if (!competition.drawSeed) {
      return {
        valid: false,
        error: 'No draw seed found',
      };
    }

    const chainEntries =
      await this.hashChainService.getEntriesByType('DRAW_RESULT');
    const drawEntry = chainEntries.find(
      (e) => (e.data as any).competitionId === competitionId,
    );

    if (!drawEntry) {
      return {
        valid: false,
        error: 'No draw result entry found in chain',
      };
    }

    const verificationResult = await this.hashChainService.verifyChain(
      drawEntry.sequence - 10,
      drawEntry.sequence + 10,
    );

    return {
      valid: verificationResult.isValid,
      drawSeed: {
        committed: !!competition.drawSeed.seedCommit,
        revealed: !!competition.drawSeed.seedReveal,
        status: competition.drawSeed.status,
      },
      chainVerification: verificationResult,
      winnersCount: competition.winners.length,
      drawResultHash: drawEntry.hash,
    };
  }
}
