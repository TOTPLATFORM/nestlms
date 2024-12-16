import { Body, Controller, Get, Post } from '@nestjs/common';
import { KycService } from '../kyc.service';
import { UserInfo } from 'src/shared/decorators/user.decorators';
import { User } from '@prisma/client';
import { use } from 'passport';
import { SubmitKycDto } from './dto/submit-kyc.dto';

@Controller('user')
export class UserController {
  constructor(private readonly kycService: KycService) {}

  @Get('kyc-verification-list')
  getUserKycVerificationList(@UserInfo() user: User) {
    return this.kycService.getUserKycVerificationList(user);
  }
  @Post('submit-kyc')
  submitKyc(@UserInfo() user: User, @Body() payload: SubmitKycDto) {
    return this.kycService.submitKyc(user, payload);
  }
  @Get('check-kyc-validation')
  checkKycValidation(@UserInfo() user: User) {
    return this.kycService.checkKycValidation(user);
  }
}
