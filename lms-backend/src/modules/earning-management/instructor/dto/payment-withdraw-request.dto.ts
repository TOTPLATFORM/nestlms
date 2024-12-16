import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class PaymentWithdrawRequestDto {
  @Min(0)
  @IsNumber()
  @IsNotEmpty()
  requested_amount: number;

  @IsString()
  @IsNotEmpty()
  requested_payment_details: string;
}
