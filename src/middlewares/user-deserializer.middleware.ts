import { Injectable, NestMiddleware, NotFoundException, Inject } from '@nestjs/common';
import { UserService } from 'user/user.service';
import { RequestWithAuth } from 'user/interfaces/user.interface';
import { Logger } from 'winston';

@Injectable()
export class UserDeserializerMiddleware implements NestMiddleware {
  constructor(private userService: UserService,
    @Inject('winston') private logger: Logger) {}

  use = async (req: RequestWithAuth, _res: Response, next: () => void) => {
    if ((req.session as any).passport !== undefined) {
      try {
        const userDocument = await this.userService.getUserByID(
          req.session.passport.userId,
        );
        req.user = {
          email: userDocument.email,
          nickName: userDocument.nickName,
          id: userDocument.id,
        };
      } catch (err) {
        if (err instanceof NotFoundException) {
          req.session.destroy(err => {
            if (err !== undefined) {
              throw err;
            }
          });
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
