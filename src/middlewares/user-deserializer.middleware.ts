import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { UserService } from 'user/user.service';
import { RequestWithAuth } from 'user/interfaces/user.interface';

@Injectable()
export class UserDeserializerMiddleware implements NestMiddleware {
  constructor(private userService: UserService) {}

  use = async (req: RequestWithAuth, _res: Response, next: () => void) => {
    if ((req.session as any).passport !== undefined) {
      try {
        const userDocument = await this.userService.getUserByID(
          req.session.passport.userId,
        );
        req.user = {
          id: userDocument.id,
          email: userDocument.email,
          nickName: userDocument.nickName,
          firstName: userDocument.firstName,
          lastName: userDocument.lastName,
          phoneNumber: userDocument.phoneNumber,
          balance: userDocument.balance,
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
