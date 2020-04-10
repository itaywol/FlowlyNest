import { Module } from '@nestjs/common';
import { PerformerService } from './performer.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PerformerSchema } from 'schemas/performer.schema';
import { PerformerController } from './performer.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Performer', schema: PerformerSchema }]),
  ],
  providers: [PerformerService],
  controllers: [PerformerController],
})
export class PerformerModule {}
