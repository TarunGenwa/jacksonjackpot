import { Module } from '@nestjs/common';
import { HashChainService } from './hash-chain.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [HashChainService],
  exports: [HashChainService]
})
export class HashChainModule {}
