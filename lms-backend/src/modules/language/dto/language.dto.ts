import { IsString, IsBoolean, IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLanguageDto {
  @ApiProperty({ example: 'en', description: 'Language code (e.g., en, ar)' })
  @IsString()
  code: string;

  @ApiProperty({ example: 'English', description: 'Language name' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'ltr', description: 'Text direction (ltr or rtl)' })
  @IsString()
  direction: string;

  @ApiProperty({ example: false, description: 'Is this the default language?' })
  @IsBoolean()
  @IsOptional()
  is_default?: boolean;

  @ApiProperty({ example: 1, description: 'Language status (1: active, 0: inactive)' })
  @IsInt()
  @IsOptional()
  status?: number;

  @ApiProperty({ example: 'flag-en.png', description: 'Flag icon URL' })
  @IsString()
  @IsOptional()
  flag_icon?: string;

  @ApiProperty({ example: 'en-US', description: 'Locale code for formatting' })
  @IsString()
  locale_code: string;
}

export class UpdateLanguageDto extends CreateLanguageDto {
  @ApiProperty({ example: 1, description: 'Language ID' })
  @IsInt()
  id: number;
}

export class LanguageResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'en' })
  code: string;

  @ApiProperty({ example: 'English' })
  name: string;

  @ApiProperty({ example: 'ltr' })
  direction: string;

  @ApiProperty({ example: false })
  is_default: boolean;

  @ApiProperty({ example: 1 })
  status: number;

  @ApiProperty({ example: 'flag-en.png' })
  flag_icon: string;

  @ApiProperty({ example: 'en-US' })
  locale_code: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
