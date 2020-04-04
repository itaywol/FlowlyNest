import { USER_MODEL, DATABASE_PROVIDER } from '../constants';
import { Connection } from 'mongoose';
import { UserSchema } from 'schemas/user.schema';

export const userProvider = [
  {
    provide: USER_MODEL,
    useFactory: (connection: Connection) =>
      connection.model('User', UserSchema),
    inject: [DATABASE_PROVIDER],
  },
];