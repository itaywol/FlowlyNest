import { Module } from '@nestjs/common';
import { StreamManagerController } from './stream-manager.controller';
import { UserModule } from 'user/user.module';
import { StreamManagerService } from './stream-manager.service';

@Module({
  imports: [UserModule],
  controllers: [StreamManagerController],
  providers: [StreamManagerService],
})
export class StreamManagerModule {}
