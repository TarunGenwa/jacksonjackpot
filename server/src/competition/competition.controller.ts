import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { CompetitionService } from './competition.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('competitions')
export class CompetitionController {
  constructor(private readonly competitionService: CompetitionService) {}

  @Public()
  @Get()
  async findAll(
    @Query('status') status?: string,
    @Query('charityId') charityId?: string,
  ) {
    return this.competitionService.findAll(status, charityId);
  }

  @Public()
  @Get('active')
  async findActive() {
    return this.competitionService.findActive();
  }

  @Public()
  @Get('upcoming')
  async findUpcoming() {
    return this.competitionService.findUpcoming();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const competition = await this.competitionService.findOne(id);
    if (!competition) {
      throw new NotFoundException('Competition not found');
    }
    return competition;
  }
}