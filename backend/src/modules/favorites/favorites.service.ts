import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async findByUser(userId: string) {
    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      include: {
        doctor: {
          include: {
            hospital: { select: { name: true, city: true } },
          },
        },
      },
    });

    return {
      doctors: favorites.filter(f => f.doctor).map(f => f.doctor),
      hospitals: favorites.filter(f => f.hospitalId).map(f => f.hospitalId),
    };
  }

  async toggleDoctor(userId: string, doctorId: string) {
    const existing = await this.prisma.favorite.findUnique({
      where: { userId_doctorId: { userId, doctorId } },
    });

    if (existing) {
      await this.prisma.favorite.delete({ where: { id: existing.id } });
      return { favorited: false };
    }

    await this.prisma.favorite.create({ data: { userId, doctorId } });
    return { favorited: true };
  }
}
