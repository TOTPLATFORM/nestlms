import { Injectable, NotFoundException } from '@nestjs/common';
import {
  errorResponse,
  getAdminSettingsData,
  processException,
  successResponse,
} from 'src/shared/helpers/functions';
import { PaymentMethodBraintreeSettingsSlugs } from 'src/shared/constants/array.constants';
import * as braintree from 'braintree';
import { modeStatusConstant } from 'src/shared/helpers/coreConstant';
import { ResponseModel } from 'src/shared/models/response.model';

@Injectable()
export class BraintreePaymentService {
  private gateway: braintree.BraintreeGateway;

  constructor() {
    // this.initializeBraintree();
  }

  private async initializeBraintree(): Promise<void> {
    const data: any = await getAdminSettingsData(
      PaymentMethodBraintreeSettingsSlugs,
    );

    let braintree_public_key = data.braintree_public_key;
    let braintree_merchant_id = data.braintree_merchant_id;
    let braintree_private_key = data.braintree_private_key;

    let environment =
      data.braintree_mode === modeStatusConstant.LIVE
        ? braintree.Environment.Sandbox
        : braintree.Environment.Sandbox;

    this.gateway = new braintree.BraintreeGateway({
      environment: environment,
      merchantId: braintree_merchant_id,
      publicKey: braintree_public_key,
      privateKey: braintree_private_key,
    });
  }

  async getClientToken(): Promise<ResponseModel> {
    try {
      await this.initializeBraintree();
      if (!this.gateway) {
        return errorResponse('Braintree gateway is not initialized.');
      }

      const { clientToken } = await this.gateway.clientToken.generate({});
      return successResponse('Braintree payment client token', clientToken);
    } catch (error) {
      return errorResponse('Braintree Error to create client token');
    }
  }

  async createTransaction(
    amount: number,
    paymentMethodNonce: string,
  ): Promise<braintree.Transaction> {
    try {
      await this.initializeBraintree();
      if (!this.gateway) {
        throw new NotFoundException(
          'Braintree gateway is not initialized. Call init() first.',
        );
      }

      new Promise((resolve, reject) => {
        this.gateway.transaction.sale(
          {
            amount: amount.toFixed(2),
            paymentMethodNonce,
            options: { submitForSettlement: true },
          },
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result.transaction);
            }
          },
        );
      });

      return successResponse('Braintree transaction successful');
    } catch (error) {
      console.log(error, 'Sssssssss');
      processException(error);
    }
  }
}
