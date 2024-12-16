import { Injectable } from '@nestjs/common';
import Razorpay from 'razorpay';
import { PaymentMethodRazoarpaySettingsSlugs } from 'src/shared/constants/array.constants';
import { modeStatusConstant } from 'src/shared/helpers/coreConstant';
import {
  errorResponse,
  getAdminSettingsData,
  processException,
  successResponse,
} from 'src/shared/helpers/functions';

@Injectable()
export class RazorpayPaymentService {
  private razorpay: Razorpay;

  constructor() {}
  async init() {
    const data: any = await getAdminSettingsData(
      PaymentMethodRazoarpaySettingsSlugs,
    );
    if (!data.payment_razorpay_key_id && !data.payment_razorpay_key_secret) {
      return;
    }
    this.razorpay = new Razorpay({
      key_id: data.payment_razorpay_key_id,
      key_secret: data.payment_razorpay_key_secret,
    });
  }
  async createOrder(amount: number, currency: string) {
    const options = {
      amount,
      currency,
      payment_capture: 1,
    };

    try {
      const order = await this.razorpay.orders.create(options);
      return order;
    } catch (error) {
      throw new Error('Error creating Razorpay order');
    }
  }
  async capturePayment(orderId: string, amount: number, currency: string) {
    try {
      const payment = await this.razorpay.payments.capture(
        orderId,
        amount,
        currency,
      );
      return payment;
    } catch (error) {
      throw new Error('Error capturing payment');
    }
  }
  private async retrieveOrder(orderId: string): Promise<any> {
    const order = await this.razorpay.orders.fetch(orderId);
    return order;
  }
  async verifyPayment(orderId: string): Promise<boolean> {
    try {
      const payment = await this.retrieveOrder(orderId);
      if (payment && payment.status === 'captured') {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error verifying payment:', error);
      return false; // An error occurred during verification
    }
  }
}
