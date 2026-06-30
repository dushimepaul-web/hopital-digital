import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AppointmentStatus } from '@prisma/client';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: {
    patientId?: string; doctorId?: string; hospitalId?: string;
    status?: AppointmentStatus; date?: string; page?: number; limit?: number;
  }) {
    const { patientId, doctorId, hospitalId, status, date, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;
    const where: any = {};

    if (patientId) where.patientId = patientId;
    if (doctorId) where.doctorId = doctorId;
    if (hospitalId) where.hospitalId = hospitalId;
    if (status) where.status = status;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      where.date = { gte: startDate, lt: endDate };
    }

    const [appointments, total] = await Promise.all([
      this.prisma.appointment.findMany({
        where,
        skip,
        take: limit,
        include: {
          patient: {
            select: {
              patientProfile: { select: { firstName: true, lastName: true, avatarUrl: true } },
            },
          },
          doctor: {
            select: {
              doctorProfile: { select: { firstName: true, lastName: true, specialty: true, avatarUrl: true } },
            },
          },
          hospital: { select: { id: true, name: true, city: true } },
          payment: { select: { status: true, amount: true, method: true } },
        },
        orderBy: { date: 'desc' },
      }),
      this.prisma.appointment.count({ where }),
    ]);

    return { data: appointments, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: { select: { patientProfile: true } },
        doctor: { select: { doctorProfile: { include: { hospital: true } } } },
        hospital: true,
        payment: true,
      },
    });
    if (!appointment) throw new NotFoundException('Appointment not found');
    return appointment;
  }

  async create(dto: any, patientId: string) {
    const doctor = await this.prisma.doctorProfile.findUnique({
      where: { id: dto.doctorProfileId },
      include: { availabilities: true },
    });
    if (!doctor) throw new NotFoundException('Doctor not found');

    const date = new Date(dto.date);
    const endDate = new Date(date.getTime() + 60 * 60 * 1000);

    const conflict = await this.prisma.appointment.findFirst({
      where: {
        doctorProfileId: doctor.id,
        date: { gte: date, lt: endDate },
        status: { notIn: ['CANCELLED', 'NO_SHOW'] },
      },
    });
    if (conflict) throw new BadRequestException('Doctor is not available at this time');

    return this.prisma.appointment.create({
      data: {
        patientId,
        doctorId: doctor.userId,
        doctorProfileId: doctor.id,
        hospitalId: doctor.hospitalId || dto.hospitalId,
        date,
        endDate,
        type: dto.type || 'IN_PERSON',
        reason: dto.reason,
        status: 'PENDING',
      },
      include: {
        patient: { select: { patientProfile: { select: { firstName: true, lastName: true } } } },
        doctor: { select: { doctorProfile: { select: { firstName: true, lastName: true } } } },
        hospital: { select: { name: true } },
      },
    });
  }

  async updateStatus(id: string, status: AppointmentStatus, reason?: string) {
    const appointment = await this.prisma.appointment.findUnique({ where: { id } });
    if (!appointment) throw new NotFoundException('Appointment not found');

    return this.prisma.appointment.update({
      where: { id },
      data: { status, cancellationReason: reason },
    });
  }

  async getUpcoming(doctorId?: string, patientId?: string) {
    const where: any = {
      date: { gte: new Date() },
      status: { notIn: ['CANCELLED', 'COMPLETED', 'NO_SHOW'] },
    };
    if (doctorId) where.doctorId = doctorId;
    if (patientId) where.patientId = patientId;

    return this.prisma.appointment.findMany({
      where,
      include: {
        patient: { select: { patientProfile: { select: { firstName: true, lastName: true } } } },
        doctor: { select: { doctorProfile: { select: { firstName: true, lastName: true } } } },
        hospital: { select: { name: true, city: true } },
      },
      orderBy: { date: 'asc' },
      take: 10,
    });
  }
}
