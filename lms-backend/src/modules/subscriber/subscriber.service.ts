import { Injectable } from '@nestjs/common';
import { SubscribeDto } from './user/dto/subscribe.dto';
import {
  PrismaClient,
  errorResponse,
  paginatioOptions,
  paginationMetaData,
  processException,
  successResponse,
} from 'src/shared/helpers/functions';

@Injectable()
export class SubscriberService {
  async subscribe(payload: SubscribeDto) {
    try {
      const alreadySubscribed = await PrismaClient.subscriber.findFirst({
        where: {
          email: payload.email,
        },
      });
      if (alreadySubscribed) {
        return errorResponse('You already subscribed with this mail!');
      }

      const subscribed = await PrismaClient.subscriber.create({
        data: {
          email: payload.email,
        },
      });

      return successResponse('Subscribed successfully!');
    } catch (error) {
      processException(error);
    }
  }

  async getSubscriberListByFilterPaginate(payload: any) {
    try {
      const paginate = await paginatioOptions(payload);
      const whereCondition = {
        email: {
          contains: payload.search,
        },
      };
      const subscriberList = await PrismaClient.subscriber.findMany({
        where: whereCondition,
        orderBy: {
          created_at: 'desc',
        },
        ...paginate,
      });

      const data = {
        list: subscriberList,
        meta: await paginationMetaData('subscriber', payload, whereCondition),
      };

      return successResponse('Subscriber list', data);
    } catch (error) {
      processException(error);
    }
  }
}
