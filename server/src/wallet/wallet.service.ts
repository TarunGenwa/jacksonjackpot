import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../../generated/prisma';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  async createWallet(userId: string, currency: string = 'GBP') {
    return this.prisma.wallet.create({
      data: {
        userId,
        currency,
        balance: new Prisma.Decimal(0),
      },
    });
  }

  async getWalletByUserId(userId: string) {
    return this.prisma.wallet.findUnique({
      where: { userId },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });
  }

  async updateBalance(
    walletId: string,
    amount: Prisma.Decimal,
    operation: 'add' | 'subtract',
  ) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { id: walletId },
    });

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    const currentBalance = new Prisma.Decimal(wallet.balance);
    let newBalance: Prisma.Decimal;

    if (operation === 'add') {
      newBalance = currentBalance.add(amount);
    } else {
      newBalance = currentBalance.sub(amount);
      if (newBalance.lessThan(0)) {
        throw new Error('Insufficient balance');
      }
    }

    return this.prisma.wallet.update({
      where: { id: walletId },
      data: { balance: newBalance },
    });
  }
}