import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { PaymentService } from './payment.service';
import { IQueueCreatePaymentDTO } from './payment.producer';
import { PaymentGateway } from './payment.gateway';

@Processor('payments')
export class PaymentConsumer {
  constructor(
    private paymentService: PaymentService,
    private paymentGateway: PaymentGateway,
  ) {}
  @Process()
  async handlePayment(job: Job<IQueueCreatePaymentDTO>) {
    const { purchaserId, ...rest } = job.data;
    const data = await this.paymentService.checkout(purchaserId, rest);
    this.paymentGateway.emitMessage(purchaserId, 'PaymentStatus', data);

    return data;
  }
}
