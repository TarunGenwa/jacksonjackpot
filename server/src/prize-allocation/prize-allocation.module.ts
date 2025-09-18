import { Module } from '@nestjs/common';
import { PrizeAllocationService } from './prize-allocation.service';
import { PrismaModule } from '../prisma/prisma.module';
import { HashChainModule } from '../hash-chain/hash-chain.module';

@Module({
  imports: [PrismaModule, HashChainModule],
  providers: [PrizeAllocationService],
  exports: [PrizeAllocationService]
})
export class PrizeAllocationModule {}
