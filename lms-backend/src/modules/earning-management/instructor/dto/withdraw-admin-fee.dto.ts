import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class WithdrawAdminFeeDto {
  @Min(0)
  @IsNumber()
  @IsNotEmpty()
  requested_amount: number;
}
