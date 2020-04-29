import { Module, forwardRef } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { UserModule } from 'user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { ChatConsumer } from './chat.consumer';
import { ChatProducer } from './chat.producer';
import { ChatSchema } from 'schemas/chat.schema';
import { ChatService } from './chat.service';

@Module({
  imports: [
    forwardRef(() => UserModule),
    MongooseModule.forFeature([{ name: 'Chat', schema: ChatSchema }]),
    BullModule.registerQueue({
      name: 'chatMessages',
      redis: {
        host: process.env.REDIS_URL,
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),
  ],
  providers: [ChatGateway, ChatConsumer, ChatProducer, ChatService],
  exports: [ChatGateway, ChatService],
})
export class ChatModule {}
