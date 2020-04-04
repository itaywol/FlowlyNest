import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
//import { logoutUserFromRequest } from 'src/sessions/sessions.controller';
import { UserService } from '../user/user.service';

@Injectable()
export class UserDeserializerMiddleware implements NestMiddleware {
  constructor(private userService: UserService) {}

  use = async (req: Request, _res: Response, next: () => void) => {
    if ((req.session as any).passport !== undefined) {
      try {
        //        req.user = await this.userService.getUser(req.session.passport.userId);
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
