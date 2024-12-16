import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class EditSectionDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsNumber()
  courseId: number;

  @IsNotEmpty()
  @IsString()
  title: string;
}
