import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SaveQuizQuestionAnsDto {
  @IsNumber()
  @IsNotEmpty()
  quiz_id: number;

  @IsNumber()
  @IsNotEmpty()
  quiz_question_id: number;

  @IsString()
  @IsNotEmpty()
  answer: string;
}
