import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { CompetitionsService } from './competitions.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole, CompetitionStatus } from '@prisma/client';

@Controller('admin/competitions')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class CompetitionsController {
  constructor(private readonly competitionsService: CompetitionsService) {}

  @Get()
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('search') search?: string,
    @Query('status') status?: CompetitionStatus,
    @Query('charityId') charityId?: string,
  ) {
    const take = limit || 10;
    const skip = page ? (page - 1) * take : 0;

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (charityId) {
      where.charityId = charityId;
    }

    return this.competitionsService.findAll({
      skip,
      take,
      where,
    });
  }

  @Get('statistics')
  async getStatistics() {
    return this.competitionsService.getStatistics();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.competitionsService.findOne(id);
  }

  @Post()
  async create(@Body() createData: any) {
    return this.competitionsService.create(createData);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: any) {
    return this.competitionsService.update(id, updateData);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: CompetitionStatus,
  ) {
    if (!Object.values(CompetitionStatus).includes(status)) {
      throw new BadRequestException('Invalid status');
    }
    return this.competitionsService.updateStatus(id, status);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.competitionsService.delete(id);
  }
}
