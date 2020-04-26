import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ICreatePaymentDTO } from 'payment/interfaces/payment.interfaces';
import Bull = require('bull');

export interface IQueueCreatePaymentDTO extends ICreatePaymentDTO {
  purchaserId: string;
}
@Injectable()
export class QueuesService {
  constructor(@InjectQueue('payments') private paymentsQueue: Queue) {}

  async createPayment(
    data: IQueueCreatePaymentDTO,
  ): Promise<Bull.Job<IQueueCreatePaymentDTO>> {
    return await this.paymentsQueue.add(data);
  }
}
