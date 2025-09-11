import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { AddFundsDto } from './dto/add-funds.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

interface AuthRequest extends Request {
  user: {
    id: string;
    email: string;
    username: string;
    role: string;
  };
}

@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  async getWallet(@Request() req: AuthRequest) {
    try {
      const userId = req.user.id;
      let wallet = await this.walletService.getWalletByUserId(userId);

      if (!wallet) {
        wallet = await this.walletService.createWallet(userId);
      }

      return wallet;
    } catch {
      throw new HttpException(
        'Error fetching wallet',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('add-funds')
  async addFunds(
    @Request() req: AuthRequest,
    @Body() addFundsDto: AddFundsDto,
  ) {
    try {
      const userId = req.user.id;

      let wallet = await this.walletService.getWalletByUserId(userId);

      if (!wallet) {
        wallet = await this.walletService.createWallet(userId);
      }

      const updatedWallet = await this.walletService.updateBalance(
        wallet.id,
        addFundsDto.amount,
        'add',
      );

      await this.prisma.transaction.create({
        data: {
          walletId: wallet.id,
          userId: userId,
          amount: addFundsDto.amount,
          currency: addFundsDto.currency || 'GBP',
          type: 'DEPOSIT',
          status: 'COMPLETED',
          description: addFundsDto.description || 'Funds added to wallet',
        },
      });

      return {
        success: true,
        message: 'Funds added successfully',
        wallet: updatedWallet,
      };
    } catch (error) {
      if (error instanceof Error && error.message === 'Wallet not found') {
        throw new HttpException('Wallet not found', HttpStatus.NOT_FOUND);
      }

      throw new HttpException(
        'Error adding funds to wallet',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('balance')
  async getBalance(@Request() req: AuthRequest) {
    try {
      const userId = req.user.id;
      const wallet = await this.walletService.getWalletByUserId(userId);

      if (!wallet) {
        return { balance: 0, currency: 'GBP' };
      }

      return {
        balance: wallet.balance,
        currency: wallet.currency,
      };
    } catch {
      throw new HttpException(
        'Error fetching balance',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('transactions')
  async getTransactions(@Request() req: AuthRequest) {
    try {
      const userId = req.user.id;
      const wallet = await this.walletService.getWalletByUserId(userId);

      if (!wallet) {
        return [];
      }

      const transactions = await this.prisma.transaction.findMany({
        where: { walletId: wallet.id },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });

      return transactions;
    } catch {
      throw new HttpException(
        'Error fetching transactions',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
