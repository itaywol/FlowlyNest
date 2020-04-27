import {
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
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
  namespace: 'payment',
  path: '/sock',
})
export class PaymentGateway
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
    this.logger.info(`${user.nickName} has connected`);
    client.join(user._id);
  }
  async handleDisconnect(@ConnectedSocket() client: Socket) {
    // Disconnect any connection if isnt a logged in user
    const user: User = await this.userService.getUserByID(
      client.handshake.session.passport.userId,
    );
    if (!client.handshake.session.passport) {
      client.disconnect();
    }
    this.logger.info(`${user.nickName} has disconnected`);
  }

  async emitMessage(userId: string, eventName: string, data: any) {
    this.server.to(userId).emit(eventName, data);
  }
}
