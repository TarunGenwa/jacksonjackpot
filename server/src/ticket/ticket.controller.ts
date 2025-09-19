import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { PurchaseTicketDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthRequest extends Request {
  user: {
    id: string;
    userId: string;
    email: string;
  };
}

@Controller('tickets')
@UseGuards(JwtAuthGuard)
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post('purchase')
  async purchaseTickets(
    @Request() req: AuthRequest,
    @Body() purchaseDto: PurchaseTicketDto,
  ) {
    return this.ticketService.purchaseTickets(req.user.id, purchaseDto);
  }

  @Get('my-tickets')
  async getMyTickets(
    @Request() req: AuthRequest,
    @Query('competitionId') competitionId?: string,
    @Query('status') status?: string,
  ) {
    const filters: Record<string, string> = {};
    if (competitionId) filters['competitionId'] = competitionId;
    if (status) filters['status'] = status;

    return this.ticketService.getUserTickets(req.user.id, filters);
  }

  @Get(':id')
  async getTicket(@Param('id') ticketId: string, @Request() req: AuthRequest) {
    return this.ticketService.getTicketById(ticketId, req.user.id);
  }

  @Get('competition/:competitionId')
  async getCompetitionTickets(
    @Param('competitionId') competitionId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ) {
    // Note: This endpoint might need admin authorization depending on requirements
    return this.ticketService.getCompetitionTickets(competitionId, page, limit);
  }

  @Post(':id/claim-instant-win')
  async claimInstantWin(
    @Param('id') ticketId: string,
    @Request() req: AuthRequest,
  ) {
    return this.ticketService.claimInstantWin(ticketId, req.user.id);
  }

  @Get(':id/verify')
  async verifyTicket(
    @Param('id') ticketId: string,
    @Request() req: AuthRequest,
  ) {
    return this.ticketService.getTicketVerification(ticketId, req.user.id);
  }
}
