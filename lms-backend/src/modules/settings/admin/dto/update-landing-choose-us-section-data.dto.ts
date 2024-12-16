import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateLandingChooseUsSectionDataDto {
  @IsNotEmpty()
  @IsString()
  landing_choose_us_first_title: string;

  @IsNotEmpty()
  @IsString()
  landing_choose_us_list_first_title: string;

  @IsNotEmpty()
  @IsString()
  landing_choose_us_list_first_description: string;

  @IsNotEmpty()
  @IsString()
  landing_choose_us_list_second_title: string;

  @IsNotEmpty()
  @IsString()
  landing_choose_us_list_second_description: string;

  @IsNotEmpty()
  @IsString()
  landing_choose_us_list_third_title: string;

  @IsNotEmpty()
  @IsString()
  landing_choose_us_list_third_description: string;

  @IsNotEmpty()
  @IsString()
  landing_choose_us_list_fourth_title: string;

  @IsNotEmpty()
  @IsString()
  landing_choose_us_list_fourth_description: string;

  @IsOptional()
  @IsNumber()
  landing_choose_us_first_image_url: number;
}
