import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CourseService } from '../course.service';
import { IsAdmin } from 'src/shared/decorators/is-admin.decorator';
import { ChangeCourseStatusDto } from './dto/change-course-status.dto';
import { CreateCourseByAdminDto } from './dto/create-edit-course.dto';
import { paginateInterface } from 'src/shared/constants/types';
import { SectionService } from '../section.service';
import { LessonService } from '../lesson.service';
import { CreateSectionDto } from '../user/dto/create-section.dto';
import { EditSectionDto } from '../user/dto/edit-section.dto';
import { CreateLessonDto } from '../user/dto/create-lesson.';
import { EditLessonDto } from '../user/dto/edit-lesson';

@IsAdmin()
@Controller('admin')
export class AdminCourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly sectionService: SectionService,
    private readonly lessonService: LessonService,
  ) {}
  @IsAdmin()
  @Get('course-list')
  getCourseListForAdmin(@Query() payload: any) {
    return this.courseService.getCourseListForAdmin(payload);
  }
  @IsAdmin()
  @Get('course-details/:id')
  getCourseDetailsForAdmin(@Param('id', ParseIntPipe) id: number) {
    return this.courseService.getCourseDetailsForAdmin(id);
  }
  @IsAdmin()
  @Get('get-course-details-sections/:course_id')
  getCourseDetailsSections(@Param('course_id') course_id: number) {
    return this.courseService.getCourseDetailsSections(course_id);
  }
  @IsAdmin()
  @Post('change-course-status')
  changeCourseStatusByAdmin(@Body() payload: ChangeCourseStatusDto) {
    return this.courseService.changeCourseStatusByAdmin(payload);
  }
  @IsAdmin()
  @Post('create-edit-course')
  createCourseByAdmin(@Body() payload: CreateCourseByAdminDto) {
    return this.courseService.createCourseByAdmin(payload);
  }
  @IsAdmin()
  @Delete('delete-course/:id')
  deleteCourseByAdmin(@Param('id', ParseIntPipe) id: number) {
    return this.courseService.deleteCourseByAdmin(id);
  }
  @IsAdmin()
  @Post('create-section')
  createCourseSection(@Body() payload: CreateSectionDto) {
    return this.sectionService.createSection(payload);
  }

  @IsAdmin()
  @Patch('edit-section')
  editCourseSection(@Body() payload: EditSectionDto) {
    return this.sectionService.updateSection(payload);
  }

  @IsAdmin()
  @Delete('delete-course-section/:section_id')
  deleteInstructorCoursesSection(@Param('section_id') section_id: number) {
    return this.sectionService.adminDeleteSection(section_id);
  }

  @IsAdmin()
  @Get('get-section-by-id/:section_id')
  getSectionById(@Param('section_id') section_id: number) {
    return this.sectionService.getSectionById(section_id);
  }
  @IsAdmin()
  @Post('create-lesson')
  createLesson(@Body() payload: CreateLessonDto) {
    return this.lessonService.createLesson(payload);
  }
  @IsAdmin()
  @Patch('edit-lesson')
  editLesson(@Body() payload: EditLessonDto) {
    return this.lessonService.editLesson(payload);
  }
  @IsAdmin()
  @Delete('delete-lesson/:lesson_id')
  deleteLesson(@Param('lesson_id') lesson_id: number) {
    return this.lessonService.deleteLesson(lesson_id);
  }
  @IsAdmin()
  @Get('get-lesson-by-section-id/:section_id')
  getLessonBySectionId(@Param('section_id') section_id: number) {
    return this.lessonService.getLessonBySectionId(section_id);
  }

  @IsAdmin()
  @Get('course-report')
  getAllCourseReport(@Query() payload: any) {
    return this.courseService.getAllCourseReport(payload);
  }
}
