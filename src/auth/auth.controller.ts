import {
  Body,
  Controller,
  Inject,
  Post,
  HttpException,
  Session,
} from '@nestjs/common';
import {
  CreateUserDTO,
  User,
  LoginUserDTO,
} from 'user/interfaces/user.interface';
import { UserService } from 'user/user.service';
import { Logger } from 'winston';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    @Inject('winston') private logger: Logger,
  ) {}

  @Post('register')
  async registerUser(
    @Session() session: any,
    @Body() data: CreateUserDTO,
  ): Promise<string> {
    const createdUser: User = await this.userService.registerUser(data);

    if (!createdUser) throw new HttpException('User Already Exists', 401);

    session.user = createdUser;
    delete session.user.password;

    return createdUser._id;
  }

  @Post('login')
  async loginUser(
    @Session() session: any,
    @Body() data: LoginUserDTO,
  ): Promise<string> {
    const loginUser = await this.userService.validateUser(data);

    if (!loginUser)
      throw new HttpException('Email or Password not Correct', 404);

    session.user = loginUser;
    delete session.user.password;
    return loginUser._id;
  }
}
