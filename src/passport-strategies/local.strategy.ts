import { Strategy, IVerifyOptions } from 'passport-local';
import { AuthGuard } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'user/user.service';
import { use } from 'passport';

@Injectable()
export class LocalStrategy {
  constructor(readonly userService: UserService) {
    use(
      'local',
      new Strategy(
        {
          usernameField: 'email',
          passwordField: 'password',
          session: false,
        },
        async (
          email: string,
          password: string,
          done: (error: any, user?: any, options?: IVerifyOptions) => void,
        ) => {
          try {
            const user = await userService.validateLocalUser({ email, password });

            if (!user) {
              return done(new UnauthorizedException(), false);
            }

            return done(null, user);
          } catch (error) {
            return done(error, false);
          }
        },
      ),
    );
  }
}

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
