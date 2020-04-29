import { Request } from 'express';
import { ChannelChatDTO, ChannelChat } from 'chat/interfaces/chat.interfaces';
export interface StreamSettings {
  pricing: number;
}
export interface Stream {
  title: string;
  secretKey: string;
  chat: ChannelChat;
  live: boolean;
  settings: StreamSettings;
}
export interface Paypal {
  email: string;
  phoneNumber: string;
}
export interface Performer {
  stream: Stream;
  paypal: Paypal;
  balance: {
    currentBalance: number;
    transactions: any;
  };
  //TODO: switch to performances type
  performances: string[];
}

export type AuthType = AuthTypes.Local | AuthTypes.Facebook;

export declare namespace AuthTypes {
  interface Local {
    authType: "local";
    password?: string;
  }

  interface Facebook {
    authType: "facebook";
    facebook: string;
  }
}

export interface UserDto {
  _id: string;
  email: string;
  nickName: string;
  firstName: string;
  lastName: string;
  enabled: boolean;
  performer: Performer;
  lastSeenAt: number;
  balance: {
    currentBalance: number;
  };
}

export interface User extends UserDto {
  _id: any;
  auth: AuthType;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}

export interface GetUserChannelDTO {
  owner: UserDto;
  chat: ChannelChatDTO;
}

export interface CreateUserDTO {
  email: string;
  password: string;
  nickName: string;
}

export interface UpdateUserDTO {
  email: string;
  firstName: string;
  lastName: string;
}

export interface RequestWithAuth extends Request {
  user: UserDto;
}
