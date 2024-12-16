import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateLandingHowItWorkSectionDataDto {
  @IsNotEmpty()
  @IsString()
  landing_how_it_work_first_title: string;

  @IsNotEmpty()
  @IsString()
  landing_how_it_work_list_first_title: string;

  @IsNotEmpty()
  @IsString()
  landing_how_it_work_list_first_description: string;

  @IsNotEmpty()
  @IsString()
  landing_how_it_work_list_second_title: string;

  @IsNotEmpty()
  @IsString()
  landing_how_it_work_list_second_description: string;

  @IsNotEmpty()
  @IsString()
  landing_how_it_work_list_third_title: string;

  @IsNotEmpty()
  @IsString()
  landing_how_it_work_list_third_description: string;

  @IsOptional()
  @IsNumber()
  landing_how_it_work_list_first_image_url:number;

  @IsOptional()
  @IsNumber()
  landing_how_it_work_list_second_image_url:number;

  @IsOptional()
  @IsNumber()
  landing_how_it_work_list_third_image_url:number;
}
