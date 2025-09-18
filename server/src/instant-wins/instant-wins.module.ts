import { Module } from '@nestjs/common';
import { InstantWinsService } from './instant-wins.service';
import { PrismaModule } from '../prisma/prisma.module';
import { HashChainModule } from '../hash-chain/hash-chain.module';
import { PrizeAllocationModule } from '../prize-allocation/prize-allocation.module';

@Module({
  imports: [PrismaModule, HashChainModule, PrizeAllocationModule],
  providers: [InstantWinsService],
  exports: [InstantWinsService]
})
export class InstantWinsModule {}
