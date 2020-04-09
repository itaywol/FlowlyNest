import { Module } from '@nestjs/common';
import { PerformerResolver } from './performer.resolver';
import { PerformerService } from './performer.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PerformerSchema } from 'schemas/performer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Performer', schema: PerformerSchema }]),
  ],
  providers: [PerformerResolver, PerformerService],
})
export class PerformerModule {}
