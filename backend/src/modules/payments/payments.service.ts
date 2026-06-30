import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { PaymentStatus, PaymentMethod } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: { patientId?: string; hospitalId?: string; status?: PaymentStatus; page?: number; limit?: number }) {
    const { patientId, hospitalId, status, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (patientId) where.patientId = patientId;
    if (hospitalId) where.hospitalId = hospitalId;
    if (status) where.status = status;

    const [payments, total] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        skip,
        take: limit,
        include: {
          appointment: {
            select: {
              date: true,
              type: true,
              doctor: { select: { doctorProfile: { select: { firstName: true, lastName: true } } } },
            },
          },
          hospital: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.payment.count({ where }),
    ]);

    return { data: payments, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        appointment: {
          include: {
            patient: { select: { patientProfile: true } },
            doctor: { select: { doctorProfile: true } },
          },
        },
        hospital: true,
      },
    });
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }

  async processPayment(dto: {
    appointmentId: string; method: PaymentMethod; amount: number;
    currency?: string;
  }) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: dto.appointmentId },
      include: { payment: true },
    });
    if (!appointment) throw new NotFoundException('Appointment not found');
    if (appointment.payment) throw new BadRequestException('Payment already exists');

    const payment = await this.prisma.payment.create({
      data: {
        appointmentId: dto.appointmentId,
        patientId: appointment.patientId,
        hospitalId: appointment.hospitalId,
        amount: dto.amount,
        currency: dto.currency || 'EUR',
        method: dto.method,
        status: 'COMPLETED',
        paidAt: new Date(),
        transactionId: `TXN-${Date.now()}`,
      },
    });

    return payment;
  }

  async refundPayment(id: string) {
    const payment = await this.prisma.payment.findUnique({ where: { id } });
    if (!payment) throw new NotFoundException('Payment not found');
    if (payment.status !== 'COMPLETED') throw new BadRequestException('Payment cannot be refunded');

    return this.prisma.payment.update({
      where: { id },
      data: { status: 'REFUNDED', refundedAt: new Date() },
    });
  }

  async getStats(hospitalId?: string) {
    const where = hospitalId ? { hospitalId, status: 'COMPLETED' as PaymentStatus } : { status: 'COMPLETED' as PaymentStatus };

    const [totalRevenue, totalTransactions, byMethod] = await Promise.all([
      this.prisma.payment.aggregate({ where, _sum: { amount: true } }),
      this.prisma.payment.count({ where }),
      this.prisma.payment.groupBy({
        by: ['method'],
        where,
        _sum: { amount: true },
        _count: true,
      }),
    ]);

    return {
      totalRevenue: totalRevenue._sum.amount || 0,
      totalTransactions,
      byMethod,
    };
  }
}
