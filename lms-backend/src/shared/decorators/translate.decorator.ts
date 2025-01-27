import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface TranslationOptions {
  fields?: string[];
  tableName?: string;
}

export const Translate = createParamDecorator(
  (options: TranslationOptions = {}, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const language = request.language;

    return {
      language,
      fields: options.fields || [],
      tableName: options.tableName || getTableNameFromRequest(request),
    };
  },
);

function getTableNameFromRequest(request: any): string {
  const route = request.route.path;
  const parts = route.split('/');
  // Remove empty strings and parameters
  const filteredParts = parts.filter(part => part && !part.startsWith(':'));
  // Get the main resource name
  return filteredParts[0] || 'unknown';
}

// Example usage in a controller:
/*
@Get(':id')
async findOne(
  @Param('id') id: string,
  @Translate({ fields: ['name', 'description'] }) translationOpts: TranslationOptions,
) {
  const result = await this.service.findOne(+id);
  const translations = await this.translationService.getTranslations(
    translationOpts.tableName,
    +id,
    translationOpts.language.id,
  );
  return { ...result, translations };
}
*/
