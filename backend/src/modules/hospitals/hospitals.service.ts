import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { UserStatus } from '@prisma/client';

@Injectable()
export class HospitalsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: {
    search?: string; city?: string; isVerified?: boolean;
    page?: number; limit?: number; status?: string;
  }) {
    const { search, city, isVerified, page = 1, limit = 20, status } = query;
    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (city) where.city = { contains: city, mode: 'insensitive' };
    if (isVerified !== undefined) where.isVerified = isVerified;
    if (status) where.status = status;

    const [hospitals, total] = await Promise.all([
      this.prisma.hospital.findMany({
        where,
        skip,
        take: limit,
        include: {
          _count: { select: { doctors: true, departments: true, appointments: true } },
          subscription: { select: { plan: true, status: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.hospital.count({ where }),
    ]);

    return { data: hospitals, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string) {
    const hospital = await this.prisma.hospital.findUnique({
      where: { id },
      include: {
        departments: true,
        doctors: {
          include: {
            user: { select: { email: true } },
            reviews: { select: { rating: true } },
          },
        },
        subscription: true,
        _count: { select: { appointments: true, payments: true } },
      },
    });
    if (!hospital) throw new NotFoundException('Hospital not found');
    return hospital;
  }

  async create(dto: any, ownerId: string) {
    const slug = dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const existing = await this.prisma.hospital.findUnique({ where: { slug } });
    if (existing) throw new ConflictException('Hospital slug already exists');

    return this.prisma.hospital.create({
      data: {
        ...dto,
        slug,
        ownerId,
        status: 'PENDING',
      },
    });
  }

  async update(id: string, dto: any) {
    const hospital = await this.prisma.hospital.findUnique({ where: { id } });
    if (!hospital) throw new NotFoundException('Hospital not found');
    return this.prisma.hospital.update({ where: { id }, data: dto });
  }

  async verify(id: string) {
    return this.prisma.hospital.update({
      where: { id },
      data: { isVerified: true, status: 'ACTIVE' },
    });
  }

  async getStats(id: string) {
    const [appointments, doctors, payments] = await Promise.all([
      this.prisma.appointment.findMany({
        where: { hospitalId: id },
        select: { status: true, date: true },
      }),
      this.prisma.doctorProfile.count({ where: { hospitalId: id } }),
      this.prisma.payment.aggregate({
        where: { hospitalId: id, status: 'COMPLETED' },
        _sum: { amount: true },
      }),
    ]);

    return {
      totalAppointments: appointments.length,
      completedAppointments: appointments.filter(a => a.status === 'COMPLETED').length,
      totalDoctors: doctors,
      totalRevenue: payments._sum.amount || 0,
    };
  }
}
