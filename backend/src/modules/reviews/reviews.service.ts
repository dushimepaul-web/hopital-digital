import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async findByDoctor(doctorId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { doctorId },
        skip,
        take: limit,
        include: {
          patient: {
            select: { patientProfile: { select: { firstName: true, lastName: true, avatarUrl: true } } },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.review.count({ where: { doctorId } }),
    ]);
    return { data, total, page, limit };
  }

  async create(dto: { doctorId: string; rating: number; comment?: string; hospitalId?: string }, patientUserId: string) {
    const existing = await this.prisma.review.findUnique({
      where: { patientId_doctorId: { patientId: patientUserId, doctorId: dto.doctorId } },
    });
    if (existing) throw new Error('You already reviewed this doctor');

    const review = await this.prisma.review.create({
      data: {
        patientId: patientUserId,
        doctorId: dto.doctorId,
        hospitalId: dto.hospitalId,
        rating: dto.rating,
        comment: dto.comment,
        isApproved: false,
      },
    });

    await this.updateDoctorRating(dto.doctorId);
    return review;
  }

  private async updateDoctorRating(doctorId: string) {
    const result = await this.prisma.review.aggregate({
      where: { doctorId, isApproved: true },
      _avg: { rating: true },
      _count: true,
    });
    await this.prisma.doctorProfile.update({
      where: { id: doctorId },
      data: { rating: result._avg.rating || 0, reviewCount: result._count },
    });
  }
}
