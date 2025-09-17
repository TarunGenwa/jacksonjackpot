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
} from '@nestjs/common';
import { CharitiesService } from './charities.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('admin/charities')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class CharitiesController {
  constructor(private readonly charitiesService: CharitiesService) {}

  @Get()
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('search') search?: string,
    @Query('isVerified') isVerified?: string,
    @Query('isActive') isActive?: string,
  ) {
    const take = limit || 10;
    const skip = page ? (page - 1) * take : 0;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { taxId: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (isVerified !== undefined) {
      where.isVerified = isVerified === 'true';
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    return this.charitiesService.findAll({
      skip,
      take,
      where,
    });
  }

  @Get('statistics')
  async getStatistics() {
    return this.charitiesService.getStatistics();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.charitiesService.findOne(id);
  }

  @Post()
  async create(@Body() createData: any) {
    return this.charitiesService.create(createData);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: any,
  ) {
    return this.charitiesService.update(id, updateData);
  }

  @Put(':id/toggle-verification')
  async toggleVerification(@Param('id') id: string) {
    return this.charitiesService.toggleVerification(id);
  }

  @Put(':id/toggle-active')
  async toggleActive(@Param('id') id: string) {
    return this.charitiesService.toggleActive(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.charitiesService.delete(id);
  }
}