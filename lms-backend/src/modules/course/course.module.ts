import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './user/course.controller';
import { AdminCourseController } from './admin/admin-course.controller';
import { SectionService } from './section.service';
import { NotificationService } from '../notification-management/notification.service';
import { LessonService } from './lesson.service';
import { PublicCourseController } from './public/public-course.controller';

@Module({
  controllers: [
    CourseController,
    AdminCourseController,
    PublicCourseController,
  ],
  providers: [
    CourseService,
    SectionService,
    NotificationService,
    LessonService,
  ],
})
export class CourseModule {}
