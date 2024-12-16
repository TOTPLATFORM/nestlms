import { Injectable } from '@nestjs/common';
import {
  PrismaClient,
  createSlug,
  errorResponse,
  paginatioOptions,
  paginationMetaData,
  processException,
  successResponse,
} from 'src/shared/helpers/functions';
import { ResponseModel } from 'src/shared/models/response.model';
import { CreateCategoryDto } from './admin/dto/create-category.dto';
import { UpdateCategoryDto } from './admin/dto/update-category.dto';
import { CreateSubcategoryDto } from './admin/dto/create-subcategory.dto';
import { updateSubcategoryDto } from './admin/dto/update-subcategory.dto ';
import { coreConstant } from 'src/shared/helpers/coreConstant';
import { paginateInterface } from 'src/shared/constants/types';

@Injectable()
export class CategoryService {
  constructor() {}

  async getAllCategories(payload: paginateInterface): Promise<ResponseModel> {
    try {
      const search = payload.search ? payload.search : '';
      const paginate = await paginatioOptions(payload);
      const whereCondition = {
        OR: [
          {
            name: {
              contains: search,
            },
          },
          {
            slug: {
              contains: search,
            },
          },
        ],
      };
      const allCategories = await PrismaClient.category.findMany({
        where: whereCondition,
        ...paginate,
      });
      const paginationMeta = await paginationMetaData(
        'category',
        payload,
        whereCondition,
      );
      const data = {
        list: allCategories,
        meta: paginationMeta,
      };
      return successResponse('Response Successfully', data);
    } catch (error) {
      processException(error);
    }
  }
  async getAllActiveCategoriesPublic(): Promise<ResponseModel> {
    try {
      const allCategories = await PrismaClient.category.findMany({
        where: { status: coreConstant.ACTIVE },
        include: {
          SubCategory: true,
        },
      });
      return successResponse('Response Successfully', allCategories);
    } catch (error) {
      processException(error);
    }
  }
  async getAllActiveCategories(
    payload: paginateInterface,
  ): Promise<ResponseModel> {
    try {
      const search = payload.search ? payload.search : '';
      const paginate = await paginatioOptions(payload);
      const whereCondition = {
        OR: [
          {
            name: {
              contains: search,
            },
          },
          {
            slug: {
              contains: search,
            },
          },
        ],
      };
      const allCategories = await PrismaClient.category.findMany({
        where: { ...whereCondition, status: coreConstant.ACTIVE },
        ...paginate,
      });
      const paginationMeta = await paginationMetaData(
        'category',
        payload,
        whereCondition,
      );
      const data = {
        list: allCategories,
        meta: paginationMeta,
      };
      return successResponse('Response Successfull', data);
    } catch (error) {
      processException(error);
    }
  }
  async getCategoryDetails(id: number): Promise<ResponseModel> {
    try {
      const category = await PrismaClient.category.findUnique({
        where: {
          id: id,
        },
      });
      if (!category) {
        return errorResponse('Category not found');
      }
      return successResponse('Response Successfull', category);
    } catch (error) {
      processException(error);
    }
  }
  async createCategory(payload: CreateCategoryDto): Promise<ResponseModel> {
    try {
      const slug = await createSlug(payload.name);
      const Category = await PrismaClient.category.create({
        data: {
          name: payload.name,
          slug: slug,
          logo: payload.logo,
          status:
            payload.status === coreConstant.ACTIVE
              ? coreConstant.ACTIVE
              : coreConstant.INACTIVE,
        },
      });
      if (Category) {
        return successResponse('Created Successfully', Category);
      }
    } catch (error) {
      processException(error);
    }
  }
  async updateCategory(payload: UpdateCategoryDto): Promise<ResponseModel> {
    try {
      const Category = await PrismaClient.category.update({
        where: {
          id: payload.id,
        },
        data: {
          name: payload.name,
          logo: payload.logo,
          status:
            payload.status === coreConstant.ACTIVE
              ? coreConstant.ACTIVE
              : coreConstant.INACTIVE,
        },
      });
      if (Category) {
        return successResponse('Updated Successfully', Category);
      }
    } catch (error) {
      processException(error);
    }
  }
  async deleteCategory(categoryId: number): Promise<ResponseModel> {
    try {
      const existsCategory = await PrismaClient.category.findFirst({
        where: {
          id: categoryId,
        },
        include: {
          SubCategory: true,
          Course: true,
        },
      });

      if (!existsCategory) {
        return errorResponse('Invalid Request!');
      }

      if (existsCategory.SubCategory.length > 0) {
        return errorResponse(
          'Please, remove subcategory under this category first!',
        );
      }

      if (existsCategory.Course.length > 0) {
        return errorResponse(
          'Please, remove Course under this category first!',
        );
      }

      await PrismaClient.category.delete({
        where: {
          id: categoryId,
        },
      });

      return successResponse('Deleted Successfully');
    } catch (error) {
      processException(error);
    }
  }
  async getAllSubcategories(
    payload: paginateInterface,
  ): Promise<ResponseModel> {
    try {
      const search = payload.search ? payload.search : '';
      const paginate = await paginatioOptions(payload);
      const whereCondition = {
        OR: [
          {
            name: {
              contains: search,
            },
          },
          {
            slug: {
              contains: search,
            },
          },
        ],
      };
      const Subcategories = await PrismaClient.subCategory.findMany({
        where: whereCondition,
        include: {
          category: {
            select: {
              name: true,
            },
          },
        },
        ...paginate,
      });
      if (Subcategories) {
        const paginationMeta = await paginationMetaData(
          'subCategory',
          payload,
          whereCondition,
        );
        const data = {
          list: Subcategories,
          meta: paginationMeta,
        };
        return successResponse('Sub Categories Get Successfully', data);
      }
    } catch (error) {
      processException(error);
    }
  }
  async getSubCategoryDetails(id: number): Promise<ResponseModel> {
    try {
      const Subcategory = await PrismaClient.subCategory.findUnique({
        where: {
          id: id,
        },
        include: {
          category: true,
        },
      });
      if (!Subcategory) {
        return errorResponse('Sub Category Not Found');
      }
      return successResponse('Sub Category Get Successfully', Subcategory);
    } catch (error) {}
  }
  async createSubcategory(
    payload: CreateSubcategoryDto,
  ): Promise<ResponseModel> {
    try {
      const slug = await createSlug(payload.name);

      const Subcategory = await PrismaClient.subCategory.create({
        data: {
          name: payload.name,
          logo: payload.logo,
          slug: slug,
          status:
            payload.status === coreConstant.ACTIVE
              ? coreConstant.ACTIVE
              : coreConstant.INACTIVE,
          category_id: payload.category_id,
        },
      });
      if (Subcategory) {
        return successResponse(
          'Sub Category Created Successfully',
          Subcategory,
        );
      }
      return errorResponse('Sub Category Not Created');
    } catch (error) {
      processException(error);
    }
  }
  async updateSubcategory(
    payload: updateSubcategoryDto,
  ): Promise<ResponseModel> {
    try {
      const Subcategory = await PrismaClient.subCategory.update({
        where: {
          id: payload.id,
        },
        data: {
          name: payload.name,
          logo: payload.logo,
          status:
            payload.status === coreConstant.ACTIVE
              ? coreConstant.ACTIVE
              : coreConstant.INACTIVE,
          category_id: payload.category_id,
        },
      });
      console.log(Subcategory, 'Subcategory');
      if (Subcategory) {
        return successResponse(
          'Sub Category Updated Successfully',
          Subcategory,
        );
      }
    } catch (error) {
      processException(error);
    }
  }
  async deleteSubcategory(id: number): Promise<ResponseModel> {
    try {
      const existsSubcategory = await PrismaClient.subCategory.findFirst({
        where: {
          id: id,
        },
        include: {
          Course: true,
        },
      });

      if (!existsSubcategory) {
        return errorResponse('Invalid Request!');
      }

      if (existsSubcategory.Course.length > 0) {
        return errorResponse(
          'Please, remove Courses under this sub-category first!',
        );
      }
      const Subcategory = await PrismaClient.subCategory.delete({
        where: {
          id: id,
        },
      });
      if (Subcategory) {
        return successResponse(
          'Sub Category Deleted Successfully',
          Subcategory,
        );
      }
      return errorResponse('Sub Category Not Deleted');
    } catch (error) {
      processException(error);
    }
  }
}
