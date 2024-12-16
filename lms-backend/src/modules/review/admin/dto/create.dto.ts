// create-review.dto.ts
import { IsNotEmpty, IsInt, Min, Max, IsString, IsIn } from 'class-validator';
import { ReviewRatingArray } from 'src/shared/constants/array.constants';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsIn(ReviewRatingArray)
  @IsInt()
  @IsNotEmpty()
  rating: number;

  @IsNotEmpty()
  @IsInt()
  course_id: number;
}
