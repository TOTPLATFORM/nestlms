import { IsNumber, IsNotEmpty } from 'class-validator';

export class AddToCartDto {
  @IsNotEmpty()
  @IsNumber()
  course_id: number;
}
