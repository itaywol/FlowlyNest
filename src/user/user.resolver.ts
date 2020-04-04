import { Resolver, Query, Int, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './graphql/user.graphql';

@Resolver(of => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(returns => User)
  async User(@Args('id', { type: () => Int }) id: number): Promise<User> {
    return {
      id: 'xxx',
      email: 'itay',
      password: 'secret',
      wallet: 'mywallet',
      tickets: 'my tickets',
    };
  }
}
