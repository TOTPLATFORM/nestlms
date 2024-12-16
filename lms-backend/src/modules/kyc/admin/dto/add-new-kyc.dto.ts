import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { StatusOnOffArray, UserRolesArray } from 'src/shared/constants/array.constants';

export class AddNewKycDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @IsIn(StatusOnOffArray)
  status: number;

  @IsNotEmpty()
  @IsNumber()
  @IsIn(StatusOnOffArray)
  is_text_required: number;

  @IsNotEmpty()
  @IsNumber()
  @IsIn(StatusOnOffArray)
  is_file_required: number;

}
