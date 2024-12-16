import { IsNotEmpty, IsNumber, IsString, IsDate } from 'class-validator';

export class StoreLiveClassDto {
  @IsNotEmpty()
  @IsNumber()
  course_id: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsDate()
  start_date_time: Date;
}
export class UpdateLiveClassDto {
  @IsNotEmpty()
  @IsNumber()
  course_id: number;

  @IsNotEmpty()
  @IsNumber()
  classId: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsDate()
  start_date_time: Date;
}
