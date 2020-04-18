// Payment Plans
export interface PaymentPlan {
  price: number;
  worth: {
    balance: number;
    bonus?: number;
    total?: number;
  };
}
export interface ICreatePaymentPlanDTO {
  price: number;
  balance: number;
  bonus: number;
}
export interface IUpdatePaymentPlanDTO {
  paymentPlanID: string;
  price: number;
  balance: number;
  bonus: number;
}

export interface IDeletePaymentPlanDTO {
  paymentPlanID: string;
}

// Payments
// MVP:
// TODO: switch to ticket balanced payment creation
export interface ICreatePaymentDTO {
  payment_method_nounce: string;
  paymentPlanID?: string;
  paymentAmount?: number;
}

export interface IPaymentResponse {
  paymentID: string;
  payerID: string;
}

export interface IPaymentCreation {
  auth: {
    username: string;
    password: string;
  };
  body: {
    intent: string;
    payer: {
      payment_method: string;
    };
    transactions: [
      {
        amount: {
          total: string;
          currency: string;
        };
      },
    ];
    redirect_urls: {
      return_url: string;
      cancel_url: string;
    };
  };
  json: boolean;
}
