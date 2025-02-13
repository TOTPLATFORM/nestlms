import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { LanguageService } from '../../modules/language/language.service';
import { TranslationService } from '../services/translation.service';

@Injectable()
export class LanguageInterceptor implements NestInterceptor {
  constructor(
    private readonly languageService: LanguageService,
    private readonly translationService: TranslationService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const langCode = request.headers['accept-language'] || 'en';

    // Get language from header or use default
    const language =
      (await this.languageService.findByCode(langCode)) ||
      (await this.languageService.getDefaultLanguage());

    if (!language) {
      return next.handle();
    }

    // Attach language to request for use in controllers
    request.language = language;

    return next.handle().pipe(
      switchMap((data) => {
        // If the response is an array, handle each item
        if (Array.isArray(data)) {
          return from(
            Promise.all(
              data.map(async (item) => {
                if (item && item.id && !item.translations) {
                  const translations =
                    await this.translationService.getTranslations(
                      this.getTableName(request),
                      item.id,
                      language.id,
                    );
                  return { ...item, translations };
                }
                return item;
              }),
            ),
          );
        }

        // If the response is an object with an id, handle single item
        if (data && data.id && !data.translations) {
          return from(
            this.translationService
              .getTranslations(this.getTableName(request), data.id, language.id)
              .then((translations) => ({ ...data, translations })),
          );
        }
        return from(Promise.resolve(data));
      }),
    );
  }

  private getTableName(request: any): string {
    // Extract table name from the route
    const route = request.route.path;
    const parts = route.split('/');
    // Remove empty strings and parameters
    const filteredParts = parts.filter((part) => part && !part.startsWith(':'));
    // Get the main resource name
    return filteredParts[0] || 'unknown';
  }
}
