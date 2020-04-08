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
import { UserDocument } from 'schemas/user.schema';

@Resolver(of => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Mutation(returns => String)
  async registerUser(
    @Context() context: any,
    @Args('data') data: UserInput,
  ): Promise<User> {
    let createdUser: User | undefined;
    try {
      createdUser = await this.userService.registerUser(data);
    } catch (error) {
      console.error(error.message);
    }
    context.req.session.user = { id: createdUser._id };
    return createdUser._id;
  }

  @Query(returns => String)
  async loginUser(
    @Context() context: any,
    @Args('data') data: LoginInput,
  ): Promise<string | undefined> {
    const user: UserDocument = await this.userService.validateUser(data);
    if (!user) return undefined;

    context.req.session.user = { id: user._id };
    return user._id;
  }

  @Query(returns => Boolean)
  async logout(@Context() context): Promise<boolean> {
    try {
      context.req.session.destroy();
    } catch (error) {
      return false;
    }

    return true;
  }
}
