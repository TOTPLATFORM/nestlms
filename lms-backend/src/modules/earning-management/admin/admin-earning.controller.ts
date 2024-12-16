import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { EarningService } from '../earning.service';
import { IsAdmin } from 'src/shared/decorators/is-admin.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadConfig } from 'src/shared/configs/file-upload.config';
import { WithdrawStatusUpdatedDto } from './dto/withdraw-status-updated.dto';

@IsAdmin()
@Controller('admin')
export class AdminEarningController {
  constructor(private readonly earningService: EarningService) {}

  @Get('withdraw-list')
  getWithdrawEarningForAdmin(@Param() payload: any) {
    return this.earningService.getWithdrawEarningForAdmin(payload);
  }

  @Post('withdraw-status-update')
  @UseInterceptors(FileInterceptor('file', fileUploadConfig))
  updateWithdrawRequest(
    @UploadedFile() file: Express.Multer.File,
    @Body() payload: WithdrawStatusUpdatedDto,
  ) {
    return this.earningService.updateWithdrawRequest(payload, file);
  }

  @Get('instructor-wallet-list')
  getInstructorWalletList(@Query() payload: any) {
    return this.earningService.getInstructorWalletList(payload);
  }
}
