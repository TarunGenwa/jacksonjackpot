import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CharitiesService {
  constructor(private prisma: PrismaService) {}

  async findAll(params?: {
    skip?: number;
    take?: number;
    where?: Prisma.CharityWhereInput;
    orderBy?: Prisma.CharityOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params || {};

    const [charities, total] = await Promise.all([
      this.prisma.charity.findMany({
        skip,
        take,
        where,
        orderBy: orderBy || { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              competitions: true,
              donations: true,
            },
          },
        },
      }),
      this.prisma.charity.count({ where }),
    ]);

    return {
      charities,
      total,
      skip: skip || 0,
      take: take || charities.length,
    };
  }

  async findOne(id: string) {
    const charity = await this.prisma.charity.findUnique({
      where: { id },
      include: {
        competitions: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            _count: {
              select: {
                tickets: true,
                winners: true,
              },
            },
          },
        },
        donations: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!charity) {
      throw new NotFoundException(`Charity with ID ${id} not found`);
    }

    return charity;
  }

  async create(data: Prisma.CharityCreateInput) {
    return this.prisma.charity.create({
      data,
    });
  }

  async update(id: string, data: Prisma.CharityUpdateInput) {
    try {
      const charity = await this.prisma.charity.update({
        where: { id },
        data,
      });
      return charity;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Charity with ID ${id} not found`);
      }
      throw error;
    }
  }

  async toggleVerification(id: string) {
    const charity = await this.prisma.charity.findUnique({
      where: { id },
      select: { isVerified: true },
    });

    if (!charity) {
      throw new NotFoundException(`Charity with ID ${id} not found`);
    }

    return this.update(id, { isVerified: !charity.isVerified });
  }

  async updateVerification(id: string, isVerified: boolean) {
    return this.update(id, { isVerified });
  }

  async toggleActive(id: string) {
    const charity = await this.prisma.charity.findUnique({
      where: { id },
      select: { isActive: true },
    });

    if (!charity) {
      throw new NotFoundException(`Charity with ID ${id} not found`);
    }

    return this.update(id, { isActive: !charity.isActive });
  }

  async delete(id: string) {
    try {
      await this.prisma.charity.delete({
        where: { id },
      });
      return { message: `Charity with ID ${id} has been deleted` };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Charity with ID ${id} not found`);
      }
      throw error;
    }
  }

  async getStatistics() {
    const [
      totalCharities,
      verifiedCharities,
      activeCharities,
      totalDonations,
      totalCompetitions,
    ] = await Promise.all([
      this.prisma.charity.count(),
      this.prisma.charity.count({ where: { isVerified: true } }),
      this.prisma.charity.count({ where: { isActive: true } }),
      this.prisma.donation.aggregate({
        _sum: {
          amount: true,
        },
        _count: true,
      }),
      this.prisma.competition.count(),
    ]);

    return {
      totalCharities,
      verifiedCharities,
      unverifiedCharities: totalCharities - verifiedCharities,
      activeCharities,
      inactiveCharities: totalCharities - activeCharities,
      totalDonations: totalDonations._count,
      totalDonationAmount: totalDonations._sum.amount || 0,
      totalCompetitions,
    };
  }
}
