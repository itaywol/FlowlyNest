import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserModule } from 'user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionSchema } from './sessions.schema';
import { AuthService } from './auth.service';

@Module({
  imports: [UserModule,
            MongooseModule.forFeature([{ name: 'Session', schema: SessionSchema }])],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
