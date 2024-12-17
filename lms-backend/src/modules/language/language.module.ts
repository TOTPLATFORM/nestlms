import { Module } from '@nestjs/common';
import { LanguageService } from './language.service';
import { LanguageController } from './language.controller';
import { PublicLanguageController } from './public/public-language.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { TranslationModule } from '../../shared/services/translation.module';

@Module({
  imports: [PrismaModule, TranslationModule],
  controllers: [LanguageController, PublicLanguageController],
  providers: [LanguageService],
  exports: [LanguageService],
})
export class LanguageModule {}
