import { MongooseModule } from '@nestjs/mongoose';

export const databaseProviders = [
  MongooseModule.forRoot(process.env.MONGO_URI),
];
