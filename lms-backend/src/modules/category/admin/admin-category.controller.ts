import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { IsAdmin } from 'src/shared/decorators/is-admin.decorator';
import { CategoryService } from '../category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { updateSubcategoryDto } from './dto/update-subcategory.dto ';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { paginateInterface } from 'src/shared/constants/types';
@Controller('admin')
export class AdminCategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @IsAdmin()
  @Get('get-all-category')
  getAllCategory(@Query() payload: paginateInterface) {
    return this.categoryService.getAllCategories(payload);
  }
  @IsAdmin()
  @Get('get-all-active-category')
  getAllActiveCategory(@Query() payload: paginateInterface) {
    return this.categoryService.getAllActiveCategories(payload);
  }
  @IsAdmin()
  @Get('get-category-details/:id')
  getCategoryDetails(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.getCategoryDetails(id);
  }
  @IsAdmin()
  @Post('create-category')
  createCategory(@Body() payload: CreateCategoryDto) {
    return this.categoryService.createCategory(payload);
  }
  @IsAdmin()
  @Patch('update-category')
  updateCategory(@Body() payload: UpdateCategoryDto) {
    return this.categoryService.updateCategory(payload);
  }
  @IsAdmin()
  @Delete('delete-category/:id')
  deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.deleteCategory(id);
  }

  @IsAdmin()
  @Get('get-all-sub-category')
  getAllSubCategory(@Query() payload: paginateInterface) {
    return this.categoryService.getAllSubcategories(payload);
  }
  @IsAdmin()
  @Get('get-sub-category-details/:id')
  getSubCategoryDetails(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.getSubCategoryDetails(id);
  }
  @IsAdmin()
  @Post('create-sub-category')
  createSubCategory(@Body() payload: CreateSubcategoryDto) {
    return this.categoryService.createSubcategory(payload);
  }
  @IsAdmin()
  @Patch('update-sub-category')
  updateSubCategory(@Body() payload: updateSubcategoryDto) {
    return this.categoryService.updateSubcategory(payload);
  }
  @IsAdmin()
  @Delete('delete-sub-category/:id')
  deleteSubCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.deleteSubcategory(id);
  }
}
