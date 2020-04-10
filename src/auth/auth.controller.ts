import {
  Body,
  Controller,
  Inject,
  Post,
  HttpException,
  Session,
} from '@nestjs/common';
import { CreateUserDTO, User } from 'user/interfaces/user.interface';
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
    let createdUser: User | undefined;
    console.log(data);

    try {
      createdUser = await this.userService.registerUser(data);
    } catch (error) {
      this.logger.error(error.message);
    }

    if (!createdUser) throw new HttpException('User Already Exists', 401);

    session.user = createdUser;

    return createdUser._id;
  }

  @Post('login')
  async loginUser(
    @Session() session: any,
    @Body() data: CreateUserDTO,
  ): Promise<string> {
    let loginUser: User | undefined;

    try {
      loginUser = await this.userService.validateUser(data);
    } catch (error) {
      this.logger.error(error.message);
    }

    if (!loginUser)
      throw new HttpException('Email or Password not Correcgt', 404);

    session.user = loginUser;
    return loginUser._id;
  }
}
