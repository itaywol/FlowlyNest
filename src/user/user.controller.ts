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
  Query,
} from '@nestjs/common';
import {
  User,
  UpdateUserDTO,
  CreateUserDTO,
  RequestWithAuth,
  UserDto,
  GetUserChannelDTO,
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
  ): Promise<UserDto> {
    const createdUser: User = await this.userService.registerLocal(body);

    if (!createdUser) throw new HttpException('User Already Exists', 401);

    session.passport = {
      userId: createdUser._id,
    };

    const toUserDto: UserDto = {
      _id: createdUser._id,
      balance: createdUser.balance,
      email: createdUser.email,
      enabled: createdUser.enabled,
      firstName: createdUser.firstName,
      lastName: createdUser.lastName,
      lastSeenAt: createdUser.lastSeenAt,
      nickName: createdUser.nickName,
      performer: createdUser.performer
    };
    
    return toUserDto;
  }

  @Get()
  public async myUser(@Req() req: RequestWithAuth): Promise<UserDto> {
    return req.user;
  }

  @Get()
  public async getUserByID(
    @Query('id') id: string,
    @Query('nickName') nickName: string,
  ): Promise<UserDto> {
    if (id) return (await this.userService.getUserByID(id)) as UserDto;
    if (nickName)
      return (await this.userService.getUserByNickname(nickName)) as UserDto;

    throw new HttpException('Must provide query', 401);
  }
  @Get('/channel')
  public async getUserChannel(
    @Query('nickName') nickName: string,
  ): Promise<GetUserChannelDTO | null> {
    if (!nickName) throw new HttpException('Must provide nickName param', 404);
    const result = await this.userService.getUserChannel(nickName);
    return result;
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
