import { Body, Controller, Get, Post } from '@nestjs/common';
import { PaymentService } from '../payment.service';
import {
  UpdatePaymentMethodStripeSettingsDto,
} from './dto/stripe-payment-settings.dto';
import { IsAdmin } from 'src/shared/decorators/is-admin.decorator';
import { RazorpayPaymentSettingsDto } from './dto/razorpay-payment-settings.dto';
import { PaystackPaymentSettingsDto } from './dto/paystack-payment-settings.dto';
import { UpdateBraintreeSettingsDto } from './dto/braintree-payment-settings.dto';

@IsAdmin()
@Controller('admin-payment')
export class AdminPaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('update-stripe-settings')
  updateStripePaymentSettings(
    @Body() payload: UpdatePaymentMethodStripeSettingsDto,
  ) {
    return this.paymentService.updatePaymentStripeSettings(payload);
  }

  @Get('get-stripe-settings')
  getStripePaymentSettings() {
    return this.paymentService.getStripePaymentSettings();
  }

  @Post('update-razorpay-settings')
  updateRazorpaySettings(@Body() payload: RazorpayPaymentSettingsDto) {
    return this.paymentService.updateRazorpaySettings(payload);
  }

  @Get('get-razorpay-settings')
  getRazorpayPaymentSettings() {
    return this.paymentService.getRazorpayPaymentSettings();
  }

  @Post('update-paystack-settings')
  updatePaystackSettings(@Body() payload: PaystackPaymentSettingsDto) {
    return this.paymentService.updatePaystackSettings(payload);
  }

  @Get('get-paystack-settings')
  getPaystackPaymentSettings() {
    return this.paymentService.getPaystackPaymentSettings();
  }

  @Post('update-braintree-settings')
  updateBrainTreePaymentSettings(@Body() payload: UpdateBraintreeSettingsDto) {
    return this.paymentService.updateBrainTreePaymentSettings(payload);
  }

  @Get('get-braintree-payment-settings')
  getBraintreePaymentSettings() {
    return this.paymentService.getBraintreePaymentSettings();
  }
}
