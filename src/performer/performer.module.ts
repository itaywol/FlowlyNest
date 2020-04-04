import { Module } from '@nestjs/common';
import { PerformerResolver } from './performer.resolver';
import { PerformerService } from './performer.service';

@Module({
  providers: [PerformerResolver, PerformerService]
})
export class PerformerModule {}
