import { IsIn, IsNotEmpty, IsNumber } from 'class-validator';
import { VerificationTypeArray } from 'src/shared/constants/array.constants';

export class VerifyUserKycDto {
  @IsNotEmpty()
  @IsNumber()
  user_kyc_id: number;

  @IsNotEmpty()
  @IsNumber()
  @IsIn(VerificationTypeArray)
  status: number;
}
