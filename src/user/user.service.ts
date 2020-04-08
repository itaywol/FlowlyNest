import { Injectable, Inject } from '@nestjs/common';
import { User, CredentialsInput  } from './graphql/user.input';
import { Model, Document, Types, Schema } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from 'schemas/user.schema';

export interface CreateUserDto {
  email: string;
  password: string;
}

export interface ReturnUser {
  _id: string;
  email: string;
  password: string;
}

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

  public async registerUser(createUser: CredentialsInput): Promise<User> {
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
    loginData: CredentialsInput,
  ): Promise<UserDocument | undefined> {
    let userAttemptLogin: UserDocument | undefined;
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
