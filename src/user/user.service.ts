import { Injectable, Inject } from '@nestjs/common';
import { Model, Document } from 'mongoose';
import { USER_MODEL } from '../constants';

export interface UserDoc extends Document {
  readonly email: string;
  readonly password: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
}
@Injectable()
export class UserService {
  constructor(@Inject(USER_MODEL) private userModel: Model<UserDoc>) {}
  public registerUser(createUser: CreateUserDto): Promise<UserDoc> {
    const createdUser = new this.userModel(createUser);
    return createdUser.save();
  }
}
