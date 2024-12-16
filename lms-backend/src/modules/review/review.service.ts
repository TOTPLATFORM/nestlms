import { Injectable } from '@nestjs/common';
import { error } from 'console';
import { paginateInterface } from 'src/shared/constants/types';
import {
  PrismaClient,
  addPhotoPrefix,
  errorResponse,
  paginatioOptions,
  paginationMetaData,
  processException,
  successResponse,
} from 'src/shared/helpers/functions';
import { ResponseModel } from 'src/shared/models/response.model';
import { CreateReviewDto } from './admin/dto/create.dto';
import { User } from '@prisma/client';
import { EditReviewDto } from './admin/dto/edit.dto';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class ReviewService {
  constructor() {}
  async createReview(
    user: User,
    createReviewDto: CreateReviewDto,
  ): Promise<ResponseModel> {
    try {
      const existsCourse = await PrismaClient.course.findFirst({
        where: {
          id: createReviewDto.course_id,
        },
      });

      if (!existsCourse) {
        return errorResponse('Invalid Request!');
      }

      const existsCourseEnrollment =
        await PrismaClient.courseEnrollment.findFirst({
          where: {
            user_id: user.id,
            course_id: createReviewDto.course_id,
          },
        });

      if (!existsCourseEnrollment) {
        return errorResponse('Invalid Request!');
      }

      const existsReview = await PrismaClient.review.findFirst({
        where: {
          userId: user.id,
          course_id: createReviewDto.course_id,
        },
      });
      if (existsReview) {
        return errorResponse('You already gave a review to this course!');
      }

      const review = await PrismaClient.review.create({
        data: {
          content: createReviewDto.content,
          rating: createReviewDto.rating,
          course_id: createReviewDto.course_id,
          userId: user.id,
        },
      });
      return successResponse('Review is created successfully', review);
    } catch (error) {
      return errorResponse('Failed to create review');
    }
  }

  async getCourseReviewListForInstructor(
    user: User,
    course_id: number,
    payload: any,
  ) {
    try {
      const myCourse = await PrismaClient.course.findFirst({
        where: {
          id: course_id,
          instructorId: user.id,
        },
      });

      if (!myCourse) {
        return errorResponse('Invalid Request!');
      }

      const paginate = await paginatioOptions(payload);
      const whereCondition = {
        course_id: myCourse.id,
        ...(payload.search
          ? {
              OR: [
                ...(payload.search
                  ? [
                      {
                        content: {
                          contains: payload.search,
                        },
                      },
                    ]
                  : []),
                ...(payload.rating
                  ? [
                      {
                        rating: {
                          in: Number(payload.rating),
                        },
                      },
                    ]
                  : []),
              ],
            }
          : {}),
      };
      const where = {
        where: whereCondition,
      };

      let sortBy = {
        orderBy: {},
      };

      if (payload.sort_by) {
        if (payload.sort_by === 'rating_high_to_low') {
          sortBy.orderBy = { rating: 'desc' };
        } else if (payload.sort_by === 'rating_low_to_high') {
          sortBy.orderBy = { rating: 'desc' };
        }
      } else {
        sortBy.orderBy = { created_at: 'desc' };
      }

      const reviewList = await PrismaClient.review.findMany({
        ...where,
        ...sortBy,
        ...paginate,
      });

      const data = {
        list: reviewList,
        meta: await paginationMetaData('review', payload, whereCondition),
      };

      return successResponse('Course review list', data);
    } catch (error) {
      processException(error);
    }
  }

  async getReviewsByUserId(userId: number): Promise<ResponseModel> {
    try {
      const reviews = await PrismaClient.review.findMany({
        where: {
          userId,
        },
        orderBy: {
          created_at: 'desc',
        },
      });
      return successResponse('Reviews fetched successfully', reviews);
    } catch (error) {
      return errorResponse('Failed to fetch reviews');
    }
  }

  async getReviewsAdmin(payload: paginateInterface): Promise<ResponseModel> {
    try {
      const search = payload.search ? payload.search : '';
      const paginate = await paginatioOptions(payload);
      const whereCondition = {
        OR: [
          {
            content: {
              contains: search,
            },
          },
        ],
      };
      const reviews = await PrismaClient.review.findMany({
        where: whereCondition,
        orderBy: {
          created_at: 'desc',
        },
        ...paginate,
      });
      const paginationMeta = await paginationMetaData(
        'category',
        payload,
        whereCondition,
      );
      const data = {
        list: reviews,
        meta: paginationMeta,
      };
      return successResponse('Review fetched successfully', data);
    } catch (error) {
      processException(error);
    }
  }

  async editReview(editReviewDto: EditReviewDto): Promise<ResponseModel> {
    try {
      const updatedReview = await PrismaClient.review.update({
        where: { id: editReviewDto.reviewId },
        data: editReviewDto,
      });
      return successResponse('Review updated successfully', updatedReview);
    } catch (error) {
      return errorResponse('Failed to update review');
    }
  }
  async deleteReview(reviewId: number): Promise<ResponseModel> {
    try {
      await PrismaClient.review.delete({
        where: { id: reviewId },
      });
      return successResponse('Review deleted successfully');
    } catch (error) {
      return errorResponse('Failed to delete review');
    }
  }

  async getReviewListForLandingPage(take: number = 4): Promise<ResponseModel> {
    try {
      const reviewList: any = await PrismaClient.review.findMany({
        include: {
          user: true,
        },
        orderBy: {
          created_at: 'desc',
        },
        take: take,
      });
      
      reviewList.map((review) => {
        delete review.User.password;
        review.User.photo = addPhotoPrefix(review.User.photo);
        return review;
      });

      return successResponse('Review List for landing page!', reviewList);
    } catch (error) {
      
      processException(error);
    }
  }
}
