import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { StatusOnOffArray } from 'src/shared/constants/array.constants';

export class StoreBlogCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsIn(StatusOnOffArray)
  @IsNumber()
  @IsNotEmpty()
  status: number;
}
