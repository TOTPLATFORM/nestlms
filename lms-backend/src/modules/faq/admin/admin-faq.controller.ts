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
import { FaqService } from '../faq.service';
import { AddNewFaqDto } from './dto/add-new-faq.dto';

@Controller('admin')
export class FaqAdminController {
  constructor(private readonly faqService: FaqService) {}

  @Post('add-new-faq')
  addNewFaq(@Body() payload: AddNewFaqDto) {
    return this.faqService.addNewFaq(payload);
  }

  @Get('get-faq-list')
  getFaqList(@Query() payload: any) {
    return this.faqService.getFaqListByFilterByPaginate(payload);
  }

  @Get('get-faq-details-:id')
  getFaqDetails(@Param('id', ParseIntPipe) id: number) {
    return this.faqService.getFaqDetails(id);
  }

  @Put('update-faq-:id')
  updateFaq(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: AddNewFaqDto,
  ) {
    return this.faqService.updateFaq(id, payload);
  }

  @Delete('delete-faq-:id')
  deleteFaq(@Param('id', ParseIntPipe) id: number) {
    return this.faqService.deleteFaq(id);
  }
}
