import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  AnswerTypeArray,
  FileTypeArray,
} from 'src/shared/constants/array.constants';

export class StoreQuizQuestionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  mark: number;

  @IsIn(FileTypeArray)
  @IsNumber()
  @IsNotEmpty()
  file_type: number;

  @IsNumber()
  @IsOptional()
  file_url: number;

  @IsNumber()
  @IsNotEmpty()
  course_id: number;

  @IsNumber()
  @IsNotEmpty()
  quiz_id: number;
}
