import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { UserRole } from '@prisma/client';

@Controller('api/verify')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Public()
  @Get('ticket/:ticketId')
  async verifyTicket(@Param('ticketId') ticketId: string) {
    return await this.verificationService.verifyTicket(ticketId);
  }

  @Public()
  @Get('chain/integrity')
  async verifyChainIntegrity(
    @Query('start') start?: string,
    @Query('end') end?: string,
  ) {
    const startSequence = start ? parseInt(start, 10) : undefined;
    const endSequence = end ? parseInt(end, 10) : undefined;

    return await this.verificationService.verifyChainIntegrity(
      startSequence,
      endSequence,
    );
  }

  @Public()
  @Get('checkpoints/latest')
  async getLatestCheckpoint() {
    return await this.verificationService.getLatestCheckpoint();
  }

  @Public()
  @Get('checkpoint/:checkpointId')
  async verifyCheckpoint(@Param('checkpointId') checkpointId: string) {
    return await this.verificationService.verifyCheckpoint(checkpointId);
  }

  @Get('admin/checkpoint/:checkpointId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  async verifyCheckpointDetailed(@Param('checkpointId') checkpointId: string) {
    return await this.verificationService.verifyCheckpoint(checkpointId);
  }

  @Public()
  @Get('competition/:competitionId/draw-results')
  async getDrawResults(@Param('competitionId') competitionId: string) {
    return await this.verificationService.getDrawResults(competitionId);
  }

  @Public()
  @Get('report')
  async getVerificationReport(@Query('competitionId') competitionId?: string) {
    return await this.verificationService.getVerificationReport(competitionId);
  }

  @Get('admin/report')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  async getDetailedVerificationReport(
    @Query('competitionId') competitionId?: string,
  ) {
    return await this.verificationService.getVerificationReport(competitionId);
  }
}
