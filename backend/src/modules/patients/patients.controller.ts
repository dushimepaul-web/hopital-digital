import { Controller, Get, Patch, Body } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get('profile')
  @Roles(Role.PATIENT)
  async getProfile(@CurrentUser('id') userId: string) {
    return this.patientsService.getProfile(userId);
  }

  @Patch('profile')
  @Roles(Role.PATIENT)
  async updateProfile(@CurrentUser('id') userId: string, @Body() dto: any) {
    return this.patientsService.updateProfile(userId, dto);
  }

  @Get('appointments')
  @Roles(Role.PATIENT)
  async getAppointments(@CurrentUser('id') userId: string) {
    return this.patientsService.getAppointments(userId);
  }

  @Get('medical-records')
  @Roles(Role.PATIENT)
  async getMedicalRecords(@CurrentUser('id') userId: string) {
    return this.patientsService.getMedicalRecords(userId);
  }

  @Get('prescriptions')
  @Roles(Role.PATIENT)
  async getPrescriptions(@CurrentUser('id') userId: string) {
    return this.patientsService.getPrescriptions(userId);
  }
}
