import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChatDocument } from 'schemas/chat.schema';
import { Model } from 'mongoose';
import { ChatMessage } from './interfaces/chat.interfaces';

@Injectable()
export class ChatService {
  constructor(@InjectModel('Chat') private chatModel: Model<ChatDocument>) {}

  public async createChat(): Promise<ChatDocument | null> {
    const chat: ChatDocument | null = await this.chatModel.create({});

    return chat;
  }

  public async pushChatMessageToDB(chatID: string, data: ChatMessage) {
    console.log('heyo');
    const chat: ChatDocument = await this.chatModel.findById(chatID);
    chat.chatMessages.push(data);
    return await chat.save();
  }
}
