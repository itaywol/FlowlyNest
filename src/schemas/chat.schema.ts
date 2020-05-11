import { Schema, Document } from 'mongoose';
import { ChannelChat } from 'chat/interfaces/chat.interfaces';

export interface ChatDocument extends ChannelChat, Document {}

export const ChatSchema = new Schema(
  {
    chatMessages: [
      {
        sender: {
          user: { type: Schema.Types.ObjectId, ref: 'User' },
          nickName: { type: String },
        },
        message: { type: String },
        createdAt: { type: Date, default: () => Date.now() },
      },
    ],
    chatSettings: {
      censorOffensiveWords: { type: Boolean, default: true },
    },
  },
  { timestamps: true },
);
