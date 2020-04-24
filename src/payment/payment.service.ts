import { Injectable, HttpException } from '@nestjs/common';
// TODO: generate types or switch to fully axios implementation
const paypal = require('@paypal/payouts-sdk');
import {
  ICreatePaymentDTO,
  PaymentPlan,
  ICreatePaymentPlanDTO,
  IUpdatePaymentPlanDTO,
} from './interfaces/payment.interfaces';
import { PerformerService } from 'performer/performer.service';
import { PaymentPlanDocument } from 'schemas/payment.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  connect,
  Environment,
  BraintreeGateway,
  TransactionRequest,
  ValidatedResponse,
  Transaction,
} from 'braintree';
import { PerformerDocument } from 'schemas/performer.schema';
import { UserService } from 'user/user.service';

@Injectable()
export class PaymentService {
  private braintreeGateway: BraintreeGateway;
  private paypalClient: any;
  constructor(
    private performerService: PerformerService,
    private userService: UserService,
    @InjectModel('PaymentPlan')
    private paymentPlanModel: Model<PaymentPlanDocument>,
  ) {
    this.braintreeGateway = connect({
      environment: Environment.Sandbox,
      merchantId: process.env.BRAINTREE_MERCHANT_ID,
      publicKey: process.env.BRAINTREE_PUBLIC_KEY,
      privateKey: process.env.BRAINTREE_PRIVATE_KEY,
    });
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    const paypalEnvironment = new paypal.core.SandboxEnvironment(
      clientId,
      clientSecret,
    );

    this.paypalClient = new paypal.core.PayPalHttpClient(paypalEnvironment);
  }

  async getPaymentPlanById(planId: string): Promise<PaymentPlan | undefined> {
    return await this.paymentPlanModel.findById(planId);
  }

  async getPaymentAmountByPlanId(planId: string): Promise<number | undefined> {
    return (await this.getPaymentPlanById(planId)).price;
  }

  async getPaymentPlans(): Promise<PaymentPlan[] | undefined> {
    return (await this.paymentPlanModel.find({})) as PaymentPlan[];
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
      this.userService.addBalanceToUser(purchaserId, amount);
    }

    if (transaction.errors) {
      console.error(transaction);
    }
  }

  //TODO: currency selection and conversion
  async withdraw(_id: string, amount: number) {
    const performer: PerformerDocument = await this.performerService.getPerformerById(
      _id,
    );

    if (amount > performer.user.balance.currentBalance)
      throw new HttpException('Payout amount higher then holdings', 401);

    const dedactBalace = await this.userService.takeBalanceFromUser(
      performer.user._id,
      amount,
    );
    if (!dedactBalace)
      throw new HttpException("Couldn't decrement balance", 500);

    const request = new paypal.payouts.PayoutsPostRequest();

    const payout = {
      // eslint-disable-next-line @typescript-eslint/camelcase
      sender_batch_header: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        recipient_type: 'EMAIL',
        // eslint-disable-next-line @typescript-eslint/camelcase
        email_message: "Here is you'r Payout",
        note: 'Enjoy',
        // eslint-disable-next-line @typescript-eslint/camelcase
        sender_batch_id: 'Performa',
        // eslint-disable-next-line @typescript-eslint/camelcase
        email_subject: "You'r Performa Payout",
      },
      items: [
        {
          note: `You'r ${amount} payout`,
          amount: {
            currency: 'USD',
            value: amount,
          },
          receiver: performer.paypal.email || performer.user.email,
          // eslint-disable-next-line @typescript-eslint/camelcase
          sender_item_id: `${amount} eBalance withdrawl`,
        },
      ],
    };
    request.requestBody(payout);

    const createPayout = await this.paypalClient.execute(request);
    if (!createPayout) throw new HttpException('Payout failed', 500);

    console.log('Success');
  }
}
