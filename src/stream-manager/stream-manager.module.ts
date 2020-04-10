import { Module } from '@nestjs/common';
import { StreamManagerController } from './stream-manager.controller';

@Module({
  controllers: [StreamManagerController],
})
export class StreamManagerModule {}
