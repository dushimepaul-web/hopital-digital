import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class DoctorsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: {
    search?: string; specialty?: string; hospitalId?: string;
    minRating?: number; page?: number; limit?: number;
  }) {
    const { search, specialty, hospitalId, minRating, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { specialty: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (specialty) where.specialty = { contains: specialty, mode: 'insensitive' };
    if (hospitalId) where.hospitalId = hospitalId;
    if (minRating) where.rating = { gte: minRating };
    where.isAvailable = true;

    const [doctors, total] = await Promise.all([
      this.prisma.doctorProfile.findMany({
        where,
        skip,
        take: limit,
        include: {
          hospital: { select: { id: true, name: true, city: true } },
          availabilities: { where: { isAvailable: true } },
          reviews: { select: { rating: true }, take: 5, orderBy: { createdAt: 'desc' } },
        },
        orderBy: [{ rating: 'desc' }, { reviewCount: 'desc' }],
      }),
      this.prisma.doctorProfile.count({ where }),
    ]);

    return { data: doctors, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string) {
    const doctor = await this.prisma.doctorProfile.findUnique({
      where: { id },
      include: {
        hospital: { select: { id: true, name: true, address: true, city: true, logoUrl: true } },
        availabilities: { orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }] },
        reviews: {
          include: { patient: { select: { patientProfile: { select: { firstName: true, lastName: true, avatarUrl: true } } } } },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        user: { select: { email: true } },
      },
    });
    if (!doctor) throw new NotFoundException('Doctor not found');
    return doctor;
  }

  async updateProfile(id: string, dto: any) {
    const doctor = await this.prisma.doctorProfile.findUnique({ where: { id } });
    if (!doctor) throw new NotFoundException('Doctor profile not found');
    return this.prisma.doctorProfile.update({ where: { id }, data: dto });
  }

  async updateAvailability(doctorId: string, availabilities: any[]) {
    await this.prisma.availability.deleteMany({ where: { doctorId } });
    return this.prisma.availability.createMany({
      data: availabilities.map(a => ({ ...a, doctorId })),
    });
  }

  async getPatients(doctorId: string) {
    const appointments = await this.prisma.appointment.findMany({
      where: { doctorProfileId: doctorId },
      include: {
        patient: {
          select: {
            patientProfile: {
              select: { firstName: true, lastName: true, avatarUrl: true, bloodGroup: true, gender: true },
            },
          },
        },
      },
      distinct: ['patientId'],
      orderBy: { date: 'desc' },
    });
    return appointments.map(a => a.patient);
  }
}
