import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { userProvider } from './user.provider';
import { DatabaseModule } from 'database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [UserResolver, UserService, ...userProvider],
})
export class UserModule {}
