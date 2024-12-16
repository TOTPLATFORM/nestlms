import { Module } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { EnrollmentController } from './user/enrollment.controller';
import { CouponService } from '../coupon/coupon.service';
import { EnrollmentAdminController } from './admin/enrollment.controller';
import { BraintreePaymentService } from '../payment/braintree/braintree.service';
import { RazorpayPaymentService } from '../payment/razorpay/razorpay.service';
import { PayStackService } from '../payment/paystack/paystack.service';

@Module({
  controllers: [EnrollmentController, EnrollmentAdminController],
  providers: [
    EnrollmentService,
    CouponService,
    BraintreePaymentService,
    RazorpayPaymentService,
    PayStackService,
  ],
})
export class EnrollmentModule {}
