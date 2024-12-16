import { Injectable } from '@nestjs/common';
import { UpdatePaymentMethodStripeSettingsDto } from './admin/dto/stripe-payment-settings.dto';
import {
  getAdminSettingsData,
  processException,
  successResponse,
  updateOrCreateAdminSettings,
} from 'src/shared/helpers/functions';
import {
  PaymentMethodBraintreeSettingsSlugs,
  PaymentMethodPaystackSettingsSlugs,
  PaymentMethodRazoarpaySettingsSlugs,
  PaymentMethodStripeSettingsSlugs,
} from 'src/shared/constants/array.constants';
import { RazorpayPaymentSettingsDto } from './admin/dto/razorpay-payment-settings.dto';
import { PaystackPaymentSettingsDto } from './admin/dto/paystack-payment-settings.dto';
import { UpdateBraintreeSettingsDto } from './admin/dto/braintree-payment-settings.dto';

@Injectable()
export class PaymentService {
  async updatePaymentStripeSettings(
    payload: UpdatePaymentMethodStripeSettingsDto,
  ) {
    try {
      const keyValuePairs = Object.keys(payload).map((key) => ({
        key,
        value: payload[key],
      }));

      await Promise.all(
        keyValuePairs.map(async (element) => {
          await updateOrCreateAdminSettings(element.key, element.value);
        }),
      );

      const data = await getAdminSettingsData(PaymentMethodStripeSettingsSlugs);

      return successResponse(
        'Stripe payment method settings is updated successfully!',
        data,
      );
    } catch (error) {
      processException(error);
    }
  }

  async getStripePaymentSettings() {
    try {
      const data = await getAdminSettingsData(PaymentMethodStripeSettingsSlugs);

      return successResponse('Stripe payment method settings data!', data);
    } catch (error) {
      processException(error);
    }
  }

  async updateRazorpaySettings(payload: RazorpayPaymentSettingsDto) {
    try {
      const keyValuePairs = Object.keys(payload).map((key) => ({
        key,
        value: payload[key],
      }));

      await Promise.all(
        keyValuePairs.map(async (element) => {
          await updateOrCreateAdminSettings(element.key, element.value);
        }),
      );

      const data = await getAdminSettingsData(
        PaymentMethodRazoarpaySettingsSlugs,
      );

      return successResponse(
        'Razoarpay payment method settings is updated successfully!',
        data,
      );
    } catch (error) {
      processException(error);
    }
  }

  async getRazorpayPaymentSettings() {
    try {
      const data = await getAdminSettingsData(
        PaymentMethodRazoarpaySettingsSlugs,
      );

      return successResponse('Razoarpay payment method settings data!', data);
    } catch (error) {
      processException(error);
    }
  }

  async updatePaystackSettings(payload: PaystackPaymentSettingsDto) {
    try {
      const keyValuePairs = Object.keys(payload).map((key) => ({
        key,
        value: payload[key],
      }));

      await Promise.all(
        keyValuePairs.map(async (element) => {
          await updateOrCreateAdminSettings(element.key, element.value);
        }),
      );

      const data = await getAdminSettingsData(
        PaymentMethodPaystackSettingsSlugs,
      );

      return successResponse(
        'Paystack payment method settings is updated successfully!',
        data,
      );
    } catch (error) {
      processException(error);
    }
  }

  async getPaystackPaymentSettings() {
    try {
      const data = await getAdminSettingsData(
        PaymentMethodPaystackSettingsSlugs,
      );

      return successResponse('Paystack payment method settings data!', data);
    } catch (error) {
      processException(error);
    }
  }

  async updateBrainTreePaymentSettings(payload: UpdateBraintreeSettingsDto) {
    try {
      const keyValuePairs = Object.keys(payload).map((key) => ({
        key,
        value: payload[key],
      }));

      await Promise.all(
        keyValuePairs.map(async (element) => {
          await updateOrCreateAdminSettings(element.key, element.value);
        }),
      );

      const data = await getAdminSettingsData(
        PaymentMethodBraintreeSettingsSlugs,
      );

      return successResponse(
        'Braintree payment method settings is updated successfully!',
        data,
      );
    } catch (error) {
      processException(error);
    }
  }

  async getBraintreePaymentSettings() {
    try {
      const data = await getAdminSettingsData(
        PaymentMethodBraintreeSettingsSlugs,
      );

      return successResponse('Braintree payment method settings data!', data);
    } catch (error) {
      processException(error);
    }
  }
}
