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
import { AddNewKycDto } from './dto/add-new-kyc.dto';
import { KycService } from '../kyc.service';
import { VerifyUserKycDto } from './dto/verify-user-kyc.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly kycService: KycService) {}

  @Post('add-new-kyc')
  addNewKyc(@Body() payload: AddNewKycDto) {
    return this.kycService.addNewKyc(payload);
  }

  @Get('kyc-list')
  getKycListAdmin(@Query() payload: any) {
    return this.kycService.getKycListAdmin(payload);
  }

  @Get('kyc-details-:id')
  getKycDetails(@Param('id', ParseIntPipe) id: number) {
    return this.kycService.getKycDetails(id);
  }

  @Put('update-kyc-:id')
  updateKyc(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: AddNewKycDto,
  ) {
    return this.kycService.updateKyc(id, payload);
  }

  @Delete('delete-kyc-:id')
  deleteKyc(@Param('id', ParseIntPipe) id: number) {
    return this.kycService.deleteKyc(id);
  }

  @Get('get-user-kyc-list')
  getUserKycList(@Query() payload: any) {
    return this.kycService.getUserKycList(payload);
  }

  @Post('verify-user-kyc')
  verifyUserKyc(@Body() payload: VerifyUserKycDto) {
    return this.kycService.verifyUserKyc(payload);
  }
}
