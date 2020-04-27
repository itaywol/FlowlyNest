import {
  Controller,
  Post,
  Session,
  Get,
  Param,
  Put,
  Body,
  HttpException,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  User,
  UpdateUserDTO,
  CreateUserDTO,
  RequestWithAuth,
  UserDto,
} from './interfaces/user.interface';
import { UserService } from './user.service';
import { Personalized } from 'personalized.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async registerUser(
    @Session() session: Express.Session,
    @Body() body: CreateUserDTO,
  ): Promise<string> {
    const createdUser: User = await this.userService.registerUser(body);

    if (!createdUser) throw new HttpException('User Already Exists', 401);

    session.passport = {
      userId: createdUser._id,
    };

    return createdUser._id;
  }

  @Get()
  public async myUser(@Req() req: RequestWithAuth): Promise<UserDto> {
    return req.user;
  }

  @Get(':id')
  public async getUserByID(@Param('id') id: string): Promise<User> {
    return (await this.userService.getUserByID(id)) as User;
  }

  @Put()
  @UseGuards(AuthGuard())
  public async updateMyProfile(
    @Session() session: Express.Session,
    @Body() updateUserData: UpdateUserDTO,
  ): Promise<User> {
    if (!session.user) throw new HttpException('Not loggedin user', 401);
    return await this.userService.updateUser(session.user._id, updateUserData);
  }

  @Put(':id')
  @Personalized(true)
  @UseGuards(AuthGuard())
  public async updateProfile(
    @Param('id') id: string,
    @Body() updateUserData: UpdateUserDTO,
  ): Promise<User> {
    return await this.userService.updateUser(id, updateUserData);
  }
}
