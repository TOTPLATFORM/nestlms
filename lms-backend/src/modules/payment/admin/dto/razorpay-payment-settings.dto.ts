import {
  IsNotEmpty,
  IsString,
} from 'class-validator';


export class RazorpayPaymentSettingsDto {
  @IsNotEmpty()
  @IsString()
  payment_razorpay_key_id: string;

  @IsNotEmpty()
  @IsString()
  payment_razorpay_key_secret: string;
}
