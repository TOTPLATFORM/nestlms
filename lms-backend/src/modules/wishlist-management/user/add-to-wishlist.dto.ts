import { IsNotEmpty, IsNumber } from "class-validator";

export class AddToWishListDto{
    @IsNumber()
    @IsNotEmpty()
    course_id:number;
}