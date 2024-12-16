import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { BlogService } from '../blog.service';
import { Public } from 'src/shared/decorators/public.decorator';
import { UserInfo } from 'src/shared/decorators/user.decorators';
import { User } from '@prisma/client';

@Controller('public')
export class PublicBlogController {
  constructor(private readonly blogService: BlogService) {}
  @Public()
  @Get('blog-list')
  getBlogCategoryList(@Query() payload: any) {
    return this.blogService.getBlogListByPaginateAndSearchPublic(payload);
  }
  @Public()
  @Get('get-category-list')
  getCategoryList() {
    return this.blogService.getCategoryListPublic();
  }
  @Public()
  @Get('blog-details-:blog_slug')
  getBlogDetails(@Param('blog_slug') blog_slug: string) {
    return this.blogService.getBlogDetailsBySlugPublic(blog_slug);
  }

  @Post('add-blog-comment')
  addBlogComment(@UserInfo() user: User, @Body() payload: any) {
    return this.blogService.addBlogComment(user, payload);
  }
  @Public()
  @Get('get-blog-comments/:blog_id')
  getBlogComments(@Param('blog_id') blog_id: string) {
    return this.blogService.getBlogComments(blog_id);
  }
}
