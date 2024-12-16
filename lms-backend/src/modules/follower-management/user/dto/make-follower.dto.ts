import { IsNotEmpty, IsNumber } from 'class-validator';

export class MakeFollowerDto {
  @IsNotEmpty()
  @IsNumber()
  instructor_id: number;
}
