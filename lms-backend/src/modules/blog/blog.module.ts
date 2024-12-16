import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogAdminController } from './admin/admin-blog.controller';
import { PublicBlogController } from './public/public-blog.controller';

@Module({
  controllers: [BlogAdminController, PublicBlogController],
  providers: [BlogService],
})
export class BlogModule {}
