import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from 'winston';
import { Inject } from '@nestjs/common';
import sharedsession = require('express-socket.io-session');
import { session } from 'main';
import { UserService } from 'user/user.service';
import { User } from 'user/interfaces/user.interface';

@WebSocketGateway(parseInt(process.env.BACK_WS_PORT || '3001'), {
  namespace: 'chat',
  path: '/sock',
})
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  constructor(
    @Inject('winston') private logger: Logger,
    private userService: UserService,
  ) {}

  @WebSocketServer() server: Server;
  afterInit(server: Server) {
    server.use(sharedsession(session, { autoSave: true }));
  }

  /*
   * Connection handling
   */
  async handleConnection(@ConnectedSocket() client: Socket) {
    // Disconnect any connection if isnt a logged in user
    if (!client.handshake.session.passport) {
      client.disconnect();
      return;
    }
    const user: User = await this.userService.getUserByID(
      client.handshake.session.passport.userId,
    );
    this.logger.verbose(`${user.nickName} has connected`);
  }
  async handleDisconnect(@ConnectedSocket() client: Socket) {
    // Disconnect any connection if isnt a logged in user
    const user: User = await this.userService.getUserByID(
      client.handshake.session.passport.userId,
    );
    if (!client.handshake.session.passport) {
      client.disconnect();
    }
    this.logger.verbose(`${user.nickName} has disconnected`);
  }

  @SubscribeMessage('onMessageFromClient')
  async onMessageFromClient(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { room: string; message: string },
  ): Promise<void> {
    const user: User = await this.userService.getUserByID(
      client.handshake.session.passport.userId,
    );
    this.logger.verbose(
      `${user.nickName} has sent a message to room: ${payload.room} with content: ${payload.message}`,
    );
    this.server.to(payload.room).emit('onMessageFromServer', {
      sender: user.nickName,
      message: payload.message,
    });
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoomRequest(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { room: string },
  ) {
    this.logger.verbose(`${client.id} had joined ${payload.room}`);
    client.join(payload.room);
    client.emit('joinedRoom', payload.room);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoomRequest(
    @ConnectedSocket() client: Socket,
    @MessageBody() room: string,
  ) {
    this.logger.verbose(`${client.id} had left ${room}`);
    client.leave(room);
    client.emit('leftRoom', room);
  }
}
