import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'schemas/user.schema';
import { UserController } from './user.controller';
import { PerformerModule } from 'performer/performer.module';
import { PassportModule } from '@nestjs/passport';

const passportModule = PassportModule.register({ defaultStrategy: 'local' });

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    PerformerModule,
    passportModule
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [
    UserService,
    passportModule
  ],
})
export class UserModule {}
