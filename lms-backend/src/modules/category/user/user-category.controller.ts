import { Controller, Get, Query } from '@nestjs/common';
import { CategoryService } from '../category.service';
import { paginateInterface } from 'src/shared/constants/types';

@Controller('category')
export class UserCategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Get('get-all-category')
  getAllCategory() {
    return this.categoryService.getAllActiveCategoriesPublic();
  }
}
