import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PublicController } from './public.controller';
import { PublicService } from './public.service';
import { ReviewService } from '../review/review.service';

@Module({
  imports: [PrismaModule],
  controllers: [PublicController],
  providers: [
    PublicService,
    ReviewService
  ],
  exports: [PublicService],
})
export class PublicModule {}
