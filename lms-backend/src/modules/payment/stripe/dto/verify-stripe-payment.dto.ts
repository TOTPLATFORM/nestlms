import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyStripePaymentDto {
  @IsString()
  @IsNotEmpty()
  payment_intent_id: string;
}
