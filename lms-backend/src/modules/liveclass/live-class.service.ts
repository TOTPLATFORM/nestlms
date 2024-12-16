import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import {
  StoreLiveClassDto,
  UpdateLiveClassDto,
} from './instructor/dto/store-live-class.dto';
import {
  PrismaClient,
  addPhotoPrefix,
  errorResponse,
  generateAccessTokenFunction,
  generateChannelName,
  getAdminSettingsData,
  paginatioOptions,
  paginationMetaData,
  processException,
  successResponse,
} from 'src/shared/helpers/functions';
import { LiveCLassStatus, coreConstant } from 'src/shared/helpers/coreConstant';
import { AgoraCredentialsSlug } from 'src/shared/constants/array.constants';
import { RtcRole, RtcTokenBuilder } from 'agora-access-token';
import { ResponseModel } from 'src/shared/models/response.model';

@Injectable()
export class LiveClassService {
  async createLiveClass(user: User, payload: StoreLiveClassDto) {
    try {
      const checkCourse = await PrismaClient.course.findUnique({
        where: { id: payload.course_id },
      });
      if (!checkCourse) {
        return successResponse('Course not found!');
      }

      const liveClass = await PrismaClient.liveClass.create({
        data: {
          title: payload.title,
          instructor_id: user.id,
          courseId: payload.course_id,
          channel_name: generateChannelName(payload.title),
          status: LiveCLassStatus.UPCOMING,
          start_date_time: payload.start_date_time,
        },
      });

      return successResponse(
        'New live class is created successfully!',
        liveClass,
      );
    } catch (error) {
      processException(error);
      return errorResponse('Failed to create live class.');
    }
  }
  async updateLiveClass(user: User, payload: UpdateLiveClassDto) {
    try {
      const existingLiveClass = await PrismaClient.liveClass.findUnique({
        where: {
          id: Number(payload.classId),
        },
      });
      if (!existingLiveClass) {
        return successResponse('Live class not found!');
      }

      const currentDate = new Date();
      const startDate = new Date(payload.start_date_time);
      if (currentDate > startDate) {
        return successResponse(
          'Live class start date has already passed. Cannot update.',
        );
      }

      const updatedLiveClass = await PrismaClient.liveClass.update({
        where: {
          id: Number(payload.classId),
        },
        data: {
          title: payload.title,
          instructor_id: user.id,
          courseId: payload.course_id,
          start_date_time: payload.start_date_time,
        },
      });

      return successResponse(
        'Live class updated successfully!',
        updatedLiveClass,
      );
    } catch (error) {
      processException(error);
    }
  }

  async getLiveClassDetails(liveClassId: string) {
    try {
      const getLiveClass = await PrismaClient.liveClass.findUnique({
        where: {
          id: Number(liveClassId),
        },
        include: {
          Course: true,
          LiveClassInstructor: true,
        },
      });
      if (!getLiveClass) {
        return errorResponse('Live class not found!');
      }
      return successResponse('Live class details', getLiveClass);
    } catch (error) {
      processException(error);
    }
  }

  async getInstructorLiveClasses(user: User, payload: any) {
    try {
      const paginate = await paginatioOptions(payload);

      const liveClasses = await PrismaClient.liveClass.findMany({
        where: {
          instructor_id: user.id,
        },
        orderBy: {
          created_at: 'desc',
        },
        include: {
          Course: true,
        },
        ...paginate,
      });
      liveClasses.map((liveClass) => {
        liveClass.Course.thumbnail_link = addPhotoPrefix(
          liveClass.Course.thumbnail_link,
        );
      });
      const data = {
        list: liveClasses,
        meta: await paginationMetaData('liveClass', payload),
      };
      return successResponse('Live classes', data);
    } catch (error) {
      processException(error);
    }
  }
  async deleteLiveClass(user: User, id: string) {
    try {
      const liveClass = await PrismaClient.liveClass.findUnique({
        where: {
          id: Number(id),
        },
      });
      if (!liveClass) {
        return successResponse('Live class not found!');
      }
      await PrismaClient.liveClass.delete({
        where: {
          id: Number(id),
        },
      });
      return successResponse('Live class deleted successfully!');
    } catch (error) {
      processException(error);
    }
  }
  async liveClassCourseList(user: User) {
    try {
      const courses = await PrismaClient.course.findMany({
        where: {
          status: coreConstant.ACTIVE,
          instructorId: user.id,
        },
      });
      return successResponse('Courses', courses);
    } catch (error) {
      processException(error);
    }
  }

  async InstructorStartLiveClass(
    user: User,
    class_id: number,
    class_name: string,
  ): Promise<ResponseModel> {
    try {
      const data: any = await getAdminSettingsData(AgoraCredentialsSlug);
      if (
        Number(data.agora_status) !== coreConstant.ACTIVE ||
        !data.agora_app_id ||
        !data.app_certificate
      ) {
        return successResponse('Live class not allowed!');
      }

      const role = RtcRole.SUBSCRIBER;
      const token = await generateAccessTokenFunction(
        data.agora_app_id,
        data.app_certificate,
        class_name,
        0,
        7200, // Expiration time in seconds
        role,
      );

      // Update live class status to LIVE
      const liveClass = await PrismaClient.liveClass.update({
        where: {
          id: class_id,
        },
        data: {
          status: LiveCLassStatus.LIVE,
        },
      });

      if (!liveClass) return errorResponse('Live class not found!');

      return successResponse('Live class started successfully!', { token });
    } catch (error) {
      processException(error);
    }
  }
  async StudentJoinLiveClass(user: User, class_id: number, class_name: string) {
    try {
      const data: any = await getAdminSettingsData(AgoraCredentialsSlug);
      if (
        Number(data.agora_status) !== coreConstant.ACTIVE ||
        !data.agora_app_id ||
        !data.app_certificate
      ) {
        return successResponse('Live class not allowed!');
      }

      const role = RtcRole.SUBSCRIBER;
      const token = await generateAccessTokenFunction(
        data.agora_app_id,
        data.app_certificate,
        class_name,
        0,
        7200,
        role,
      );

      return successResponse('Live class started successfully!', { token });
    } catch (error) {
      processException(error);
    }
  }
  async StudentLeaveLiveClass(user: User, className: string) {
    try {
      if (!className) {
        return errorResponse('Please provide class id!');
      }
      if (user.roles.includes(String(coreConstant.ROLES.INSTRUCTOR))) {
        const changeClassStatus = await PrismaClient.liveClass.update({
          where: {
            channel_name: className,
          },
          data: {
            status: LiveCLassStatus.COMPLETED,
          },
        });
        if (!changeClassStatus) {
          return errorResponse('Live class not found!');
        }
      }

      return successResponse('Live class completed successfully!');
    } catch (error) {
      console.log(error, 'error in leave live class');
      processException(error);
    }
  }
}
