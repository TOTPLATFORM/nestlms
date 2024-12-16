import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class SubmitKycDto {
  @IsNotEmpty()
  @IsNumber()
  kyc_verification_id: number;

  @IsOptional()
  @IsString()
  text: string;

  @IsOptional()
  @IsNumber()
  file_id: number;
}
