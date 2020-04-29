import { Injectable, Req, Inject } from '@nestjs/common';
import { SessionDocument } from './sessions.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, NativeError } from 'mongoose';
import { RequestWithAuth } from 'user/interfaces/user.interface';
import { Logger } from 'winston';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('Session') private sessionModel: Model<SessionDocument>,
    @Inject('winston') private logger: Logger,
  ) {}

  async loginUser(@Req() req: RequestWithAuth) {
    req.session.passport = {
      userId: req.user._id,
    };

    await this.sessionModel
      .deleteMany({
        _id: { $ne: req.session.id },
        'session.passport.userId': req.user._id,
      })
      .exec((err: NativeError, result) => {
        if (result.n > 0) {
          this.logger.debug(
            `signed out of ${result.n} other sessions for user: "${req.user.email}"`,
          );
        }

        if (err !== null) {
          throw err;
        }
      });

    return req.user;
  }
}
