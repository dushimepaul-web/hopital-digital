import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: { origin: '*', credentials: true },
  namespace: '/ws/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger(ChatGateway.name);
  private connectedClients = new Map<string, string>();

  constructor(private chatService: ChatService) {}

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.connectedClients.set(userId, client.id);
      client.join(`user:${userId}`);
      this.logger.log(`User ${userId} connected to chat`);
    }
  }

  handleDisconnect(client: Socket) {
    this.connectedClients.forEach((value, key) => {
      if (value === client.id) {
        this.connectedClients.delete(key);
        this.logger.log(`User ${key} disconnected from chat`);
      }
    });
  }

  @SubscribeMessage('join:chat')
  async handleJoinChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chatId: string },
  ) {
    client.join(`chat:${data.chatId}`);
  }

  @SubscribeMessage('message:send')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chatId: string; content: string; senderId: string; fileUrl?: string },
  ) {
    const message = await this.chatService.sendMessage(
      data.chatId,
      data.senderId,
      data.content,
      data.fileUrl,
    );
    this.server.to(`chat:${data.chatId}`).emit('message:new', message);
  }

  @SubscribeMessage('message:typing')
  async handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chatId: string; userId: string; isTyping: boolean },
  ) {
    client.to(`chat:${data.chatId}`).emit('message:typing', data);
  }
}
