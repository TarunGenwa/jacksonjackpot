import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompetitionService {
  constructor(private prisma: PrismaService) {}

  async findAll(status?: string, charityId?: string) {
    return this.prisma.competition.findMany({
      where: {
        isActive: true,
        ...(status && { status: status as any }),
        ...(charityId && { charityId }),
      },
      include: {
        charity: {
          select: {
            id: true,
            name: true,
            logoUrl: true,
            isVerified: true,
          },
        },
        prizes: {
          select: {
            id: true,
            name: true,
            description: true,
            value: true,
            position: true,
            quantity: true,
            imageUrl: true,
          },
          orderBy: {
            position: 'asc',
          },
        },
        _count: {
          select: {
            tickets: true,
            prizes: true,
          },
        },
      },
      orderBy: [
        {
          status: 'asc',
        },
        {
          endDate: 'asc',
        },
      ],
    });
  }

  async findOne(id: string) {
    return this.prisma.competition.findUnique({
      where: {
        id,
        isActive: true,
      },
      include: {
        charity: {
          select: {
            id: true,
            name: true,
            description: true,
            logoUrl: true,
            website: true,
            email: true,
            isVerified: true,
          },
        },
        prizes: {
          select: {
            id: true,
            name: true,
            description: true,
            value: true,
            position: true,
            quantity: true,
            imageUrl: true,
          },
          orderBy: {
            position: 'asc',
          },
        },
        tickets: {
          select: {
            id: true,
            ticketNumber: true,
            status: true,
            purchasedAt: true,
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: {
            purchasedAt: 'desc',
          },
          take: 20,
        },
        _count: {
          select: {
            tickets: true,
            prizes: true,
          },
        },
      },
    });
  }

  async findActive() {
    return this.findAll('ACTIVE');
  }

  async findUpcoming() {
    return this.findAll('UPCOMING');
  }

  async findByCharity(charityId: string) {
    return this.findAll(undefined, charityId);
  }
}
