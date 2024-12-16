import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { AnswerStatusArray } from 'src/shared/constants/array.constants';

export class StoreQuizQuestionAnswerDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsIn(AnswerStatusArray)
  @IsNumber()
  @IsNotEmpty()
  is_correct: number;

  @IsNumber()
  @IsOptional()
  file_url: number;

  @IsNumber()
  @IsNotEmpty()
  quiz_id: number;

  @IsNumber()
  @IsNotEmpty()
  quiz_question_id: number;
}
