import { Injectable, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'schemas/user.schema';
import { CreateUserDTO, User } from 'user/interfaces/user.interface';
import { PerformerService } from 'performer/performer.service';
import { PerformerDocument } from 'schemas/performer.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
    private performerService: PerformerService,
  ) {}

  public async registerUser(createUser: CreateUserDTO): Promise<User> {
    const createdUser = new this.userModel({
      ...createUser,
      enabled: JSON.parse(process.env.AUTO_ACTIVATE_USERS || 'true'),
    });
    let user: UserDocument | undefined;
    try {
      user = await createdUser.save();
    } catch (error) {
      console.error(error.message);
    }
    return user;
  }

  public async validateUser(
    loginData: CreateUserDTO,
  ): Promise<UserDocument | undefined> {
    let userAttemptLogin: UserDocument | undefined;

    if (loginData.email) {
      userAttemptLogin = await this.userModel.findOne({
        lowercaseEmail: loginData.email.toLowerCase(),
      });
    }

    if (userAttemptLogin && userAttemptLogin.enabled === false) {
      userAttemptLogin = undefined;
      throw new HttpException('User is not activated', 401);
    }

    let isMatch = false;
    try {
      isMatch = await userAttemptLogin.checkPassword(loginData.password);
    } catch (error) {
      return undefined;
    }

    if (isMatch) {
      const result = userAttemptLogin;
      delete result.password;
      userAttemptLogin.lastSeenAt = Date.now();
      userAttemptLogin.save();
      return result;
    }

    return undefined;
  }

  async getUserByID(id: string): Promise<UserDocument> {
    let findUserById: UserDocument | undefined;

    try {
      findUserById = await this.userModel.findById(id);
    } catch (Error) {
      throw new HttpException('Not found', 404);
    }

    return findUserById;
  }

  async makeUserPerformer(id: string): Promise<UserDocument> {
    const findUser: UserDocument = await this.getUserByID(id);
    findUser.populate('performer');
    if (findUser.performer) throw new HttpException('Already performer', 401);

    if (findUser) {
      try {
        const performerModel: PerformerDocument = await this.performerService.makeUserPerformer(
          findUser._id,
        );
        console.log(performerModel);
        findUser.performer = performerModel._id;
        await findUser.save();
        return findUser;
      } catch (Error) {
        throw new HttpException('Couldnt make performer', 404);
      }
    }

    return findUser;
  }
}
