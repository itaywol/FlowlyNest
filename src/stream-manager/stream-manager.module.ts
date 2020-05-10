import { Module } from '@nestjs/common';
import { StreamManagerController } from './stream-manager.controller';
import { UserModule } from 'user/user.module';
import { StreamGateway } from './stream.gateway';

@Module({
  imports: [UserModule],
  controllers: [StreamManagerController],
  providers: [StreamGateway]
})
export class StreamManagerModule {}
