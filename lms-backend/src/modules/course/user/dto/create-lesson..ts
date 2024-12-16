import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { UPLOAD_SOURCE } from 'src/shared/helpers/coreConstant';

export class CreateLessonDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @IsIn([UPLOAD_SOURCE.LOCAL, UPLOAD_SOURCE.VIMEO, UPLOAD_SOURCE.YOUTUBE], {
    message: `Upload source type must be ${UPLOAD_SOURCE.LOCAL} or ${UPLOAD_SOURCE.VIMEO} or ${UPLOAD_SOURCE.YOUTUBE}`,
  })
  video_upload_source: number;

  @IsNotEmpty()
  @IsString()
  video_url: string;

  @IsNotEmpty()
  @IsNumber()
  course_id: number;

  @IsNotEmpty()
  @IsNumber()
  section_id: number;
}
