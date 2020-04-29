import { Injectable, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'schemas/user.schema';
import {
  CreateUserDTO as CreateLocalUserDTO,
  User,
  UpdateUserDTO,
  LoginUserDTO,
  AuthTypes,
  UserDto,
  AuthType,
} from 'user/interfaces/user.interface';
import { Profile as FacebookProfile } from "passport-facebook-token";

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
  ) {}
  public async findOrCreateFacebook(profile: FacebookProfile): Promise<UserDto | null> {

      let user = await this.userModel.findOne({email: profile.emails[0].value}).exec()
      if (user === null) {
        const authType: AuthType = {
          authType: 'facebook',
          facebook: profile.id
        };
    
        const createdUser = new this.userModel({
          auth: authType,
          email: profile.emails[0].value,
          nickName: profile.name.givenName + profile.name.familyName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          lastSeenAt: Date.now(),
          enabled: JSON.parse(process.env.AUTO_ACTIVATE_USERS || 'true'),
        } as User);

        try {
          user = await createdUser.save();
        } catch (error) {
          console.error(error.message);
          throw new HttpException(
            'Error creating user or user already exists',
            401,
          );
        }
      } else {
        if (user.auth.authType !== "facebook" || user.auth.facebook !== profile.id) {
          throw new HttpException("Email already used by another account.", 401);
        }
      }

      return user;
  }

  public async registerLocal(createUser: CreateLocalUserDTO): Promise<User> {
    const authType: AuthType = {
      authType: 'local',
      password: createUser.password,
    };

    const createdUser = new this.userModel({
      auth: authType,
      email: createUser.email.toLowerCase(),
      nickName: createUser.nickName,
      enabled: JSON.parse(process.env.AUTO_ACTIVATE_USERS || 'true'),
    });
    
    let user: UserDocument | undefined;
    try {
      user = await createdUser.save();
    } catch (error) {
      console.error(error.message);
      throw new HttpException(
        'Error creating user or user already exists',
        401,
      );
    }
    return user;
  }

  public async validateLocalUser(
    loginData: LoginUserDTO,
  ): Promise<UserDocument | undefined> {
    let userAttemptLogin: UserDocument | undefined;

    if (loginData.email) {
      userAttemptLogin = await this.userModel
        .findOne({
          "auth.authType": "local",
          email: loginData.email.toLowerCase()
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
      delete (result.auth as AuthTypes.Local).password;
      userAttemptLogin.lastSeenAt = Date.now();
      userAttemptLogin.save();
      return result;
    }

    return undefined;
  }

  async getUserByID(id: string): Promise<UserDocument | null> {
    let findUserById: UserDocument | undefined;

    try {
      findUserById = await this.userModel.findById(id);
    } catch (Error) {
      throw new HttpException('Not found', 404);
    }

    return findUserById;
  }

  async updateUser(_id: string, updateUserData: UpdateUserDTO): Promise<User> {
    const updateUser: UserDocument = await this.userModel.findByIdAndUpdate(
      _id,
      updateUserData,
      { new: true },
    );

    if (!updateUser) throw new HttpException('User not found', 404);

    return updateUser;
  }

  async takeBalanceFromUser(_id: string, amount: number): Promise<User> {
    const updateUser: UserDocument = await this.userModel.findByIdAndUpdate(
      _id,
      { $inc: { 'balance.currentBalance': -amount } },
      { new: true },
    );

    return updateUser;
  }
  async addBalanceToUser(_id: string, amount: number): Promise<User> {
    const updateUser: UserDocument = await this.userModel.findByIdAndUpdate(
      _id,
      { $inc: { 'balance.currentBalance': amount } },
      { new: true },
    );

    return updateUser;
  }
  public async getUserByStreamSecret(secret: string): Promise<UserDocument> {
    const user: UserDocument = await this.userModel.findOne({
      'performer.stream.secretKey': secret,
    });

    return user;
  }

  public async getPerformerEntryFee(userId: string): Promise<number> {
    const user: UserDocument = await this.userModel.findById(userId);
    return user.performer.stream.settings.pricing;
  }
}
