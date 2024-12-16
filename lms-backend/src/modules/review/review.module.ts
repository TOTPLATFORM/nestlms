import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { UserReviewController } from './user/review.controller';

@Module({
  controllers: [UserReviewController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}
