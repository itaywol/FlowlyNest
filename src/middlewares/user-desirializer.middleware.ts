import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
//import { logoutUserFromRequest } from 'src/sessions/sessions.controller';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserDeserializerMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}

  use = async (req: Request, _res: Response, next: () => void) => {
    if ((req.session as any).passport !== undefined) {
      try {
        req.user = await this.authService.getUser(req.session.passport.userId);
      } catch (err) {
        if (err instanceof NotFoundException) {
          //         logoutUserFromRequest(req);
        } else {
          console.error(err);
          throw err;
        }
      }
    }
    next();
  };

  resolve() {
    return this.use;
  }
}
