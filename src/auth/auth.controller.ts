import {
  Controller,
  Post,
  Get,
  Req,
  UseGuards,
  HttpException,
  Delete,
} from '@nestjs/common';
import { UserDto, RequestWithAuth } from 'user/interfaces/user.interface';
import { LocalAuthGuard } from '../passport-strategies/local.strategy';
import { AuthService } from './auth.service';
import { FacebookAuthGuard } from 'passport-strategies/facebook.startegy';
import { GoogleAuthGuard } from 'passport-strategies/google.strategy';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('google')
  @UseGuards(new GoogleAuthGuard())
  async google(
    @Req() req: RequestWithAuth
  ): Promise<UserDto> {  
    return this.authService.loginUser(req);
  }

  @Get('facebook')
  @UseGuards(new FacebookAuthGuard())
  async facebook(
    @Req() req: RequestWithAuth
  ): Promise<UserDto> {  
    return this.authService.loginUser(req);
  }

  @Post()
  @UseGuards(new LocalAuthGuard())
  async loginUser(
    @Req() req: RequestWithAuth
  ): Promise<UserDto> {
    return this.authService.loginUser(req);
  }

  @Get()
  async getUser(@Req() req: RequestWithAuth): Promise<UserDto> {
    if (req.user === undefined) {
      throw new HttpException('Not logged in', 401);
    } else {
      return req.user as UserDto;
    }
  }

  @Delete()
  async logoutUser(@Req() req: RequestWithAuth) {
    req.session.destroy((err) => {
      if (!err) {

        throw err;
      }
    })
  }
}
