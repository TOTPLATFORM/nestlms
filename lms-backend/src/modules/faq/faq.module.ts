import { Module } from '@nestjs/common';
import { FaqService } from './faq.service';
import { FaqAdminController } from './admin/admin-faq.controller';

@Module({
  controllers: [FaqAdminController],
  providers: [FaqService],
})
export class FaqModule {}
