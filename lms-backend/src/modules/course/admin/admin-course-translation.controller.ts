import {
  Controller,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { CourseTranslatableService } from '../course-translatable.service';
import { CreateCourseWithTranslationDto, UpdateCourseTranslationDto } from '../dto/course-translation.dto';

@ApiTags('Admin Course Translations')
@Controller('admin/courses')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminCourseTranslationController {
  constructor(
    private readonly courseTranslatableService: CourseTranslatableService,
  ) {}

  @Post(':id/translations')
  @ApiOperation({ summary: 'Add translations for a course' })
  @ApiResponse({ status: 201, description: 'Translations added successfully' })
  async addTranslations(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateCourseWithTranslationDto,
  ) {
    await this.courseTranslatableService.createTranslations(
      id,
      dto.translations,
      dto.language_id,
    );

    return {
      message: 'Course translations added successfully',
    };
  }

  @Put(':id/translations')
  @ApiOperation({ summary: 'Update translations for a course' })
  @ApiResponse({ status: 200, description: 'Translations updated successfully' })
  async updateTranslations(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCourseTranslationDto,
  ) {
    await this.courseTranslatableService.updateTranslations(
      id,
      dto.translations,
      dto.language_id,
    );

    return {
      message: 'Course translations updated successfully',
    };
  }

  @Post(':id/translations/validate')
  @ApiOperation({ summary: 'Validate translations for a course' })
  @ApiResponse({ status: 200, description: 'Translations validation result' })
  async validateTranslations(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateCourseWithTranslationDto,
  ) {
    const isValid = this.courseTranslatableService.validateTranslations(
      dto.translations,
      dto.language_id,
    );

    return {
      isValid,
      message: isValid
        ? 'Translations are valid'
        : 'Required translations are missing',
    };
  }
}
