import { Module } from '@nestjs/common';
import { AdminCategoryController } from './admin/admin-category.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CategoryService } from './category.service';
import { UserCategoryController } from './user/user-category.controller';

@Module({
  controllers: [AdminCategoryController, UserCategoryController],
  providers: [CategoryService],
  imports: [PrismaModule],
  exports: [CategoryService],
})
export class CategoryModule {}
