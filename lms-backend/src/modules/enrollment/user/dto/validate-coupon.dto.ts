import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class validateCouponDto {
  @IsNotEmpty()
  @IsString()
  promo_code: string;

  @IsNotEmpty()
  @IsNumber()
  total_amount: number;
}
