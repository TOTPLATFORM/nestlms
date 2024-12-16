import { IsNotEmpty, IsString } from 'class-validator';

export class PaystackPaymentSettingsDto {
  @IsNotEmpty()
  @IsString()
  payment_paystack_public_key: string;

  @IsNotEmpty()
  @IsString()
  payment_paystack_key_secret: string;

  @IsNotEmpty()
  @IsString()
  payment_paystack_redirect_url: string;
}
