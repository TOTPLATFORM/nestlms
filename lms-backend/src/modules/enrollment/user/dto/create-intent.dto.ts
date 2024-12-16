import { IsNotEmpty, IsNumber } from 'class-validator';

export class createIntentDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
