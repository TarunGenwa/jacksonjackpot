import { Module } from '@nestjs/common';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CompetitionsController } from './competitions/competitions.controller';
import { CompetitionsService } from './competitions/competitions.service';
import { CharitiesController } from './charities/charities.controller';
import { CharitiesService } from './charities/charities.service';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController, CompetitionsController, CharitiesController],
  providers: [UsersService, CompetitionsService, CharitiesService]
})
export class AdminModule {}
