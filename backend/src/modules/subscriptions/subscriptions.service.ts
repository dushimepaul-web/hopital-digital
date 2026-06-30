import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { SubscriptionStatus } from '@prisma/client';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: {
    hospitalId: string; plan: string; price: number;
    startDate?: string; endDate: string; trialEndDate?: string;
    autoRenew?: boolean; stripeSubId?: string;
  }) {
    const existing = await this.prisma.subscription.findUnique({ where: { hospitalId: dto.hospitalId } });
    if (existing) throw new BadRequestException('Hospital already has a subscription');

    return this.prisma.subscription.create({
      data: {
        hospitalId: dto.hospitalId,
        plan: dto.plan,
        price: dto.price,
        startDate: dto.startDate ? new Date(dto.startDate) : new Date(),
        endDate: new Date(dto.endDate),
        trialEndDate: dto.trialEndDate ? new Date(dto.trialEndDate) : undefined,
        autoRenew: dto.autoRenew ?? true,
        stripeSubId: dto.stripeSubId,
        status: 'TRIAL',
      },
    });
  }

  async findByHospital(hospitalId: string) {
    const subscription = await this.prisma.subscription.findUnique({ where: { hospitalId } });
    if (!subscription) throw new NotFoundException('Subscription not found for this hospital');
    return subscription;
  }

  async update(id: string, dto: any) {
    const subscription = await this.prisma.subscription.findUnique({ where: { id } });
    if (!subscription) throw new NotFoundException('Subscription not found');
    return this.prisma.subscription.update({ where: { id }, data: dto });
  }

  async cancel(id: string) {
    const subscription = await this.prisma.subscription.findUnique({ where: { id } });
    if (!subscription) throw new NotFoundException('Subscription not found');
    return this.prisma.subscription.update({
      where: { id },
      data: { status: 'CANCELLED' as SubscriptionStatus },
    });
  }

  async findAll(query: { status?: string; plan?: string; page?: number; limit?: number }) {
    const { status, plan, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;
    const where: any = {};

    if (status) where.status = status;
    if (plan) where.plan = { contains: plan, mode: 'insensitive' };

    const [data, total] = await Promise.all([
      this.prisma.subscription.findMany({
        where,
        skip,
        take: limit,
        include: { hospitals: { select: { id: true, name: true, city: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.subscription.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
