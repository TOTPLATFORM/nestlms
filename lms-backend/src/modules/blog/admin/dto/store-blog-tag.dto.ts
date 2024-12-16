import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { StatusOnOffArray } from 'src/shared/constants/array.constants';

export class StoreBlogTagDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsIn(StatusOnOffArray)
  @IsNumber()
  @IsNotEmpty()
  status: number;
}
