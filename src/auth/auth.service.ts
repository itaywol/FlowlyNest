import { Injectable } from '@nestjs/common';
import { Auth } from 'src/auth/graphql/auth.graphql';

@Injectable()
export class AuthService {
  public getUser(userId: string): Promise<Auth> | Auth {
    return new Auth();
  }
}
