import { UserSchema } from 'schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';

export const userProvider = [
  MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
];
