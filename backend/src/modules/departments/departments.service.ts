import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class DepartmentsService {
  constructor(private prisma: PrismaService) {}

  async findByHospital(hospitalId: string) {
    return this.prisma.department.findMany({
      where: { hospitalId },
      orderBy: { name: 'asc' },
    });
  }

  async create(dto: { hospitalId: string; name: string; description?: string }) {
    return this.prisma.department.create({ data: dto });
  }

  async update(id: string, dto: { name?: string; description?: string }) {
    const department = await this.prisma.department.findUnique({ where: { id } });
    if (!department) throw new NotFoundException('Department not found');
    return this.prisma.department.update({ where: { id }, data: dto });
  }

  async delete(id: string) {
    const department = await this.prisma.department.findUnique({ where: { id } });
    if (!department) throw new NotFoundException('Department not found');
    return this.prisma.department.delete({ where: { id } });
  }
}
