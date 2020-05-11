import { User } from 'user/interfaces/user.interface';
import { StreamChat } from 'chat/interfaces/chat.interfaces';

declare namespace CrowdControlType {
  interface freeForAll {
    ticketPrice: number;
    limitViewers: number;
  }

  interface list {
    whiteList: User[];
    blackList: User[];
  }
}

export type CCTypes = CrowdControlType.list | CrowdControlType.freeForAll;

declare namespace TicketsType {
  interface oneTime {
    price: number;
  }

  interface plan {
    price: number;
    interval: number;
  }

  interface unlimited {
    price: number;
  }
}

export type TicketingTypes =
  | TicketsType.oneTime
  | TicketsType.plan
  | TicketsType.unlimited;

export interface StreamSettings {
  crowdControl: CCTypes;
  ticketing: TicketingTypes;
  title: string;
  isPublic: boolean;
}

export interface Stream extends StreamSettings {
  _id: any;
  startTime: number;
  endTime: number;
  streamChat: StreamChat;
}

export interface UserStreams {
  isActiveStreamer: boolean;
  activeStream: Stream | null;
  futureStreams: Stream[] | null;
  pastStreams: Stream[] | null;
  defaultStreamSettings: StreamSettings;
}
