import { Injectable } from '@nestjs/common';
import { AddNewFaqDto } from './admin/dto/add-new-faq.dto';
import {
  PrismaClient,
  errorResponse,
  paginatioOptions,
  paginationMetaData,
  processException,
  successResponse,
} from 'src/shared/helpers/functions';

@Injectable()
export class FaqService {
  async addNewFaq(payload: AddNewFaqDto) {
    try {
      const faqDetails = await PrismaClient.faq.create({
        data: {
          type: payload.type,
          question: payload.question,
          answer: payload.answer,
          status: payload.status,
        },
      });

      return successResponse('Faq is added successfully!', faqDetails);
    } catch (error) {
      processException(error);
    }
  } 
  async getFaqListByFilterByPaginate(payload: any) {
    try {
      const whereCondition = payload.search
        ? {
            OR: [
              {
                answer: {
                  contains: payload.search,
                },
              },
              {
                question: {
                  contains: payload.search,
                },
              },

              isNaN(Number(payload.search))
                ? {}
                : { type: Number(payload.search) },
            ],
          }
        : {};

      const paginate = await paginatioOptions(payload);

      const faqList = await PrismaClient.faq.findMany({
        where: whereCondition,
        ...paginate,
      });

      const data = {
        list: faqList,
        meta: await paginationMetaData('faq', payload, whereCondition),
      };

      return successResponse('Faq list by filter and paginate', data);
    } catch (error) {
      processException(error);
    }
  }

  async getFaqDetails(id: number) {
    try {
      const faqDetails = await PrismaClient.faq.findFirst({
        where: {
          id: id,
        },
      });
      if (!faqDetails) {
        return errorResponse('Invalid Request!');
      }

      return successResponse('Faq details', faqDetails);
    } catch (error) {
      processException(error);
    }
  }
  async updateFaq(id: number, payload: AddNewFaqDto) {
    try {
      const faqDetails = await PrismaClient.faq.findFirst({
        where: {
          id: id,
        },
      });
      if (!faqDetails) {
        return errorResponse('Invalid Request!');
      }

      const updateFaq = await PrismaClient.faq.update({
        where: {
          id: faqDetails.id,
        },
        data: {
          type: payload.type,
          question: payload.question,
          answer: payload.answer,
          status: payload.status,
        },
      });

      return successResponse('Faq is updated');
    } catch (error) {
      processException(error);
    }
  }

  async deleteFaq(id: number) {
    try {
      const faqDetails = await PrismaClient.faq.findFirst({
        where: {
          id: id,
        },
      });
      if (!faqDetails) {
        return errorResponse('Invalid Request!');
      }

      await PrismaClient.faq.delete({
        where: {
          id: faqDetails.id,
        },
      });

      return successResponse('Faq is deleted successfully!');
    } catch (error) {
      processException(error);
    }
  }
}
