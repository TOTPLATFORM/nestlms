import { IsIn, IsNotEmpty, IsNumber } from 'class-validator';
import { CourseStatusTypeArray } from 'src/shared/constants/array.constants';

export class ChangeCourseStatusDto {
  @IsNumber()
  @IsNotEmpty()
  course_id: number;

  @IsIn(CourseStatusTypeArray)
  @IsNumber()
  @IsNotEmpty()
  status: number;
}
