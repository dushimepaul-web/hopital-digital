import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  async findAll(@Query() query: any) {
    return this.appointmentsService.findAll(query);
  }

  @Get('upcoming')
  async getUpcoming(@CurrentUser('id') userId: string, @CurrentUser('role') role: string) {
    if (role === 'DOCTOR') {
      return this.appointmentsService.getUpcoming(userId);
    }
    return this.appointmentsService.getUpcoming(undefined, userId);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.appointmentsService.findById(id);
  }

  @Post()
  async create(@Body() dto: any, @CurrentUser('id') userId: string) {
    return this.appointmentsService.create(dto, userId);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: any,
    @Body('reason') reason?: string,
  ) {
    return this.appointmentsService.updateStatus(id, status, reason);
  }
}
