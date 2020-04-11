import { Module } from '@nestjs/common';
import { StreamManagerController } from './stream-manager.controller';
import { PerformerModule } from 'performer/performer.module';

@Module({
  imports: [PerformerModule],
  controllers: [StreamManagerController],
})
export class StreamManagerModule {}
