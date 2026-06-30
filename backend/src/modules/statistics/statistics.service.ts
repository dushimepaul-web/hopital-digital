import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class StatisticsService {
  constructor(private prisma: PrismaService) {}

  async getAdminStats() {
    const [
      totalUsers, totalDoctors, totalPatients, totalHospitals,
      totalAppointments, totalRevenue, pendingHospitals,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.doctorProfile.count(),
      this.prisma.user.count({ where: { role: 'PATIENT' } }),
      this.prisma.hospital.count(),
      this.prisma.appointment.count(),
      this.prisma.payment.aggregate({ where: { status: 'COMPLETED' }, _sum: { amount: true } }),
      this.prisma.hospital.count({ where: { status: 'PENDING' } }),
    ]);

    return {
      totalUsers,
      totalDoctors,
      totalPatients,
      totalHospitals,
      totalAppointments,
      totalRevenue: totalRevenue._sum.amount || 0,
      pendingHospitals,
    };
  }

  async getHospitalStats(hospitalId: string) {
    const [appointments, doctors, payments, revenue] = await Promise.all([
      this.prisma.appointment.findMany({
        where: { hospitalId },
        select: { status: true, date: true },
      }),
      this.prisma.doctorProfile.count({ where: { hospitalId } }),
      this.prisma.payment.findMany({
        where: { hospitalId },
        select: { status: true, amount: true, createdAt: true },
      }),
      this.prisma.payment.aggregate({
        where: { hospitalId, status: 'COMPLETED' },
        _sum: { amount: true },
      }),
    ]);

    const completedAppointments = appointments.filter(a => a.status === 'COMPLETED').length;
    const cancelledAppointments = appointments.filter(a => a.status === 'CANCELLED').length;

    return {
      totalAppointments: appointments.length,
      completedAppointments,
      cancelledAppointments,
      totalDoctors: doctors,
      totalRevenue: revenue._sum.amount || 0,
      totalPayments: payments.length,
    };
  }

  async getDoctorStats(doctorUserId: string) {
    const doctor = await this.prisma.doctorProfile.findUnique({ where: { userId: doctorUserId } });
    if (!doctor) return {};

    const [appointments, patients, revenue] = await Promise.all([
      this.prisma.appointment.findMany({
        where: { doctorProfileId: doctor.id },
        select: { status: true },
      }),
      this.prisma.appointment.groupBy({
        by: ['patientId'],
        where: { doctorProfileId: doctor.id },
      }),
      this.prisma.payment.aggregate({
        where: { appointment: { doctorProfileId: doctor.id }, status: 'COMPLETED' },
        _sum: { amount: true },
      }),
    ]);

    return {
      totalAppointments: appointments.length,
      completedAppointments: appointments.filter(a => a.status === 'COMPLETED').length,
      totalPatients: patients.length,
      rating: doctor.rating,
      reviewCount: doctor.reviewCount,
      totalRevenue: revenue._sum.amount || 0,
    };
  }
}
