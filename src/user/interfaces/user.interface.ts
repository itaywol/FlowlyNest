import { Performer } from 'performer/interfaces/performer.interface';
import { Request } from "express"

export interface User {
  _id: any;
  email: string;
  firstName: string;
  lastName: string;
  nickName: string;
  phoneNumber: string;
  enabled: boolean;
  performer: Performer;
  lastSeenAt: number;
  balance: {
    currentBalance: number;
  };
}
export interface LoginUserDTO {
  email: string;
  password: string;
}

export interface UserDto {
  id: string;
  email: string;
  nickName: string;
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
  phoneNumber: string;
}

export interface RequestWithAuth extends Request {
  user: UserDto;
}