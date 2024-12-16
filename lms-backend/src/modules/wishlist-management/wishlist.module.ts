import { Module } from "@nestjs/common";
import { WishListService } from "./wishlist.service";
import { UserWishListController } from "./user/wishlist-user.controller";

@Module({
    controllers:[UserWishListController],
    providers:[WishListService]
})

export class WishListModule {}