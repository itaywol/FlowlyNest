import { Module } from '@nestjs/common';
import { QueuesService } from './queues.service';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'payments',
      redis: { host: 'redis', port: 6379 },
    }),
  ],
  providers: [QueuesService],
  exports: [QueuesService],
})
export class QueuesModule {}
