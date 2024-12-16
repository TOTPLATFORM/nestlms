import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateLandingPageDataDto {
  @IsNotEmpty()
  @IsString()
  landing_main_banner_first_title: string;

  @IsNotEmpty()
  @IsString()
  landing_main_banner_first_description: string;

  @IsOptional()
  @IsNumber()
  landing_main_banner_image_url: number;
}
