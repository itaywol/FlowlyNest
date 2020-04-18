import { Document, Schema } from 'mongoose';
import { PaymentPlan } from 'payment/interfaces/payment.interfaces';

export interface PaymentPlanDocument extends PaymentPlan, Document {
  purchases: number;
}

export const PaymentPlanSchema = new Schema(
  {
    price: { type: Number, required: true },
    worth: {
      balance: { type: Number, required: false, default: 10 },
      bonus: { type: Number, required: false, default: 0 },
      total: {
        type: Number,
        default: 0,
      },
    },
    purchases: { type: Number, default: 0 },
  },
  { timestamps: true },
);

PaymentPlanSchema.pre<PaymentPlanDocument>('save', function(next) {
  this.worth.total = this.worth.balance + this.worth.bonus;
  next();
});
