import { Injectable, Inject } from '@nestjs/common';
import { Model, Document, Types, Schema } from 'mongoose';
import { USER_MODEL } from '../constants';
import { User } from './graphql/user.graphql';

export interface UserDoc extends Document {
  email: string;
  password: string;
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
  constructor(@Inject(USER_MODEL) private userModel: Model<UserDoc>) {}
  public async registerUser(createUser: CreateUserDto): Promise<ReturnUser> {
    const createdUser = new this.userModel({
      ...createUser,
    }).save();
    return await createdUser;
  }
}
