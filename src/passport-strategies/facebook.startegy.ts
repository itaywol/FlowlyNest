import { Strategy, Profile } from 'passport-facebook';
import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserService } from 'user/user.service';
import { use } from 'passport';

@Injectable()
export class FacebookStartegy {
  constructor(readonly userService: UserService) {
    use(
      'facebook',
      new Strategy(
        {
          clientID: '933128667136642',
          clientSecret: 'b5f645ac5bc377fdd9d90c630e797984',
          callbackURL: '/login',
        },
        this.verify,
      ),
    );
  }

  verify = async (
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any, info?: any) => void,
  ) => {
    try {
        return done(null , await this.userService.findOrCreateFacebook(profile));
    } catch (e) {
        return done(e, false);
    }
  };
}

@Injectable()
export class FacebookAuthGuard extends AuthGuard('facebook') {}
