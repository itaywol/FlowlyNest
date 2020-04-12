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
} from '@nestjs/common';
import { User, UpdateUserDTO } from './interfaces/user.interface';
import { UserService } from './user.service';
import { AuthGuard } from 'middlewares/auth.guard';
import { Personalized } from 'personalized.decorator';

@Controller('user')
export class UserController {
  constructor(private userSerivce: UserService) {}

  @Get()
  @UseGuards(AuthGuard)
  public async myUser(@Session() session: any): Promise<User> {
    return await session.user;
  }

  @Get(':id')
  public async getUserByID(@Param('id') id: string): Promise<User> {
    return (await this.userSerivce.getUserByID(id)) as User;
  }

  @Post(':id/performer')
  public async makePerformerAccount(@Param('id') id: string): Promise<User> {
    return (await this.userSerivce.makeUserPerformer(id)) as User;
  }

  @Put()
  @UseGuards(AuthGuard)
  public async updateMyProfile(
    @Session() session: any,
    @Body() updateUserData: UpdateUserDTO,
  ): Promise<User> {
    if (!session.user) throw new HttpException('Not loggedin user', 401);
    return await this.userSerivce.updateUser(session.user._id, updateUserData);
  }

  @Put(':id')
  @Personalized(true)
  @UseGuards(AuthGuard)
  public async updateProfile(
    @Param('id') id: string,
    @Body() updateUserData: UpdateUserDTO,
  ): Promise<User> {
    return await this.userSerivce.updateUser(id, updateUserData);
  }
}
