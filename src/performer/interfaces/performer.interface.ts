import { User } from 'user/interfaces/user.interface';
export interface Stream {
  title: string;
  secretKey: string;
  live: boolean;
}
export interface Performer {
  _id: any;
  user: User;
  stream: Stream;
  //TODO: switch to performances type
  performances: string[];
}
