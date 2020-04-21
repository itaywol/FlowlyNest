import {
  Controller,
  Post,
  Body,
  Delete,
  Put,
  Get,
  Query,
  UseGuards,
  Session,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import {
  ICreatePaymentDTO,
  IPaymentResponse,
  ICreatePaymentPlanDTO,
  IUpdatePaymentPlanDTO,
  PaymentPlan,
} from './interfaces/payment.interfaces';
import { AuthGuard } from 'middlewares/auth.guard';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  ///
  //PAYMENT PLANS
  ///
  @Get('plan')
  async getPaymentPlans(): Promise<PaymentPlan[] | undefined> {
    return await this.paymentService.getPaymentPlans();
  }
  @Post('plan')
  async createPaymentPlan(
    @Body() data: ICreatePaymentPlanDTO,
  ): Promise<PaymentPlan | undefined> {
    return await this.paymentService.createPaymentPlan(data);
  }
  @Put('plan')
  async updatePaymentPlan(
    @Query('planId') planId: string,
    @Body() data: IUpdatePaymentPlanDTO,
  ): Promise<PaymentPlan | undefined> {
    return await this.paymentService.updatePaymentPlan(planId, data);
  }

  @Delete('plan')
  async deletePaymentPlan(@Query('planId') planId: string): Promise<boolean> {
    return await this.paymentService.deletePaymentPlan(planId);
  }

  ///
  //PAYMENTS
  ///
  @Post('token')
  @UseGuards(AuthGuard)
  async getToken() {
    return await this.paymentService.getToken();
  }
  @Post('checkout')
  @UseGuards(AuthGuard)
  async checkout(@Session() session: any, @Body() data: ICreatePaymentDTO) {
    return await this.paymentService.checkout(session?.user?._id, data);
  }

  @Post('payout')
  @UseGuards(AuthGuard)
  async withdraw(@Session() session: any, @Body() body: { amount: number }) {
    return await this.paymentService.withdraw(
      session?.user?.performer,
      body.amount,
    );
  }
}
