import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { StatusOnOffArray } from 'src/shared/constants/array.constants';

export class StoreQuizByInstructorDto {
  @IsNumber()
  @IsNotEmpty()
  course_id: number;

  @IsNumber()
  @IsNotEmpty()
  section_id: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  time: number;

  @IsNumber()
  @IsNotEmpty()
  max_attempts: number;

  @IsNumber()
  @IsNotEmpty()
  pass_mark: number;

  @IsNumber()
  @IsNotEmpty()
  expiry_days: number;

  @IsIn(StatusOnOffArray)
  @IsNumber()
  @IsNotEmpty()
  display_qus_randomly: number;

  @IsIn(StatusOnOffArray)
  @IsNumber()
  @IsNotEmpty()
  display_limited_qus: number;

  @IsNumber()
  @IsOptional()
  qus_limit: number;

  @IsIn(StatusOnOffArray)
  @IsNumber()
  @IsNotEmpty()
  certificate_included: number;

  @IsIn(StatusOnOffArray)
  @IsNumber()
  @IsNotEmpty()
  status: number;
}
