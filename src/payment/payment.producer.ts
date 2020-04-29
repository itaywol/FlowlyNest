import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ICreatePaymentDTO } from './interfaces/payment.interfaces';

export interface IQueueCreatePaymentDTO extends ICreatePaymentDTO {
  purchaserId: string;
}
@Injectable()
export class PaymentProducer {
  constructor(@InjectQueue('payments') private paymentsQueue: Queue) {}

  async createPayment(data: IQueueCreatePaymentDTO): Promise<void> {
    await this.paymentsQueue.add(data);
  }
}
