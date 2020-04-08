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
import { User, CredentialsInput, UserDto } from './graphql/user.input';
import { UserDocument } from 'schemas/user.schema';
import { Request } from 'express';
import { Req, Inject } from '@nestjs/common';
import { Logger } from 'winston';

@Resolver(of => User)
export class UserResolver {
  constructor(
    private userService: UserService,
    @Inject('winston') private readonly logger: Logger,
  ) {}

  @Mutation(returns => String)
  async register(
    @Req() req: Request,
    @Args('data') data: CredentialsInput,
  ): Promise<User> {
    let createdUser: User | undefined;
    try {
      createdUser = await this.userService.registerUser(data);
    } catch (error) {
      console.error(error.message);
    }
    req.session.user = { id: createdUser._id };
    return createdUser._id;
  }

  @Query(returns => String)
  async login(
    @Req() req: Request,
    @Args('data') data: CredentialsInput,
  ): Promise<string | undefined> {
    const user: UserDocument = await this.userService.validateUser(data);
    if (!user) return undefined;

    req.session.user = { id: user._id };
    return user._id;
  }

  @Query(returns => Boolean)
  async logout(@Req() req: Request): Promise<boolean> {
    try {
      req.session.destroy(err => {
        throw err;
      });
    } catch (error) {
      this.logger.warn('Logout failed: ' + error);
      return false;
    }

    return true;
  }

  @Query(returns => UserDto, {nullable: true})
  async get(@Req() req: Request): Promise<boolean> {
    let result = undefined;

    if (req.session !== undefined) {
      result = req.session.user;
    }

    return result;
  }
}
