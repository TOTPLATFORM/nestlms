import { IsNotEmpty, IsNumber, IsString, IsDate } from 'class-validator';

export class CreateLiveClassDto {
  @IsNotEmpty()
  @IsNumber()
  class_id: number;

  @IsNotEmpty()
  @IsString()
  class_name: string;
}
