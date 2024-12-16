import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateStripePaymentIntentDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
