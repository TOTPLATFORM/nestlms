import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
  UseInterceptors,
  DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CourseTranslatableService } from '../course-translatable.service';
import { Public } from 'src/shared/decorators/public.decorator';
import { LanguageInterceptor } from 'src/shared/interceptors/language.interceptor';

@ApiTags('Public Course Translations')
@Controller('public/courses')
@UseInterceptors(LanguageInterceptor)
export class PublicCourseTranslationController {
  constructor(
    private readonly courseTranslatableService: CourseTranslatableService,
  ) {}

  @Public()
  @Get(':id/translated')
  @ApiOperation({ summary: 'Get translated course by id' })
  @ApiResponse({ status: 200, description: 'Return translated course' })
  @ApiQuery({ name: 'language_id', required: false, type: Number })
  async getTranslatedCourse(
    @Param('id', ParseIntPipe) id: number,
    @Query('language_id', new DefaultValuePipe(1), ParseIntPipe) languageId: number,
  ) {
    return this.courseTranslatableService.getTranslatedCourse(id, languageId);
  }

  @Public()
  @Get('translated')
  @ApiOperation({ summary: 'Get all translated courses' })
  @ApiResponse({ status: 200, description: 'Return all translated courses' })
  @ApiQuery({ name: 'language_id', required: false, type: Number })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  async getTranslatedCourses(
    @Query('language_id', new DefaultValuePipe(1), ParseIntPipe) languageId: number,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take: number,
  ) {
    return this.courseTranslatableService.getTranslatedCourses(languageId, {
      skip,
      take,
      where: {
        status: 1, // Only active courses
        private_status: false, // Only public courses
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  @Public()
  @Get('category/:categoryId/translated')
  @ApiOperation({ summary: 'Get translated courses by category' })
  @ApiResponse({ status: 200, description: 'Return translated courses by category' })
  @ApiQuery({ name: 'language_id', required: false, type: Number })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  async getTranslatedCoursesByCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Query('language_id', new DefaultValuePipe(1), ParseIntPipe) languageId: number,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take: number,
  ) {
    return this.courseTranslatableService.getTranslatedCourses(languageId, {
      skip,
      take,
      where: {
        status: 1,
        private_status: false,
        category_id: categoryId,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  @Public()
  @Get('subcategory/:subcategoryId/translated')
  @ApiOperation({ summary: 'Get translated courses by subcategory' })
  @ApiResponse({ status: 200, description: 'Return translated courses by subcategory' })
  @ApiQuery({ name: 'language_id', required: false, type: Number })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  async getTranslatedCoursesBySubcategory(
    @Param('subcategoryId', ParseIntPipe) subcategoryId: number,
    @Query('language_id', new DefaultValuePipe(1), ParseIntPipe) languageId: number,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take: number,
  ) {
    return this.courseTranslatableService.getTranslatedCourses(languageId, {
      skip,
      take,
      where: {
        status: 1,
        private_status: false,
        sub_category_id: subcategoryId,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }
}
