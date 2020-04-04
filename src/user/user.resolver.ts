import {
  Resolver,
  Query,
  Mutation,
  Int,
  Args,
  InputType,
  Field,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './graphql/user.graphql';

@InputType()
export class UserInput {
  @Field()
  email: string;
  @Field()
  password: string;
}

@Resolver(of => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Mutation(returns => User)
  async registerUser(@Args('data') data: UserInput): Promise<User> {
    console.debug('help');
    const user = await this.userService.registerUser({
      email: data.email,
      password: data.password,
    });
    return { ...user, wallet: 'test', tickets: 'test' };
  }
}
