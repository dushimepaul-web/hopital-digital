import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class PrescriptionsService {
  constructor(private prisma: PrismaService) {}

  async findByPatient(patientUserId: string) {
    const profile = await this.prisma.patientProfile.findUnique({ where: { userId: patientUserId } });
    if (!profile) throw new NotFoundException('Patient profile not found');

    return this.prisma.prescription.findMany({
      where: { patientId: profile.id },
      include: {
        doctor: { select: { firstName: true, lastName: true, specialty: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: any, doctorUserId: string) {
    const doctor = await this.prisma.doctorProfile.findUnique({ where: { userId: doctorUserId } });
    if (!doctor) throw new NotFoundException('Doctor profile not found');

    return this.prisma.prescription.create({
      data: {
        patientId: dto.patientId,
        doctorId: doctor.id,
        medications: dto.medications,
        diagnosis: dto.diagnosis,
        notes: dto.notes,
        validUntil: dto.validUntil ? new Date(dto.validUntil) : undefined,
        isRefillable: dto.isRefillable || false,
      },
      include: {
        doctor: { select: { firstName: true, lastName: true, specialty: true } },
      },
    });
  }
}
