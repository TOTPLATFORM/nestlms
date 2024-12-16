import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSectionDto {
  @IsNotEmpty()
  @IsNumber()
  courseId: number;

  @IsNotEmpty()
  @IsString()
  title: string;
}
