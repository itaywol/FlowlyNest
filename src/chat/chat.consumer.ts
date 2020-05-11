import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import {
  ReceiveChatMessageDTO,
  ChatMessage,
} from './interfaces/chat.interfaces';
import { UserService } from 'user/user.service';
import { UserDocument } from 'schemas/user.schema';
import { forwardRef, Inject } from '@nestjs/common';
import { ChatService } from './chat.service';

@Processor('chatMessages')
export class ChatConsumer {
  constructor(
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    private chatService: ChatService,
  ) {}

  @Process()
  async handleChatMessage(job: Job<ReceiveChatMessageDTO>) {
    // Extract the owner of the chat by the room name
    const userChat: UserDocument = await this.userService.getUserByNickname(
      job.data.room,
    );

    // get the chat id
    const chatId: string = userChat.streams.activeStream.streamChat._id;

    // Exctract message sender data
    const sender: UserDocument = await this.userService.getUserByNickname(
      job.data.sender.nickName,
    );

    // construct a formatted chat message object
    const constructedChatMessage: ChatMessage = {
      sender: { user: sender, nickName: sender.nickName },
      message: job.data.message,
      createdAt: Date.now(),
    };

    // push that message to that chat room history
    const result = await this.chatService.pushChatMessageToDB(
      chatId,
      constructedChatMessage,
    );

    return result;
  }
}
