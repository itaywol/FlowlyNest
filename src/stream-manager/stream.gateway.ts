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
import { RTCPeerConnection } from 'wrtc';

interface WebRTCStream {
  rtc: RTCPeerConnection;
  socketId: string;
}

@WebSocketGateway(parseInt(process.env.BACK_WS_PORT || '3001'), {
  namespace: 'stream',
  path: '/sock',
})
export class StreamGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  private activeStreams: Map<string, WebRTCStream> = new Map<
    string,
    WebRTCStream
  >();
  constructor(
    @Inject('winston') private logger: Logger,
    private userService: UserService,
  ) {}

  @WebSocketServer() server: Server;
  afterInit(server: Server) {
    server.use(sharedsession(session, { autoSave: true }));
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    const userId = client.handshake.session.passport.userId;

    // Disconnect any connection if isnt a logged in user or currently streaming
    //if (!client.handshake.session.passport || this.activeStreams.get(userId) !== undefined) {
    //client.disconnect();
    //return;
    //}

    const user: User = await this.userService.getUserByID(userId);
    try {
      new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      });
    } catch (e) {
      this.logger.error(e);
    }
    const rtc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });
    this.logger.error(rtc);
    rtc.onicecandidate = (e) => this.onIceCandidate(e, client);
    rtc.onconnectionstatechange = () => this.logger.error(rtc.connectionState);

    this.activeStreams.set(userId, { rtc, socketId: client.id });

    this.logger.verbose(`${user.nickName} Started streaming WebRTC negotiate`);

    client.emit('offer', 'test12343');
  }

  onIceCandidate(e: RTCPeerConnectionIceEvent, client: Socket) {
    client.emit('candidate', e.candidate);
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    // Disconnect any connection if isnt a logged in user
    const user: User = await this.userService.getUserByID(
      client.handshake.session.passport.userId,
    );

    if (!client.handshake.session.passport) {
      client.disconnect();
    }

    this.logger.verbose(`${user.nickName} has disconnected from streaming`);
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoomRequest(
    @ConnectedSocket() client: Socket,
    @MessageBody() room: string,
  ) {
    this.logger.verbose(`${client.id} had left ${room}`);
    client.leave(room);
    client.emit('leftRoom', room);
  }
}
