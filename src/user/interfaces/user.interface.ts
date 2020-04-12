import { Performer } from 'performer/interfaces/performer.interface';

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
}
export interface LoginUserDTO {
  email: string;
  password: string;
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
