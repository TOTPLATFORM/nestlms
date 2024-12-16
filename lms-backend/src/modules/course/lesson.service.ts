import { Injectable } from '@nestjs/common';
import {
  PrismaClient,
  addPhotoPrefix,
  errorResponse,
  processException,
  successResponse,
} from 'src/shared/helpers/functions';
import { ResponseModel } from 'src/shared/models/response.model';
import { CreateLessonDto } from './user/dto/create-lesson.';
import { UPLOAD_SOURCE, coreConstant } from 'src/shared/helpers/coreConstant';
import { EditLessonDto } from './user/dto/edit-lesson';
import { User } from '@prisma/client';
import { CheckLessionDto } from './user/dto/check-lession.dto';

@Injectable()
export class LessonService {
  async createLesson(payload: CreateLessonDto): Promise<ResponseModel> {
    try {
      const course = await PrismaClient.course.findUnique({
        where: {
          id: payload.course_id,
        },
      });
      if (!course) return errorResponse('Course ID not valid');
      const section = await PrismaClient.section.findUnique({
        where: {
          id: payload.section_id,
        },
      });
      if (!section) return errorResponse('Section ID not valid');

      let video_url;
      if (
        payload.video_upload_source === UPLOAD_SOURCE.LOCAL &&
        payload.video_url
      ) {
        let getVideo = await PrismaClient.myUploads.findUnique({
          where: {
            id: parseInt(payload.video_url),
          },
        });
        if (!getVideo) {
          return errorResponse('Video is not valid');
        }
        video_url = getVideo.file_path;
      } else {
        video_url = payload.video_url;
      }
      const lesson = await PrismaClient.lesson.create({
        data: {
          title: payload.title,
          video_upload_source: payload.video_upload_source,
          video_url: video_url,
          description: payload.description,
          course_id: payload.course_id,
          section_id: payload.section_id,
        },
      });
      return successResponse('Lesson created successfully', lesson);
    } catch (error) {
      console.log(error, 'This is an error');
      processException(error);
    }
  }

  async getLessonBySectionId(sectionId: number): Promise<ResponseModel> {
    try {
      if (!sectionId) return errorResponse('Section ID not valid');
      const lessons = await PrismaClient.lesson.findMany({
        where: {
          section_id: sectionId,
        },
      });

      if (!lessons || lessons.length === 0) {
        return errorResponse('No lessons found for the given course');
      }
      let lessonsWithUrl = [];
      lessons.map((lesson) => {
        lessonsWithUrl.push({
          ...lesson,
          video_url:
            lesson.video_upload_source === UPLOAD_SOURCE.LOCAL
              ? addPhotoPrefix(lesson.video_url)
              : lesson.video_url,
        });
      });

      return successResponse('Lessons found successfully', lessonsWithUrl);
    } catch (error) {
      processException(error);
    }
  }

  async editLesson(payload: EditLessonDto): Promise<ResponseModel> {
    try {
      if (payload.course_id) {
        const course = await PrismaClient.course.findUnique({
          where: {
            id: payload.course_id,
          },
        });
        if (!course) return errorResponse('Course ID not valid');
      }
      if (payload.section_id) {
        const section = await PrismaClient.section.findUnique({
          where: {
            id: payload.section_id,
          },
        });
        if (!section) return errorResponse('Section ID not valid');
      }

      let video_url;
      if (
        payload.video_upload_source === UPLOAD_SOURCE.LOCAL &&
        payload.video_url
      ) {
        let getVideo = await PrismaClient.myUploads.findUnique({
          where: {
            id: parseInt(payload.video_url),
          },
        });
        if (!getVideo) {
          return errorResponse('Video is not valid');
        }
        video_url = getVideo.file_path;
      } else {
        video_url = payload.video_url;
      }
      const lesson = await PrismaClient.lesson.update({
        where: {
          id: payload.id,
        },
        data: {
          title: payload.title,
          video_upload_source: payload.video_upload_source,
          video_url: video_url,
          description: payload.description,
          course_id: payload.course_id,
          section_id: payload.section_id,
        },
      });
      return successResponse('Section updated successfully', lesson);
    } catch (error) {
      processException(error);
    }
  }

  async deleteLesson(lessonId: number): Promise<ResponseModel> {
    try {
      if (!lessonId) return errorResponse('Lesson id is required');
      const lesson = await PrismaClient.lesson.findUnique({
        where: {
          id: lessonId,
        },
      });

      if (!lesson) {
        return errorResponse('Section not found');
      }

      const courseIsAlreadyUse = await PrismaClient.userLession.count({
        where: {
          lessonId: lesson.id,
        },
      });

      if (courseIsAlreadyUse > 0) {
        return errorResponse(
          'This lession is already enrolled, you can not delete this!',
        );
      }

      await PrismaClient.lesson.delete({
        where: {
          id: lesson.id,
        },
      });

      return successResponse('Lesson deleted successfully');
    } catch (error) {
      processException(error);
    }
  }

  async checkLession(user: User, payload: CheckLessionDto) {
    try {
      const checkLession = await PrismaClient.lesson.findFirst({
        where: {
          id: payload.lession_id,
          course_id: payload.course_id,
          section_id: payload.section_id,
        },
      });
      if (!checkLession) {
        return errorResponse('Invalid Request!');
      }

      const courseEnrollmentDetails =
        await PrismaClient.courseEnrollment.findFirst({
          where: {
            user_id: user.id,
            course_id: checkLession.course_id,
          },
        });

      if (!courseEnrollmentDetails) {
        return errorResponse('Invalid Request!');
      }

      const userLession = await PrismaClient.userLession.findFirst({
        where: {
          userId: user.id,
          courseId: checkLession.course_id,
          sectionId: checkLession.section_id,
          lessonId: checkLession.id,
        },
      });

      if (userLession) {
        await PrismaClient.userLession.update({
          where: {
            id: userLession.id,
          },
          data: {
            userId: user.id,
            courseId: checkLession.course_id,
            courseEnrollmentId: courseEnrollmentDetails.id,
            sectionId: checkLession.section_id,
            lessonId: checkLession.id,
            is_completed: userLession.is_completed ? false : true,
          },
        });
      } else {
        await PrismaClient.userLession.create({
          data: {
            userId: user.id,
            courseId: checkLession.course_id,
            courseEnrollmentId: courseEnrollmentDetails.id,
            sectionId: checkLession.section_id,
            lessonId: checkLession.id,
            is_completed: true,
          },
        });
      }

      const totalLession = await PrismaClient.lesson.findMany({
        where: {
          course_id: checkLession.course_id,
        },
      });

      const totalCompleteLessionList = await PrismaClient.userLession.findMany({
        where: {
          userId: user.id,
          courseId: checkLession.course_id,
          is_completed: true,
        },
      });

      const quizList = await PrismaClient.quiz.findMany({
        where: {
          courseId: checkLession.course_id,
        },
      });

      const userCompletedQuizList = await PrismaClient.userQuiz.groupBy({
        by: ['quizId'],
        where: {
          studentId: user.id,
          courseId: checkLession.course_id,
          is_completed: coreConstant.STATUS_ACTIVE,
        },
      });

      const totalCompletePercentage =
        ((totalCompleteLessionList.length + userCompletedQuizList.length) *
          100) /
        (totalLession.length + quizList.length);

      if (
        totalCompleteLessionList.length === totalLession.length &&
        userCompletedQuizList.length === quizList.length
      ) {
        await PrismaClient.courseEnrollment.update({
          where: {
            id: courseEnrollmentDetails.id,
          },
          data: {
            is_completed: true,
          },
        });
      }

      const data = {
        total_complete_percentage: totalCompletePercentage.toFixed(2),
      };
      let message;

      if (userLession) {
        if (userLession.is_completed) {
          message = 'Lession is marked as complete';
        } else {
          message = 'Lession is marked as incomplete';
        }
      } else {
        message = 'Lession is marked as complete';
      }

      return successResponse(message, data);
    } catch (error) {
      processException(error);
    }
  }
}
