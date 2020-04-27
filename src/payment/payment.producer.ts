import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ICreatePaymentDTO } from './interfaces/payment.interfaces';
import Bull = require('bull');

export interface IQueueCreatePaymentDTO extends ICreatePaymentDTO {
  purchaserId: string;
}
@Injectable()
export class PaymentProducer {
  constructor(@InjectQueue('payments') private paymentsQueue: Queue) {}

  async createPayment(data: IQueueCreatePaymentDTO): Promise<boolean> {
    const job: Bull.Job<any> = await this.paymentsQueue.add(data);

    return await job.isCompleted();
  }
}
