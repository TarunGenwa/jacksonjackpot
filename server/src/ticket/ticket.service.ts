import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PurchaseTicketDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TicketService {
  constructor(private prisma: PrismaService) {}

  async purchaseTickets(userId: string, purchaseDto: PurchaseTicketDto) {
    const { competitionId, quantity, paymentMethod } = purchaseDto;

    // Start transaction to ensure data consistency
    return this.prisma.$transaction(async (tx) => {
      // 1. Get competition details and validate
      const competition = await tx.competition.findUnique({
        where: { id: competitionId },
        select: {
          id: true,
          title: true,
          ticketPrice: true,
          maxTickets: true,
          ticketsSold: true,
          status: true,
          startDate: true,
          endDate: true,
          isActive: true,
        },
      });

      if (!competition) {
        throw new NotFoundException('Competition not found');
      }

      if (!competition.isActive || competition.status !== 'ACTIVE') {
        throw new BadRequestException('Competition is not available for ticket purchases');
      }

      // Check if competition has started and not ended
      const now = new Date();
      if (now < competition.startDate) {
        throw new BadRequestException('Competition has not started yet');
      }

      if (now > competition.endDate) {
        throw new BadRequestException('Competition has ended');
      }

      // Check if enough tickets are available
      const availableTickets = competition.maxTickets - competition.ticketsSold;
      if (quantity > availableTickets) {
        throw new BadRequestException(`Only ${availableTickets} tickets available`);
      }

      // 2. Get user wallet and validate balance
      const wallet = await tx.wallet.findUnique({
        where: { userId },
      });

      if (!wallet) {
        throw new NotFoundException('Wallet not found');
      }

      if (wallet.isLocked) {
        throw new ForbiddenException('Wallet is locked');
      }

      const totalCost = competition.ticketPrice.mul(quantity);
      
      if (wallet.balance.lt(totalCost)) {
        throw new BadRequestException(`Insufficient balance. Required: £${totalCost}, Available: £${wallet.balance}`);
      }

      // 3. Update wallet balance
      await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: wallet.balance.sub(totalCost),
          updatedAt: new Date(),
        },
      });

      // 4. Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          walletId: wallet.id,
          userId: userId,
          type: 'TICKET_PURCHASE',
          amount: totalCost.neg(), // Negative for deduction
          currency: wallet.currency,
          status: 'COMPLETED',
          description: `Purchased ${quantity} ticket(s) for ${competition.title}`,
          referenceId: `TKT-${Date.now()}-${userId.slice(-6)}`,
          metadata: {
            competitionId,
            quantity,
            unitPrice: competition.ticketPrice.toString(),
            paymentMethod: paymentMethod || 'WALLET',
          },
        },
      });

      // 5. Generate ticket numbers and create tickets
      const tickets: any[] = [];
      const ticketNumbers = await this.generateTicketNumbers(competitionId, quantity, tx);
      
      for (let i = 0; i < quantity; i++) {
        const ticket = await tx.ticket.create({
          data: {
            ticketNumber: ticketNumbers[i],
            competitionId,
            userId: userId,
            purchasePrice: competition.ticketPrice,
            status: 'ACTIVE',
          },
          include: {
            competition: {
              select: {
                id: true,
                title: true,
                drawDate: true,
              },
            },
          },
        });
        tickets.push(ticket);
      }

      // 6. Update competition tickets sold
      await tx.competition.update({
        where: { id: competitionId },
        data: {
          ticketsSold: {
            increment: quantity,
          },
          updatedAt: new Date(),
        },
      });

      // 7. Check if competition should be marked as SOLD_OUT
      const updatedCompetition = await tx.competition.findUnique({
        where: { id: competitionId },
        select: { ticketsSold: true, maxTickets: true },
      });

      if (updatedCompetition && updatedCompetition.ticketsSold >= updatedCompetition.maxTickets) {
        await tx.competition.update({
          where: { id: competitionId },
          data: { status: 'SOLD_OUT' },
        });
      }

      return {
        success: true,
        transaction: {
          id: transaction.id,
          reference: transaction.referenceId,
          amount: totalCost.toString(),
          status: transaction.status,
        },
        tickets: tickets.map(ticket => ({
          id: ticket.id,
          ticketNumber: ticket.ticketNumber,
          competitionTitle: ticket.competition.title,
          drawDate: ticket.competition.drawDate,
          purchasePrice: ticket.purchasePrice.toString(),
          status: ticket.status,
        })),
        wallet: {
          newBalance: wallet.balance.sub(totalCost).toString(),
        },
      };
    });
  }

  async getUserTickets(userId: string, filters?: { competitionId?: string; status?: string }) {
    const where: Prisma.TicketWhereInput = {
      userId,
      ...(filters?.competitionId && { competitionId: filters.competitionId }),
      ...(filters?.status && { status: filters.status as any }),
    };

    return this.prisma.ticket.findMany({
      where,
      include: {
        competition: {
          select: {
            id: true,
            title: true,
            description: true,
            drawDate: true,
            status: true,
            imageUrl: true,
            charity: {
              select: {
                id: true,
                name: true,
                logoUrl: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getTicketById(ticketId: string, userId: string) {
    const ticket = await this.prisma.ticket.findFirst({
      where: {
        id: ticketId,
        userId,
      },
      include: {
        competition: {
          include: {
            charity: true,
            prizes: {
              orderBy: { position: 'asc' },
            },
          },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    return ticket;
  }

  private async generateTicketNumbers(competitionId: string, quantity: number, tx: any): Promise<string[]> {
    const ticketNumbers: string[] = [];
    const year = new Date().getFullYear();
    
    // Get the last ticket number for this competition
    const lastTicket = await tx.ticket.findFirst({
      where: { competitionId },
      orderBy: { ticketNumber: 'desc' },
    });

    let lastNumber = 0;
    if (lastTicket) {
      const match = lastTicket.ticketNumber.match(/(\d+)$/);
      lastNumber = match ? parseInt(match[1], 10) : 0;
    }

    // Generate sequential ticket numbers
    for (let i = 1; i <= quantity; i++) {
      const nextNumber = String(lastNumber + i).padStart(6, '0');
      ticketNumbers.push(`TKT-${year}-${nextNumber}`);
    }

    return ticketNumbers;
  }

  async getCompetitionTickets(competitionId: string, page = 1, limit = 50) {
    const skip = (page - 1) * limit;

    const [tickets, total] = await Promise.all([
      this.prisma.ticket.findMany({
        where: { competitionId },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.ticket.count({ where: { competitionId } }),
    ]);

    return {
      tickets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }
}