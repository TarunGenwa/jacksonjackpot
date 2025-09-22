import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, CompetitionStatus } from '@prisma/client';

@Injectable()
export class CompetitionsService {
  constructor(private prisma: PrismaService) {}

  async findAll(params?: {
    skip?: number;
    take?: number;
    where?: Prisma.CompetitionWhereInput;
    orderBy?: Prisma.CompetitionOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params || {};

    const [competitions, total] = await Promise.all([
      this.prisma.competition.findMany({
        skip,
        take,
        where,
        orderBy: orderBy || { createdAt: 'desc' },
        include: {
          charity: {
            select: {
              name: true,
              logoUrl: true,
            },
          },
          prizes: {
            orderBy: { position: 'asc' },
          },
          _count: {
            select: {
              tickets: true,
              winners: true,
            },
          },
        },
      }),
      this.prisma.competition.count({ where }),
    ]);

    return {
      competitions,
      total,
      skip: skip || 0,
      take: take || competitions.length,
    };
  }

  async findOne(id: string) {
    const competition = await this.prisma.competition.findUnique({
      where: { id },
      include: {
        charity: true,
        prizes: {
          orderBy: { position: 'asc' },
        },
        tickets: {
          take: 20,
          orderBy: { purchasedAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
        },
        winners: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
            prize: true,
            ticket: true,
          },
        },
      },
    });

    if (!competition) {
      throw new NotFoundException(`Competition with ID ${id} not found`);
    }

    return competition;
  }

  async create(data: Prisma.CompetitionCreateInput) {
    return this.prisma.competition.create({
      data,
      include: {
        charity: true,
        prizes: true,
      },
    });
  }

  async update(id: string, data: Prisma.CompetitionUpdateInput) {
    try {
      const competition = await this.prisma.competition.update({
        where: { id },
        data,
        include: {
          charity: true,
          prizes: true,
        },
      });
      return competition;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Competition with ID ${id} not found`);
      }
      throw error;
    }
  }

  async updateStatus(id: string, status: CompetitionStatus) {
    return this.update(id, { status });
  }

  async delete(id: string) {
    try {
      await this.prisma.competition.delete({
        where: { id },
      });
      return { message: `Competition with ID ${id} has been deleted` };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Competition with ID ${id} not found`);
      }
      throw error;
    }
  }

  async getStatistics() {
    const [
      totalCompetitions,
      activeCompetitions,
      completedCompetitions,
      totalRevenue,
      totalTicketsSold,
      competitionsByStatus,
    ] = await Promise.all([
      this.prisma.competition.count(),
      this.prisma.competition.count({ where: { status: 'ACTIVE' } }),
      this.prisma.competition.count({ where: { status: 'COMPLETED' } }),
      this.prisma.competition.aggregate({
        _sum: {
          ticketsSold: true,
        },
      }),
      this.prisma.ticket.count(),
      this.prisma.competition.groupBy({
        by: ['status'],
        _count: true,
      }),
    ]);

    const avgTicketsPerCompetition =
      totalCompetitions > 0 ? totalTicketsSold / totalCompetitions : 0;

    return {
      totalCompetitions,
      activeCompetitions,
      completedCompetitions,
      totalTicketsSold,
      avgTicketsPerCompetition: Math.round(avgTicketsPerCompetition),
      competitionsByStatus: competitionsByStatus.reduce(
        (acc, curr) => {
          acc[curr.status] = curr._count;
          return acc;
        },
        {} as Record<string, number>,
      ),
    };
  }

  async getPrizes(competitionId: string) {
    const competition = await this.prisma.competition.findUnique({
      where: { id: competitionId },
      include: {
        prizes: {
          orderBy: { position: 'asc' },
        },
      },
    });

    if (!competition) {
      throw new NotFoundException(`Competition with ID ${competitionId} not found`);
    }

    return competition.prizes;
  }

  async createPrize(
    competitionId: string,
    prizeData: {
      name: string;
      description?: string;
      value: number;
      position: number;
      quantity?: number;
    },
  ) {
    const competition = await this.prisma.competition.findUnique({
      where: { id: competitionId },
    });

    if (!competition) {
      throw new NotFoundException(`Competition with ID ${competitionId} not found`);
    }

    try {
      const prize = await this.prisma.prize.create({
        data: {
          name: prizeData.name,
          description: prizeData.description || '',
          value: prizeData.value,
          position: prizeData.position,
          quantity: prizeData.quantity || 1,
          competitionId,
        },
      });
      return prize;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException(
          `A prize with position ${prizeData.position} already exists for this competition`,
        );
      }
      throw error;
    }
  }

  async updatePrize(
    competitionId: string,
    prizeId: string,
    prizeData: {
      name?: string;
      description?: string;
      value?: number;
      position?: number;
      quantity?: number;
    },
  ) {
    const prize = await this.prisma.prize.findFirst({
      where: {
        id: prizeId,
        competitionId,
      },
    });

    if (!prize) {
      throw new NotFoundException(
        `Prize with ID ${prizeId} not found for competition ${competitionId}`,
      );
    }

    try {
      const updatedPrize = await this.prisma.prize.update({
        where: { id: prizeId },
        data: prizeData,
      });
      return updatedPrize;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException(
          `A prize with position ${prizeData.position} already exists for this competition`,
        );
      }
      throw error;
    }
  }

  async deletePrize(competitionId: string, prizeId: string) {
    const prize = await this.prisma.prize.findFirst({
      where: {
        id: prizeId,
        competitionId,
      },
    });

    if (!prize) {
      throw new NotFoundException(
        `Prize with ID ${prizeId} not found for competition ${competitionId}`,
      );
    }

    await this.prisma.prize.delete({
      where: { id: prizeId },
    });

    return { message: `Prize with ID ${prizeId} has been deleted` };
  }
}
