import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const profile = await this.prisma.patientProfile.findUnique({
      where: { userId },
      include: {
        user: { select: { email: true, phone: true, role: true, createdAt: true } },
      },
    });
    if (!profile) throw new NotFoundException('Patient profile not found');
    return profile;
  }

  async updateProfile(userId: string, dto: any) {
    const profile = await this.prisma.patientProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Patient profile not found');
    return this.prisma.patientProfile.update({ where: { userId }, data: dto });
  }

  async getAppointments(userId: string) {
    return this.prisma.appointment.findMany({
      where: { patientId: userId },
      include: {
        doctor: {
          select: {
            doctorProfile: { select: { firstName: true, lastName: true, specialty: true, avatarUrl: true } },
          },
        },
        hospital: { select: { id: true, name: true, city: true } },
        payment: { select: { status: true, amount: true } },
      },
      orderBy: { date: 'desc' },
    });
  }

  async getMedicalRecords(userId: string) {
    const profile = await this.prisma.patientProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Patient profile not found');
    return this.prisma.medicalRecord.findMany({
      where: { patientId: profile.id },
      include: {
        doctor: { select: { firstName: true, lastName: true, specialty: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPrescriptions(userId: string) {
    const profile = await this.prisma.patientProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Patient profile not found');
    return this.prisma.prescription.findMany({
      where: { patientId: profile.id },
      include: {
        doctor: { select: { firstName: true, lastName: true, specialty: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
