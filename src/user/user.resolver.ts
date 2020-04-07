import {
  Resolver,
  Query,
  Mutation,
  Int,
  Args,
  InputType,
  Field,
  Context,
  GraphQLExecutionContext,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { User, LoginInput, UserInput } from './graphql/user.graphql';

@Resolver(of => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Mutation(returns => User)
  async registerUser(@Args('data') data: UserInput): Promise<User> {
    let createdUser: User | undefined;
    try {
      createdUser = await this.userService.registerUser(data);
    } catch (error) {
      console.error(error.message);
    }
    console.log(JSON.stringify(createdUser));
    return createdUser;
  }

  @Query(returns => String)
  async loginUser(@Context() context: any, @Args('data') data: LoginInput) {
    context.res.cookie('test_cookie', 'safjdufsjdflksjdf908usdf', {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return 'hello';
  }
}
