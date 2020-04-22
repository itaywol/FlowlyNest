import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserModule } from 'user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionSchema } from './sessions.schema';

@Module({
  imports: [UserModule,
            MongooseModule.forFeature([{ name: 'Session', schema: SessionSchema }])],
  controllers: [AuthController]
})
export class AuthModule {}
