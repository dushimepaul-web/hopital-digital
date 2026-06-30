import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  async findAll(@Query() query: any) {
    return this.paymentsService.findAll(query);
  }

  @Get('stats')
  @Roles(Role.HOSPITAL_ADMIN, Role.ADMIN, Role.SUPER_ADMIN)
  async getStats(@Query('hospitalId') hospitalId?: string) {
    return this.paymentsService.getStats(hospitalId);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.paymentsService.findById(id);
  }

  @Post('process')
  async processPayment(@Body() dto: any) {
    return this.paymentsService.processPayment(dto);
  }

  @Post(':id/refund')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  async refundPayment(@Param('id') id: string) {
    return this.paymentsService.refundPayment(id);
  }
}
