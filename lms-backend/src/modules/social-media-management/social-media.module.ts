import { Module } from "@nestjs/common";
import { AdminSocialMediaController } from "./admin/social-media-admin.controller";
import { SocialMediaService } from "./social-media.service";

@Module({
    controllers:[AdminSocialMediaController],
    providers:[SocialMediaService]
})

export class SocialMediaModule {}