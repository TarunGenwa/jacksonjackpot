import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { CharityService } from './charity.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('charities')
export class CharityController {
  constructor(private readonly charityService: CharityService) {}

  @Public()
  @Get()
  async findAll() {
    return this.charityService.findAll();
  }

  @Public()
  @Get('verified')
  async findVerified() {
    return this.charityService.findVerified();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const charity = await this.charityService.findOne(id);
    if (!charity) {
      throw new NotFoundException('Charity not found');
    }
    return charity;
  }
}