export interface User {
  _id: any;
  email: string;
  password: string;
  enabled: boolean;
  lastSeenAt: number;
}

export interface CreateUserDTO {
  email: string;
  password: string;
}
