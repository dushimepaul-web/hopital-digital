import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async getOrCreateChat(patientId: string, doctorId: string) {
    const existing = await this.prisma.chat.findUnique({
      where: { patientId_doctorId: { patientId, doctorId } },
      include: { messages: { orderBy: { createdAt: 'desc' }, take: 1 } },
    });
    if (existing) return existing;

    return this.prisma.chat.create({
      data: { patientId, doctorId },
      include: { messages: true },
    });
  }

  async getChats(userId: string) {
    return this.prisma.chat.findMany({
      where: {
        OR: [{ patientId: userId }, { doctorId: userId }],
      },
      include: {
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
        _count: { select: { messages: { where: { readAt: null, senderId: { not: userId } } } } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getMessages(chatId: string, page = 1, limit = 50) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.chatMessage.findMany({
        where: { chatId },
        skip,
        take: limit,
        include: { sender: { select: { id: true, role: true } } },
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.chatMessage.count({ where: { chatId } }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async markAsRead(chatId: string, userId: string) {
    return this.prisma.chatMessage.updateMany({
      where: { chatId, senderId: { not: userId }, readAt: null },
      data: { readAt: new Date() },
    });
  }
}
