import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  async createWallet(userId: string, currency: string = 'GBP') {
    return this.prisma.wallet.create({
      data: {
        userId,
        currency,
        balance: 0,
      },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });
  }

  async getWalletByUserId(userId: string) {
    return this.prisma.wallet.findUnique({
      where: { 
        userId: userId 
      },
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
    amount: number,
    operation: 'add' | 'subtract',
  ) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { id: walletId },
    });

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    const currentBalance = Number(wallet.balance);
    let newBalance: number;

    if (operation === 'add') {
      newBalance = currentBalance + amount;
    } else {
      newBalance = currentBalance - amount;
      if (newBalance < 0) {
        throw new Error('Insufficient balance');
      }
    }

    return this.prisma.wallet.update({
      where: { id: walletId },
      data: { balance: newBalance },
    });
  }
}
