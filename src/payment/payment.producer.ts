import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { PaymentService } from './payment.service';
import { IQueueCreatePaymentDTO } from 'queues/queues.service';

@Processor('payments')
export class PaymentProducer {
  constructor(private paymentService: PaymentService) {}
  @Process()
  async handlePayment(job: Job<IQueueCreatePaymentDTO>) {
    const { purchaserId, ...rest } = job.data;
    this.paymentService.checkout(purchaserId, rest);
  }
}
