import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import {
  CouponUsesTypeArray,
  DiscountTypeArray,
  StatusOnOffArray,
} from 'src/shared/constants/array.constants';

export class CouponStoreDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  @Length(6)
  code: string;

  @IsNotEmpty()
  @IsNumber()
  @IsIn(DiscountTypeArray)
  discount_type: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  discount_amount: number;

  @IsOptional()
  @IsNumber()
  minimum_purchase: number;

  @IsNotEmpty()
  @IsDateString()
  start_date: string;

  @IsOptional()
  @IsDateString()
  end_date: string;

  @IsNotEmpty()
  @IsNumber()
  @IsIn(CouponUsesTypeArray)
  uses_type: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  uses_limit: number;

  @IsNotEmpty()
  @IsNumber()
  @IsIn(StatusOnOffArray)
  status: number;
}
