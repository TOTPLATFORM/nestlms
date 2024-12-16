import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../modules/prisma/prisma.service';
import { TranslationService } from './translation.service';
import { 
  Translatable, 
  TranslatableConfig, 
  TranslationPayload 
} from '../interfaces/translatable.interface';

@Injectable()
export class BaseTranslatableService {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly translationService: TranslationService,
    protected readonly config: TranslatableConfig,
  ) {}

  /**
   * Save translations for an entity
   */
  protected async saveTranslations(
    entityId: number,
    translations: { [key: string]: string },
    languageId: number,
  ): Promise<void> {
    const validFields = this.config.fields.map(f => f.field);

    for (const [field, translation] of Object.entries(translations)) {
      if (!validFields.includes(field)) {
        continue; // Skip invalid fields
      }

      await this.translationService.translate(
        this.config.tableName,
        entityId,
        field,
        languageId,
        translation,
      );
    }
  }

  /**
   * Load translations for an entity
   */
  protected async loadTranslations<T extends Translatable>(
    entity: T,
    languageId: number,
  ): Promise<T> {
    if (!entity) return entity;

    const translations = await this.translationService.getTranslations(
      this.config.tableName,
      entity.id,
      languageId,
    );

    return {
      ...entity,
      translations,
    };
  }

  /**
   * Load translations for multiple entities
   */
  protected async loadMultipleTranslations<T extends Translatable>(
    entities: T[],
    languageId: number,
  ): Promise<T[]> {
    if (!entities.length) return entities;

    const entityIds = entities.map(e => e.id);
    const translations = await this.translationService.getTranslationsForMultipleRecords(
      this.config.tableName,
      entityIds,
      languageId,
    );

    return entities.map(entity => ({
      ...entity,
      translations: translations[entity.id] || {},
    }));
  }

  /**
   * Delete all translations for an entity
   */
  protected async deleteTranslations(entityId: number): Promise<void> {
    await this.translationService.deleteTranslations(
      this.config.tableName,
      entityId,
    );
  }

  /**
   * Validate required translations
   */
  protected validateRequiredTranslations(
    translations: { [key: string]: string },
    languageId: number,
  ): boolean {
    const requiredFields = this.config.fields
      .filter(f => f.required)
      .map(f => f.field);

    return requiredFields.every(field => 
      translations && translations[field] && translations[field].trim() !== ''
    );
  }

  /**
   * Get translatable fields configuration
   */
  getTranslatableFields() {
    return this.config.fields;
  }

  /**
   * Check if a field is translatable
   */
  isFieldTranslatable(fieldName: string): boolean {
    return this.config.fields.some(f => f.field === fieldName);
  }
}

// Example usage in a service:
/*
@Injectable()
export class CourseService extends BaseTranslatableService {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly translationService: TranslationService,
  ) {
    super(prisma, translationService, COURSE_TRANSLATABLE_CONFIG);
  }

  async create(data: CreateCourseDto, translations: { [key: string]: string }, languageId: number) {
    const course = await this.prisma.course.create({ data });
    await this.saveTranslations(course.id, translations, languageId);
    return this.loadTranslations(course, languageId);
  }

  async findOne(id: number, languageId: number) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    return this.loadTranslations(course, languageId);
  }
}
*/
