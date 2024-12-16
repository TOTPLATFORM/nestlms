import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { UPLOAD_SOURCE } from 'src/shared/helpers/coreConstant';

export class EditLessonDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  @IsIn([UPLOAD_SOURCE.LOCAL, UPLOAD_SOURCE.VIMEO, UPLOAD_SOURCE.YOUTUBE], {
    message: `Upload source type must be ${UPLOAD_SOURCE.LOCAL} or ${UPLOAD_SOURCE.VIMEO} or ${UPLOAD_SOURCE.YOUTUBE}`,
  })
  video_upload_source: number;

  @IsOptional()
  @IsString()
  video_url: string;

  @IsOptional()
  @IsNumber()
  course_id: number;

  @IsOptional()
  @IsNumber()
  section_id: number;
}
