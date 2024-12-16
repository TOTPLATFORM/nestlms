import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { EnrollmentService } from '../enrollment.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UserInfo } from 'src/shared/decorators/user.decorators';
import { User } from '@prisma/client';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { ResponseModel } from 'src/shared/models/response.model';
import { createIntentDto } from './dto/create-intent.dto';
import { validateCouponDto } from './dto/validate-coupon.dto';

@Controller('enroll')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post('create-stripe-intent')
  createStripePaymentIntent(
    @Body() payload: createIntentDto,
  ): Promise<ResponseModel> {
    return this.enrollmentService.createStripePaymentIntent(payload.amount);
  }

  @Post('confirm-and-verify-stripe-payment')
  verifyPaymentIntent(
    @Body()
    payload: {
      payment_intent_id: string;
      promo_code: string;
    },
    @UserInfo() user: User,
  ): Promise<ResponseModel> {
    return this.enrollmentService.verifyPaymentIntent(
      payload.payment_intent_id,
      payload.promo_code,
      user,
    );
  }
  @Post()
  async enroll(
    @Body() createEnrollmentDto: CreateEnrollmentDto,
    @UserInfo() user: User,
  ): Promise<ResponseModel> {
    return await this.enrollmentService.enroll(
      createEnrollmentDto.promo_code,
      user,
    );
  }

  @Get('my-cart-details')
  async myCartDetails(@UserInfo() user: User): Promise<ResponseModel> {
    return await this.enrollmentService.myCartDetails(user);
  }

  @Post('add-to-cart')
  async addToCart(
    @Body() addToCartDto: AddToCartDto,
    @UserInfo() user: User,
  ): Promise<ResponseModel> {
    return await this.enrollmentService.addToCart(addToCartDto.course_id, user);
  }
  @Delete('remove-from-cart/:course_id')
  async removeFromCart(
    @Param('course_id') course_id: number,
    @UserInfo() user: User,
  ): Promise<ResponseModel> {
    return await this.enrollmentService.removeFromCart(course_id, user);
  }
  @Post('validate-coupon')
  async validateCoupon(
    @Body() validateCouponDto: validateCouponDto,
    @UserInfo() user: User,
  ) {
    return await this.enrollmentService.validateCoupon(
      validateCouponDto.promo_code,
      user,
      validateCouponDto.total_amount,
    );
  }

  @Get('create-braintree-client-token')
  createBraintreeClientToken(): Promise<ResponseModel> {
    return this.enrollmentService.createBraintreeClientToken();
  }

  @Post('confirm-and-verify-braintree-payment')
  processBraintreePaymentTransaction(
    @Body('amount') amount: number,
    @Body('payment_method_nonce') payment_method_nonce: string,
    @UserInfo() user: User,
    @Body('promoCode') promoCode: string,
  ): Promise<ResponseModel> {
    return this.enrollmentService.processBraintreePaymentTransaction(
      amount,
      payment_method_nonce,
      promoCode,
      user,
    );
  }

  @Post('razorpay-create-order')
  razorpayCreateOrder(
    @Body('amount') amount: number,
    @UserInfo() user: User,
  ): Promise<ResponseModel> {
    return this.enrollmentService.razorpayCreateOrder(amount, user);
  }

  @Post('razorpay-capture-subscribe')
  capturePayment(
    @UserInfo() user: User,
    @Body('promoCode') promoCode: string,
    @Body('orderId') orderId: string,
  ): Promise<ResponseModel> {
    return this.enrollmentService.razorpaycapturePayment(
      orderId,
      user,
      promoCode,
    );
  }

  @Post('paystack-create-payment')
  payStackCreatePayment(
    @Body('amount') amount: number,
    @UserInfo() user: User,
  ): Promise<ResponseModel> {
    return this.enrollmentService.payStackCreatePayment(amount, user);
  }
}
