import { User } from 'user/interfaces/user.interface';

export interface ChatMessage {
  sender: { user: User; nickName: string };
  message: string;
  createdAt: number;
}

export interface ChatMessageEvent extends ChatMessage {
  room: string;
}

export interface ChatSettings {
  censorOffensiveWords: boolean;
}

export interface StreamChat {
  _id: any;
  chatMessages: ChatMessage[];
  chatSettings: ChatSettings;
}

export interface ChatMessageDTO {
  sender: { nickName: string };
  message: string;
  createdAt: number;
}

export interface ReceiveChatMessageDTO extends ChatMessageDTO {
  room: string;
}

export interface StreamChatDTO {
  _id: string;
  chatMessages: ChatMessageDTO[];
  chatSettings: ChatSettings;
}
