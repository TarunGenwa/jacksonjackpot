import { Module } from '@nestjs/common';
import { CharityController } from './charity.controller';
import { CharityService } from './charity.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CharityController],
  providers: [CharityService],
  exports: [CharityService],
})
export class CharityModule {}
