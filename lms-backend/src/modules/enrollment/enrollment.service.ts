import { Injectable } from '@nestjs/common';
import {
  PrismaClient,
  addPhotoPrefix,
  errorResponse,
  getAdminSettingsData,
  paginatioOptions,
  paginationMetaData,
  processCourseLinks,
  processException,
  successResponse,
} from 'src/shared/helpers/functions';
import { ResponseModel } from 'src/shared/models/response.model';
import { Course, User } from '@prisma/client';
import {
  PaymentStatusConstant,
  coreConstant,
} from 'src/shared/helpers/coreConstant';
import { CouponService } from '../coupon/coupon.service';
import { StripeService } from '../payment/stripe/stripe.service';
import { BraintreePaymentService } from '../payment/braintree/braintree.service';
import { PaymentMethodRazoarpaySettingsSlugs } from 'src/shared/constants/array.constants';
import { RazorpayPaymentService } from '../payment/razorpay/razorpay.service';
import { PayStackService } from '../payment/paystack/paystack.service';
@Injectable()
export class EnrollmentService {
  constructor(
    private readonly couponService: CouponService,
    private readonly braintreePaymentService: BraintreePaymentService,
    private readonly razorpayPaymentService: RazorpayPaymentService,
    private readonly paystackService: PayStackService,
  ) {}
  stripe = new StripeService();
  async enroll(promo_code: string | null, user: User): Promise<ResponseModel> {
    try {
      const {
        discountAmount,
        promoCode,
        discountedPrice,
        payable_price,
        totalPrice,
      } = await this.processEnrollmentWithCoupon(promo_code, user);
      const { productsList } = await this.getCartDetails(user);
      console.log(
        discountAmount,
        promoCode,
        discountedPrice,
        payable_price,
        totalPrice,
        productsList.length,
      );
      const CartEnrollment = await PrismaClient.cartEnrollment.create({
        data: {
          user_id: user.id,
          original_price: totalPrice,
          discounted_price: discountedPrice,
          payable_price: payable_price,
          payment_method: 2,
          promotion_applied: promoCode ? promoCode : '',
          payment_info: JSON.stringify({
            discount_amount: discountAmount,
            promo_code: promoCode,
            payable_price: payable_price,
            total_price: totalPrice,
            discounted_price: discountedPrice,
          }),
          payment_status: PaymentStatusConstant.PAYMENT_NOT_INITIATED,
        },
      });

      if (!CartEnrollment) {
        return errorResponse('Not able to create enrollment');
      }
      for (const product of productsList) {
        const newproduct = await PrismaClient.courseEnrollment.create({
          data: {
            course_id: product.id,
            cartEnrollmentId: CartEnrollment.id,
            user_id: user.id,
          },
        });
        console.log(newproduct.id, 'newproduct');
      }

      let cartUpdated = await PrismaClient.cartItem.updateMany({
        where: {
          userId: user.id,
          isCart: true,
        },
        data: {
          isCart: false,
        },
      });
      console.log(cartUpdated.count, 'cartUpdated');

      const cartEnrollment = await PrismaClient.cartEnrollment.update({
        where: {
          id: CartEnrollment.id,
        },
        data: {
          payment_status: PaymentStatusConstant.PAYMENT_SUCCESS,
        },
      });
      console.log(cartEnrollment.id, 'cartEnrollment');

      return successResponse('Enrolled Successfully!', productsList);
    } catch (error) {
      console.log(error, 'error');
      processException(error);
    }
  }
  async processEnrollmentWithCoupon(
    promo_code: string | null,
    user: User,
  ): Promise<any> {
    try {
      const { totalPrice, productsList } = await this.getCartDetails(user);
      let discountAmount = 0.0;
      let promoCode = '';
      let discountedPrice = 0.0;
      let payable_price = totalPrice;

      if (!productsList || productsList.length === 0) {
        return errorResponse('No items in the cart.');
      }

      if (promo_code) {
        const couponResult = await this.couponService.processCouponValidation(
          promo_code,
          user.id,
          totalPrice,
        );

        if (!couponResult.isValid) {
          return errorResponse('Coupon is invalid or cannot be applied.');
        }

        discountAmount = couponResult.discountAmount;
        promoCode = promo_code;
        discountedPrice = couponResult.discountedPrice;
        payable_price = couponResult.discountedPrice;
      }
      return {
        discountAmount,
        promoCode,
        discountedPrice,
        payable_price,
        totalPrice,
        productsList,
      };
    } catch (error) {
      processException(error);
    }
  }
  async addToCart(course_id: number, user: User): Promise<ResponseModel> {
    try {
      const valid_course = await PrismaClient.course.findFirst({
        where: {
          id: course_id,
          status: coreConstant.STATUS_ACTIVE,
        },
      });

      if (!valid_course) {
        return errorResponse(`Course id ${course_id} is invalid or inactive`);
      }
      const already_purchesed = await PrismaClient.courseEnrollment.findFirst({
        where: {
          course_id: course_id,
          user_id: user.id,
        },
      });
      if (already_purchesed) {
        return errorResponse('Course is already purched');
      }
      const existingCartItem = await PrismaClient.cartItem.findFirst({
        where: {
          courseId: course_id,
          userId: user.id,
        },
      });

      if (existingCartItem) {
        return errorResponse('Course is already in the cart');
      }

      const cart = await PrismaClient.cartItem.create({
        data: {
          courseId: course_id,
          userId: user.id,
        },
      });

      if (!cart) {
        return errorResponse('Product not added to cart!');
      }

      return successResponse('Product Added to the cart.');
    } catch (error) {
      processException(error);
    }
  }
  async removeFromCart(course_id: number, user: User): Promise<any> {
    try {
      const validCourse = await PrismaClient.course.findFirst({
        where: {
          id: Number(course_id),
          status: coreConstant.STATUS_ACTIVE,
        },
      });

      if (!validCourse) {
        return errorResponse(`Course id ${course_id} is invalid or inactive`);
      }

      const existingCartItem = await PrismaClient.cartItem.findFirst({
        where: {
          courseId: Number(course_id),
          userId: user.id,
        },
      });

      if (!existingCartItem) {
        return errorResponse('Course is not in the cart');
      }

      const removedCartItem = await PrismaClient.cartItem.delete({
        where: {
          id: existingCartItem.id,
        },
      });

      if (!removedCartItem) {
        return errorResponse('Failed to remove course from the cart');
      }

      return successResponse('Course removed from the cart successfully!');
    } catch (error) {
      processException(error);
    }
  }

  async myCartDetails(user: User): Promise<ResponseModel> {
    try {
      const { totalPrice, productsList } = await this.getCartDetails(user);
      if (!productsList.length) {
        return errorResponse('No items in the cart.');
      }
      return successResponse('Cart total calculated successfully.', {
        totalPrice,
        productsList,
      });
    } catch (error) {
      processException(error);
    }
  }
  async getCartDetails(
    user: User,
  ): Promise<{ totalPrice: number; productsList: any[] }> {
    try {
      const cartItems = await PrismaClient.cartItem.findMany({
        where: {
          userId: user.id,
          isCart: true,
        },
        include: {
          course: {
            include: {
              User: true,
            },
          },
        },
      });

      if (!cartItems || cartItems.length === 0) {
        return { totalPrice: 0, productsList: [] };
      }

      let totalPrice: any = 0.0;
      const productsList: any[] = [];
      for (const cartItem of cartItems) {
        if (!cartItem.course) {
          continue;
        }

        const coursePrice = Number(cartItem.course.payable_price) || 0.0;
        const lessons = await PrismaClient.lesson.count({
          where: {
            course_id: cartItem.course.id,
          },
        });
        if (Number(coursePrice) >= 0) {
          totalPrice += coursePrice;
          let localCourse = processCourseLinks(cartItem.course);
          localCourse.lessons = lessons;
          productsList.push(localCourse);
        }
      }

      return { totalPrice, productsList };
    } catch (error) {
      processException(error);
    }
  }
  async createStripePaymentIntent(amount: number): Promise<ResponseModel> {
    try {
      await this.stripe.init();

      const amountInCents = Math.round(amount * 100);

      const intent = await this.stripe.createStripePaymentIntent(
        amountInCents,
        'USD',
      );

      if (!intent) {
        return errorResponse('Stripe payment intent cannot be created');
      }

      return successResponse('Stripe payment intent created successfully', {
        intent: intent,
      });
    } catch (error) {
      processException(error);
    }
  }

  async verifyPaymentIntent(
    paymentIntentId: string,
    promoCode: string | null,
    user: User,
  ): Promise<any> {
    try {
      await this.stripe.init();
      const intent = await this.stripe.verifyPaymentIntent(paymentIntentId);
      if (!intent || intent.status !== 'succeeded') {
        return errorResponse(
          'Stripe payment intent could not be verified or has not succeeded',
        );
      }

      return await this.processEnrollmentWithCouponAndCart(promoCode, user);
    } catch (error) {
      processException(error);
    }
  }
  async processEnrollmentWithCouponAndCart(
    promoCode: string | null,
    user: User,
  ): Promise<ResponseModel> {
    try {
      const { totalPrice, productsList } = await this.getCartDetails(user);

      if (!productsList || productsList.length === 0) {
        return errorResponse('No items in the cart.');
      }

      let discountAmount = 0.0;
      let promoCodeValue = '';
      let discountedPrice = 0.0;
      let payablePrice = totalPrice;

      if (promoCode) {
        const couponResult = await this.couponService.processCouponValidation(
          promoCode,
          user.id,
          totalPrice,
        );

        if (!couponResult.isValid) {
          return errorResponse('Coupon is invalid or cannot be applied.');
        }

        discountAmount = couponResult.discountAmount;
        promoCodeValue = promoCode;
        discountedPrice = couponResult.discountedPrice;
        payablePrice = couponResult.discountedPrice;
      }

      const CartEnrollment = await PrismaClient.cartEnrollment.create({
        data: {
          user_id: user.id,
          original_price: totalPrice,
          discounted_price: discountedPrice,
          payable_price: payablePrice,
          payment_method: 2,
          promotion_applied: promoCodeValue,
          payment_info: JSON.stringify({
            discount_amount: discountAmount,
            promo_code: promoCodeValue,
            payable_price: payablePrice,
            total_price: totalPrice,
            discounted_price: discountedPrice,
          }),
          payment_status: PaymentStatusConstant.PAYMENT_NOT_INITIATED,
        },
      });

      if (!CartEnrollment) {
        return errorResponse('Not able to create enrollment');
      }

      let instructorIds = [];
      for (const product of productsList) {
        await PrismaClient.courseEnrollment.create({
          data: {
            course_id: product.id,
            cartEnrollmentId: CartEnrollment.id,
            user_id: user.id,
          },
        });
        instructorIds.push(product.instructorId);
      }

      await PrismaClient.cartItem.updateMany({
        where: {
          userId: user.id,
          isCart: true,
        },
        data: {
          isCart: false,
        },
      });

      await PrismaClient.cartEnrollment.update({
        where: {
          id: CartEnrollment.id,
        },
        data: {
          payment_status: PaymentStatusConstant.PAYMENT_SUCCESS,
        },
      });

      const adminUserDetails = await PrismaClient.user.findFirst({
        where: {
          roles: {
            contains: '2',
          },
        },
      });

      const checkAdminWallet = await PrismaClient.wallet.findFirst({
        where: {
          userId: adminUserDetails.id,
          is_admin_wallet: true,
        },
      });

      if (checkAdminWallet) {
        await PrismaClient.wallet.update({
          where: {
            id: checkAdminWallet.id,
          },
          data: {
            balance: {
              increment: payablePrice,
            },
          },
        });
      } else {
        await PrismaClient.wallet.create({
          data: {
            userId: adminUserDetails.id,
            balance: payablePrice,
            is_admin_wallet: true,
          },
        });
      }

      for (let i = 0; i < instructorIds.length; i++) {
        const checkInstructorWallet = await PrismaClient.wallet.findFirst({
          where: {
            userId: instructorIds[i],
          },
        });

        if (checkInstructorWallet) {
          await PrismaClient.wallet.update({
            where: {
              id: checkInstructorWallet.id,
            },
            data: {
              balance: {
                increment: payablePrice,
              },
            },
          });
        } else {
          await PrismaClient.wallet.create({
            data: {
              userId: instructorIds[i],
              balance: payablePrice,
            },
          });
        }
      }

      return successResponse('Enrolled Successfully!');
    } catch (error) {
      processException(error);
    }
  }

  async validateCoupon(promo_code: string, user: User, total_amount: number) {
    try {
      const validationResult = await this.couponService.processCouponValidation(
        promo_code,
        user.id,
        total_amount,
      );

      if (!validationResult.isValid) {
        return errorResponse('Invalid coupon code or coupon is inactive!');
      }

      return successResponse('Coupon is valid!', validationResult);
    } catch (error) {
      processException(error);
    }
  }

  async getCourseTransactionReport(payload: any) {
    try {
      const paginate = await paginatioOptions(payload);

      const transactionList = await PrismaClient.cartEnrollment.findMany({
        include: {
          user: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
            },
          },
        },
        ...paginate,
      });

      const paginationMeta = await paginationMetaData(
        'cartEnrollment',
        payload,
      );
      const data = {
        list: transactionList,
        meta: paginationMeta,
      };

      return successResponse('Transaction list', data);
    } catch (error) {
      processException(error);
    }
  }

  async createBraintreeClientToken(): Promise<ResponseModel> {
    try {
      const clientToken = await this.braintreePaymentService.getClientToken();
      return successResponse('Braintree client token created successfully', {
        clientToken,
      });
    } catch (error) {
      processException(error);
    }
  }

  async processBraintreePaymentTransaction(
    amount: number,
    paymentMethodNonce: string,
    promoCode: string,
    user: User,
  ): Promise<ResponseModel> {
    try {
      const transaction = await this.braintreePaymentService.createTransaction(
        amount,
        paymentMethodNonce,
      );
      if (!transaction) {
        return errorResponse('Purchase failed!');
      }

      return await this.processEnrollmentWithCouponAndCart(promoCode, user);
    } catch (error) {
      return errorResponse(
        'Braintree payment transaction processed successfully',
      );
    }
  }

  async razorpayCreateOrder(amount, user): Promise<ResponseModel> {
    try {
      const paymentData: any = await getAdminSettingsData(
        PaymentMethodRazoarpaySettingsSlugs,
      );
      if (
        !paymentData.payment_razorpay_key_id &&
        !paymentData.payment_razorpay_key_secret
      ) {
        return errorResponse('Credential not provided for razorpay');
      }
      this.razorpayPaymentService.init();

      let amountLocal = Number(amount) * 100;
      const repsonse: any = await this.razorpayPaymentService.createOrder(
        amountLocal,
        'USD',
      );
      repsonse.key_id = paymentData.payment_razorpay_key_id;
      return successResponse('Order created successfully', repsonse);
    } catch (error) {
      console.log(error, 'error');
      processException(error);
    }
  }

  async razorpaycapturePayment(
    orderId,
    user: User,
    promoCode,
  ): Promise<ResponseModel> {
    try {
      const orderValid = this.razorpayPaymentService.verifyPayment(orderId);
      if (!orderValid) {
        return errorResponse('Order id not valid');
      }

      return await this.processEnrollmentWithCouponAndCart(promoCode, user);
    } catch (error) {
      processException(error);
    }
  }

  async payStackCreatePayment(amount, user: User): Promise<ResponseModel> {
    try {
      const response = await this.paystackService.initiatePayment(
        amount,
        user.email,
        String(coreConstant.PAYMENT_METHODS.PAYSTACK),
        String(coreConstant.PAYMENT_METHODS.PAYSTACK),
      );
      return successResponse('Payment created successfully', response);
    } catch (error) {
      processException(error);
    }
  }
}
