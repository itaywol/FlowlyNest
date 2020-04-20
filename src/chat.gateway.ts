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
import { Inject, UseGuards } from '@nestjs/common';
import sharedsession = require('express-socket.io-session');
import { session } from 'main';
import { AuthGuard } from 'middlewares/auth.guard';

@WebSocketGateway(parseInt(process.env.PORT_WS) || 3001, {
  namespace: 'chat',
})
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  constructor(@Inject('winston') private logger: Logger) {}

  @WebSocketServer() server: Server;
  afterInit(server: Server) {
    server.use(sharedsession(session, { autoSave: true }));
  }

  /*
   * Connection handling
   */
  handleConnection(@ConnectedSocket() client: Socket) {
    // Disconnect any connection if isnt a logged in user
    if (!client.handshake.session.user) {
      client.disconnect();
      return;
    }
    this.logger.info(`${client.handshake.session.user.nickName} has connected`);
  }
  handleDisconnect(@ConnectedSocket() client: Socket) {
    // Disconnect any connection if isnt a logged in user
    if (!client.handshake.session.user) client.disconnect();
    this.logger.info(
      `${client.handshake.session.user.nickName} has disconnected`,
    );
  }

  @SubscribeMessage('onMessageFromClient')
  onMessageFromClient(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { room: string; message: string },
  ): void {
    this.logger.info(
      `${client.handshake.session.user.nickName} has sent a message to room: ${payload.room}`,
    );
    this.server.to(payload.room).emit('onMessageFromServer', {
      sender: client.handshake.session.user.nickName,
      message: payload.message,
    });
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoomRequest(
    @ConnectedSocket() client: Socket,
    @MessageBody() room: string,
  ) {
    this.logger.info(`${client.id} had joined ${room}`);
    client.join(room);
    client.emit('joinedRoom', room);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoomRequest(
    @ConnectedSocket() client: Socket,
    @MessageBody() room: string,
  ) {
    this.logger.info(`${client.id} had left ${room}`);
    client.leave(room);
    client.emit('leftRoom', room);
  }
}
