import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CouponService } from '../coupon.service';
import { CouponStoreDto } from './dto/coupon-store.dto';

@Controller('admin')
export class CouponAdminController {
  constructor(private readonly couponService: CouponService) {}

  @Post('add-new-coupon')
  addNewCoupon(@Body() payload: CouponStoreDto) {
    return this.couponService.addNewCoupon(payload);
  }

  @Get('get-coupon-list')
  getCouponList(@Query() payload: any) {
    return this.couponService.getCouponListByFilterPaginate(payload);
  }

  @Get('get-coupon-details-:id')
  getCouponDetails(@Param('id', ParseIntPipe) id: number) {
    return this.couponService.getCouponDetails(id);
  }

  @Put('update-coupon-:id')
  updateCoupon(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: CouponStoreDto,
  ) {
    return this.couponService.updateCoupon(id, payload);
  }

  @Delete('delete-coupon-:id')
  deleteCoupon(@Param('id', ParseIntPipe) id: number) {
    return this.couponService.deleteCoupon(id);
  }
}
