import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { paginateInterface } from 'src/shared/constants/types';
import {
  DISCOUNT_TYPE,
  LiveCLassStatus,
  UPLOAD_SOURCE,
  coreConstant,
} from 'src/shared/helpers/coreConstant';
import {
  PrismaClient,
  addPhotoPrefix,
  calculateDiscountedPrice,
  createSlug,
  errorResponse,
  getTotalDiscountAmount,
  paginatioOptions,
  paginationMetaData,
  processCourseLinks,
  processException,
  storeException,
  successResponse,
} from 'src/shared/helpers/functions';
import { ResponseModel } from 'src/shared/models/response.model';
import { CreateEditCourseDto } from './user/dto/create-edit-course.dto';
import { EditCourseDto } from './user/dto/edit-course.dto';
import { IsAdmin } from 'src/shared/decorators/is-admin.decorator';
import { IsNumber } from 'class-validator';
import { ChangeCourseStatusDto } from './admin/dto/change-course-status.dto';
import { CreateCourseByAdminDto } from './admin/dto/create-edit-course.dto';

import { error } from 'console';
import { NotificationService } from '../notification-management/notification.service';

@Injectable()
export class CourseService {
  constructor(private readonly notificationService: NotificationService) {}
  private async checkCourseExistAndBelongsToUser(
    courseId: number,
    userId: number,
  ): Promise<ResponseModel> {
    const course = await PrismaClient.course.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!course) {
      return errorResponse('Course not found');
    }

    if (course.instructorId !== userId) {
      return errorResponse('Course does not belong to the user');
    }
  }

  async getInstructorCourses(
    payload: paginateInterface,
    user: User,
  ): Promise<ResponseModel> {
    try {
      const paginate = await paginatioOptions(payload);
      const courses = await PrismaClient.course.findMany({
        where: {
          instructorId: user.id,
        },
        ...paginate,
        orderBy: {
          created_at: 'desc',
        },
      });
      let updatedCourses = [];
      await courses.map((course) => {
        updatedCourses.push({
          ...course,
          thumbnail_link: addPhotoPrefix(course.thumbnail_link),
          cover_image_link: addPhotoPrefix(course.cover_image_link),
          demo_video: addPhotoPrefix(course.demo_video),
        });
      });
      if (!courses || courses.length === 0) {
        return errorResponse('No course found');
      }
      const paginationMeta = await paginationMetaData('subCategory', payload);
      const data = {
        list: updatedCourses,
        meta: paginationMeta,
      };

      return successResponse('Courses found Successfully', data);
    } catch (error) {
      processException(error);
    }
  }
  async getInstructorStudents(
    payload: paginateInterface,
    user: User,
  ): Promise<ResponseModel> {
    try {
      const paginate = await paginatioOptions(payload);

      const enrolledStudents = await PrismaClient.courseEnrollment.findMany({
        where: {
          course: {
            instructorId: user.id,
          },
        },
        include: {
          user: true,
        },
        ...paginate,
      });

      if (!enrolledStudents || enrolledStudents.length === 0) {
        return errorResponse('No students found for the instructor.');
      }

      const uniqueUserIds = new Set<number>();

      const formattedStudents = enrolledStudents.reduce(
        (result, enrollment) => {
          const { id } = enrollment.user;
          console.log(id, 'id');
          if (!uniqueUserIds.has(id)) {
            uniqueUserIds.add(id);

            const { password, ...userWithoutPassword } = enrollment.user;

            const formattedStudent = {
              user: {
                ...userWithoutPassword,
                photo: addPhotoPrefix(enrollment.user.photo),
              },
              created_at: enrollment.created_at,
            };

            result.push(formattedStudent);
          }

          return result;
        },
        [],
      );

      const paginationMeta = await paginationMetaData(
        'courseEnrollment',
        payload,
      );

      const data = {
        list: formattedStudents,
        meta: paginationMeta,
      };

      return successResponse(
        'Enrolled students for the instructor retrieved successfully.',
        data,
      );
    } catch (error) {
      processException(error);
    }
  }

  async getCourseDetails(
    course_id: number,
    user: User,
  ): Promise<ResponseModel> {
    try {
      let course_details: any = await PrismaClient.course.findFirst({
        where: {
          id: Number(course_id),
          instructorId: user.id,
        },
        include: {
          category: true,
          sub_category: true,
        },
      });
      if (!course_details) {
        return errorResponse('Course not found');
      }
      course_details.thumbnail_link = await addPhotoPrefix(
        course_details.thumbnail_link,
      );
      course_details.cover_image_link = await addPhotoPrefix(
        course_details.cover_image_link,
      );
      if (course_details.video_upload_source === UPLOAD_SOURCE.LOCAL) {
        course_details.demo_video = await addPhotoPrefix(
          course_details.demo_video,
        );
      }

      return successResponse('Courses found Successfully', course_details);
    } catch (error) {
      console.log(error);
      processException(error);
    }
  }
  async getCourseDetailsSections(course_id: number): Promise<ResponseModel> {
    try {
      let course_sections: any = await PrismaClient.section.findMany({
        where: {
          course_id: Number(course_id),
        },
        include: {
          Lesson: true,
        },
      });
      if (!course_sections.length) {
        return errorResponse('Course not found');
      }

      return successResponse(
        'Courses Section found Successfully',
        course_sections,
      );
    } catch (error) {
      console.log(error);
      processException(error);
    }
  }
  async createEditCourse(
    createEditCourseDto: CreateEditCourseDto,
    user: User,
  ): Promise<ResponseModel> {
    try {
      const edit = createEditCourseDto.id ? true : false;
      let exist;

      if (createEditCourseDto.name) {
        exist = await PrismaClient.course.findUnique({
          where: {
            name: createEditCourseDto.name,
          },
        });
      }

      if (!edit && !createEditCourseDto.name) {
        return errorResponse('Please enter course name');
      }
      let category;
      if (createEditCourseDto.category_id) {
        category = await PrismaClient.category.findUnique({
          where: {
            id: createEditCourseDto.category_id,
          },
        });
      }

      let sub_category;
      if (createEditCourseDto.sub_category_id) {
        sub_category = await PrismaClient.subCategory.findUnique({
          where: {
            id: createEditCourseDto.sub_category_id,
          },
        });
      }

      if (!category && createEditCourseDto.category_id)
        return errorResponse('Category not found!');
      if (!sub_category && createEditCourseDto.sub_category_id)
        return errorResponse('Sub Category not found');
      if (exist && !edit) {
        return errorResponse('Course Name already exist please try another');
      }
      if (
        createEditCourseDto.discount_status === true &&
        createEditCourseDto.discount_value <= 0
      ) {
        return errorResponse('Discount value must be greater than 0');
      }
      let slug;
      if (createEditCourseDto.name) {
        slug = await createSlug(createEditCourseDto.name);
      }
      const thumbnail_link = createEditCourseDto.thumbnail_link
        ? await PrismaClient.myUploads.findUnique({
            where: {
              id: createEditCourseDto.thumbnail_link,
            },
          })
        : null;
      const cover_image_link = createEditCourseDto.cover_image_link
        ? await PrismaClient.myUploads.findUnique({
            where: {
              id: createEditCourseDto.cover_image_link,
            },
          })
        : null;
      let demo_video;

      if (
        createEditCourseDto.demo_video &&
        !createEditCourseDto.video_upload_source
      ) {
        return errorResponse('Please select video upload source');
      }
      if (
        createEditCourseDto.video_upload_source === UPLOAD_SOURCE.LOCAL &&
        createEditCourseDto.demo_video
      ) {
        let getVideo = await PrismaClient.myUploads.findUnique({
          where: {
            id: parseInt(createEditCourseDto.demo_video),
          },
        });
        if (!getVideo) {
          return errorResponse('Video is not valid');
        }
        demo_video = getVideo.file_path;
      } else {
        demo_video = createEditCourseDto.demo_video;
      }

      if (!demo_video && createEditCourseDto.demo_video) {
        return errorResponse('Demo video is not valid');
      }
      if (!thumbnail_link && createEditCourseDto.thumbnail_link) {
        return errorResponse('Thumbnail id is not valid');
      }
      if (!cover_image_link && createEditCourseDto.cover_image_link) {
        return errorResponse('Cover image id is not valid');
      }

      if (createEditCourseDto.discount_status === true && createEditCourseDto.discount_value <= 0) {
        return errorResponse('Discount value must be greater than 0');
      }

      if(createEditCourseDto.discount_status === true && createEditCourseDto.discount_type === DISCOUNT_TYPE.PERCENTAGE)
      {
        if(createEditCourseDto.discount_value > 100)
        {
          return errorResponse('Discount value must be less than 100');
        }
      }

      let payable_price = createEditCourseDto.price;

      if(createEditCourseDto.discount_status === true && createEditCourseDto.discount_type === DISCOUNT_TYPE.PERCENTAGE)
      {
        if(createEditCourseDto.discount_value > 100)
        {
          return errorResponse('Discount value must be less than 100');
        }
      }

      if (createEditCourseDto.discount_status === true && createEditCourseDto.discount_value) {
        payable_price = createEditCourseDto.price - getTotalDiscountAmount(createEditCourseDto.price,createEditCourseDto.discount_value, createEditCourseDto.discount_type);
      }
      if (payable_price <= 0 ) {
        return errorResponse('Decrease Discount Value, because discount price can not be less than 0!');
      }

      let prepareData = {
        ...createEditCourseDto,
        instructorId: user.id,
        ...(slug && { slug: slug }),
        ...(payable_price && { payable_price: payable_price }),
        ...(cover_image_link && {
          cover_image_link: cover_image_link.file_path,
        }),
        ...(demo_video && { demo_video: demo_video }),
        ...(thumbnail_link && { thumbnail_link: thumbnail_link.file_path }),
        ...(exist && { slug: await createSlug(createEditCourseDto.name) }),
        ...(!createEditCourseDto.id && { status: coreConstant.STATUS_PENDING }),
      };

      if (edit) {
        const updateCourse = await PrismaClient.course.update({
          where: {
            id: createEditCourseDto.id,
          },
          data: prepareData,
        });

        return successResponse('Course updated successfully', updateCourse);
      } else {
        const createdCourse = await PrismaClient.course.create({
          data: prepareData,
        });

        return successResponse('Course created successfully', createdCourse);
      }
    } catch (error) {
      console.log(error, 'error');
      processException(error);
    }
  }

  async deleteCourse(id: number, user: User): Promise<ResponseModel> {
    try {
      await this.checkCourseExistAndBelongsToUser(id, user.id);

      const findCourse = await PrismaClient.course.findUnique({
        where: {
          id: id,
        },
        include: {
          Section: {
            include: {
              Lesson: true,
            },
          },
          CourseEnrollment: true,
        },
      });

      if (findCourse.CourseEnrollment.length > 0) {
        return errorResponse(
          'Course cannot be deleted because it has enrolled students',
        );
      }

      for (const section of findCourse.Section) {
        for (const lesson of section.Lesson) {
          await PrismaClient.lesson.delete({
            where: {
              id: lesson.id,
            },
          });
        }
      }
      await PrismaClient.section.deleteMany({
        where: {
          course_id: id,
        },
      });

      const deletedCourse = await PrismaClient.course.delete({
        where: {
          id: id,
        },
      });

      return successResponse(
        'Course and associated sections/lessons deleted successfully',
        deletedCourse,
      );
    } catch (error) {
      processException(error);
    }
  }

  async getCourseListForAdmin(payload: any) {
    try {
      const type =
        payload.type && !isNaN(Number(payload.type))
          ? { status: Number(payload.type) }
          : {};

      const paginate = await paginatioOptions(payload);
      const courseList = await PrismaClient.course.findMany({
        where: {
          ...type,
        },
        include: {
          User: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
        ...paginate,
      });

      courseList.map((course) => {
        (course.thumbnail_link = addPhotoPrefix(course.thumbnail_link)),
          (course.cover_image_link = addPhotoPrefix(course.cover_image_link)),
          (course.demo_video = addPhotoPrefix(course.demo_video));
      });

      const data = {
        list: courseList,
        meta: await paginationMetaData(courseList, payload),
      };
      return successResponse('Course list', data);
    } catch (error) {
      processException(error);
    }
  }

  async getCourseDetailsForAdmin(id: number) {
    try {
      let course_details: any = await PrismaClient.course.findFirst({
        where: {
          id: id,
        },
        include: {
          category: true,
          sub_category: true,
          User: true,
        },
      });
      if (!course_details) {
        return errorResponse('Course not found');
      }
      course_details.thumbnail_link = addPhotoPrefix(
        course_details.thumbnail_link,
      );
      course_details.cover_image_link = addPhotoPrefix(
        course_details.cover_image_link,
      );
      if (course_details.video_upload_source === UPLOAD_SOURCE.LOCAL) {
        course_details.demo_video = addPhotoPrefix(course_details.demo_video);
      }

      return successResponse('Courses found Successfully', course_details);
    } catch (error) {
      processException(error);
    }
  }

  async changeCourseStatusByAdmin(payload: ChangeCourseStatusDto) {
    try {
      const courseDetails = await PrismaClient.course.findFirst({
        where: {
          id: payload.course_id,
        },
        include: {
          User: true,
        },
      });

      if (!courseDetails) {
        return errorResponse('Invalid Request!');
      }

      if (
        courseDetails.status === coreConstant.STATUS_PENDING &&
        payload.status === coreConstant.STATUS_ACTIVE
      ) {
        const instructorName =
          courseDetails.User.first_name + ' ' + courseDetails.User.last_name;

        const notificationTitle =
          instructorName + ' has been publish a new course.';
        const notificationBody =
          'Course name ' +
          courseDetails.name +
          '.Course price is ' +
          courseDetails.price;
        const notificationRedirectUrl = 'redirect_url';
        const followerList: any =
          await PrismaClient.instructorFollower.findMany({
            where: {
              instructorId: courseDetails.instructorId,
            },
          });

        const userIdArray = followerList.map(
          (follower: any) => follower.userId,
        );

        await this.notificationService.sendNotificationToAllUser(
          userIdArray,
          notificationTitle,
          notificationBody,
          notificationRedirectUrl,
        );
      }

      await PrismaClient.course.update({
        where: {
          id: courseDetails.id,
        },
        data: {
          status: payload.status,
        },
      });

      return successResponse('Course status is changed successfully!');
    } catch (error) {
      processException(error);
    }
  }

  async createCourseByAdmin(payload: CreateCourseByAdminDto) {
    try {
      const edit = payload.id ? true : false;
      let exist;

      if (payload.name) {
        exist = await PrismaClient.course.findUnique({
          where: {
            name: payload.name,
          },
        });
      }

      if (!edit && !payload.name) {
        return errorResponse('Please enter course name');
      }
      let category;
      if (payload.category_id) {
        category = await PrismaClient.category.findUnique({
          where: {
            id: payload.category_id,
          },
        });
      }

      let sub_category;
      if (payload.sub_category_id) {
        sub_category = await PrismaClient.subCategory.findUnique({
          where: {
            id: payload.sub_category_id,
          },
        });
      }

      if (!category && payload.category_id)
        return errorResponse('Category not found!');
      if (!sub_category && payload.sub_category_id)
        return errorResponse('Sub Category not found');
      if (exist && !edit) {
        return errorResponse('Course Name already exist please try another');
      }
      if (payload.discount_status === true && payload.discount_value <= 0) {
        return errorResponse('Discount value must be greater than 0');
      }
      let slug;
      if (payload.name) {
        slug = await createSlug(payload.name);
      }
      const thumbnail_link = payload.thumbnail_link
        ? await PrismaClient.myUploads.findUnique({
            where: {
              id: payload.thumbnail_link,
            },
          })
        : null;
      const cover_image_link = payload.cover_image_link
        ? await PrismaClient.myUploads.findUnique({
            where: {
              id: payload.cover_image_link,
            },
          })
        : null;
      let demo_video;

      if (payload.demo_video && !payload.video_upload_source) {
        return errorResponse('Please select video upload source');
      }
      if (
        payload.video_upload_source === UPLOAD_SOURCE.LOCAL &&
        payload.demo_video
      ) {
        let getVideo = await PrismaClient.myUploads.findUnique({
          where: {
            id: parseInt(payload.demo_video),
          },
        });
        if (!getVideo) {
          return errorResponse('Video is not valid');
        }
        demo_video = getVideo.file_path;
      } else {
        demo_video = payload.demo_video;
      }

      if (!demo_video && payload.demo_video) {
        return errorResponse('Demo video is not valid');
      }
      if (!thumbnail_link && payload.thumbnail_link) {
        return errorResponse('Thumbnail id is not valid');
      }
      if (!cover_image_link && payload.cover_image_link) {
        return errorResponse('Cover image id is not valid');
      }
      

      if (payload.discount_status === true && payload.discount_value <= 0) {
        return errorResponse('Discount value must be greater than 0');
      }

      if(payload.discount_status === true && payload.discount_type === DISCOUNT_TYPE.PERCENTAGE)
      {
        if(payload.discount_value > 100)
        {
          return errorResponse('Discount value must be less than 100');
        }
      }
      let payable_price = payload.price;
      if (payload.discount_status === true && payload.discount_value) {
        payable_price = payload.price - getTotalDiscountAmount(payload.price,payload.discount_value, payload.discount_type);
      }
      if (payable_price <= 0 ) {
        return errorResponse('Decrease Discount Value, because discount price can not be less than 0!');
      }


      let prepareData = {
        ...payload,
        instructorId: payload.instructorId,
        ...(slug && { slug: slug }),
        ...(payable_price && { payable_price: payable_price }),
        ...(cover_image_link && {
          cover_image_link: cover_image_link.file_path,
        }),
        ...(demo_video && { demo_video: demo_video }),
        ...(thumbnail_link && { thumbnail_link: thumbnail_link.file_path }),
        ...(exist && { slug: await createSlug(payload.name) }),
        ...(!payload.id && { status: coreConstant.STATUS_PENDING }),
      };

      if (edit) {
        const updateCourse = await PrismaClient.course.update({
          where: {
            id: payload.id,
          },
          data: prepareData,
        });

        return successResponse('Course updated successfully', updateCourse);
      } else {
        const createdCourse = await PrismaClient.course.create({
          data: prepareData,
        });

        return successResponse('Course created successfully', createdCourse);
      }
    } catch (error) {
      console.log(error, 'error');
      processException(error);
    }
  }

  async deleteCourseByAdmin(id: number) {
    try {
      const existCourse = await PrismaClient.course.findFirst({
        where: {
          id: id,
        },
        include: {
          CourseEnrollment: true,
          CartItem: true,
          Quiz: true,
        },
      });

      if (!existCourse) {
        return errorResponse('Invalid Request!');
      }

      if (existCourse.CourseEnrollment.length > 0) {
        return errorResponse(
          'This course is already enrolled, you can not remove this!',
        );
      }
      if (existCourse.CartItem.length > 0) {
        return errorResponse(
          'This course is already added to cart, you can not remove this!',
        );
      }

      if (existCourse.Quiz.length > 0) {
        return errorResponse(
          'Please, remove quiz first to delete this course!',
        );
      }
      await PrismaClient.course.delete({
        where: {
          id: existCourse.id,
        },
      });

      return successResponse('Course is deleted successfully!');
    } catch (error) {
      processException(error);
    }
  }

  async getCourseListPublic(payload: any) {
    try {
      const paginate = await paginatioOptions(payload);
      let courseIds: any = [];
      if (payload.min_average_rating) {
        const averageRatingList = await PrismaClient.review.groupBy({
          by: ['course_id'],
          _avg: {
            rating: true,
          },
        });

        courseIds = averageRatingList
          .filter((review) => review._avg.rating >= payload.min_average_rating)
          .map((review) => review.course_id);
      }

      // return courseIds
      const courseLevel = payload.course_level
        ? payload.course_level.split(',').map(Number)
        : [];

      const subCategory = payload.sub_category_id
        ? payload.sub_category_id.split(',').map(Number)
        : [];

      const whereConditions = {
        where: {
          status: coreConstant.STATUS_ACTIVE,
          private_status: false,
          OR: [],
        },
      };

      Object.keys(payload).forEach((key) => {
        switch (key) {
          case 'search':
            whereConditions.where.OR.push({
              name: {
                contains: payload[key],
              },
            });
            break;
          case 'is_free':
            whereConditions.where.OR.push({
              is_free: payload[key] === 'false' ? false : true,
            });
            break;
          case 'discount_status':
            whereConditions.where.OR.push({
              discount_status: payload[key] === 'false' ? false : true,
            });
            break;
          case 'course_level':
            const courseLevelArray = payload[key].split(',').map(Number);
            whereConditions.where.OR.push({
              course_level: {
                in: courseLevelArray,
              },
            });
            break;
          case 'category_id':
            whereConditions.where.OR.push({
              category_id: Number(payload[key]),
            });
            break;
          case 'sub_category_id':
            const subCategory = payload[key].split(',').map(Number);
            whereConditions.where.OR.push({
              sub_category_id: {
                in: subCategory,
              },
            });
            break;
          case 'min_price':
            whereConditions.where.OR.push({
              price: {
                gte: parseFloat(payload[key]),
              },
            });
            break;
          case 'max_price':
            whereConditions.where.OR.push({
              price: {
                lte: parseFloat(payload[key]),
              },
            });
            break;
          case 'min_duration':
            whereConditions.where.OR.push({
              duration: {
                gte: Number(payload[key]),
              },
            });
            break;
          case 'max_duration':
            whereConditions.where.OR.push({
              duration: {
                lte: Number(payload[key]),
              },
            });
            break;
          default:
            break;
        }
      });

      if (courseIds.length > 0) {
        whereConditions.where.OR.push({
          id: {
            in: courseIds,
          },
        });
      }

      const finalWhereCondition = {
        where: {
          status: coreConstant.STATUS_ACTIVE,
          private_status: false,
          AND: whereConditions.where.OR,
        },
      };

      let sortBy = {};

      if (payload.sort_by) {
        if (payload.sort_by === 'latest') {
          sortBy = {
            orderBy: {
              created_at: 'desc',
            },
          };
        } else if (payload.sort_by === 'price_high_to_low') {
          sortBy = {
            orderBy: {
              price: 'desc',
            },
          };
        } else if (payload.sort_by === 'price_low_to_high') {
          sortBy = {
            orderBy: {
              price: 'asc',
            },
          };
        }
      } else {
        sortBy = {
          orderBy: {
            created_at: 'desc',
          },
        };
      }

      const courseList = await PrismaClient.course.findMany({
        ...finalWhereCondition,
        include: {
          Lesson: true,
          Review: true,
          category: true,
          User: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              photo: true,
            },
          },
        },

        ...sortBy,
        ...paginate,
      });

      const coursesWithLessonCount: any = await Promise.all(
        courseList.map(async (course) => {
          course['lession_count'] = course.Lesson.length;
          course.thumbnail_link = addPhotoPrefix(course.thumbnail_link);
          course.cover_image_link = addPhotoPrefix(course.cover_image_link);
          course.demo_video = addPhotoPrefix(course.demo_video);
          course.User.photo = course.User.photo
            ? addPhotoPrefix(course.User.photo)
            : course.User.photo;
          // Calculate average rating
          const totalRating = course.Review.reduce(
            (sum, review) => sum + review.rating,
            0,
          );

          const averageRating = totalRating / course.Review.length || 0;
          course['average_rating'] = averageRating;

          delete course.Lesson;
          delete course.Review;

          return {
            course,
          };
        }),
      );
      const paginationMetaCondition = {
        status: coreConstant.STATUS_ACTIVE,
        private_status: false,
        ...(whereConditions.where.OR.length > 0
          ? { AND: whereConditions.where.OR }
          : {}),
      };

      const data = {
        list: coursesWithLessonCount,
        meta: await paginationMetaData(
          'course',
          payload,
          paginationMetaCondition,
        ),
      };
      return successResponse('Public course list', data);
    } catch (error) {
      processException(error);
    }
  }

  async getCourseFilterDataPublic() {
    try {
      const categoryList = await PrismaClient.category.findMany({
        where: {
          status: coreConstant.STATUS_ACTIVE,
        },
        include: {
          SubCategory: {
            include: {
              Course: true,
            },
          },
          Course: true,
        },
      });

      categoryList.map((category) => {
        category['course_count'] = category.Course.length;
        category.SubCategory.map((subcategory) => {
          subcategory['course_count'] = subcategory.Course.length;
          delete subcategory.Course;
        });
        delete category.Course;
      });

      const reviewList = await PrismaClient.review.groupBy({
        by: ['rating'],
        _count: {
          rating: true,
        },
      });
      const modifiedReviewList = reviewList.map((review) => {
        return { rating: review.rating, total: review._count.rating };
      });

      const data = {
        category_list: categoryList,
        rating_list: modifiedReviewList,
      };

      return successResponse('Course list page filter data', data);
    } catch (error) {
      processException(error);
    }
  }

  async getCourseDetailsPublic(course_slug: string) {
    try {
      const courseDetails = await PrismaClient.course.findFirst({
        where: {
          slug: course_slug,
        },
        include: {
          category: true,
          sub_category: true,
          Review: true,
          Section: {
            include: {
              Lesson: true,
              Quiz: true,
            },
          },
          Quiz: true,
          User: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              photo: true,
              user_name: true,
            },
          },
          CourseEnrollment: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!courseDetails) {
        return errorResponse('Invalid Request!');
      }

      courseDetails.thumbnail_link = addPhotoPrefix(
        courseDetails.thumbnail_link,
      );
      courseDetails.cover_image_link = addPhotoPrefix(
        courseDetails.cover_image_link,
      );
      courseDetails.demo_video = addPhotoPrefix(courseDetails.demo_video);

      courseDetails.User.photo = courseDetails.User.photo
        ? addPhotoPrefix(courseDetails.User.photo)
        : courseDetails.User.photo;

      const totalRating = courseDetails.Review.reduce(
        (sum, review) => sum + review.rating,
        0,
      );
      const totalReviews = courseDetails.Review.length;

      const averageRating = totalRating / totalReviews || 0;
      const totalLessons = courseDetails.Section.reduce(
        (sum, section) => sum + section.Lesson.length,
        0,
      );

      const totalStudents = courseDetails.CourseEnrollment.length;

      courseDetails['total_lessons'] = totalLessons;
      courseDetails['average_rating'] = averageRating;
      courseDetails['total_section'] = courseDetails.Section.length;
      courseDetails['total_quiz'] = courseDetails.Quiz.length;
      courseDetails['averageRating'] = averageRating;
      courseDetails['totalReviews'] = totalReviews;
      courseDetails['total_students'] = totalStudents;

      courseDetails.Section.map((section) => {
        section.Lesson.map((lession) => {
          delete lession.video_url;
        });
      });
      delete courseDetails.Quiz;

      return successResponse('Course details public', courseDetails);
    } catch (error) {
      processException(error);
    }
  }

  async getEnrolledCourses(
    user: User,
    payload: paginateInterface, // Add pagination parameter
  ): Promise<ResponseModel> {
    try {
      const paginate = await paginatioOptions(payload);
      const whereConditions = {
        user_id: user.id,
      };

      const enrolledCourses = await PrismaClient.courseEnrollment.findMany({
        where: whereConditions,
        include: {
          course: true,
        },
        ...paginate, // Include pagination options
      });

      if (!enrolledCourses || enrolledCourses.length === 0) {
        return errorResponse('User has not enrolled in any courses yet.');
      }

      const formattedCourses = enrolledCourses.map((enrollment) =>
        processCourseLinks(enrollment.course),
      );
      const paginationMeta = await paginationMetaData(
        'courseEnrollment',
        payload,
        whereConditions,
      );
      const data = {
        list: formattedCourses,
        meta: paginationMeta,
      };
      return successResponse('Enrolled courses retrieved successfully.', data);
    } catch (error) {
      processException(error);
    }
  }
  async checkCourseEnrollment(
    course_id: number,
    user: User,
  ): Promise<ResponseModel> {
    try {
      const courseEnrollment = await PrismaClient.courseEnrollment.findFirst({
        where: {
          course_id,
          user_id: user.id,
        },
      });
      if (!courseEnrollment) {
        return errorResponse('User has not enrolled in this course yet.');
      }
      return successResponse('User has enrolled in this course.');
    } catch (error) {
      processException(error);
    }
  }

  async getEnrolledCourseDetails(user: User, course_id: number) {
    try {
      const checkEnrolledCourse = await PrismaClient.courseEnrollment.findFirst(
        {
          where: {
            user_id: user.id,
            course_id: course_id,
          },
        },
      );
      if (!checkEnrolledCourse) {
        return errorResponse('This course is not enrolled yet!');
      }
      const courseDetails = await PrismaClient.course.findFirst({
        where: {
          id: course_id,
        },
        include: {
          category: true,
          sub_category: true,
          Review: true,
          LiveClass: {
            where: {
              OR: [
                { status: LiveCLassStatus.LIVE },
                { status: LiveCLassStatus.UPCOMING },
              ],
            },
          },
          Section: {
            include: {
              Lesson: {
                include: {
                  UserLession: {
                    where: {
                      userId: user.id,
                    },
                  },
                },
              },
              Quiz: {
                include: {
                  UserQuiz: {
                    where: {
                      is_completed: 1,
                    },
                  },
                },
              },
            },
          },
          Quiz: true,
          User: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              photo: true,
            },
          },
          CourseEnrollment: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!courseDetails) {
        return errorResponse('Invalid Request!');
      }

      courseDetails.thumbnail_link = addPhotoPrefix(
        courseDetails.thumbnail_link,
      );
      courseDetails.cover_image_link = addPhotoPrefix(
        courseDetails.cover_image_link,
      );

      if (courseDetails.video_upload_source === UPLOAD_SOURCE.LOCAL) {
        courseDetails.demo_video = addPhotoPrefix(courseDetails.demo_video);
      }

      courseDetails.Section.map((section) => {
        section.Lesson.map((lession) => {
          lession['is_completed'] =
            lession.UserLession.length > 0
              ? lession.UserLession[0].is_completed
              : false;
          delete lession.UserLession;
          lession.video_url = addPhotoPrefix(lession.video_url);
        });
        section.Quiz.map((quiz) => {
          quiz['is_completed'] =
            quiz.UserQuiz.length > 0 ? quiz.UserQuiz[0].is_completed : false;

          delete quiz.UserQuiz;
        });
      });

      courseDetails.User.photo = courseDetails.User.photo
        ? addPhotoPrefix(courseDetails.User.photo)
        : courseDetails.User.photo;

      const totalRating = courseDetails.Review.reduce(
        (sum, review) => sum + review.rating,
        0,
      );

      const totalReviews = courseDetails.Review.length;

      const averageRating = totalRating / totalReviews || 0;
      const totalLessons = courseDetails.Section.reduce(
        (sum, section) => sum + section.Lesson.length,
        0,
      );

      const totalStudents = courseDetails.CourseEnrollment.length;

      const totalCompleteLessionList = await PrismaClient.userLession.findMany({
        where: {
          userId: user.id,
          courseId: courseDetails.id,
          is_completed: true,
        },
      });

      const userCompletedQuizList = await PrismaClient.userQuiz.groupBy({
        by: ['quizId'],
        where: {
          studentId: user.id,
          courseId: courseDetails.id,
          is_completed: coreConstant.STATUS_ACTIVE,
        },
      });

      const totalCompletePercentage =
        ((totalCompleteLessionList.length + userCompletedQuizList.length) *
          100) /
        (totalLessons + courseDetails.Quiz.length);

      courseDetails['total_lessons'] = totalLessons;
      courseDetails['average_rating'] = averageRating;
      courseDetails['total_section'] = courseDetails.Section.length;
      courseDetails['total_quiz'] = courseDetails.Quiz.length;
      courseDetails['averageRating'] = averageRating;
      courseDetails['totalReviews'] = totalReviews;
      courseDetails['total_students'] = totalStudents;
      courseDetails['total_complete_percentage'] =
        totalCompletePercentage.toFixed(2);

      delete courseDetails.Quiz;

      return successResponse('Course details public', courseDetails);
    } catch (error) {
      processException(error);
    }
  }

  async getCourseReviewDataPublic(course_id: number) {
    try {
      const courseDetails = await PrismaClient.course.findFirst({
        where: {
          id: course_id,
        },
      });
      if (!courseDetails) {
        return errorResponse('Invalid Request!');
      }

      const reviewList = await PrismaClient.review.findMany({
        where: {
          course_id: courseDetails.id,
        },
        include: {
          user: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              photo: true,
            },
          },
        },
      });

      let totalRating = 0;
      reviewList.map((review) => {
        totalRating = totalRating + review.rating;

        review.user.photo = review.user.photo
          ? addPhotoPrefix(review.user.photo)
          : review.user.photo;
      });

      const averageRating =
        reviewList.length > 0
          ? (totalRating / reviewList.length).toFixed(2)
          : 0;

      const reviewListByratingGroup = await PrismaClient.review.groupBy({
        where: {
          course_id: courseDetails.id,
        },
        by: ['rating'],
        _count: {
          rating: true,
        },
      });

      const modifiedReviewList = reviewListByratingGroup.map((review) => {
        const rating = review.rating;
        const total = review._count.rating;
        const percentage = ((total * 100) / reviewList.length).toFixed(2);
        return { rating, total, percentage };
      });

      const data = {
        review_list: reviewList,
        total_review_data: {
          average_rating: averageRating,
          rating_groupBy: modifiedReviewList,
        },
      };
      return successResponse('Course review details!', data);
    } catch (error) {
      processException(error);
    }
  }

  async getAllCourseReport(payload: any) {
    try {
      const paginate = await paginatioOptions(payload);

      const courseList = await PrismaClient.course.findMany({
        include: {
          CourseEnrollment: true,
          Review: true,
          User: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
              phone: true,
            },
          },
        },
        ...paginate,
      });

      courseList.map((course) => {
        let totalCompleted = 0;
        course.CourseEnrollment.map((courseEnroll) => {
          if (
            course.id === courseEnroll.course_id &&
            courseEnroll.is_completed
          ) {
            totalCompleted++;
          }
        });
        course.thumbnail_link = addPhotoPrefix(course.thumbnail_link);
        course.cover_image_link = addPhotoPrefix(course.cover_image_link);
        course['total_enrolled'] = course.CourseEnrollment.length;
        course['completed_course'] = totalCompleted;
        course['total_review'] = course.Review.length;

        delete course.CourseEnrollment;
        delete course.Review;
      });

      const paginationMeta = await paginationMetaData('course', payload);
      const data = {
        list: courseList,
        meta: paginationMeta,
      };

      return successResponse('Course report', data);
    } catch (error) {
      processException(error);
    }
  }

  async getCourseListBySearch(payload) {
    try {
      const courseList = await PrismaClient.course.findMany({
        where: {
          status: coreConstant.STATUS_ACTIVE,
          OR: {
            name: {
              contains: payload.search ?? '',
            },
          },
        },
      });

      courseList.map((course) => {
        course.thumbnail_link = addPhotoPrefix(course.thumbnail_link);
      });

      return successResponse('Course list by search!', courseList);
    } catch (error) {
      processException(error);
    }
  }
}
