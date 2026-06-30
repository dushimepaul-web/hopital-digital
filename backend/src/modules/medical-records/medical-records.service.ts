import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class MedicalRecordsService {
  constructor(private prisma: PrismaService) {}

  async findByPatient(patientId: string) {
    const profile = await this.prisma.patientProfile.findUnique({ where: { userId: patientId } });
    if (!profile) throw new NotFoundException('Patient profile not found');

    return this.prisma.medicalRecord.findMany({
      where: { patientId: profile.id },
      include: {
        doctor: { select: { firstName: true, lastName: true, specialty: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: any, doctorId: string) {
    const doctor = await this.prisma.doctorProfile.findUnique({ where: { userId: doctorId } });
    if (!doctor) throw new NotFoundException('Doctor profile not found');

    return this.prisma.medicalRecord.create({
      data: {
        patientId: dto.patientId,
        doctorId: doctor.id,
        diagnosis: dto.diagnosis,
        symptoms: dto.symptoms,
        notes: dto.notes,
        attachments: dto.attachments || [],
      },
      include: {
        doctor: { select: { firstName: true, lastName: true, specialty: true } },
      },
    });
  }
}
