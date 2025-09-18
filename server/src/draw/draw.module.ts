import { Module } from '@nestjs/common';
import { DrawService } from './draw.service';
import { DrawController } from './draw.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PrizeAllocationModule } from '../prize-allocation/prize-allocation.module';
import { HashChainModule } from '../hash-chain/hash-chain.module';

@Module({
  imports: [PrismaModule, PrizeAllocationModule, HashChainModule],
  providers: [DrawService],
  controllers: [DrawController],
  exports: [DrawService]
})
export class DrawModule {}
