import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { HospitalsService } from './hospitals.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@Controller('hospitals')
export class HospitalsController {
  constructor(private readonly hospitalsService: HospitalsService) {}

  @Public()
  @Get()
  async findAll(@Query() query: any) {
    return this.hospitalsService.findAll({ ...query, status: 'ACTIVE' });
  }

  @Public()
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.hospitalsService.findById(id);
  }

  @Post()
  async create(@Body() dto: any, @CurrentUser('id') userId: string) {
    return this.hospitalsService.create(dto, userId);
  }

  @Patch(':id')
  @Roles(Role.HOSPITAL_ADMIN, Role.ADMIN, Role.SUPER_ADMIN)
  async update(@Param('id') id: string, @Body() dto: any) {
    return this.hospitalsService.update(id, dto);
  }

  @Patch(':id/verify')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async verify(@Param('id') id: string) {
    return this.hospitalsService.verify(id);
  }

  @Get(':id/stats')
  async getStats(@Param('id') id: string) {
    return this.hospitalsService.getStats(id);
  }
}
