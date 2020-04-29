import { Injectable, HttpException, forwardRef, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'schemas/user.schema';
import {
  CreateUserDTO,
  User,
  UpdateUserDTO,
  LoginUserDTO,
  UserDto,
  GetUserChannelDTO,
} from 'user/interfaces/user.interface';
import { ChannelChatDTO } from 'chat/interfaces/chat.interfaces';
import { ChatDocument } from 'schemas/chat.schema';
import { ChatService } from 'chat/chat.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => ChatService)) private chatService: ChatService,
  ) {}

  public async registerUser(createUser: CreateUserDTO): Promise<User> {
    const createdUser: UserDocument = new this.userModel({
      ...createUser,
      enabled: JSON.parse(process.env.AUTO_ACTIVATE_USERS || 'true'),
    });
    let user: UserDocument | undefined;
    let chat: ChatDocument = await this.chatService.createChat();
    try {
      createdUser.performer.stream.chat = chat;
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

  public async validateUser(
    loginData: LoginUserDTO,
  ): Promise<UserDocument | undefined> {
    let userAttemptLogin: UserDocument | undefined;

    if (loginData.email) {
      userAttemptLogin = await this.userModel
        .findOne({
          lowercaseEmail: loginData.email.toLowerCase(),
        })
        .select('+password');
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

  public async getUserEntryFee(userId: string): Promise<number> {
    const user: UserDocument = await this.userModel.findById(userId);
    return user.performer.stream.settings.pricing;
  }

  public async getUserByNickname(nickName: string): Promise<UserDocument> {
    const user: UserDocument = await this.userModel
      .findOne({ nickName })
      .populate('performer.stream.chat');

    return user;
  }

  public async getUserChannel(
    nickName: string,
  ): Promise<GetUserChannelDTO | null> {
    console.log('here');
    const user: UserDocument = await this.getUserByNickname(nickName);
    const owner: UserDto = user as UserDto;
    const chat: ChannelChatDTO = user.performer.stream.chat as ChannelChatDTO;
    if (chat?.chatMessages && chat?.chatMessages.length > 200) {
      const messages = chat?.chatMessages.slice(
        chat.chatMessages.length - 200,
        chat.chatMessages.length - 1,
      );
      chat.chatMessages = messages;
    } else {
      chat.chatMessages = [];
    }

    return { owner, chat } as GetUserChannelDTO;
  }
}
