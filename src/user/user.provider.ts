import { USER_MODEL, DATABASE_PROVIDER } from '../constants';
import { UserSchema } from 'schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';

export const userProvider = [
  MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
];
