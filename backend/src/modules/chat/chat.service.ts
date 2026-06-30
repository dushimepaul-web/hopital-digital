import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getOrCreateChat(patientId: string, doctorId: string) {
    let chat = await this.prisma.chat.findUnique({
      where: { patientId_doctorId: { patientId, doctorId } },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          include: { sender: { select: { id: true, role: true } } },
        },
      },
    });

    if (!chat) {
      chat = await this.prisma.chat.create({
        data: { patientId, doctorId },
        include: {
          messages: {
            include: { sender: { select: { id: true, role: true } } },
          },
        },
      });
    }

    return chat;
  }

  async getChats(userId: string, role: string) {
    const where = role === 'DOCTOR' ? { doctorId: userId } : { patientId: userId };

    return this.prisma.chat.findMany({
      where,
      include: {
        messages: { take: 1, orderBy: { createdAt: 'desc' } },
        patient: role === 'DOCTOR' ? {
          select: { patientProfile: { select: { firstName: true, lastName: true, avatarUrl: true } } },
        } : undefined,
        doctor: role === 'PATIENT' ? {
          select: { doctorProfile: { select: { firstName: true, lastName: true, avatarUrl: true, specialty: true } } },
        } : undefined,
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async sendMessage(chatId: string, senderId: string, content: string, fileUrl?: string) {
    const message = await this.prisma.chatMessage.create({
      data: { chatId, senderId, content, fileUrl },
      include: { sender: { select: { id: true, role: true } } },
    });

    await this.prisma.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() },
    });

    return message;
  }

  async markAsRead(chatId: string, userId: string) {
    await this.prisma.chatMessage.updateMany({
      where: { chatId, senderId: { not: userId }, readAt: null },
      data: { readAt: new Date() },
    });
    return { success: true };
  }
}
