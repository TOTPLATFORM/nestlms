import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CreateReviewDto } from '../admin/dto/create.dto';
import { User } from '@prisma/client';
import { ResponseModel } from 'src/shared/models/response.model';
import { UserInfo } from 'src/shared/decorators/user.decorators';
import { ReviewService } from '../review.service';
import { IsInstructor } from 'src/shared/decorators/is-instructor.decorator';

@Controller('review')
export class UserReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('submit-review')
  async createReview(
    @UserInfo() user: User,
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<ResponseModel> {
    return this.reviewService.createReview(user, createReviewDto);
  }

  @IsInstructor()
  @Get('course-review-list-:course_id')
  async getCourseReviewListForInstructor(
    @UserInfo() user: User,
    @Param('course_id', ParseIntPipe) course_id: number,
    @Query() payload: any,
  ): Promise<ResponseModel> {
    return this.reviewService.getCourseReviewListForInstructor(
      user,
      course_id,
      payload,
    );
  }
}
