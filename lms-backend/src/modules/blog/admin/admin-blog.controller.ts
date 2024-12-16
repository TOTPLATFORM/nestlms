import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BlogService } from '../blog.service';
import { StoreBlogDto } from './dto/store-blog.dto';
import { StoreBlogCategoryDto } from './dto/store-blog-category.dto';
import { IsAdmin } from 'src/shared/decorators/is-admin.decorator';
import { User } from '@prisma/client';
import { UserInfo } from 'src/shared/decorators/user.decorators';
import { StoreBlogTagDto } from './dto/store-blog-tag.dto';

@IsAdmin()
@Controller('admin')
export class BlogAdminController {
  constructor(private readonly blogService: BlogService) {}

  @Post('add-blog-category')
  addBlogCategory(@Body() payload: StoreBlogCategoryDto) {
    return this.blogService.addBlogCategory(payload);
  }

  @Get('get-blog-category')
  getBlogCategory(@Query() payload: any) {
    return this.blogService.getBlogCategoryByPaginateSearch(payload);
  }

  @Put('update-blog-category-:blog_category_id')
  updateBlogCategory(
    @Param('blog_category_id', ParseIntPipe) blog_category_id: number,
    @Body() payload: StoreBlogCategoryDto,
  ) {
    return this.blogService.updateBlogCategory(blog_category_id, payload);
  }

  @Get('blog-category-details-:blog_category_id')
  getBlogCategoryDetails(
    @Param('blog_category_id', ParseIntPipe) blog_category_id,
  ) {
    return this.blogService.getBlogCategoryDetails(blog_category_id);
  }

  @Delete('delete-blog-category-:blog_category_id')
  deleteBlogCategory(
    @Param('blog_category_id', ParseIntPipe) blog_category_id: number,
  ) {
    return this.blogService.deleteBlogCategory(blog_category_id);
  }

  @Post('create-new-blog')
  createNewBlog(@UserInfo() user: User, @Body() payload: StoreBlogDto) {
    return this.blogService.createNewBlog(user, payload);
  }

  @Get('get-blog-pending-comments')
  getBlogPendingComments(@Query() payload: any) {
    return this.blogService.getBlogPendingComments(payload);
  }

  @Post('approve-blog-comment')
  approveBlogComment(@Body() payload: any) {
    return this.blogService.approveBlogComment(payload);
  }
  @Delete('delete-blog-comment-:blog_comment_id')
  deleteBlogComment(@Param('blog_comment_id') blog_comment_id: number) {
    return this.blogService.deleteBlogComment(blog_comment_id);
  }
  @Get('get-blog-list')
  getBlogList(@Query() payload: any) {
    return this.blogService.getBlogListByPaginateAndSearch(payload);
  }

  @Put('update-blog-post-:blog_id')
  updateBlogPost(
    @UserInfo() user: User,
    @Param('blog_id', ParseIntPipe) blog_id: number,
    @Body() payload: StoreBlogDto,
  ) {
    return this.blogService.updateBlogPost(user, blog_id, payload);
  }

  @Get('get-blog-post-details-:blog_id')
  getBlogPostDetails(@Param('blog_id', ParseIntPipe) blog_id: number) {
    return this.blogService.getBlogPostDetails(blog_id);
  }

  @Delete('delete-blog-post-:blog_id')
  deleteBlogPost(@Param('blog_id', ParseIntPipe) blog_id: number) {
    return this.blogService.deleteBlogPost(blog_id);
  }

  @Post('add-blog-tag')
  addBlogTag(@Body() payload: StoreBlogTagDto) {
    return this.blogService.addBlogTag(payload);
  }

  @Get('blog-tag-list')
  getBlogTagList(@Query() payload: any) {
    return this.blogService.getBlogTagListByPaginateSearch(payload);
  }

  @Put('update-blog-tag-:blog_tag_id')
  updateBlogTag(
    @Param('blog_tag_id', ParseIntPipe) blog_tag_id: number,
    @Body() payload: StoreBlogTagDto,
  ) {
    return this.blogService.updateBlogTag(blog_tag_id, payload);
  }

  @Get('get-blog-tag-:blog_tag_id')
  getBlogTagDetails(@Param('blog_tag_id', ParseIntPipe) blog_tag_id: number) {
    return this.blogService.getBlogTagDetails(blog_tag_id);
  }

  @Delete('delete-blog-tag-:blog_tag_id')
  deleteBlogTagDetails(
    @Param('blog_tag_id', ParseIntPipe) blog_tag_id: number,
  ) {
    return this.blogService.deleteBlogTagDetails(blog_tag_id);
  }

  @Get('all-blog-category')
  getAllBlogCategory() {
    return this.blogService.getAllActiveBlogCategory();
  }

  @Get('all-blog-tag')
  getAllBlogTag() {
    return this.blogService.getAllActiveBlogTag();
  }
}
