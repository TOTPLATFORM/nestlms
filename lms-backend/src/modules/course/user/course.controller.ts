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
import { IsInstructor } from 'src/shared/decorators/is-instructor.decorator';
import { CourseService } from '../course.service';
import { paginateInterface } from 'src/shared/constants/types';
import { User } from '@prisma/client';
import { UserInfo } from 'src/shared/decorators/user.decorators';
import { CreateEditCourseDto } from './dto/create-edit-course.dto';
import { CreateSectionDto } from './dto/create-section.dto';
import { SectionService } from '../section.service';
import { EditSectionDto } from './dto/edit-section.dto';
import { LessonService } from '../lesson.service';
import { CreateLessonDto } from './dto/create-lesson.';
import { EditLessonDto } from './dto/edit-lesson';
import { CheckLessionDto } from './dto/check-lession.dto';

@Controller('course')
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly sectionService: SectionService,
    private readonly lessonService: LessonService,
  ) {}
  @Get('check-course-enrollment/:course_id')
  checkCourseEnrollment(
    @Param('course_id') course_id: number,
    @UserInfo() user: User,
  ) {
    return this.courseService.checkCourseEnrollment(course_id, user);
  }
  @IsInstructor()
  @Get('get-instructor-courses')
  getInstructorCourses(
    @Query() payload: paginateInterface,
    @UserInfo() user: User,
  ) {
    return this.courseService.getInstructorCourses(payload, user);
  }
  @IsInstructor()
  @Get('get-instructor-students')
  getInstructorStudents(
    @Query() payload: paginateInterface,
    @UserInfo() user: User,
  ) {
    return this.courseService.getInstructorStudents(payload, user);
  }
  @IsInstructor()
  @Get('get-instructor-course-details/:course_id')
  getCourseDetails(
    @Param('course_id') course_id: number,
    @UserInfo() user: User,
  ) {
    return this.courseService.getCourseDetails(course_id, user);
  }
  @IsInstructor()
  @Get('get-course-details-sections/:course_id')
  getCourseDetailsSections(
    @Param('course_id') course_id: number,
    @UserInfo() user: User,
  ) {
    return this.courseService.getCourseDetailsSections(course_id);
  }
  @IsInstructor()
  @Post('create-edit-instructor-course')
  createInstructorCourses(
    @Body() payload: CreateEditCourseDto,
    @UserInfo() user: User,
  ) {
    return this.courseService.createEditCourse(payload, user);
  }

  @IsInstructor()
  @Delete('delete-instructor-course/:id')
  deleteInstructorCourses(@Param('id') id: number, @UserInfo() user: User) {
    return this.courseService.deleteCourse(id, user);
  }

  @Get('get-my-enrolled-courses')
  getEnrolledCourses(
    @Query() payload: paginateInterface,
    @UserInfo() user: User,
  ) {
    return this.courseService.getEnrolledCourses(user, payload);
  }
  @IsInstructor()
  @Post('create-section')
  createCourseSection(@Body() payload: CreateSectionDto) {
    return this.sectionService.createSection(payload);
  }

  @IsInstructor()
  @Patch('edit-section')
  editCourseSection(@Body() payload: EditSectionDto) {
    return this.sectionService.updateSection(payload);
  }

  @IsInstructor()
  @Delete('delete-instructor-course-section/:section_id')
  deleteInstructorCoursesSection(
    @Param('section_id') section_id: number,
    @UserInfo() user: User,
  ) {
    return this.sectionService.deleteSection(section_id, user);
  }

  @IsInstructor()
  @Get('get-section-by-id/:section_id')
  getSectionById(@Param('section_id') section_id: number) {
    return this.sectionService.getSectionById(section_id);
  }
  @IsInstructor()
  @Post('create-lesson')
  createLesson(@Body() payload: CreateLessonDto) {
    return this.lessonService.createLesson(payload);
  }

  @IsInstructor()
  @Patch('edit-lesson')
  editLesson(@Body() payload: EditLessonDto) {
    return this.lessonService.editLesson(payload);
  }

  @IsInstructor()
  @Delete('delete-lesson/:lesson_id')
  deleteLesson(@Param('lesson_id') lesson_id: number) {
    return this.lessonService.deleteLesson(lesson_id);
  }

  @IsInstructor()
  @Get('get-lesson-by-section-id/:section_id')
  getLessonBySectionId(@Param('section_id') section_id: number) {
    return this.lessonService.getLessonBySectionId(section_id);
  }

  @Post('check-lession')
  checkLession(@UserInfo() user: User, @Body() payload: CheckLessionDto) {
    return this.lessonService.checkLession(user, payload);
  }

  @Get('enrolled-course-details-:course_id')
  getEnrolledCourseDetails(
    @UserInfo() user: User,
    @Param('course_id', ParseIntPipe) course_id: number,
  ) {
    return this.courseService.getEnrolledCourseDetails(user, course_id);
  }
}
