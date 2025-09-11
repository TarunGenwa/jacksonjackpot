import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CharityService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.charity.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        logoUrl: true,
        website: true,
        email: true,
        phone: true,
        address: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            competitions: {
              where: {
                isActive: true,
              },
            },
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findVerified() {
    return this.prisma.charity.findMany({
      where: {
        isActive: true,
        isVerified: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        logoUrl: true,
        website: true,
        email: true,
        phone: true,
        address: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            competitions: {
              where: {
                isActive: true,
              },
            },
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.charity.findUnique({
      where: {
        id,
        isActive: true,
        isVerified: true,
      },
      include: {
        competitions: {
          where: {
            isActive: true,
          },
          select: {
            id: true,
            title: true,
            description: true,
            ticketPrice: true,
            maxTickets: true,
            ticketsSold: true,
            startDate: true,
            endDate: true,
            drawDate: true,
            status: true,
            imageUrl: true,
            _count: {
              select: {
                prizes: true,
              },
            },
          },
          orderBy: {
            startDate: 'desc',
          },
        },
        donations: {
          where: {
            status: 'COMPLETED',
          },
          select: {
            amount: true,
            currency: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
      },
    });
  }
}
