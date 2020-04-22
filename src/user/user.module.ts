import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'schemas/user.schema';
import { UserController } from './user.controller';
import { PerformerModule } from 'performer/performer.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    PerformerModule
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [
    UserService
  ],
})
export class UserModule {}
