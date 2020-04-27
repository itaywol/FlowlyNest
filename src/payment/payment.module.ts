import { Module, HttpModule } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentPlanSchema, TransactionSchema } from 'schemas/payment.schema';
import { UserModule } from 'user/user.module';
import { PaymentProducer } from './payment.producer';
import { PaymentConsumer } from './payment.consumer';
import { PaymentGateway } from './payment.gateway';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    HttpModule,
    UserModule,
    BullModule.registerQueue({
      name: 'payments',
      redis: {
        host: process.env.REDIS_URL,
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),
    MongooseModule.forFeature([
      { name: 'PaymentPlan', schema: PaymentPlanSchema },
      { name: 'Transactions', schema: TransactionSchema },
    ]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentProducer, PaymentConsumer, PaymentGateway],
})
export class PaymentModule {}
