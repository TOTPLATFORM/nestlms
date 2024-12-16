import { Injectable } from '@nestjs/common';
import {
  PrismaClient,
  errorResponse,
  processException,
  successResponse,
} from 'src/shared/helpers/functions';
import { ResponseModel } from 'src/shared/models/response.model';
import { CreateSectionDto } from './user/dto/create-section.dto';
import { EditSectionDto } from './user/dto/edit-section.dto';
import { User } from '@prisma/client';

@Injectable()
export class SectionService {
  async createSection(payload: CreateSectionDto): Promise<ResponseModel> {
    try {
      const find_course = await PrismaClient.course.findUnique({
        where: {
          id: payload.courseId,
        },
      });
      if (!find_course) return errorResponse('Course not found');
      const createdSection = await PrismaClient.section.create({
        data: {
          title: payload.title,
          course_id: payload.courseId,
        },
      });

      return successResponse('Section created successfully', createdSection);
    } catch (error) {
      processException(error);
    }
  }

  async getSectionsByCourseId(courseId: number): Promise<ResponseModel> {
    try {
      const sections = await PrismaClient.section.findMany({
        where: {
          course_id: courseId,
        },
      });

      if (!sections || sections.length === 0) {
        return errorResponse('No sections found for the given course');
      }

      return successResponse('Sections found successfully', sections);
    } catch (error) {
      processException(error);
    }
  }

  async getSectionById(sectionId: number): Promise<ResponseModel> {
    try {
      if (!sectionId) return errorResponse('Section id is required');
      const section = await PrismaClient.section.findUnique({
        where: {
          id: sectionId,
        },
      });

      if (!section) {
        return errorResponse('Section not found');
      }

      return successResponse('Section found successfully', section);
    } catch (error) {
      processException(error);
    }
  }

  async updateSection(payload: EditSectionDto): Promise<ResponseModel> {
    try {
      const updatedSection = await PrismaClient.section.update({
        where: {
          id: payload.id,
        },
        data: {
          title: payload.title,
          course_id: payload.courseId,
        },
      });

      return successResponse('Section updated successfully', updatedSection);
    } catch (error) {
      processException(error);
    }
  }

  async deleteSection(sectionId: number, user: User): Promise<ResponseModel> {
    try {
      if (!sectionId) return errorResponse('Section id is required');
      const section = await PrismaClient.section.findUnique({
        where: {
          id: sectionId,
        },
        include: {
          Lesson: true,
          course: true,
        },
      });

      if (!section) {
        return errorResponse('Section not found');
      }

      const courseIsAlreadyUse = await PrismaClient.userLession.count({
        where: {
          sectionId: section.id,
        },
      });

      if (courseIsAlreadyUse > 0) {
        return errorResponse(
          'This section is already enrolled, you can not delete this!',
        );
      }

      if (section.course.instructorId !== user.id) {
        return errorResponse('You are not authorized to delete this section');
      }

      if (section.Lesson.length > 0) {
        await Promise.all(
          section.Lesson.map(async (lesson) => {
            await PrismaClient.lesson.delete({
              where: {
                id: lesson.id,
              },
            });
          }),
        );
      }
      const deletedSection = await PrismaClient.section.delete({
        where: {
          id: sectionId,
        },
      });

      return successResponse('Section deleted successfully', deletedSection);
    } catch (error) {
      console.log(error, 'This is an error');
      processException(error);
    }
  }

  async adminDeleteSection(sectionId: number): Promise<ResponseModel> {
    try {
      if (!sectionId) return errorResponse('Section id is required');
      const section = await PrismaClient.section.findUnique({
        where: {
          id: sectionId,
        },
        include: {
          Lesson: true,
          course: true,
        },
      });

      if (!section) {
        return errorResponse('Section not found');
      }
      if (section.Lesson.length > 0) {
        await Promise.all(
          section.Lesson.map(async (lesson) => {
            await PrismaClient.lesson.delete({
              where: {
                id: lesson.id,
              },
            });
          }),
        );
      }
      const deletedSection = await PrismaClient.section.delete({
        where: {
          id: sectionId,
        },
      });

      return successResponse('Section deleted successfully', deletedSection);
    } catch (error) {
      console.log(error, 'This is an error');
      processException(error);
    }
  }
}
