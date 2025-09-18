import { Module } from '@nestjs/common';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { PrismaModule } from '../prisma/prisma.module';
import { HashChainModule } from '../hash-chain/hash-chain.module';
import { InstantWinsModule } from '../instant-wins/instant-wins.module';

@Module({
  imports: [PrismaModule, HashChainModule, InstantWinsModule],
  controllers: [TicketController],
  providers: [TicketService],
  exports: [TicketService],
})
export class TicketModule {}
