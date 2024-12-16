import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { IsInstructor } from 'src/shared/decorators/is-instructor.decorator';
import { EarningService } from '../earning.service';
import { UserInfo } from 'src/shared/decorators/user.decorators';
import { User } from '@prisma/client';
import { PaymentWithdrawRequestDto } from './dto/payment-withdraw-request.dto';
import { WithdrawAdminFeeDto } from './dto/withdraw-admin-fee.dto';

@IsInstructor()
@Controller('instructor')
export class InstructorEarningController {
  constructor(private readonly earningService: EarningService) {}

  @Post('withdraw-request')
  paymentWithdrawRequest(
    @UserInfo() user: User,
    @Body() payload: PaymentWithdrawRequestDto,
  ) {
    return this.earningService.paymentWithdrawRequest(user, payload);
  }

  @Get('withdraw-list')
  getWithdrawList(@UserInfo() user: User, @Query() payload: any) {
    return this.earningService.getWithdrawListForInstructor(user, payload);
  }

  @Post('withdraw-admin-fee')
  getWithdrawAdminFee(
    @UserInfo() user: User,
    @Body() payload: WithdrawAdminFeeDto,
  ) {
    return this.earningService.getWithdrawAdminFee(user, payload);
  }

  @Get('instructor-earning-details')
  getInstructorSelfEarningDetails(@UserInfo() user: User, @Query() payload: any) {
    return this.earningService.getInstructorSelfEarningDetails(user, payload);
  }

}
