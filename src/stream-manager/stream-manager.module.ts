import { Module } from '@nestjs/common';
import { StreamManagerController } from './stream-manager.controller';
import { StreamManagerResolver } from './stream-manager.resolver';

@Module({
  controllers: [StreamManagerController],
  providers: [StreamManagerResolver]
})
export class StreamManagerModule {}
