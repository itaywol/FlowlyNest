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
import { RTCPeerConnection as wRtcPeerConnection, MediaStream as wMediaStream, nonstandard } from 'wrtc';
import { PassThrough } from 'stream';
import * as ffmpeg from 'fluent-ffmpeg';
import { StreamInput } from 'fluent-ffmpeg-multistream';
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';

interface WebRTCStream {
    rtc: RTCPeerConnection;
    socketId: string;
    mediaStream: MediaStream;
}

interface AudioVideoSinks {
    video: nonstandard.RTCVideoSink;
    audio: nonstandard.RTCAudioSink
}

interface AudioVideoPassThroughs {
    video: PassThrough;
    audio: PassThrough
}

interface FfmpegStream {
    sinks: AudioVideoSinks;
    pass: AudioVideoPassThroughs;
    output: string;
    firstTime: boolean;
}

@WebSocketGateway(parseInt(process.env.BACK_WS_PORT || '3001'), {
    namespace: 'stream',
    path: '/sock',
})
export class StreamGateway
    implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    private activeStreams: Map<string, WebRTCStream> = new Map<string, WebRTCStream>();
    constructor(
        @Inject('winston') private logger: Logger,
        private userService: UserService) { }

    @WebSocketServer() server: Server;
    afterInit(server: Server) {
        server.use(sharedsession(session, { autoSave: true }));
    }

    onFrame = ({ frame: { width, height, data } }, stream: FfmpegStream) => {
        const VIDEO_OUTPUT_SIZE = '1920x1080'
        if (stream.firstTime) {
            try {
                stream.firstTime = false;

                stream.sinks.audio.addEventListener('data', ({ samples: { buffer } }) => stream.pass.audio.push(Buffer.from(buffer)));
    
                ffmpeg.setFfmpegPath(ffmpegPath);
                const proc = ffmpeg(stream.pass.video)
                    .addInputOptions([
                        '-f', 'rawvideo',
                        '-s', width + 'x' + height,
                    ])
                    .fps(24)
                    .toFormat('flv')
                    .videoCodec('libx264')
                    .audioCodec('aac')
                    .addInput((new StreamInput(stream.pass.audio)).url)
                    .addInputOptions([
                        '-f s16le',
                        '-ar 48k',
                        '-ac 1',
                    ])
                    .size(VIDEO_OUTPUT_SIZE)
                    .output(stream.output);
    
                proc.run();
            } catch (e) {
                stream.firstTime = true;
                this.logger.error(e);
            }

        }
        
        stream.pass.video.push(Buffer.from(data));
    };

    async handleConnection(@ConnectedSocket() client: Socket) {
        const userId: string = "" + client.handshake.session.passport.userId;

        // Disconnect any connection if isnt a logged in user or currently streaming
        if (!client.handshake.session.passport || this.activeStreams.get(userId) !== undefined) {
            client.disconnect();
            return;
        }

        const user: User = await this.userService.getUserByID(userId);
        const rtc = (new wRtcPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] })) as RTCPeerConnection;

        this.activeStreams.set(userId, { rtc, socketId: client.id, mediaStream: new wMediaStream() });

        rtc.onicecandidate = (e) => { if (e.candidate !== null) client.emit("candidate", e.candidate); };
        rtc.onconnectionstatechange = () => this.onRtcConnectionStateChanged(rtc, user);
        rtc.ontrack = (e) => this.onTrackAdded(e.track, user);

        this.logger.verbose(`${user.nickName} Started WebRTC negotiate`);

        client.on("offer", async (data: RTCSessionDescriptionInit) => this.onOfferReceived(rtc, client, data))
        client.on("candidate", (data: RTCIceCandidate) => rtc.addIceCandidate(data))
    }

    onTrackAdded(track: MediaStreamTrack, user: User) {
        const activeStream = this.activeStreams.get("" + user._id);

        if (activeStream === undefined) {
            this.logger.error("Track added on non existing stream");
        } else {
            activeStream.mediaStream.addTrack(track);

            this.activeStreams.set(user._id, activeStream);

            this.logger.verbose(`Added ${track.kind} track for ${user.nickName} stream.`);

            const audioTracks = activeStream.mediaStream.getAudioTracks();
            const videoTracks = activeStream.mediaStream.getVideoTracks();

            if (audioTracks.length === 1 && videoTracks.length === 1) {
                const videoSink = new nonstandard.RTCVideoSink(videoTracks[0]);
                const audioSink = new nonstandard.RTCAudioSink(audioTracks[0]);
                const stream: FfmpegStream = {
                    sinks: {
                        video: videoSink,
                        audio: audioSink
                    },
                    output: `rtmp://nginx:1935/perform/${user.performer.stream.secretKey}`,
                    pass: {
                        audio: new PassThrough(),
                        video: new PassThrough()
                    },
                    firstTime: true
                }
                stream.sinks.video.addEventListener('frame', (a) => this.onFrame(a, stream));
            }
        }
    }

    onOfferReceived = async (rtc: RTCPeerConnection, client: Socket, data: RTCSessionDescriptionInit) => {
        try {
            await rtc.setRemoteDescription(data);
            const answer = await rtc.createAnswer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
            await rtc.setLocalDescription(answer);
            client.emit("answer", answer);
        } catch (e) {
            console.error(e);
            console.error("error creating answer");
        }
    }

    onRtcConnectionStateChanged(rtc: RTCPeerConnection, _user: User) {
        switch (rtc.connectionState) {
            case "connected":
            case "disconnected":
            case "closed":
            case "failed":
                break;
        }
    }

    async handleDisconnect(@ConnectedSocket() client: Socket) {
        const userId = "" + client.handshake.session.passport.userId;
        // Disconnect any connection if isnt a logged in user
        const user: User = await this.userService.getUserByID(userId);

        const activeStream = this.activeStreams.get(userId);

        if (activeStream !== undefined && activeStream.socketId === client.id) {
            activeStream.rtc.close();
            this.activeStreams.set(userId, undefined);
        }

        this.logger.verbose(`${user.nickName} has stopped WebRTC negotiate`);
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