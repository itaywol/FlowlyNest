import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'schemas/user.schema';
import { CreateUserDTO, User } from 'user/interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

  public async registerUser(createUser: CreateUserDTO): Promise<User> {
    const createdUser = new this.userModel(createUser);
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
    console.log(JSON.stringify(loginData));
    if (loginData.email) {
      userAttemptLogin = await this.userModel.findOne({
        lowercaseEmail: loginData.email.toLowerCase(),
      });
    }

    if (userAttemptLogin && userAttemptLogin.enabled === false) {
      userAttemptLogin = undefined;
    }

    if (!userAttemptLogin) return undefined;

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
}
