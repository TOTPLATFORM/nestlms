import {
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { DISCOUNT_TYPE, UPLOAD_SOURCE } from 'src/shared/helpers/coreConstant';

export class CreateCourseByAdminDto {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsOptional()
  @IsString()
  short_description: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsBoolean()
  private_status?: boolean;

  @IsOptional()
  @IsNumber()
  course_level?: number;

  @IsOptional()
  @IsNumber()
  @IsIn([DISCOUNT_TYPE.AMOUNT, DISCOUNT_TYPE.PERCENTAGE], {
    message: `discount type must be ${DISCOUNT_TYPE.AMOUNT} or ${DISCOUNT_TYPE.PERCENTAGE}`,
  })
  discount_type?: number;

  @IsOptional()
  @IsNumber()
  discount_value?: number;

  @IsOptional()
  @IsBoolean()
  is_free?: boolean;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsBoolean()
  discount_status?: boolean;

  @IsOptional()
  @IsNumber()
  thumbnail_link: number;

  @IsOptional()
  @IsNumber()
  cover_image_link: number;

  @IsOptional()
  @IsString()
  demo_video: string;

  @IsOptional()
  @IsString()
  what_you_will_learn: string;

  @IsOptional()
  @IsString()
  requirments: string;

  @IsOptional()
  @IsNumber()
  @IsIn([UPLOAD_SOURCE.LOCAL, UPLOAD_SOURCE.VIMEO, UPLOAD_SOURCE.YOUTUBE], {
    message: `Upload source type must be ${UPLOAD_SOURCE.LOCAL} or ${UPLOAD_SOURCE.VIMEO} or ${UPLOAD_SOURCE.YOUTUBE}`,
  })
  video_upload_source: number;

  @IsOptional()
  @IsString()
  meta_title: string;

  @IsOptional()
  @IsString()
  meta_keyword: string;

  @IsOptional()
  @IsString()
  meta_description: string;

  @IsOptional()
  @IsNumber()
  category_id: number;

  @IsOptional()
  @IsNumber()
  sub_category_id: number;

  @IsOptional()
  @IsNumber()
  instructorId: number;
}
