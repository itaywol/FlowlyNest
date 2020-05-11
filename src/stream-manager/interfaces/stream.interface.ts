import { User } from 'user/interfaces/user.interface';
import { StreamChat } from 'chat/interfaces/chat.interfaces';
import { Ticket } from 'tickets/interface/ticket.interface';

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
    plan: 'OneTime';
    price: number;
  }

  interface intervalPlan {
    plan: 'Interval';
    price: number;
    interval: number;
  }
  interface entryPlan {
    plan: 'Entries';
    price: number;
    amount: number;
  }

  interface unlimited {
    plan: 'Unlimited';
    price: number;
  }
}

export type TicketingTypes =
  | TicketsType.oneTime
  | TicketsType.intervalPlan
  | TicketsType.entryPlan
  | TicketsType.unlimited;

export interface StreamSettings {
  crowdControl: CCTypes;
  ticketing: TicketingTypes[];
  title: string;
  isPublic: boolean;
}

export interface Stream extends StreamSettings {
  _id: any;
  startTime: number;
  endTime: number;
  streamChat: StreamChat;
  ticketsBought: Ticket[] | null;
}

export interface UserStreams {
  isActiveStreamer: boolean;
  activeStream: Stream | null;
  futureStreams: Stream[] | null;
  pastStreams: Stream[] | null;
  defaultStreamSettings: StreamSettings;
  streamVisits: number;
}
