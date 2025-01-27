import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LanguageService } from '../../modules/language/language.service';

@Injectable()
export class LanguageMiddleware implements NestMiddleware {
  constructor(private readonly languageService: LanguageService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      // Get language from header or cookie
      const langCode = 
        req.headers['accept-language'] || 
        req.cookies?.['preferred_language'] || 
        'en';

      // Get language from database or fallback to default
      const language = await this.languageService.findByCode(langCode) 
        || await this.languageService.getDefaultLanguage();

      if (language) {
        // Attach language to request
        (req as any).language = language;

        // Set language direction in response header
        res.setHeader('Content-Language', language.code);
        res.setHeader('X-Language-Direction', language.direction);
      }

      next();
    } catch (error) {
      // If there's an error, continue without setting language
      console.error('Language middleware error:', error);
      next();
    }
  }
}
