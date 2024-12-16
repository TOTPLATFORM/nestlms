import { Injectable } from '@nestjs/common';
import { SendNotificationDto } from './admin/dto/send-notification.dto';
import {
  PrismaClient,
  errorResponse,
  paginatioOptions,
  paginationMetaData,
  processException,
  successResponse,
} from 'src/shared/helpers/functions';
import {
  SeenUnseenStatusConstant,
  coreConstant,
} from 'src/shared/helpers/coreConstant';
import { User } from '../users/entities/user.entity';

@Injectable()
export class NotificationService {
  async sendNotificationToOneUser(
    user_id: number,
    title: string,
    body: string,
    redirect_url: string = null,
  ) {
    try {
      await PrismaClient.notification.create({
        data: {
          userId: user_id,
          title: title,
          body: body,
          redirect_url: redirect_url,
        },
      });
      return successResponse('Notification is sent successfully!');
    } catch (error) {
      processException(error);
    }
  }

  async sendNotificationToAllUser(
    userIdArray: number[],
    title: string,
    body: string,
    redirect_url: string = null,
  ) {
    try {
      for (let i = 0; i < userIdArray.length; i++) {
        await PrismaClient.notification.create({
          data: {
            userId: userIdArray[i],
            title: title,
            body: body,
            redirect_url: redirect_url,
          },
        });
      }
      return successResponse('Notification is sent successfully!');
    } catch (error) {
      processException(error);
    }
  }
  async sendNotification(payload: SendNotificationDto) {
    try {
      if (payload.user_id) {
        const response = await this.sendNotificationToOneUser(
          payload.user_id,
          payload.title,
          payload.body,
          payload.redirect_url,
        );
        return response;
      } else {
        const roles = String(coreConstant.ROLES.STUDENT);
        const userList = await PrismaClient.user.findMany({
          where: {
            roles: {
              contains: roles,
            },
          },
        });
        const userIdArray = userList.map((follower: any) => follower.userId);
        const response = await this.sendNotificationToAllUser(
          userIdArray,
          payload.title,
          payload.body,
          payload.redirect_url,
        );

        return response;
      }
    } catch (error) {
      processException(error);
    }
  }

  async getMyNotificationList(user: User, payload?: any) {
    try {
      const seen = payload?.seen;
      const paginate = await paginatioOptions(payload);
      const whereCondition = {
        userId: user.id,
      };
      const notificationList = await PrismaClient.notification.findMany({
        where: whereCondition,
        orderBy: {
          created_at: 'desc',
        },
        ...paginate,
      });
      if (Number(seen) === 1) {
        notificationList.map((notification) => {
          PrismaClient.notification.update({
            where: {
              id: notification.id,
            },
            data: {
              is_seen: 1,
            },
          });
        });
      }

      const data = {
        list: notificationList,
        meta: await paginationMetaData(
          notificationList,
          payload,
          whereCondition,
        ),
      };

      return successResponse('Notification list of user', data);
    } catch (error) {
      processException(error);
    }
  }

  async getNotificationDetails(user: User, id: number) {
    try {
      const notificationDetails = await PrismaClient.notification.findFirst({
        where: {
          id: id,
          userId: user.id,
        },
      });

      if (!notificationDetails) {
        return errorResponse('Invalid Request!');
      }

      if (notificationDetails.is_seen === SeenUnseenStatusConstant.UNSEEN) {
        await PrismaClient.notification.update({
          where: {
            id: notificationDetails.id,
          },
          data: {
            is_seen: SeenUnseenStatusConstant.SEEN,
          },
        });
      }

      return successResponse('Notification details', notificationDetails);
    } catch (error) {
      processException(error);
    }
  }
}
