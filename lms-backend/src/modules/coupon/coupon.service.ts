import { Injectable } from '@nestjs/common';
import { CouponStoreDto } from './admin/dto/coupon-store.dto';
import {
  PrismaClient,
  errorResponse,
  paginatioOptions,
  paginationMetaData,
  processException,
  successResponse,
} from 'src/shared/helpers/functions';
import {
  CouponUsesTypeConstant,
  DiscountConstant,
  coreConstant,
} from 'src/shared/helpers/coreConstant';

interface CouponValidationResult {
  isValid: boolean;
  totalOriginalPrice?: number;
  discountedPrice?: number;
  discountAmount?: number;
}
@Injectable()
export class CouponService {
  async addNewCoupon(payload: CouponStoreDto) {
    try {
      const existCouponCode = await PrismaClient.coupon.findFirst({
        where: {
          code: payload.code,
        },
      });
      if (existCouponCode) {
        return errorResponse('This code is already exist!');
      }
      const startDate = new Date(payload.start_date);
      let endDate = null;
      if (payload.end_date) {
        endDate = new Date(payload.end_date);

        if (endDate < startDate) {
          return errorResponse(
            'End date must not be a past date from start date!',
          );
        }
      }

      if (
        payload.uses_type == CouponUsesTypeConstant.LIMITED_USER &&
        (!payload.uses_limit || payload.uses_limit == 0)
      ) {
        return errorResponse('Uses limit must be more than 0!');
      }

      const couponDetails = await PrismaClient.coupon.create({
        data: {
          title: payload.title,
          code: payload.code,
          discount_type: payload.discount_type,
          discount_amount: payload.discount_amount,
          start_date: startDate,
          end_date: endDate,
          minimum_purchase: payload.minimum_purchase,
          uses_type: payload.uses_type,
          uses_limit: payload.uses_limit,
          status: payload.status,
        },
      });

      return successResponse('Coupon is added successfully!', couponDetails);
    } catch (error) {
      processException(error);
    }
  }

  async getCouponListByFilterPaginate(payload: any) {
    try {
      const whereCondition = payload.search
        ? {
            OR: [
              {
                title: {
                  contains: payload.search,
                },
              },
              {
                code: {
                  contains: payload.search,
                },
              },
            ],
          }
        : {};

      const paginate = await paginatioOptions(payload);
      const couponList = await PrismaClient.coupon.findMany({
        where: whereCondition,
        ...paginate,
      });

      const data = {
        list: couponList,
        meta: await paginationMetaData('coupon', payload, whereCondition),
      };

      return successResponse('Coupon list', data);
    } catch (error) {
      processException(error);
    }
  }

  async getCouponDetails(id: number) {
    try {
      const couponDetails = await PrismaClient.coupon.findFirst({
        where: {
          id: id,
        },
      });

      if (!couponDetails) {
        return errorResponse('Invalid Request!');
      }

      return successResponse('Coupon details', couponDetails);
    } catch (error) {
      processException(error);
    }
  }

  async updateCoupon(id: number, payload: CouponStoreDto) {
    try {
      const couponDetails = await PrismaClient.coupon.findFirst({
        where: {
          id: id,
        },
      });

      if (!couponDetails) {
        return errorResponse('Invalid Request!');
      }

      const existCouponCode = await PrismaClient.coupon.findFirst({
        where: {
          code: payload.code,
          NOT: {
            id: id,
          },
        },
      });

      if (existCouponCode) {
        return errorResponse('This code is already exist!');
      }
      const startDate = new Date(payload.start_date);
      let endDate = null;
      if (payload.end_date) {
        endDate = new Date(payload.end_date);

        if (endDate < startDate) {
          return errorResponse(
            'End date must not be a past date from start date!',
          );
        }
      }

      if (
        payload.uses_type == CouponUsesTypeConstant.LIMITED_USER &&
        (!payload.uses_limit || payload.uses_limit == 0)
      ) {
        return errorResponse('Uses limit must be more than 0!');
      }

      const updateCoupon = await PrismaClient.coupon.update({
        where: {
          id: id,
        },
        data: {
          title: payload.title,
          code: payload.code,
          discount_type: payload.discount_type,
          discount_amount: payload.discount_amount,
          start_date: startDate,
          end_date: endDate,
          minimum_purchase: payload.minimum_purchase,
          uses_type: payload.uses_type,
          uses_limit: payload.uses_limit,
          status: payload.status,
        },
      });

      return successResponse('Coupon is updated successfully!', updateCoupon);
    } catch (error) {
      {
        processException(error);
      }
    }
  }

  async deleteCoupon(id: number) {
    try {
      const couponDetails = await PrismaClient.coupon.findFirst({
        where: {
          id: id,
        },
      });

      if (!couponDetails) {
        return errorResponse('Invalid Request!');
      }

      await PrismaClient.coupon.delete({
        where: {
          id: id,
        },
      });

      return successResponse('Coupon is deleted successfully!');
    } catch (error) {
      processException(error);
    }
  }
  async processCouponValidation(
    code: any,
    userId: number,
    totalAmount: number,
  ): Promise<CouponValidationResult> {
    try {
      const coupon = await PrismaClient.coupon.findFirst({
        where: {
          code: code,
          status: coreConstant.STATUS_ACTIVE,
        },
      });
      if (!coupon || coupon.status !== coreConstant.STATUS_ACTIVE) {
        return { isValid: false };
      }

      const currentDate = new Date();
      if (
        coupon.start_date > currentDate ||
        (coupon.end_date && coupon.end_date < currentDate)
      ) {
        return { isValid: false };
      }

      if (
        coupon.uses_type === CouponUsesTypeConstant.LIMITED_USER &&
        coupon.uses_limit !== null &&
        coupon.uses_limit <= 0
      ) {
        return { isValid: false };
      }

      const userUsedCoupon = await PrismaClient.cartEnrollment.findFirst({
        where: {
          user_id: userId,
          promotion_applied: coupon.code,
        },
      });

      if (userUsedCoupon) {
        return { isValid: false };
      }

      let totalOriginalPrice: number = totalAmount;
      let discountAmount: number = 0.0;
      let discountedPrice: number = totalAmount;

      if (coupon.discount_type === DiscountConstant.DISCOUNT_FIXED) {
        discountAmount = Number(coupon.discount_amount || 0.0);
        discountedPrice = Math.max(0, totalAmount - discountAmount);
      } else if (
        coupon.discount_type === DiscountConstant.DISCOUNT_PERCENTAGE
      ) {
        const discountPercentage: number = Number(
          coupon.discount_amount || 0.0,
        );
        discountAmount = (discountPercentage / 100) * totalAmount;
        discountedPrice = Math.max(0, totalAmount - discountAmount);
      }

      return {
        isValid: true,
        totalOriginalPrice,
        discountedPrice,
        discountAmount,
      };
    } catch (error) {
      processException(error);
    }
  }
}
