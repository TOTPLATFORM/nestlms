import { Module } from '@nestjs/common';
import { TranslationService } from './translation.service';
import { PrismaModule } from '../../modules/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TranslationService],
  exports: [TranslationService],
})
export class TranslationModule {}
