import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { AdminPaymentController } from './admin/admin-payment.controller';
import { UserPaymentController } from './user/user-payment.controller';
import { StripeService } from './stripe/stripe.service';
import { PayStackService } from './paystack/paystack.service';
import { RazorpayPaymentService } from './razorpay/razorpay.service';
import { BraintreePaymentService } from './braintree/braintree.service';

@Module({
  controllers: [AdminPaymentController, UserPaymentController],
  providers: [
    PaymentService,
    StripeService,
    PayStackService,
    RazorpayPaymentService,
    BraintreePaymentService,
  ],
})
export class PaymentModule {}
