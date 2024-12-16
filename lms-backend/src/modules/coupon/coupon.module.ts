import { Module } from '@nestjs/common';
import { CouponAdminController } from './admin/admin.controller';
import { CouponService } from './coupon.service';

@Module({
  controllers: [CouponAdminController],
  providers: [CouponService],
})
export class CouponModule {}
