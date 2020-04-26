import { Injectable, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'schemas/user.schema';
import {
  CreateUserDTO as CreateLocalUserDTO,
  User,
  UpdateUserDTO,
  LoginUserDTO as LoginLocalUserDTO,
  AuthTypes,
  UserDto,
  AuthType,
} from 'user/interfaces/user.interface';
import { PerformerDocument } from 'schemas/performer.schema';
import { PerformerService } from 'performer/performer.service';
import { Profile as FacebookProfile } from 'passport-facebook';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
    private performerService: PerformerService,
  ) {}
  public async findOrCreateFacebook(profile: FacebookProfile): Promise<UserDto | null> {

      const user = await this.userModel.findOne({email: profile.emails[0].value}).exec()
      debugger;
      if (user.auth.authType !== "facebook" || user.auth.facebook !== profile.id) {
        throw new HttpException("Email already used by another account.", 401);
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
    loginData: LoginLocalUserDTO,
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

  async makeUserPerformer(id: string): Promise<UserDocument> {
    const findUser: UserDocument = await this.getUserByID(id);
    findUser.populate('performer');
    if (findUser.performer) throw new HttpException('Already performer', 401);

    if (findUser) {
      try {
        const performerModel: PerformerDocument = await this.performerService.makeUserPerformer(
          findUser._id,
        );
        findUser.performer = performerModel._id;
        await findUser.save();
        return findUser;
      } catch (Error) {
        throw new HttpException('Couldnt make performer', 404);
      }
    }

    return findUser;
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
}
