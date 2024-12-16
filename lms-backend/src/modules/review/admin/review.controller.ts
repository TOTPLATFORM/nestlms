import { Body, Controller, Get, Put, Delete, Param } from '@nestjs/common';
import { EditReviewDto } from '../admin/dto/edit.dto';
import { ResponseModel } from 'src/shared/models/response.model';
import { ReviewService } from '../review.service';
import { paginateInterface } from 'src/shared/constants/types';
import { IsAdmin } from 'src/shared/decorators/is-admin.decorator';

@Controller('admin')
export class AdminReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @IsAdmin()
  @Put('edit-review')
  async editReview(
    @Body() editReviewDto: EditReviewDto,
  ): Promise<ResponseModel> {
    return this.reviewService.editReview(editReviewDto);
  }

  @IsAdmin()
  @Delete('delete-review/:reviewId')
  async deleteReview(
    @Param('reviewId') reviewId: number,
  ): Promise<ResponseModel> {
    return this.reviewService.deleteReview(reviewId);
  }
  @IsAdmin()
  @Get('get-reviews')
  async getReviewsAdmin(
    @Body() payload: paginateInterface,
  ): Promise<ResponseModel> {
    return this.reviewService.getReviewsAdmin(payload);
  }
}
