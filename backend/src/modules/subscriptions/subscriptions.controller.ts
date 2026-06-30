import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  @Roles(Role.HOSPITAL_ADMIN, Role.ADMIN)
  async create(@Body() dto: any) {
    return this.subscriptionsService.create(dto);
  }

  @Get('hospital/:hospitalId')
  async findByHospital(@Param('hospitalId') hospitalId: string) {
    return this.subscriptionsService.findByHospital(hospitalId);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  async update(@Param('id') id: string, @Body() dto: any) {
    return this.subscriptionsService.update(id, dto);
  }

  @Post(':id/cancel')
  @Roles(Role.HOSPITAL_ADMIN, Role.ADMIN)
  async cancel(@Param('id') id: string) {
    return this.subscriptionsService.cancel(id);
  }

  @Get()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async findAll(@Query() query: any) {
    return this.subscriptionsService.findAll(query);
  }
}
