import { Performer } from 'performer/interfaces/performer.interface';
import { Request } from "express"

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
}

export interface User extends UserDto {
  _id: any;
  auth: AuthType;
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
}

export interface RequestWithAuth extends Request {
  user: UserDto;
}