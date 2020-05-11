import { User } from 'user/interfaces/user.interface';
import { Stream } from 'stream-manager/interfaces/stream.interface';

export interface Ticket {
  _id: any;
  ownerID: any;
  streamID: any;
  price: number;
  createdAt: Date;
}

export interface TicketDTO {
  _id: any;
  owner: User;
  stream: Stream;
  price: number;
  createdAt: Date;
}

export interface BuyTicketDTO {
  streamID: string;
}
