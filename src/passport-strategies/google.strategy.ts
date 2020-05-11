import { Profile, VerifyCallback } from 'passport-google-oauth20';
import { Strategy } from 'passport-google-token';
import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserService } from 'user/user.service';
import { use } from 'passport';

@Injectable()
export class GoogleStartegy {
  constructor(readonly userService: UserService) {
    use(
      'google',
      new Strategy(
        {
          clientID: '1014596992798-h2tr5h1lts32p6ld93qtpvc0b17c88p6.apps.googleusercontent.com',
          clientSecret: '4o1aSS8raUHywICmsAaaa3GG',
        },
        this.verify,
      ),
    );
  }

  verify = async (
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback
)  => {
    try {
        return done(null , await this.userService.findOrCreateGoogle(profile));
    } catch (e) {
        return done(e, false);
    }
  };
}

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {}
