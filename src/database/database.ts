import * as mongoose from 'mongoose';
import { DATABASE_PROVIDER } from '../constants';
import { MongooseModule } from '@nestjs/mongoose';

export const databaseProviders = [
  MongooseModule.forRoot(process.env.MONGO_URI),
];
