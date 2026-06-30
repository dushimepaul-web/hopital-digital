import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  async getChats(@CurrentUser() user: any) {
    return this.chatService.getChats(user.id, user.role);
  }

  @Get(':doctorId')
  async getOrCreateChat(
    @CurrentUser('id') userId: string,
    @Param('doctorId') doctorId: string,
  ) {
    return this.chatService.getOrCreateChat(userId, doctorId);
  }

  @Post(':chatId/message')
  async sendMessage(
    @Param('chatId') chatId: string,
    @CurrentUser('id') userId: string,
    @Body('content') content: string,
  ) {
    return this.chatService.sendMessage(chatId, userId, content);
  }

  @Post(':chatId/read')
  async markAsRead(
    @Param('chatId') chatId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.chatService.markAsRead(chatId, userId);
  }
}
