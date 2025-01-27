import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TranslationService } from '../../shared/services/translation.service';
import { BaseTranslatableService } from '../../shared/services/base-translatable.service';
import { COURSE_TRANSLATABLE_CONFIG } from '../../shared/interfaces/translatable.interface';
import { CourseTranslationDto } from './dto/course-translation.dto';

type TranslationMap = { [key: string]: string };

@Injectable()
export class CourseTranslatableService extends BaseTranslatableService {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly translationService: TranslationService,
  ) {
    super(prisma, translationService, COURSE_TRANSLATABLE_CONFIG);
  }

  private toTranslationMap(dto: CourseTranslationDto): TranslationMap {
    return Object.entries(dto).reduce((map, [key, value]) => {
      if (value !== undefined && value !== null) {
        map[key] = value;
      }
      return map;
    }, {} as TranslationMap);
  }

  async createTranslations(
    courseId: number,
    translations: CourseTranslationDto,
    languageId: number,
  ): Promise<void> {
    const translationMap = this.toTranslationMap(translations);
    await this.saveTranslations(courseId, translationMap, languageId);
  }

  async updateTranslations(
    courseId: number,
    translations: CourseTranslationDto,
    languageId: number,
  ): Promise<void> {
    const translationMap = this.toTranslationMap(translations);
    await this.saveTranslations(courseId, translationMap, languageId);
  }

  async getTranslatedCourse(courseId: number, languageId: number) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        category: true,
        sub_category: true,
        User: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            photo: true,
          },
        },
      },
    });

    if (!course) return null;

    return this.loadTranslations(course, languageId);
  }

  async getTranslatedCourses(
    languageId: number,
    options: {
      skip?: number;
      take?: number;
      where?: any;
      orderBy?: any;
    } = {},
  ) {
    const courses = await this.prisma.course.findMany({
      ...options,
      include: {
        category: true,
        sub_category: true,
        User: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            photo: true,
          },
        },
      },
    });

    return this.loadMultipleTranslations(courses, languageId);
  }

  async deleteAllTranslations(courseId: number): Promise<void> {
    await this.deleteTranslations(courseId);
  }

  validateTranslations(
    translations: CourseTranslationDto,
    languageId: number,
  ): boolean {
    const translationMap = this.toTranslationMap(translations);
    return this.validateRequiredTranslations(translationMap, languageId);
  }
}
