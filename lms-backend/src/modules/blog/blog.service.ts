import { Injectable } from '@nestjs/common';

import {
  PrismaClient,
  addPhotoPrefix,
  createUniqueSlug,
  errorResponse,
  fetchMyUploadFilePathById,
  paginatioOptions,
  paginationMetaData,
  processException,
  successResponse,
} from 'src/shared/helpers/functions';
import { StoreBlogCategoryDto } from './admin/dto/store-blog-category.dto';
import { StoreBlogDto } from './admin/dto/store-blog.dto';
import { User } from '../users/entities/user.entity';
import { StoreBlogTagDto } from './admin/dto/store-blog-tag.dto';
import { block } from 'sharp';
import { coreConstant } from 'src/shared/helpers/coreConstant';

@Injectable()
export class BlogService {
  async addBlogCategory(payload: StoreBlogCategoryDto) {
    try {
      const checkUniqueCategory = await PrismaClient.blogCategory.findFirst({
        where: {
          name: payload.name,
        },
      });

      if (checkUniqueCategory) {
        return errorResponse('This name has already taken!');
      }
      const blogCategory = await PrismaClient.blogCategory.create({
        data: {
          name: payload.name,
          status: payload.status,
        },
      });
      return successResponse('Blog is stored successfully!', blogCategory);
    } catch (error) {
      processException(error);
    }
  }

  async getBlogCategoryByPaginateSearch(payload: any) {
    try {
      const whereCondition = payload.search
        ? {
            OR: [
              {
                name: {
                  contains: payload.search,
                },
              },
            ],
          }
        : {};

      const paginate = await paginatioOptions(payload);

      const faqList = await PrismaClient.blogCategory.findMany({
        where: whereCondition,
        orderBy: {
          created_at: 'desc',
        },
        ...paginate,
      });

      const data = {
        list: faqList,
        meta: await paginationMetaData('blogCategory', payload, whereCondition),
      };

      return successResponse('Blog category list', data);
    } catch (error) {
      processException(error);
    }
  }

  async updateBlogCategory(
    blog_category_id: number,
    payload: StoreBlogCategoryDto,
  ) {
    try {
      const checkUniqueCategory = await PrismaClient.blogCategory.findFirst({
        where: {
          name: payload.name,
          NOT: {
            id: blog_category_id,
          },
        },
      });

      if (checkUniqueCategory) {
        return errorResponse('This name has already taken!');
      }

      const existsBlogCategory = await PrismaClient.blogCategory.findFirst({
        where: {
          id: blog_category_id,
        },
      });

      if (!existsBlogCategory) {
        return errorResponse('Invalid Request!');
      }

      const updateBlogCategory = await PrismaClient.blogCategory.update({
        where: {
          id: existsBlogCategory.id,
        },
        data: {
          name: payload.name,
          status: payload.status,
        },
      });

      return successResponse(
        'Blog category is updated successfully!',
        updateBlogCategory,
      );
    } catch (error) {
      processException(error);
    }
  }

  async getBlogCategoryDetails(blog_category_id: number) {
    try {
      const blogCategoryDetails = await PrismaClient.blogCategory.findFirst({
        where: {
          id: blog_category_id,
        },
      });

      if (!blogCategoryDetails) {
        return errorResponse('Invalid Request!');
      }

      return successResponse('Blog category details', blogCategoryDetails);
    } catch (error) {
      processException(error);
    }
  }

  async deleteBlogCategory(blog_category_id: number) {
    try {
      const blogCategoryDetails = await PrismaClient.blogCategory.findFirst({
        where: {
          id: blog_category_id,
        },
      });

      if (!blogCategoryDetails) {
        return errorResponse('Invalid Request!');
      }

      await PrismaClient.blogCategory.delete({
        where: {
          id: blogCategoryDetails.id,
        },
      });

      return successResponse('Blog category is deleted successfully!');
    } catch (error) {
      processException(error);
    }
  }

  async createNewBlog(user: User, payload: StoreBlogDto) {
    try {
      const slug = await createUniqueSlug(payload.title);
      console.log(slug, 'slugslug');
      const checkUniqueBlog = await PrismaClient.blog.findFirst({
        where: {
          slug: slug,
        },
      });

      if (checkUniqueBlog) {
        return errorResponse('This title has already taken');
      }

      const thumbnail_link_path = payload.thumbnail_link
        ? await fetchMyUploadFilePathById(payload.thumbnail_link)
        : null;

      const cover_image_link_path = payload.cover_image_link
        ? await fetchMyUploadFilePathById(payload.cover_image_link)
        : null;

      const meta_img_path = payload.meta_img
        ? await fetchMyUploadFilePathById(payload.meta_img)
        : null;

      const existsBlogCategory = await PrismaClient.blogCategory.findFirst({
        where: {
          id: payload.blog_category_id,
        },
      });

      if (!existsBlogCategory) {
        return errorResponse('Invalid blog category');
      }

      const newBlog = await PrismaClient.blog.create({
        data: {
          title: payload.title,
          slug: slug,
          status: payload.status,
          authorId: user.id,
          blogCategoryId: payload.blog_category_id,
          tag: payload.tag,
          thumbnail_link: thumbnail_link_path,
          cover_image_link: cover_image_link_path,
          description: payload.description,
          meta_title: payload.meta_title,
          meta_keyword: payload.meta_keyword,
          meta_description: payload.meta_description,
          meta_img: meta_img_path,
        },
      });

      return successResponse('New blog is created successfully!', newBlog);
    } catch (error) {
      console.log(error, 'error');
      processException(error);
    }
  }
  async getBlogPendingComments(payload) {
    try {
      const whereCondition = {
        status: coreConstant.STATUS_PENDING,
      };

      const paginate = await paginatioOptions(payload);

      const blogComments = await PrismaClient.blogComment.findMany({
        where: whereCondition,
        include: {
          Blog: true,
          User: true,
        },
        orderBy: {
          created_at: 'desc',
        },
        ...paginate,
      });

      const data = {
        list: blogComments,
        meta: await paginationMetaData('blogComment', payload, whereCondition),
      };

      return successResponse('Blog comment list', data);
    } catch (error) {
      processException(error);
    }
  }

  async approveBlogComment(payload: any) {
    try {
      const blogComment = await PrismaClient.blogComment.findUnique({
        where: {
          id: Number(payload.blog_comment_id),
        },
      });

      if (!blogComment) {
        return errorResponse('Invalid Blog comment id!');
      }

      const blogComments = await PrismaClient.blogComment.update({
        where: {
          id: Number(payload.blog_comment_id),
        },
        data: {
          status:
            Number(payload.status) === coreConstant.STATUS_ACTIVE
              ? coreConstant.STATUS_ACTIVE
              : Number(payload.status) === coreConstant.STATUS_PENDING
              ? coreConstant.STATUS_PENDING
              : coreConstant.STATUS_REJECTED,
        },
      });

      return successResponse(
        'Blog comment is approved successfully!',
        blogComments,
      );
    } catch (error) {
      processException(error);
    }
  }
  async deleteBlogComment(blog_comment_id: number) {
    try {
      const blogComment = await PrismaClient.blogComment.findUnique({
        where: {
          id: Number(blog_comment_id),
        },
      });

      if (!blogComment) {
        return errorResponse('Invalid Blog comment id!');
      }
      const deletedBlog = await PrismaClient.blogComment.delete({
        where: {
          id: Number(blog_comment_id),
        },
      });
      if (!deletedBlog) {
        return errorResponse('Comment is not deleted!');
      }

      return successResponse('Blog comment is deleted successfully!');
    } catch (error) {
      console.log(error, 'error');
      processException(error);
    }
  }

  async getBlogListByPaginateAndSearch(payload) {
    try {
      const whereCondition = payload.search
        ? {
            OR: [
              {
                title: {
                  contains: payload.search,
                },
              },
            ],
          }
        : {};

      const paginate = await paginatioOptions(payload);

      const blogList = await PrismaClient.blog.findMany({
        where: whereCondition,
        include: {
          BlogCategory: true,
        },
        orderBy: {
          created_at: 'desc',
        },
        ...paginate,
      });

      blogList.map((blog) => {
        blog.cover_image_link = addPhotoPrefix(blog.cover_image_link);
        blog.meta_img = addPhotoPrefix(blog.meta_img);
        blog.thumbnail_link = addPhotoPrefix(blog.thumbnail_link);
      });

      const data = {
        list: blogList,
        meta: await paginationMetaData('blog', payload, whereCondition),
      };

      return successResponse('Blog list', data);
    } catch (error) {
      processException(error);
    }
  }

  async updateBlogPost(user: User, blog_id: number, payload: StoreBlogDto) {
    try {
      const existsBlog = await PrismaClient.blog.findFirst({
        where: {
          id: blog_id,
        },
      });

      if (!existsBlog) {
        return errorResponse('Invalid Request!');
      }

      const slug = await createUniqueSlug(payload.title);

      const checkUniqueBlog = await PrismaClient.blog.findFirst({
        where: {
          slug: slug,
          NOT: {
            id: existsBlog.id,
          },
        },
      });

      if (checkUniqueBlog) {
        return errorResponse('This title has already taken');
      }

      const thumbnail_link_path = payload.thumbnail_link
        ? await fetchMyUploadFilePathById(payload.thumbnail_link)
        : existsBlog.thumbnail_link;

      const cover_image_link_path = payload.cover_image_link
        ? await fetchMyUploadFilePathById(payload.cover_image_link)
        : existsBlog.cover_image_link;

      const meta_img_path = payload.meta_img
        ? await fetchMyUploadFilePathById(payload.meta_img)
        : existsBlog.meta_img;

      const existsBlogCategory = await PrismaClient.blogCategory.findFirst({
        where: {
          id: payload.blog_category_id,
        },
      });

      if (!existsBlogCategory) {
        return errorResponse('Invalid blog category');
      }

      const updateBlog = await PrismaClient.blog.update({
        where: {
          id: existsBlog.id,
        },
        data: {
          title: payload.title,
          slug: slug,
          status: payload.status,
          authorId: user.id,
          blogCategoryId: payload.blog_category_id,
          tag: payload.tag,
          thumbnail_link: thumbnail_link_path,
          cover_image_link: cover_image_link_path,
          description: payload.description,
          meta_title: payload.meta_title,
          meta_keyword: payload.meta_keyword,
          meta_description: payload.meta_description,
          meta_img: meta_img_path,
        },
      });

      return successResponse('Blog is updated successfully!', updateBlog);
    } catch (error) {
      processException(error);
    }
  }

  async getBlogPostDetails(blog_id: number) {
    try {
      const blogDetails = await PrismaClient.blog.findFirst({
        where: {
          id: blog_id,
        },
      });

      if (!blogDetails) {
        return errorResponse('Invalid Request!');
      }

      blogDetails.cover_image_link = addPhotoPrefix(
        blogDetails.cover_image_link,
      );
      blogDetails.meta_img = addPhotoPrefix(blogDetails.meta_img);
      blogDetails.thumbnail_link = addPhotoPrefix(blogDetails.thumbnail_link);

      return successResponse('Blog details', blogDetails);
    } catch (error) {
      processException(error);
    }
  }

  async deleteBlogPost(blog_id: number) {
    try {
      const blogDetails = await PrismaClient.blog.findFirst({
        where: {
          id: blog_id,
        },
      });

      if (!blogDetails) {
        return errorResponse('Invalid Request!');
      }

      await PrismaClient.blog.delete({
        where: {
          id: blogDetails.id,
        },
      });

      return successResponse('Blog is deleted successfully!');
    } catch (error) {
      processException(error);
    }
  }

  async addBlogTag(payload: StoreBlogTagDto) {
    try {
      const checkUniqueTag = await PrismaClient.blogTag.findFirst({
        where: {
          name: payload.name,
        },
      });
      if (checkUniqueTag) {
        return errorResponse('This tag name has already taken!');
      }

      const blogTag = await PrismaClient.blogTag.create({
        data: {
          name: payload.name,
          status: payload.status,
        },
      });

      return successResponse('Blog tag is stored successfully!', blogTag);
    } catch (error) {
      processException(error);
    }
  }

  async getBlogTagListByPaginateSearch(payload: any) {
    try {
      const whereCondition = payload.search
        ? {
            OR: [
              {
                name: {
                  contains: payload.search,
                },
              },
            ],
          }
        : {};

      const paginate = await paginatioOptions(payload);

      const blogTagList = await PrismaClient.blogTag.findMany({
        where: whereCondition,
        orderBy: {
          created_at: 'desc',
        },
        ...paginate,
      });

      const data = {
        list: blogTagList,
        meta: await paginationMetaData('blogTag', payload, whereCondition),
      };

      return successResponse('Blog tag list', data);
    } catch (error) {
      processException(error);
    }
  }

  async updateBlogTag(blog_tag_id: number, payload: StoreBlogTagDto) {
    try {
      const existsBlogTag = await PrismaClient.blogTag.findFirst({
        where: {
          id: blog_tag_id,
        },
      });

      if (!existsBlogTag) {
        return errorResponse('Invalid Request!');
      }

      const checkUniqueTag = await PrismaClient.blogTag.findFirst({
        where: {
          name: payload.name,
          NOT: {
            id: existsBlogTag.id,
          },
        },
      });
      if (checkUniqueTag) {
        return errorResponse('This tag name has already taken!');
      }

      const updateBlog = await PrismaClient.blogTag.update({
        where: {
          id: existsBlogTag.id,
        },
        data: {
          name: payload.name,
          status: payload.status,
        },
      });

      return successResponse('Blog tag is updated successfully!', updateBlog);
    } catch (error) {
      processException(error);
    }
  }

  async getBlogTagDetails(blog_tag_id: number) {
    try {
      const blogTagDetails = await PrismaClient.blogTag.findFirst({
        where: {
          id: blog_tag_id,
        },
      });

      if (!blogTagDetails) {
        return errorResponse('Invalid Request!');
      }

      return successResponse('Blog tag details', blogTagDetails);
    } catch (error) {
      processException(error);
    }
  }

  async deleteBlogTagDetails(blog_tag_id: number) {
    try {
      const blogTagDetails = await PrismaClient.blogTag.findFirst({
        where: {
          id: blog_tag_id,
        },
      });

      if (!blogTagDetails) {
        return errorResponse('Invalid Request!');
      }

      await PrismaClient.blogTag.delete({
        where: {
          id: blogTagDetails.id,
        },
      });

      return successResponse('Blog tag is deleted successfully');
    } catch (error) {
      processException(error);
    }
  }

  async getAllActiveBlogCategory() {
    try {
      const allBlogCategoryList = await PrismaClient.blogCategory.findMany({
        where: {
          status: coreConstant.STATUS_ACTIVE,
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      return successResponse('Active blog category list', allBlogCategoryList);
    } catch (error) {
      processException(error);
    }
  }

  async getAllActiveBlogTag() {
    try {
      const allBlogTagList = await PrismaClient.blogTag.findMany({
        where: {
          status: coreConstant.STATUS_ACTIVE,
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      return successResponse('Active blog tag list', allBlogTagList);
    } catch (error) {
      processException(error);
    }
  }
  async addBlogComment(user: User, payload: any) {
    try {
      const findBlog = await PrismaClient.blog.findUnique({
        where: {
          id: payload.blogId,
        },
      });
      if (!findBlog) return errorResponse('Blog id invalid');
      const newComment = await PrismaClient.blogComment.create({
        data: {
          message: payload.message,
          status: coreConstant.STATUS_PENDING,
          blog_id: Number(payload.blogId),
          userId: user.id,
        },
      });

      return successResponse('Comment added successfully!', newComment);
    } catch (error) {
      console.log(error, 'error');
      processException(error);
    }
  }
  async getBlogListByPaginateAndSearchPublic(payload: any) {
    try {
      const whereCondition = {
        status: coreConstant.STATUS_ACTIVE,
        ...(payload.search
          ? {
              OR: [
                {
                  title: {
                    contains: payload.search,
                  },
                },
              ],
            }
          : {}),
        ...(payload.blog_category_id
          ? { blogCategoryId: Number(payload.blog_category_id) }
          : {}),
      };

      if (payload.tag) {
        whereCondition['tag'] = {
          contains: payload.tag, // Use 'contains' to check if the tag contains the keyword
        };
      }

      const paginate = await paginatioOptions(payload);

      const blogList = await PrismaClient.blog.findMany({
        where: whereCondition,
        orderBy: {
          created_at: 'desc',
        },
        ...paginate,
      });

      blogList.map((blog) => {
        blog.cover_image_link = addPhotoPrefix(blog.cover_image_link);
        blog.meta_img = addPhotoPrefix(blog.meta_img);
        blog.thumbnail_link = addPhotoPrefix(blog.thumbnail_link);
      });

      const data = {
        list: blogList,
        meta: await paginationMetaData('blog', payload, whereCondition),
      };

      return successResponse('Blog list public', data);
    } catch (error) {
      console.log(error, 'errorerror');
      processException(error);
    }
  }

  async getCategoryListPublic() {
    try {
      const activeCategories = await PrismaClient.blogCategory.findMany({
        where: {
          status: coreConstant.STATUS_ACTIVE,
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      return successResponse('Active blog category list', activeCategories);
    } catch (error) {
      processException(error);
    }
  }
  async getBlogDetailsBySlugPublic(blog_slug: string) {
    try {
      const blogDetails: any = await PrismaClient.blog.findFirst({
        where: {
          slug: blog_slug,
          status: coreConstant.STATUS_ACTIVE,
        },
        include: {
          BlogCategory: true,
          comments: {
            where: {
              status: coreConstant.STATUS_ACTIVE,
            },
          },
        },
      });

      const activeCategories = await PrismaClient.blogCategory.findMany({
        where: {
          status: coreConstant.STATUS_ACTIVE,
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      if (!blogDetails) {
        return errorResponse('Invalid Request!');
      }

      blogDetails.cover_image_link = addPhotoPrefix(
        blogDetails.cover_image_link,
      );
      blogDetails.meta_img = addPhotoPrefix(blogDetails.meta_img);
      blogDetails.thumbnail_link = addPhotoPrefix(blogDetails.thumbnail_link);
      blogDetails.categories = [];

      // Iterate through active categories
      for (const category of activeCategories) {
        const blogsCountInCategory = await PrismaClient.blog.count({
          where: {
            status: coreConstant.STATUS_ACTIVE,
            blogCategoryId: category.id,
          },
        });

        // Create an object for each category with its count
        const categoryWithCount = {
          id: category.id,
          name: category.name,
          blogsCount: blogsCountInCategory,
        };

        // Add the category object to the categories array in blogDetails
        blogDetails.categories.push(categoryWithCount);
      }

      // Get recent 5 posts
      const recentPosts = await PrismaClient.blog.findMany({
        where: {
          status: coreConstant.STATUS_ACTIVE,
        },
        orderBy: {
          created_at: 'desc',
        },
        take: 5, // Limit to 5 posts
      });

      recentPosts.forEach((post) => {
        post.cover_image_link = addPhotoPrefix(post.cover_image_link);
        post.meta_img = addPhotoPrefix(post.meta_img);
        post.thumbnail_link = addPhotoPrefix(post.thumbnail_link);
      });

      blogDetails.recentPosts = recentPosts;

      return successResponse('Blog details', blogDetails);
    } catch (error) {
      processException(error);
    }
  }
  async getBlogComments(blogId: string) {
    try {
      const blogComments = await PrismaClient.blogComment.findMany({
        where: {
          blog_id: Number(blogId),
          status: { equals: 1 },
        },
        orderBy: {
          created_at: 'asc',
        },
        include: {
          User: true,
        },
      });
      blogComments.map((comment) => {
        comment.User.photo = addPhotoPrefix(comment.User.photo);
        delete comment.User.password;
      });

      return successResponse(
        'Blog comments retrieved successfully!',
        blogComments,
      );
    } catch (error) {
      processException(error);
      return errorResponse('Error retrieving blog comments');
    }
  }
}
