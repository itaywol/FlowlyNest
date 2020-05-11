import { Request } from 'express';
import { Transaction } from 'braintree';
import { StreamChatDTO } from 'chat/interfaces/chat.interfaces';
import { UserStreams } from 'stream-manager/interfaces/stream.interface';
import { Ticket } from 'tickets/interface/ticket.interface';

export type AuthType = AuthTypes.Local | AuthTypes.Facebook | AuthTypes.Google;

export declare namespace AuthTypes {
  interface Local {
    authType: 'local';
    password?: string;
  }

  interface Facebook {
    authType: 'facebook';
    facebook: string;
  }

  interface Google {
    authType: 'google';
    google: string;
  }
}

export declare namespace payoutMethods {
  interface Paypal {
    email: string | null;
    phoneNumber: string | null;
  }
}

export type payoutMethodsType = payoutMethods.Paypal;

export interface PayoutRequest {
  submittedAt: number;
  amount: number;
}

export interface Payouts {
  method: payoutMethodsType;
  requests: PayoutRequest[] | null;
}

export interface Wallet {
  chargedBalance: number;
  earnedBalance: number;
  transactions: Transaction[] | null;
  ownedTickets: Ticket[] | null;
  payouts: Payouts;
}

export interface UserDto {
  _id: string;
  email: string;
  nickName: string;
  firstName: string;
  lastName: string;
  enabled: boolean;
  lastSeenAt: number;
  wallet: Wallet;
  streams: UserStreams;
}

export interface User extends UserDto {
  _id: any;
  auth: AuthType;
  secretStreamKey: string;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}

export interface GetUserChannelDTO {
  owner: UserDto;
  chat: StreamChatDTO;
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
