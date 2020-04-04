import * as mongoose from 'mongoose';
import { DATABASE_PROVIDER } from '../constants';

export const databaseProviders = [
  {
    provide: DATABASE_PROVIDER,
    useFactory: (): Promise<typeof mongoose> => {
      return mongoose.connect(process.env.MONGO_URI);
    },
  },
];
