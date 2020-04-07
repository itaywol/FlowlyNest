import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { userProvider } from './user.provider';

@Module({
  imports: userProvider,
  providers: [UserResolver, UserService],
})
export class UserModule {}
