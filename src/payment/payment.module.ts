import { Module, HttpModule } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PerformerModule } from 'performer/performer.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentPlanSchema, TransactionSchema } from 'schemas/payment.schema';
import { UserModule } from 'user/user.module';

@Module({
  imports: [
    HttpModule,
    PerformerModule,
    UserModule,
    MongooseModule.forFeature([
      { name: 'PaymentPlan', schema: PaymentPlanSchema },
      { name: 'Transactions', schema: TransactionSchema },
    ]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
