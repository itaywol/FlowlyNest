import { User } from 'user/interfaces/user.interface';
export interface StreamSettings {
  pricing: number;
}
export interface Stream {
  title: string;
  secretKey: string;
  live: boolean;
  settings: StreamSettings;
}
export interface Performer {
  _id: any;
  user: User;
  stream: Stream;
  //TODO: switch to performances type
  performances: string[];
}
