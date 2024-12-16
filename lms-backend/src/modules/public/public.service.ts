import { Injectable } from '@nestjs/common';
import {
  AgoraCredentialsSlug,
  CommonSettingsSlugs,
  CountryListObjectArray,
  LandingPageSlugs,
  LanguageListJsonArray,
  PaymentMethodStripeSettingsSlugs,
  PrivacyPolicySlugs,
  TermsConditionSlugs,
} from 'src/shared/constants/array.constants';
import { coreConstant, faqTypeConstant } from 'src/shared/helpers/coreConstant';
import {
  PrismaClient,
  addPhotoPrefix,
  checkRoleIsValid,
  errorResponse,
  processCourseLinks,
  processException,
  removePasswordFromUserList,
  successResponse,
} from 'src/shared/helpers/functions';
import { getAdminSettingsData } from 'src/shared/helpers/getAdminSettingsData';
import { ResponseModel } from 'src/shared/models/response.model';
import { remove } from 'winston';
import { ReviewService } from '../review/review.service';

@Injectable()
export class PublicService {
  constructor(private readonly reviewService: ReviewService) {}
  async getAllLanguageList() {
    const languageList = LanguageListJsonArray;
    return successResponse('Language list', languageList);
  }

  async commonSettings() {
    try {
      const data = {};
      // site_logo;
      data['settings'] = await getAdminSettingsData(CommonSettingsSlugs);
      data['stripe'] = await getAdminSettingsData(
        PaymentMethodStripeSettingsSlugs,
      );
      data['agora'] = await getAdminSettingsData(AgoraCredentialsSlug);
      if (data['settings']?.site_logo) {
        data['settings'].site_logo = addPhotoPrefix(
          data['settings']?.site_logo,
        );
      }
      if (data['settings']?.site_fav_icon) {
        data['settings'].site_fav_icon = addPhotoPrefix(
          data['settings']?.site_fav_icon,
        );
      }

      if (data['settings']?.site_footer_logo) {
        data['settings'].site_footer_logo = addPhotoPrefix(
          data['settings']?.site_footer_logo,
        );
      }

      data['countryList'] = CountryListObjectArray;
      data['language_list'] = LanguageListJsonArray;
      return successResponse('Common settings', data);
    } catch (error) {
      processException(error);
    }
  }

  async getLandingPageData() {
    try {
      const courseList = await PrismaClient.course.findMany({
        where: {
          status: coreConstant.STATUS_ACTIVE,
        },
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
        take: 10,
      });
      courseList.map((courseDetails) => {
        courseDetails.thumbnail_link = courseDetails.thumbnail_link
          ? addPhotoPrefix(courseDetails.thumbnail_link)
          : courseDetails.thumbnail_link;

        courseDetails.cover_image_link = courseDetails.cover_image_link
          ? addPhotoPrefix(courseDetails.cover_image_link)
          : courseDetails.cover_image_link;
        courseDetails.User.photo = courseDetails.User.photo
          ? addPhotoPrefix(courseDetails.User.photo)
          : courseDetails.User.photo;
      });

      const roles = String(coreConstant.ROLES.INSTRUCTOR);
      const instructorList = await PrismaClient.user.findMany({
        where: {
          status: coreConstant.STATUS_ACTIVE,
          roles: {
            contains: roles,
          },
        },
        take: 5,
      });
      instructorList.map((instructorDetails) => {
        instructorDetails.photo = instructorDetails.photo
          ? addPhotoPrefix(instructorDetails.photo)
          : instructorDetails.photo;

        delete instructorDetails.password;
      });

      const faqList = await PrismaClient.faq.findMany({
        where: {
          type: faqTypeConstant.LANDING_PAGE,
          status: coreConstant.STATUS_ACTIVE,
        },
      });
      const data: any = await getAdminSettingsData(LandingPageSlugs);
      data.landing_main_banner_image_url = addPhotoPrefix(
        data.landing_main_banner_image_url,
      );

      data.landing_about_us_first_image_url = addPhotoPrefix(
        data.landing_about_us_first_image_url,
      );

      data.landing_about_us_second_image_url = addPhotoPrefix(
        data.landing_about_us_second_image_url,
      );

      data.landing_about_us_third_image_url = addPhotoPrefix(
        data.landing_about_us_third_image_url,
      );

      data.landing_choose_us_first_image_url = addPhotoPrefix(
        data.landing_choose_us_first_image_url,
      );

      data.landing_how_it_work_list_first_image_url = addPhotoPrefix(
        data.landing_how_it_work_list_first_image_url,
      );

      data.landing_how_it_work_list_second_image_url = addPhotoPrefix(
        data.landing_how_it_work_list_second_image_url,
      );

      data.landing_how_it_work_list_third_image_url = addPhotoPrefix(
        data.landing_how_it_work_list_third_image_url,
      );
      const blogList = await PrismaClient.blog.findMany({
        where: {
          status: coreConstant.STATUS_ACTIVE,
        },
        take: 4,
        orderBy: {
          created_at: 'desc',
        },
      });

      blogList.map((blogDetails) => {
        blogDetails.thumbnail_link = addPhotoPrefix(blogDetails.thumbnail_link);
        blogDetails.meta_img = addPhotoPrefix(blogDetails.meta_img);
        blogDetails.cover_image_link = addPhotoPrefix(
          blogDetails.cover_image_link,
        );
      });
      const landingData = {
        landing_data: data,
        course_list: courseList,
        instructor_list: instructorList,
        faq_list: faqList,
        blogList: blogList,
      };

      return successResponse('Landing page data!', landingData);
    } catch (error) {
      processException(error);
    }
  }

  async getInstructorProfileDetails(user_name: string) {
    try {
      const instructorDetails = await PrismaClient.user.findFirst({
        where: {
          user_name: user_name,
        },
        include: {
          Course: {
            where: {
              status: coreConstant.STATUS_ACTIVE,
            },
            include: {
              category: true,
              User: true,
              Review: true, // Include reviews for each course
            },
          },
        },
      });

      if (!instructorDetails) {
        return errorResponse('Invalid Request!');
      }

      delete instructorDetails.password;

      if (instructorDetails.photo) {
        instructorDetails.photo = addPhotoPrefix(instructorDetails.photo);
      }

      const Course = await PrismaClient.course.findMany({
        where: {
          instructorId: instructorDetails.id,
          status: coreConstant.STATUS_ACTIVE,
          private_status: false,
        },
        include: {
          User: true,
        },
      });

      const formattedCourses = Course?.map((course) =>
        processCourseLinks(course),
      );

      const isInstructor = await checkRoleIsValid(
        instructorDetails.roles,
        coreConstant.ROLES.INSTRUCTOR,
      );

      if (!isInstructor) {
        return errorResponse('This is not an instructor profile!');
      }

      const followerList = await PrismaClient.instructorFollower.findMany({
        where: {
          instructorId: instructorDetails.id,
        },
        include: {
          Student: true,
          Instructor: true,
        },
      });

      const enrolledStudents = await PrismaClient.courseEnrollment.findMany({
        where: {
          course: {
            instructorId: instructorDetails.id,
          },
        },
        include: {
          user: true,
        },
      });

      const uniqueUserIds = new Set<number>();
      const formattedStudents = enrolledStudents.reduce(
        (result, enrollment) => {
          const { id } = enrollment.user;

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

      // Collect reviews for all courses
      const allReviews = instructorDetails.Course.reduce((reviews, course) => {
        if (course.Review) {
          reviews.push(...course.Review);
        }
        return reviews;
      }, []);

      const data = {
        total_follower: followerList.length,
        profile_details: instructorDetails,
        enrolled_students: formattedStudents.length,
        review_count: allReviews.length, // Update review_count
        courses: formattedCourses,
      };

      return successResponse('Instructor profile details', data);
    } catch (error) {
      console.log(error, 'SSSsssss');
      processException(error);
    }
  }

  async getInstructors(): Promise<ResponseModel> {
    try {
      const instructors = await PrismaClient.user.findMany({
        where: {
          roles: {
            contains: `${coreConstant.ROLES.INSTRUCTOR}`,
          },
        },
      });
      const userListWithoutPassword = await removePasswordFromUserList(
        instructors,
      );
      return successResponse('List of instructors', userListWithoutPassword);
    } catch (error) {
      processException(error);
    }
  }

  async getTermsConditionData(): Promise<ResponseModel> {
    try {
      const data = await getAdminSettingsData(TermsConditionSlugs);

      return successResponse('Terms condition data!', data);
    } catch (error) {
      processException(error);
    }
  }

  async getPrivacyPolicyData(): Promise<ResponseModel> {
    try {
      const data = await getAdminSettingsData(PrivacyPolicySlugs);

      return successResponse('Privacy policy data!', data);
    } catch (error) {
      processException(error);
    }
  }
}
