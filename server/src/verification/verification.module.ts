import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { VerificationController } from './verification.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { HashChainModule } from '../hash-chain/hash-chain.module';

@Module({
  imports: [PrismaModule, HashChainModule],
  providers: [VerificationService],
  controllers: [VerificationController],
  exports: [VerificationService],
})
export class VerificationModule {}
