import { Injectable } from '@nestjs/common';

import {
  CheckEmailNickName,
  PrismaClient,
  addPhotoPrefix,
  errorResponse,
  hashedPassword,
  paginatioOptions,
  paginationMetaData,
  processException,
  removePasswordFromUserList,
  successResponse,
} from 'src/shared/helpers/functions';
import { CreateNewUserDto } from './dto/create-new-user.dto';
import { coreConstant } from 'src/shared/helpers/coreConstant';
import {
  AdminRolesArray,
  UserRolesArray,
} from 'src/shared/constants/array.constants';
import { CreateNewAdminDto } from './dto/create-new-admin.dto';
import { ResponseModel } from 'src/shared/models/response.model';
import { User } from '@prisma/client';

@Injectable()
export class AdminService {
  async createNewUser(payload: CreateNewUserDto) {
    try {
      const checkEmailNickName = await CheckEmailNickName(
        payload.email,
        payload.nick_name,
      );
      if (!checkEmailNickName.success) {
        return checkEmailNickName;
      }

      let file_url = null;
      if (payload.file_id) {
        const fileDetails = await PrismaClient.myUploads.findFirst({
          where: {
            id: payload.file_id,
          },
        });

        if (!fileDetails) {
          return errorResponse('Invalid image request!');
        }

        file_url = fileDetails.file_path;
      }

      const hashPassword = await hashedPassword(payload.password);

      const rolesToCheck =
        payload.roles.split(',').map((role) => Number(role)) || [];

      const resultOfRole = rolesToCheck.every((role) =>
        UserRolesArray.includes(role),
      );
      if (!resultOfRole) {
        return errorResponse('Invalid Roles!');
      }

      const newUserDetails = await PrismaClient.user.create({
        data: {
          first_name: payload.first_name,
          last_name: payload.last_name,
          user_name: payload.nick_name,
          phone: payload.phone,
          photo: file_url,
          country: payload.country,
          birth_date: payload.birth_date,
          roles: payload.roles,
          status: payload.status,
          gender: payload.gender,
          email: payload.email,
          password: hashPassword,
        },
      });

      return successResponse(
        'New user is created successfully!',
        newUserDetails,
      );
    } catch (error) {
      processException(error);
    }
  }

  async createNewAdmin(payload: CreateNewAdminDto) {
    try {
      const checkEmailNickName = await CheckEmailNickName(
        payload.email,
        payload.nick_name,
      );
      if (!checkEmailNickName.success) {
        return checkEmailNickName;
      }

      let file_url = null;
      if (payload.file_id) {
        const fileDetails = await PrismaClient.myUploads.findFirst({
          where: {
            id: payload.file_id,
          },
        });

        if (!fileDetails) {
          return errorResponse('Invalid image request!');
        }

        file_url = fileDetails.file_path;
      }

      const hashPassword = await hashedPassword(payload.password);

      const rolesToCheck =
        payload.roles.split(',').map((role) => Number(role)) || [];

      const resultOfRole = rolesToCheck.every((role) =>
        AdminRolesArray.includes(role),
      );
      if (!resultOfRole) {
        return errorResponse('Invalid Roles!');
      }

      const newUserDetails = await PrismaClient.user.create({
        data: {
          first_name: payload.first_name,
          last_name: payload.last_name,
          user_name: payload.nick_name,
          phone: payload.phone,
          photo: file_url,
          country: payload.country,
          birth_date: payload.birth_date,
          roles: payload.roles,
          status: payload.status,
          gender: payload.gender,
          email: payload.email,
          password: hashPassword,
        },
      });

      return successResponse(
        'New Admin is created successfully!',
        newUserDetails,
      );
    } catch (error) {
      processException(error);
    }
  }

  async getStudentList(payload: any) {
    try {
      const roles = String(coreConstant.ROLES.STUDENT);
      const responseOfUserList = await this.listOfUserDefineRoleWithQuery(
        roles,
        payload,
      );

      if (!responseOfUserList.success) {
        return responseOfUserList;
      }

      const responseData: any = responseOfUserList.data;

      const data = {
        total_student: responseData.total,
        total_active_student: responseData.total_active,
        totalInActiveStudent: responseData.total_inactive,
        list: responseData.list,
        meta: responseData.meta,
      };

      return successResponse('Student list!', data);
    } catch (error) {
      processException(error);
    }
  }

  async getInstructorList(payload: any) {
    try {
      const roles = String(coreConstant.ROLES.INSTRUCTOR);
      const responseOfUserList = await this.listOfUserDefineRoleWithQuery(
        roles,
        payload,
      );

      if (!responseOfUserList.success) {
        return responseOfUserList;
      }

      const responseData: any = responseOfUserList.data;

      const data = {
        total_instructor: responseData.total,
        total_active_instructor: responseData.total_active,
        total_inactive_instructor: responseData.total_inactive,
        list: responseData.list,
        meta: responseData.meta,
      };

      return successResponse('Instructor list!', data);
    } catch (error) {
      processException(error);
    }
  }
  async getInstructorListNoPagination() {
    try {
      const roles = String(coreConstant.ROLES.INSTRUCTOR);
      const instructors = await PrismaClient.user.findMany({
        where: {
          roles: {
            contains: roles,
          },
        },
      });
      if (!instructors) {
        return errorResponse('Instructor not found!');
      }
      const userListWithoutPassword = await removePasswordFromUserList(
        instructors,
      );

      return successResponse('Instructor list!', userListWithoutPassword);
    } catch (error) {
      processException(error);
    }
  }
  async getAdminDashboardInfo(): Promise<ResponseModel> {
    try {
      const totalUsers = await PrismaClient.user.count();
      const totalCourses = await PrismaClient.course.count();
      const totalEnrollments = await PrismaClient.courseEnrollment.count();
      const totalInstructors = await PrismaClient.user.count({
        where: {
          roles: {
            contains: String(coreConstant.ROLES.INSTRUCTOR),
          },
        },
      });
      const adminWallet = await PrismaClient.wallet.findFirst({
        where: {
          is_admin_wallet: true,
        },
      });
      const totalStudents = await PrismaClient.user.count({
        where: {
          roles: {
            contains: String(coreConstant.ROLES.STUDENT),
          },
        },
      });

      const latestCourses = await PrismaClient.course.findMany({
        take: 5,
        orderBy: {
          created_at: 'desc',
        },
      });

      const formattedLatestCourses = latestCourses.map((course) => ({
        ...course,
        thumbnail_link: addPhotoPrefix(course.thumbnail_link),
      }));

      const withdrawTransactions =
        await PrismaClient.withdrawTransaction.findMany({
          where: {
            created_at: {
              gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
            },
          },
          orderBy: {
            created_at: 'asc',
          },
        });

      const withdrawTransactionschartData = withdrawTransactions.reduce(
        (data, transaction) => {
          const date = transaction.created_at.toISOString().split('T')[0];

          data.dates.push(date);
          data.totalRequestedAmount.push(transaction.requested_amount);
          data.totalAdminFeeAmount.push(transaction.admin_fee_amount);

          return data;
        },
        { dates: [], totalRequestedAmount: [], totalAdminFeeAmount: [] },
      );

      const aggregatedChartData = withdrawTransactionschartData.dates.reduce(
        (result, date, index) => {
          if (result.lastDate === date) {
            result.totalRequestedAmount[result.lastIndex] +=
              withdrawTransactionschartData.totalRequestedAmount[index];
            result.totalAdminFeeAmount[result.lastIndex] +=
              withdrawTransactionschartData.totalAdminFeeAmount[index];
          } else {
            result.dates.push(date);
            result.totalRequestedAmount.push(
              withdrawTransactionschartData.totalRequestedAmount[index],
            );
            result.totalAdminFeeAmount.push(
              withdrawTransactionschartData.totalAdminFeeAmount[index],
            );
            result.lastDate = date;
            result.lastIndex = result.dates.length - 1;
          }

          return result;
        },
        {
          dates: [],
          totalRequestedAmount: [],
          totalAdminFeeAmount: [],
          lastDate: '',
          lastIndex: 0,
        },
      );

      const userCounts = await PrismaClient.user.aggregate({
        _count: {
          email_verified: true,
          phone_verified: true,
        },
        _sum: {
          status: true,
        },
      });

      const userDataChartData = {
        labels: ['Email Verified', 'Phone Verified', 'Active Users'],
        datasets: [
          {
            name: 'Counts',
            values: [
              userCounts._count?.email_verified || 0,
              userCounts._count?.phone_verified || 0,
              userCounts._sum?.status || 0,
            ],
          },
        ],
      };

      const chartData = {
        labels: aggregatedChartData.dates,
        datasets: [
          {
            name: 'Total Requested Amount',
            values: aggregatedChartData.totalRequestedAmount,
          },
          {
            name: 'Total Admin Fee Amount',
            values: aggregatedChartData.totalAdminFeeAmount,
          },
        ],
      };
      const currentDate = new Date();
      const last12MonthsData = [];

      for (let i = 11; i >= 0; i--) {
        const startOfMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - i,
          1,
        );
        const endOfMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - i + 1,
          0,
        );

        const newUsersThisMonth = await PrismaClient.user.count({
          where: {
            created_at: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
        });

        last12MonthsData.push(newUsersThisMonth);
      }

      const newUserDataChartData = {
        labels: Array.from({ length: 12 }, (_, i) => {
          const monthDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() - i,
            1,
          );
          return monthDate.toLocaleString('default', { month: 'short' });
        }).reverse(),
        datasets: [
          {
            name: 'New Users',
            values: last12MonthsData.reverse(),
          },
        ],
      };
      const totalTransactions = await PrismaClient.cartEnrollment.aggregate({
        _sum: {
          payable_price: true,
        },
      });
      const data = {
        totalUsers,
        totalCourses,
        totalEnrollments,
        totalInstructors,
        latestCourses: formattedLatestCourses,
        totalStudents,
        balance: adminWallet?.balance || 0,
        admin_earning: adminWallet?.admin_earning || 0,
        total_pending_withdraw: adminWallet?.total_pending_withdraw || 0,
        total_withdrawn_amount: adminWallet?.total_withdrawn_amount || 0,
        withdrawChartData: chartData,
        userDataChartData,
        newUserDataChartData,
        totalTransactions: totalTransactions._sum.payable_price,
      };

      return successResponse('Admin Dashboard Info', data);
    } catch (error) {
      console.log(error, 'error');
      processException(error);
    }
  }

  async getAdminList(payload: any) {
    try {
      const roles =
        String(coreConstant.ROLES.ADMIN) +
        ',' +
        String(coreConstant.ROLES.SUPER_ADMIN);
      const responseOfUserList = await this.listOfUserDefineRoleWithQuery(
        roles,
        payload,
      );

      if (!responseOfUserList.success) {
        return responseOfUserList;
      }
      const responseData: any = responseOfUserList.data;

      const data = {
        total_admin: responseData.total,
        total_active_admin: responseData.total_active,
        total_inactive_admin: responseData.total_inactive,
        list: responseData.list,
        meta: responseData.meta,
      };

      return successResponse('Admin list!', data);
    } catch (error) {
      processException(error);
    }
  }

  async listOfUserDefineRoleWithQuery(roles: string, payload) {
    try {
      const paginate = await paginatioOptions(payload);

      const whereCondition = {
        roles: {
          contains: roles,
        },
        ...(payload.search
          ? {
              OR: [
                {
                  first_name: {
                    contains: payload.search,
                  },
                },
                {
                  last_name: {
                    contains: payload.search,
                  },
                },
                {
                  email: {
                    contains: payload.search,
                  },
                },
                {
                  user_name: {
                    contains: payload.search,
                  },
                },
                {
                  phone: {
                    contains: payload.search,
                  },
                },
              ],
            }
          : {}),
      };

      const userList = await PrismaClient.user.findMany({
        where: whereCondition,
        ...paginate,
      });
      const userListWithoutPassword = await removePasswordFromUserList(
        userList,
      );

      const total = await PrismaClient.user.count({
        where: {
          roles: {
            contains: roles,
          },
        },
      });

      const totalActive = await PrismaClient.user.count({
        where: {
          roles: {
            contains: roles,
          },
          status: coreConstant.STATUS_ACTIVE,
        },
      });
      const totalInActive = await PrismaClient.user.count({
        where: {
          roles: {
            contains: roles,
          },
          status: coreConstant.STATUS_INACTIVE,
        },
      });
      const data = {
        total: total,
        total_active: totalActive,
        total_inactive: totalInActive,
        list: userListWithoutPassword,
        meta: await paginationMetaData('user', payload, whereCondition),
      };

      return successResponse('User list!', data);
    } catch (error) {
      processException(error);
    }
  }
}
