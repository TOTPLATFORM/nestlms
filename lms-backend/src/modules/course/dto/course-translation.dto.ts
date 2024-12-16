import { IsString, IsOptional, IsInt, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CourseTranslationDto {
  @ApiProperty({ example: 'Course Name in Arabic' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Short description in Arabic' })
  @IsString()
  @IsOptional()
  short_description?: string;

  @ApiProperty({ example: 'Detailed description in Arabic' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'What you will learn in Arabic' })
  @IsString()
  @IsOptional()
  what_you_will_learn?: string;

  @ApiProperty({ example: 'Requirements in Arabic' })
  @IsString()
  @IsOptional()
  requirements?: string;

  @ApiProperty({ example: 'Meta title in Arabic' })
  @IsString()
  @IsOptional()
  meta_title?: string;

  @ApiProperty({ example: 'Meta description in Arabic' })
  @IsString()
  @IsOptional()
  meta_description?: string;
}

export class CreateCourseWithTranslationDto {
  @ApiProperty()
  @IsInt()
  language_id: number;

  @ApiProperty({ type: CourseTranslationDto })
  @ValidateNested()
  @Type(() => CourseTranslationDto)
  translations: CourseTranslationDto;
}

export class UpdateCourseTranslationDto {
  @ApiProperty()
  @IsInt()
  language_id: number;

  @ApiProperty({ type: CourseTranslationDto })
  @ValidateNested()
  @Type(() => CourseTranslationDto)
  translations: CourseTranslationDto;
}
