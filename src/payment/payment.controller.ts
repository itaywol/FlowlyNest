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
  Req,
  HttpException,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import {
  ICreatePaymentDTO,
  ICreatePaymentPlanDTO,
  IUpdatePaymentPlanDTO,
  PaymentPlan,
} from './interfaces/payment.interfaces';
import { LocalAuthGuard } from '../passport-strategies/local.strategy';
import { RequestWithAuth } from 'user/interfaces/user.interface';

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
  async getToken(@Req() req: RequestWithAuth) {
    if (!req.session.passport) throw new HttpException('Unauthorized', 401);
    return await this.paymentService.getToken();
  }
  @Post('checkout')
  @UseGuards(new LocalAuthGuard())
  async checkout(@Req() req: RequestWithAuth, @Body() data: ICreatePaymentDTO) {
    return await this.paymentService.checkout(req.user.id, data);
  }

  @Post('payout')
  @UseGuards(new LocalAuthGuard())
  async withdraw(@Session() session: any, @Body() body: { amount: number }) {
    return await this.paymentService.withdraw(
      session?.user?.performer,
      body.amount,
    );
  }
}
