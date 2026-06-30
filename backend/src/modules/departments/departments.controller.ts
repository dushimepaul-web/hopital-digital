import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get('hospital/:hospitalId')
  async findByHospital(@Param('hospitalId') hospitalId: string) {
    return this.departmentsService.findByHospital(hospitalId);
  }

  @Post()
  @Roles(Role.HOSPITAL_ADMIN, Role.ADMIN)
  async create(@Body() dto: any) {
    return this.departmentsService.create(dto);
  }

  @Patch(':id')
  @Roles(Role.HOSPITAL_ADMIN, Role.ADMIN)
  async update(@Param('id') id: string, @Body() dto: any) {
    return this.departmentsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.HOSPITAL_ADMIN, Role.ADMIN)
  async delete(@Param('id') id: string) {
    return this.departmentsService.delete(id);
  }
}
