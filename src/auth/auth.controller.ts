import {
  Controller,
  Post,
  Session,
  Get,
  Req,
  UseGuards,
  Delete,
  HttpException,
} from '@nestjs/common';
import { UserDto, RequestWithAuth } from 'user/interfaces/user.interface';
import { LocalAuthGuard } from '../passport-strategies/local.strategy';

@Controller('auth')
export class AuthController {
  constructor() {}

  @Post()
  @UseGuards(new LocalAuthGuard())
  async loginUser(
    @Req() req: RequestWithAuth
  ): Promise<UserDto> {
    req.session.passport = {
      userId: req.user._id,
    };

    // TODO: DELETE OTHER SESSIONS

    return req.user;
  }

  @Get()
  async getUser(@Req() req: RequestWithAuth): Promise<UserDto> {
    if (req.user === undefined) {
      throw new HttpException(
        'Not logged in',
        401,
      );
    } else {
      return req.user as UserDto;
    }
  }

  @Delete()
  async logoutUser(@Session() session: Express.Session) {
    session.destroy(err => {
      if (err) {
        throw err;
      }
    });
  }
}
