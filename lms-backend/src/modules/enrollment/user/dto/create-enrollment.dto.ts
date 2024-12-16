import { IsOptional, IsString } from 'class-validator';

export class CreateEnrollmentDto {
  @IsOptional()
  @IsString()
  promo_code: string;
}
