import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('api/verify')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Get('ticket/:ticketId')
  async verifyTicket(@Param('ticketId') ticketId: string) {
    return await this.verificationService.verifyTicket(ticketId);
  }

  @Get('chain/integrity')
  async verifyChainIntegrity(
    @Query('start') start?: string,
    @Query('end') end?: string
  ) {
    const startSequence = start ? parseInt(start, 10) : undefined;
    const endSequence = end ? parseInt(end, 10) : undefined;

    return await this.verificationService.verifyChainIntegrity(startSequence, endSequence);
  }

  @Get('checkpoints/latest')
  async getLatestCheckpoint() {
    return await this.verificationService.getLatestCheckpoint();
  }

  @Get('checkpoint/:checkpointId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  async verifyCheckpoint(@Param('checkpointId') checkpointId: string) {
    return await this.verificationService.verifyCheckpoint(checkpointId);
  }

  @Get('competition/:competitionId/draw-results')
  async getDrawResults(@Param('competitionId') competitionId: string) {
    return await this.verificationService.getDrawResults(competitionId);
  }

  @Get('report')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  async getVerificationReport(@Query('competitionId') competitionId?: string) {
    return await this.verificationService.getVerificationReport(competitionId);
  }
}