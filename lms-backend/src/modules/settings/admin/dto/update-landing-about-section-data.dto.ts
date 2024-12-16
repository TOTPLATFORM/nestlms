import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateLandingAboutSectionDataDto {
  @IsNotEmpty()
  @IsString()
  landing_about_us_first_title: string;

  @IsNotEmpty()
  @IsString()
  landing_about_us_first_description: string;

  @IsNotEmpty()
  @IsString()
  landing_about_us_bullet_point: string;

  @IsNumber()
  @IsOptional()
  landing_about_us_first_image_url: number;

  @IsNumber()
  @IsOptional()
  landing_about_us_second_image_url: number;

  @IsNumber()
  @IsOptional()
  landing_about_us_third_image_url: number;
}
