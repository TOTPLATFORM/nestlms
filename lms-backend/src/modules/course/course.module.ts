import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { NotificationModule } from '../notification-management/notification.module';
import { LessonService } from './lesson.service';
import { SectionService } from './section.service';
import { AdminCourseController } from './admin/admin-course.controller';
import { AdminCourseTranslationController } from './admin/admin-course-translation.controller';
import { PublicCourseController } from './public/public-course.controller';
import { PublicCourseTranslationController } from './public/public-course-translation.controller';
import { CourseController } from './user/course.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { TranslationModule } from '../../shared/services/translation.module';
import { CourseTranslatableService } from './course-translatable.service';
import { LanguageModule } from '../language/language.module';

@Module({
  imports: [
    PrismaModule,
    TranslationModule,
    LanguageModule,
    NotificationModule
  ],
  controllers: [
    AdminCourseController,
    AdminCourseTranslationController,
    PublicCourseController,
    PublicCourseTranslationController,
    CourseController
  ],
  providers: [
    CourseService,
    LessonService,
    SectionService,
    CourseTranslatableService
  ],
  exports: [
    CourseService,
    LessonService,
    SectionService,
    CourseTranslatableService
  ],
})
export class CourseModule {}
