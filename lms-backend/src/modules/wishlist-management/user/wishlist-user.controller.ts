import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from "@nestjs/common";
import { WishListService } from "../wishlist.service";
import { UserInfo } from "src/shared/decorators/user.decorators";
import { User } from "@prisma/client";
import { AddToWishListDto } from "./add-to-wishlist.dto";

@Controller('user')
export class UserWishListController {
    constructor(private readonly wishListService:WishListService){}

    @Post('add-to-wishlist')
    addToWishList(@UserInfo() user:User, @Body() payload:AddToWishListDto)
    {
        return this.wishListService.addToWishList(user, payload);
    }

    @Get('my-wishlist')
    getMyWishList(@UserInfo() user: User,@Query() payload: any){
        return this.wishListService.getMyWishListByPaginate(user, payload);
    }

    @Delete('remove-wishlist-course-:wishlist_id')
    removeCourseWishList(@UserInfo() user:User, @Param('wishlist_id', ParseIntPipe) wishlist_id:number)
    {
        return this.wishListService.removeCourseWishList(user, wishlist_id);
    }
}