import { Body, Controller, Post } from '@nestjs/common';
import { RazorpayPaymentService } from '../razorpay/razorpay.service';
import { PayStackService } from '../paystack/paystack.service';
import { BraintreePaymentService } from '../braintree/braintree.service';

@Controller('payment')
export class UserPaymentController {
  constructor(
    private readonly razorpayPaymentService: RazorpayPaymentService,
    private readonly paystackPaymentService: PayStackService,
    private readonly braintreePaymentService: BraintreePaymentService,
  ) {}

  @Post('create-razorpay-order')
  createRazorpayPaymentOrder(@Body() payload: any) {
    return this.razorpayPaymentService.createOrder(
      payload.amount,
      'USD',
    );
  }

  @Post('verify-razorpay-payemnt')
  verifyRazorpayPayment(@Body() payload: any) {
    return this.razorpayPaymentService.verifyPayment(payload.order_id);
  }

  @Post('create-paystack-initiate-payment')
  createPaystackInitiatePayment(@Body() payload: any) {
    return this.paystackPaymentService.initiatePayment(
      payload.amount,
      payload.email,
      payload.package_id,
      payload.type,
    );
  }

  @Post('verify-paystack-payment')
  verifyPaystackPayment(@Body() payload: any) {
    return this.paystackPaymentService.verifyPayment(payload.referance);
  }

  @Post('create-braintree-payment-client-token')
  createBraintreePaymentClientToken() {
    return this.braintreePaymentService.getClientToken();
  }

  @Post('process-braintree-payment-transaction')
  processBraintreePaymentTransaction(@Body() payload: any) {
    return this.braintreePaymentService.createTransaction(
      payload.amount,
      payload.payment_method_nonce,
    );
  }
}
