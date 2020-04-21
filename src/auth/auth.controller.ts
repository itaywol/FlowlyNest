import {
  Controller,
  Inject,
  Post,
  Session,
  Get,
  Req,
  UseGuards,
  Delete,
} from '@nestjs/common';
import {
  UserDto,
  RequestWithAuth,
} from 'user/interfaces/user.interface';
import { Logger } from 'winston';
import { NativeError, Model, Document } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { LocalAuthGuard } from './local.strategy';

@Controller('auth')
export class AuthController {
  constructor(
    @InjectModel('Session') private readonly sessionModel: Model<Document>,
    @Inject('winston') private logger: Logger,
  ) {}

  @Post()
  @UseGuards(new LocalAuthGuard())
  async loginUser(@Req() req: RequestWithAuth, @Session() session: Express.Session): Promise<UserDto> {
      session.passport = {
        userId: req.user.id,
    };

      // Delete other sessions
      await this.sessionModel.updateMany({
                                          '_id': { $ne: req.session.id},
                                          'session.passport.userId': req.user.id,
                                      }, { $unset: { 'session.passport': '' }}).exec((err: NativeError, result) => {
          if ( result.n > 0) {
              this.logger.debug(`signed out other sessions for user: "${req.user.email}"`);
          }

          if (err !== null) {
              throw err;
          }
      });

      return (req.user);
  }

  @Get()
  async getUser(@Req() req: RequestWithAuth): Promise<UserDto> {
    return (req.user as UserDto);
  }

  @Delete()
  async logoutUser(@Session() session: Express.Session) {
    session.destroy((err) => {
      if (err) {
        throw err;
      }
    });
  }
}