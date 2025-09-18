import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HashChainService } from '../hash-chain/hash-chain.service';
import { InstantWinsService } from '../instant-wins/instant-wins.service';
import { PurchaseTicketDto } from './dto';
import { Prisma, ChainEntryType } from '@prisma/client';

@Injectable()
export class TicketService {
  private readonly logger = new Logger(TicketService.name);

  constructor(
    private prisma: PrismaService,
    private hashChainService: HashChainService,
    private instantWinsService: InstantWinsService
  ) {}

  async purchaseTickets(userId: string, purchaseDto: PurchaseTicketDto) {
    const { competitionId, quantity, paymentMethod } = purchaseDto;

    // Start transaction to ensure data consistency
    // Increase timeout to 20 seconds for complex ticket purchase operations
    return this.prisma.$transaction(
      async (tx) => {
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
          throw new BadRequestException(
            'Competition is not available for ticket purchases',
          );
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
        const availableTickets =
          competition.maxTickets - competition.ticketsSold;
        if (quantity > availableTickets) {
          throw new BadRequestException(
            `Only ${availableTickets} tickets available`,
          );
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
          throw new BadRequestException(
            `Insufficient balance. Required: £${totalCost.toString()}, Available: £${wallet.balance.toString()}`,
          );
        }

        // 3. Update wallet balance
        const updatedWallet = await tx.wallet.update({
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
        const tickets: Array<{
          id: string;
          ticketNumber: string;
          competition: { title: string; drawDate: Date };
          purchasePrice: any;
          status: string;
        }> = [];

        // Try to create tickets with retry logic for unique constraint
        let ticketNumbers: string[] = [];
        let retryCount = 0;
        const maxRetries = 3;

        while (retryCount < maxRetries) {
          try {
            ticketNumbers = this.generateTicketNumbers(
              competitionId,
              quantity,
            );

            // Create all tickets in batch for better performance
            const ticketData = ticketNumbers.map((ticketNumber) => ({
              ticketNumber,
              competitionId,
              userId: userId,
              purchasePrice: competition.ticketPrice,
              status: 'ACTIVE' as const,
            }));

            await tx.ticket.createMany({
              data: ticketData,
            });

            // If successful, break out of retry loop
            break;
          } catch (error) {
            // If it's a unique constraint error and we haven't exceeded retries, try again
            const isPrismaUniqueError =
              error &&
              typeof error === 'object' &&
              'code' in error &&
              error.code === 'P2002';

            if (isPrismaUniqueError && retryCount < maxRetries - 1) {
              retryCount++;
              console.warn(
                `Ticket number collision detected, retrying (${retryCount}/${maxRetries})...`,
              );
              // Add a small delay before retry
              await new Promise((resolve) => setTimeout(resolve, 100));
            } else {
              // If it's a different error or we've exceeded retries, throw it
              throw error;
            }
          }
        }

        // Fetch created tickets with competition details
        const createdTickets = await tx.ticket.findMany({
          where: {
            ticketNumber: { in: ticketNumbers },
            userId: userId,
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

        // Create hash chain entries for each ticket and check for instant wins
        const instantWinResults: any[] = [];
        for (const ticket of createdTickets) {
          // Create hash chain entry for ticket purchase
          const chainEntry = await this.hashChainService.addEntry({
            type: ChainEntryType.TICKET_PURCHASE,
            data: {
              ticketId: ticket.id,
              ticketNumber: ticket.ticketNumber,
              competitionId: ticket.competitionId,
              userId: userId,
              purchasePrice: ticket.purchasePrice,
              transactionId: transaction.id
            },
            metadata: {
              timestamp: new Date().toISOString(),
              competitionTitle: ticket.competition.title,
              paymentMethod: paymentMethod || 'WALLET'
            }
          });

          // Update ticket with chain entry reference
          await tx.ticket.update({
            where: { id: ticket.id },
            data: { chainEntryId: chainEntry.id }
          });

          // Check for instant win
          const instantWinCheck = await this.instantWinsService.checkForInstantWin(
            ticket.ticketNumber,
            ticket.competitionId
          );

          if (instantWinCheck.isWinner) {
            instantWinResults.push({
              ticketId: ticket.id,
              ticketNumber: ticket.ticketNumber,
              instantWin: instantWinCheck.instantWin,
              prize: instantWinCheck.prize
            });

            this.logger.log(`Instant win detected: ticketId=${ticket.id}, prizeId=${instantWinCheck.prize?.id}`);
          }

          // Add chain hash to ticket object
          (ticket as any).chainHash = chainEntry.hash;
          (ticket as any).chainSequence = chainEntry.sequence;
        }

        tickets.push(...createdTickets);

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

        if (
          updatedCompetition &&
          updatedCompetition.ticketsSold >= updatedCompetition.maxTickets
        ) {
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
          tickets: tickets.map((ticket) => ({
            id: ticket.id,
            ticketNumber: ticket.ticketNumber,
            competitionTitle: ticket.competition.title,
            drawDate: ticket.competition.drawDate,
            purchasePrice: ticket.purchasePrice.toString(),
            status: ticket.status,
            chainProof: {
              hash: (ticket as any).chainHash,
              sequence: (ticket as any).chainSequence,
              timestamp: new Date().toISOString()
            }
          })),
          wallet: {
            newBalance: updatedWallet.balance.toString(),
          },
          instantWins: instantWinResults.length > 0 ? {
            hasWins: true,
            count: instantWinResults.length,
            wins: instantWinResults.map(win => ({
              ticketId: win.ticketId,
              ticketNumber: win.ticketNumber,
              prizeName: win.prize.name,
              prizeValue: win.prize.value.toString(),
              instantWinId: win.instantWin.id
            }))
          } : {
            hasWins: false,
            count: 0
          }
        };
      },
      {
        maxWait: 20000, // Maximum time to wait for a transaction slot (20 seconds)
        timeout: 20000, // Maximum time the transaction can run (20 seconds)
      },
    );
  }

  async getUserTickets(
    userId: string,
    filters?: { competitionId?: string; status?: string },
  ) {
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
        chainEntry: true,
        winner: {
          include: {
            prize: true
          }
        }
      },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    // Check for instant win if not already won
    let instantWinStatus: any = null;
    if (!ticket.winner && ticket.competition.type === 'INSTANT_WINS') {
      const instantWinCheck = await this.instantWinsService.checkForInstantWin(
        ticket.ticketNumber,
        ticket.competitionId
      );

      if (instantWinCheck.isWinner) {
        instantWinStatus = {
          isWinner: true,
          prize: instantWinCheck.prize,
          instantWinId: instantWinCheck.instantWin.id,
          canClaim: !instantWinCheck.instantWin.isClaimed
        };
      }
    }

    return {
      ...ticket,
      instantWinStatus,
      chainProof: ticket.chainEntry ? {
        hash: ticket.chainEntry.hash,
        sequence: ticket.chainEntry.sequence,
        verified: true // We could add actual verification here
      } : null
    };
  }

  async claimInstantWin(ticketId: string, userId: string) {
    const ticket = await this.prisma.ticket.findFirst({
      where: { id: ticketId, userId }
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found or unauthorized');
    }

    // Check for instant win
    const instantWinCheck = await this.instantWinsService.checkForInstantWin(
      ticket.ticketNumber,
      ticket.competitionId
    );

    if (!instantWinCheck.isWinner) {
      throw new BadRequestException('This ticket is not an instant winner');
    }

    if (instantWinCheck.instantWin.isClaimed) {
      throw new BadRequestException('Instant win already claimed');
    }

    try {
      const result = await this.instantWinsService.claimInstantWin(
        instantWinCheck.instantWin.id,
        ticketId,
        userId
      );

      this.logger.log(`Instant win claimed successfully: ticketId=${ticketId}, userId=${userId}`);

      return {
        success: true,
        instantWin: {
          id: result.instantWin.id,
          claimed: true,
          claimedAt: new Date()
        },
        prize: {
          name: 'Prize', // Will be filled by actual prize data
          value: '0' // Will be filled by actual prize data
        },
        chainProof: {
          hash: result.chainEntry.hash,
          sequence: result.chainEntry.sequence
        }
      };
    } catch (error) {
      this.logger.error(`Failed to claim instant win: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getTicketVerification(ticketId: string, userId: string) {
    const ticket = await this.prisma.ticket.findFirst({
      where: { id: ticketId, userId },
      include: {
        chainEntry: true,
        competition: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found or unauthorized');
    }

    if (!ticket.chainEntry) {
      return {
        ticketId: ticket.id,
        ticketNumber: ticket.ticketNumber,
        verified: false,
        error: 'No chain entry found for this ticket'
      };
    }

    // Verify the chain entry hash
    const calculatedHash = this.hashChainService.calculateHash({
      sequence: ticket.chainEntry.sequence,
      type: ticket.chainEntry.type,
      timestamp: ticket.chainEntry.timestamp.toISOString(),
      data: ticket.chainEntry.data,
      metadata: ticket.chainEntry.metadata,
      previousHash: ticket.chainEntry.previousHash
    });

    const hashValid = calculatedHash === ticket.chainEntry.hash;

    // Verify surrounding chain integrity
    const chainVerification = await this.hashChainService.verifyChain(
      Math.max(1, ticket.chainEntry.sequence - 2),
      ticket.chainEntry.sequence + 2
    );

    return {
      ticketId: ticket.id,
      ticketNumber: ticket.ticketNumber,
      verified: hashValid && chainVerification.isValid,
      chainProof: {
        hash: ticket.chainEntry.hash,
        sequence: ticket.chainEntry.sequence,
        hashValid,
        chainIntact: chainVerification.isValid,
        timestamp: ticket.chainEntry.timestamp
      },
      purchaseData: {
        competitionId: ticket.competitionId,
        competitionTitle: ticket.competition.title,
        purchasePrice: ticket.purchasePrice.toString(),
        purchasedAt: ticket.purchasedAt
      }
    };
  }

  private generateTicketNumbers(
    competitionId: string,
    quantity: number,
  ): string[] {
    const ticketNumbers: string[] = [];

    // Include competition ID in ticket number for uniqueness
    // Use timestamp and random component to ensure uniqueness even in concurrent purchases
    const timestamp = Date.now();
    const competitionPrefix = competitionId.slice(-6).toUpperCase();

    for (let i = 0; i < quantity; i++) {
      // Generate a unique ticket number with competition prefix, timestamp, and sequence
      const randomComponent = Math.random()
        .toString(36)
        .substring(2, 6)
        .toUpperCase();
      const sequence = String(i + 1).padStart(3, '0');
      const ticketNumber = `TKT-${competitionPrefix}-${timestamp}-${randomComponent}-${sequence}`;
      ticketNumbers.push(ticketNumber);
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
