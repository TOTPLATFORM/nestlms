import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class EditCourseDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsString()
  description: string;

  @IsOptional()
  @IsBoolean()
  privateStatus?: boolean;

  @IsOptional()
  @IsNumber()
  courseLevel?: number;

  @IsOptional()
  @IsNumber()
  discount_type?: number;

  @IsOptional()
  @IsNumber()
  discount_value?: number;

  @IsOptional()
  @IsBoolean()
  isFree?: boolean;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsBoolean()
  discountStatus?: boolean;

  @IsOptional()
  @IsNumber()
  thumbnailLink: number;

  @IsOptional()
  @IsNumber()
  coverImageLink: number;

  @IsOptional()
  @IsString()
  demoVideo: string;

  @IsNumber()
  video_upload_source: number;

  @IsString()
  metaTitle: string;

  @IsString()
  metaKeyword: string;

  @IsString()
  metaDescription: string;

  @IsNumber()
  categoryId: number;

  @IsOptional()
  @IsNumber()
  subCategoryId: number;
}
