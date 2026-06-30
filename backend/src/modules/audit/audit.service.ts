import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditAction } from '@prisma/client';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: {
    action?: AuditAction; entity?: string; userId?: string;
    page?: number; limit?: number;
  }) {
    const { action, entity, userId, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;
    const where: any = {};

    if (action) where.action = action;
    if (entity) where.entity = entity;
    if (userId) where.userId = userId;

    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        include: { user: { select: { email: true, role: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findByUser(userId: string) {
    return this.prisma.auditLog.findMany({
      where: { userId },
      include: { user: { select: { email: true, role: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async log(data: {
    action: AuditAction; entity: string; entityId?: string;
    userId: string; ipAddress?: string; userAgent?: string; metadata?: any;
  }) {
    return this.prisma.auditLog.create({ data });
  }
}
