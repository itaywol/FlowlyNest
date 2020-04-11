import { Controller, Post, Session, Get, Param } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userSerivce: UserService) {}

  @Get()
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
}
