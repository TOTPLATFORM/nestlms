import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { MakeFollowerDto } from './user/dto/make-follower.dto';
import {
  PrismaClient,
  checkRoleIsValid,
  errorResponse,
  paginatioOptions,
  paginationMetaData,
  processException,
  successResponse,
} from 'src/shared/helpers/functions';
import {
  FollowingStatusConstant,
  coreConstant,
} from 'src/shared/helpers/coreConstant';

@Injectable()
export class FollowerService {
  async makeFollower(user: User, payload: MakeFollowerDto) {
    try {
      const existsInstructor = await PrismaClient.user.findFirst({
        where: {
          id: payload.instructor_id,
        },
      });

      if (!existsInstructor) {
        return errorResponse('Invalid Request!');
      }

      const isInstructor = await checkRoleIsValid(
        existsInstructor.roles,
        coreConstant.ROLES.INSTRUCTOR,
      );

      if (!isInstructor) {
        return errorResponse('You can follow only instructor!');
      }
      if (user.id === payload.instructor_id) {
        return errorResponse('You can not follow your self!');
      }

      const existsInstructorFollowingDetaials =
        await PrismaClient.instructorFollower.findFirst({
          where: {
            userId: user.id,
            instructorId: existsInstructor.id,
          },
        });

      if (existsInstructorFollowingDetaials) {
        await PrismaClient.instructorFollower.update({
          where: {
            id: existsInstructorFollowingDetaials.id,
          },
          data: {
            following_status:
              existsInstructorFollowingDetaials.following_status ===
              FollowingStatusConstant.FOLLOW
                ? FollowingStatusConstant.UNFOLLOW
                : FollowingStatusConstant.FOLLOW,
          },
        });
      } else {
        await PrismaClient.instructorFollower.create({
          data: {
            userId: user.id,
            instructorId: payload.instructor_id,
            following_status: FollowingStatusConstant.FOLLOW,
          },
        });
      }

      return successResponse('Following Status is changed successfully!');
    } catch (error) {
      processException(error);
    }
  }

  async getInstructorFollowerList(id: number, payload?: any) {
    try {
      const paginate = await paginatioOptions(payload);

      const followerList = await PrismaClient.instructorFollower.findMany({
        where: {
          instructorId: id,
        },
        include: {
          Instructor: true,
          Student: true,
        },
        orderBy: {
          created_at: 'desc',
        },
        ...paginate,
      });

      const nonsensitiveData = followerList.map((follow) => {
        delete follow.Instructor.password;
        delete follow.Student.password;
        return follow;
      });
      const data = {
        list: nonsensitiveData,
        meta: await paginationMetaData(followerList, payload),
      };
      return successResponse('Follower list', data);
    } catch (error) {
      processException(error);
    }
  }
}
