import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LanguageService } from '../language.service';
import { TranslationService } from '../../../shared/services/translation.service';
import { Public } from '../../../shared/decorators/public.decorator';
import { LanguageResponseDto } from '../dto/language.dto';
import { LanguageInterceptor } from '../../../shared/interceptors/language.interceptor';

@ApiTags('Public Language')
@Controller('public/languages')
@UseInterceptors(LanguageInterceptor)
@Public()
export class PublicLanguageController {
  constructor(
    private readonly languageService: LanguageService,
    private readonly translationService: TranslationService,
  ) {}

  @Get('active')
  @ApiOperation({ summary: 'Get all active languages' })
  @ApiResponse({ status: 200, description: 'Return all active languages' })
  async getActiveLanguages() {
    var languages = await this.languageService.getActiveLanguages();
    console.log('Active Languages:', languages);
    return languages;
  }

  @Get('system-messages')
  @ApiOperation({ summary: 'Get system messages for a language' })
  @ApiResponse({ status: 200, description: 'Return system messages' })
  async getSystemMessages(@Query('language') languageCode: string) {
    const language = await this.languageService.findByCode(languageCode);
    if (!language) {
      const defaultLanguage = await this.languageService.getDefaultLanguage();
      return this.translationService.getAllSystemMessages(defaultLanguage.id);
    }
    return this.translationService.getAllSystemMessages(language.id);
  }

  @Get('default')
  @ApiOperation({ summary: 'Get default language' })
  @ApiResponse({ status: 200, description: 'Return default language', type: LanguageResponseDto })
  async getDefaultLanguage() {
    return this.languageService.getDefaultLanguage();
  }
}
