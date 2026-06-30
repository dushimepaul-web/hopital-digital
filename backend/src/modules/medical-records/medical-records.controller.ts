import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { MedicalRecordsService } from './medical-records.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@Controller('medical-records')
export class MedicalRecordsController {
  constructor(private readonly service: MedicalRecordsService) {}

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
