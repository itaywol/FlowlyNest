import { Module } from '@nestjs/common';
import { StreamManagerController } from './stream-manager.controller';
import { UserModule } from 'user/user.module';

@Module({
  imports: [UserModule],
  controllers: [StreamManagerController],
})
export class StreamManagerModule {}
