import { IsNotEmpty, IsNumber } from 'class-validator';

export class CheckLessionDto {
  @IsNumber()
  @IsNotEmpty()
  lession_id: number;

  @IsNumber()
  @IsNotEmpty()
  course_id: number;

  @IsNumber()
  @IsNotEmpty()
  section_id: number;
}
