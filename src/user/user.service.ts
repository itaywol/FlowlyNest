import { Injectable, Inject } from '@nestjs/common';
import { Model, Document, Types, Schema } from 'mongoose';
import { USER_MODEL } from '../constants';
import { User } from './graphql/user.graphql';
import { InjectModel } from '@nestjs/mongoose';

export interface UserDoc extends Document {
  email: string;
  password: string;
  wallet: string;
  tickets: string;
}

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
  constructor(@InjectModel('User') private userModel: Model<UserDoc>) {}
  public async registerUser(createUser: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUser);
    let user: UserDoc | undefined;
    try {
      user = await createdUser.save();
    } catch (error) {
      console.error(error.message);
    }
    return user;
  }
}
