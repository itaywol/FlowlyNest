import { Injectable, HttpService, HttpException } from '@nestjs/common';
import {
  ICreatePaymentDTO,
  IPaymentResponse,
  IPaymentCreation,
  PaymentPlan,
  ICreatePaymentPlanDTO,
  IUpdatePaymentPlanDTO,
} from './interfaces/payment.interfaces';
import { PerformerService } from 'performer/performer.service';
import { PaymentPlanDocument } from 'schemas/payment.schema';
import { Model, Query } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  connect,
  Environment,
  BraintreeGateway,
  TransactionRequest,
  ValidatedResponse,
  Transaction,
} from 'braintree';

@Injectable()
export class PaymentService {
  private braintreeGateway: BraintreeGateway;
  constructor(
    private httpService: HttpService,
    private performerService: PerformerService,
    @InjectModel('PaymentPlan')
    private paymentPlanModel: Model<PaymentPlanDocument>,
  ) {
    this.braintreeGateway = connect({
      environment: Environment.Sandbox,
      merchantId: process.env.BRAINTREE_MERCHANT_ID,
      publicKey: process.env.BRAINTREE_PUBLIC_KEY,
      privateKey: process.env.BRAINTREE_PRIVATE_KEY,
    });
  }

  async getPaymentPlanById(planId: string): Promise<PaymentPlan | undefined> {
    return await this.paymentPlanModel.findById(planId);
  }

  async getPaymentAmountByPlanId(planId: string): Promise<number | undefined> {
    return (await this.getPaymentPlanById(planId)).price;
  }

  async getPaymentPlans(): Promise<PaymentPlan[] | undefined> {
    return this.paymentPlanModel.find({});
  }

  async createPaymentPlan(
    data: ICreatePaymentPlanDTO,
  ): Promise<PaymentPlan | undefined> {
    const createdPlan = new this.paymentPlanModel({
      price: data.price,
      worth: { balance: data.balance, bonus: data.bonus },
    });

    let plan: PaymentPlan | undefined;
    try {
      plan = await createdPlan.save();
    } catch (err) {
      console.error(err.message);
      throw new HttpException('Couldnt create payment plan', 500);
    }

    return plan;
  }

  async updatePaymentPlan(
    planId: string,
    data: IUpdatePaymentPlanDTO,
  ): Promise<PaymentPlan | undefined> {
    const updateData: PaymentPlan = {
      price: data.price,
      worth: { balance: data.balance, bonus: data.bonus },
    };
    const targetPlan:
      | PaymentPlan
      | undefined = await this.paymentPlanModel.findByIdAndUpdate(
      planId,
      updateData,
      { new: true },
    );

    if (!targetPlan) throw new HttpException('Plan not found', 404);
    return targetPlan;
  }

  async deletePaymentPlan(planId: string): Promise<boolean> {
    const targetPlan:
      | PaymentPlan
      | undefined = await this.paymentPlanModel.findByIdAndDelete(planId);
    return targetPlan != undefined;
  }

  async getToken() {
    return await this.braintreeGateway.clientToken.generate({});
  }

  async checkout(purchaserId: string, data: ICreatePaymentDTO) {
    /*
     * Handle not loggedin user
     */
    if (!purchaserId)
      throw new HttpException('Must be loggedin in order to checkout', 401);

    /*
     * Extract amount by plan or amount
     */
    let amount: number | undefined;
    if (!amount && data.paymentPlanID)
      amount = await this.getPaymentAmountByPlanId(data.paymentPlanID);
    if (!amount && data.paymentAmount) amount = data.paymentAmount;
    if (!amount) throw new HttpException('Couldnt get checkout amount', 500);

    /*
     * Make Transaction
     */
    const braintreeTransactionData: TransactionRequest = {
      amount: amount.toString(),
      paymentMethodNonce: data.payment_method_nounce,
    };

    const transaction: ValidatedResponse<Transaction> = await this.braintreeGateway.transaction.sale(
      braintreeTransactionData,
    );

    /*
     * Handle Transaction Result
     * TODO: get amount to charge based on payment amount or payment plan
     * TODO: charge user account
     * TODO: return restful response
     */
    if (transaction.success) {
      console.log('success');
    }

    if (transaction.errors) {
      console.log('error');
    }
  }
}
