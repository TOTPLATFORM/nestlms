// create-review.dto.ts
import { IsNotEmpty, IsInt, Min, Max, IsString } from 'class-validator';

export class EditReviewDto {
  @IsNotEmpty()
  @IsInt()
  reviewId: number;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsNotEmpty()
  @IsInt()
  course_id: number;
}
