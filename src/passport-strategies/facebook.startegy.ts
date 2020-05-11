import * as FacebookTokenStrategy from 'passport-facebook-token';
import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserService } from 'user/user.service';
import { use } from 'passport';

@Injectable()
export class FacebookStartegy {
  constructor(readonly userService: UserService) {
    use(
      'facebook',
      new FacebookTokenStrategy(
        {
          clientID: '662636214298507',
          clientSecret: '57a876d5e8864bb49d942829039cc740',
        },
        this.verify,
      ),
    );
  }

  verify = async (
    _accessToken: string,
    _refreshToken: string,
    profile: FacebookTokenStrategy.Profile,
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
