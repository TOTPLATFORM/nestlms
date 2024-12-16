import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from "@nestjs/common";
import { SocialMediaService } from "../social-media.service";
import { StoreSocialMediaDto } from "./dto/store-social-media.dto";
import { IsAdmin } from "src/shared/decorators/is-admin.decorator";

@IsAdmin()
@Controller('admin')
export class AdminSocialMediaController {
    constructor(private readonly socialMediaService:SocialMediaService){}

    @Post('create-new-social-media')
    createNewSocialMedia(@Body() payload: StoreSocialMediaDto) {
        return this.socialMediaService.createNewSocialMedia(payload);
    }

    @Get('get-social-media-list')
    getSocialMediaList(@Query() payload: any) {
        return this.socialMediaService.getSocialMediaListForAdmin(payload);
    }

    @Get('social-media-details-:id')
    getSocialMediaDetails(@Param('id', ParseIntPipe) id: number) {
        return this.socialMediaService.getSocialMediaDetails(id);
    }

    @Post('update-social-media-:social_media_id')
    updateSocialMedia(@Param('social_media_id', ParseIntPipe) social_media_id:number,@Body() payload: StoreSocialMediaDto) {
        return this.socialMediaService.updateSocialMedia(social_media_id,payload);
    }

    @Delete('delete-social-media-:id')
    deleteSocialMedia(@Param('id', ParseIntPipe) id: number) {
        return this.socialMediaService.deleteSocialMedia(id);
    }
}