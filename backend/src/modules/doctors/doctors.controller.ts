import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Public()
  @Get()
  async findAll(@Query() query: any) {
    return this.doctorsService.findAll(query);
  }

  @Public()
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.doctorsService.findById(id);
  }

  @Patch('profile')
  @Roles(Role.DOCTOR)
  async updateProfile(@CurrentUser('id') userId: string, @Body() dto: any) {
    const doctor = await this.doctorsService.findById(userId);
    return this.doctorsService.updateProfile(doctor.id, dto);
  }

  @Post('availability')
  @Roles(Role.DOCTOR)
  async updateAvailability(@CurrentUser('id') userId: string, @Body() body: any) {
    const doctor = await this.doctorsService.findById(userId);
    return this.doctorsService.updateAvailability(doctor.id, body.availabilities);
  }

  @Get('my/patients')
  @Roles(Role.DOCTOR)
  async getMyPatients(@CurrentUser('id') userId: string) {
    const doctor = await this.doctorsService.findById(userId);
    return this.doctorsService.getPatients(doctor.id);
  }
}
