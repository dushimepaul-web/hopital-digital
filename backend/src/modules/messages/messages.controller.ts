import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('chat')
  async getOrCreateChat(
    @Body('patientId') patientId: string,
    @Body('doctorId') doctorId: string,
  ) {
    return this.messagesService.getOrCreateChat(patientId, doctorId);
  }

  @Get('chats')
  async getChats(@CurrentUser('id') userId: string) {
    return this.messagesService.getChats(userId);
  }

  @Get('chat/:chatId')
  async getMessages(
    @Param('chatId') chatId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.messagesService.getMessages(chatId, page, limit);
  }

  @Post('chat/:chatId/read')
  async markAsRead(@Param('chatId') chatId: string, @CurrentUser('id') userId: string) {
    return this.messagesService.markAsRead(chatId, userId);
  }
}
