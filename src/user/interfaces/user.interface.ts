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

export interface CreateUserDTO {
  email: string;
  password: string;
  nickName: string;
}
