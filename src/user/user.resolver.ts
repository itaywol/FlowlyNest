import {
  Resolver,
  Query,
  Mutation,
  Args,
  GraphQLExecutionContext,
  Context,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { CredentialsInput } from './graphql/user.input';
import { User, UserDto } from './graphql/user.model';
import { UserDocument } from 'schemas/user.schema';
import { Request, Response } from 'express';
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
    @Context() context: { req: Request; res: Response },
    @Args('data') data: CredentialsInput,
  ): Promise<User> {
    let createdUser: User | undefined;
    try {
      createdUser = await this.userService.registerUser(data);
    } catch (error) {
      console.error(error.message);
    }
    context.req.session.user = createdUser;
    return createdUser._id;
  }

  @Query(returns => String)
  async login(
    @Context() context: { req: Request; res: Response },
    @Args('data') data: CredentialsInput,
  ): Promise<string | undefined> {
    const user: UserDocument = await this.userService.validateUser(data);
    if (!user) return undefined;

    context.req.session.user = user;
    return user._id;
  }

  @Query(returns => Boolean)
  async logout(
    @Context() context: { req: Request; res: Response },
  ): Promise<boolean> {
    try {
      context.req.session.destroy(err => {
        throw err;
      });
    } catch (error) {
      this.logger.warn('Logout failed: ' + error);
      return false;
    }

    return true;
  }

  @Query(returns => UserDto, { nullable: true })
  async get(
    @Context() context: { req: Request; res: Response },
  ): Promise<boolean> {
    let result = undefined;

    if (context.req.session) {
      try {
        result = context.req.session.user;
      } catch (error) {
        console.error(error.message);
      }
    }

    return result;
  }
}
