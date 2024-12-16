import { IsIn, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { StatusOnOffArray } from "src/shared/constants/array.constants";

export class StoreSocialMediaDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    @IsIn(StatusOnOffArray)
    status: number;

    @IsNotEmpty()
    @IsString()
    link: string;

    @IsNotEmpty()
    @IsNumber()
    file_id: number;
}