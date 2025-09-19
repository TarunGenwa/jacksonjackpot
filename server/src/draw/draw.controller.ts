import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DrawService } from './draw.service';
import type {
  CommitSeedDto,
  RevealSeedDto,
  ExecuteDrawDto,
} from './draw.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '@prisma/client';

@Controller('api/draw')
@UseGuards(JwtAuthGuard)
export class DrawController {
  constructor(private readonly drawService: DrawService) {}

  @Post('commit-seed')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  async commitSeed(@Body() dto: CommitSeedDto) {
    return await this.drawService.commitSeed(dto);
  }

  @Post('reveal-seed')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  async revealSeed(@Body() dto: RevealSeedDto) {
    return await this.drawService.revealSeed(dto);
  }

  @Post('execute')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  async executeDraw(@Body() dto: ExecuteDrawDto) {
    return await this.drawService.executeDraw(dto);
  }

  @Get('status/:competitionId')
  async getDrawStatus(@Param('competitionId') competitionId: string) {
    return await this.drawService.getDrawStatus(competitionId);
  }

  @Get('upcoming')
  async getUpcomingDraws(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return await this.drawService.getUpcomingDraws(limitNum);
  }

  @Get('validate/:competitionId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  async validateDrawIntegrity(@Param('competitionId') competitionId: string) {
    return await this.drawService.validateDrawIntegrity(competitionId);
  }
}
