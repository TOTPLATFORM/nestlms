import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { CourseService } from '../course.service';
import { Public } from 'src/shared/decorators/public.decorator';
@Public()
@Controller('course')
export class PublicCourseController {
  constructor(private readonly courseService: CourseService) {}
  @Get('course-list')
  getCourseListPublic(@Query() payload: any) {
    return this.courseService.getCourseListPublic(payload);
  }
  @Get('course-filter-data')
  getCourseFilterDataPublic() {
    return this.courseService.getCourseFilterDataPublic();
  }

  @Get('course-details/:course_slug')
  getCourseDetailsPublic(@Param('course_slug') course_slug: string) {
    return this.courseService.getCourseDetailsPublic(course_slug);
  }

  @Get('get-course-review-data-:course_id')
  getCourseReviewDataPublic(
    @Param('course_id', ParseIntPipe) course_id: number,
  ) {
    return this.courseService.getCourseReviewDataPublic(course_id);
  }

  @Get('course-list-by-search')
  getCourseListBySearch(@Query() payload: any) {
    return this.courseService.getCourseListBySearch(payload);
  }
}
