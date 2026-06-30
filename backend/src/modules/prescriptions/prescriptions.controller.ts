import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@Controller('prescriptions')
export class PrescriptionsController {
  constructor(private readonly service: PrescriptionsService) {}

  @Get('patient/:patientId')
  @Roles(Role.DOCTOR, Role.PATIENT)
  async findByPatient(@Param('patientId') patientId: string) {
    return this.service.findByPatient(patientId);
  }

  @Post()
  @Roles(Role.DOCTOR)
  async create(@Body() dto: any, @CurrentUser('id') userId: string) {
    return this.service.create(dto, userId);
  }
}
