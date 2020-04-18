import { Module, HttpModule } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PerformerModule } from 'performer/performer.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentPlanSchema } from 'schemas/payment.schema';

@Module({
  imports: [
    HttpModule,
    PerformerModule,
    MongooseModule.forFeature([
      { name: 'PaymentPlan', schema: PaymentPlanSchema },
    ]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
