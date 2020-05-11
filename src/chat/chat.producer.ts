import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { ChatMessageEvent } from './interfaces/chat.interfaces';

@Injectable()
export class ChatProducer {
  constructor(@InjectQueue('chatMessages') private chatMessagesQueue: Queue) {}

  async addMessageToDB(data: ChatMessageEvent): Promise<void> {
    console.log('producer');
    await this.chatMessagesQueue.add(data);
  }
}
