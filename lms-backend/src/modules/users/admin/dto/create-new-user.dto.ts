import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import {
  GenderTypeArray,
  StatusOnOffArray,
} from 'src/shared/constants/array.constants';

export class CreateNewUserDto {
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  last_name: string;

  @IsNotEmpty()
  @IsString()
  nick_name: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsOptional()
  @IsNumber()
  file_id: number;

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsOptional()
  @IsString()
  birth_date: string;

  @IsNotEmpty()
  @IsNumber()
  @IsIn(GenderTypeArray)
  gender: number;

  @IsNotEmpty()
  @IsNumber()
  @IsIn(StatusOnOffArray)
  status: number;

  @IsNotEmpty()
  @IsString()
  roles: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Password must have length of at least 8' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[a-z]).*$/, {
    message: 'Password must contain at least 1 number and 1 letter',
  })
  password: string;
}
