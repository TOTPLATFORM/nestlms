import { IsIn, IsNotEmpty, IsNumber } from 'class-validator';
import { WithdrawStatusArray } from 'src/shared/constants/array.constants';
import { ApiProperty } from '@nestjs/swagger';

export class WithdrawStatusUpdatedDto {
  @IsNotEmpty()
  withdraw_transaction_id: number;

  @IsNotEmpty()
  instructor_id: number;

  @IsNotEmpty()
  status: number;

  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
