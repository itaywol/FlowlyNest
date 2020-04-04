import { Injectable } from '@nestjs/common';
import { User } from 'user/graphql/user.graphql';

@Injectable()
export class UserService {
  public getUser(userId: string): Promise<User> | User {
    return new User();
  }
}
