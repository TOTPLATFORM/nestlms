import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { PaymentWithdrawRequestDto } from './instructor/dto/payment-withdraw-request.dto';
import {
  PrismaClient,
  addPhotoPrefix,
  adminSettingsValueBySlug,
  errorResponse,
  getAdminSettingsData,
  paginatioOptions,
  paginationMetaData,
  processException,
  successResponse,
} from 'src/shared/helpers/functions';
import { Decimal } from '@prisma/client/runtime';
import { WithdrawStatusUpdatedDto } from './admin/dto/withdraw-status-updated.dto';
import {
  WithdrawStatusConstant,
  coreConstant,
} from 'src/shared/helpers/coreConstant';
import { WithdrawAdminFeeDto } from './instructor/dto/withdraw-admin-fee.dto';

@Injectable()
export class EarningService {
  async paymentWithdrawRequest(user: User, payload: PaymentWithdrawRequestDto) {
    try {
      const walletDetails = await PrismaClient.wallet.findFirst({
        where: {
          userId: user.id,
        },
      });

      if (!walletDetails) {
        return errorResponse('Invalid wallet!');
      }

      const adminUserDetails = await PrismaClient.user.findFirst({
        where: {
          roles: {
            contains: '2',
          },
        },
      });

      const adminWallet = await PrismaClient.wallet.findFirst({
        where: {
          userId: adminUserDetails.id,
          is_admin_wallet: true,
        },
      });

      if (!adminWallet) {
        return errorResponse('Invalid Admin wallet!');
      }

      const withdrawPercentage = await adminSettingsValueBySlug(
        'withdraw_percentage',
      );

      let adminFeeAmount = 0;
      if (withdrawPercentage) {
        adminFeeAmount =
          (Number(withdrawPercentage) * payload.requested_amount) / 100;
      }

      const requestedAmountDecimal = new Decimal(payload.requested_amount);
      const adminFeeAmountDecimal = new Decimal(adminFeeAmount);
      const totalAmount = requestedAmountDecimal.add(adminFeeAmountDecimal);

      if (Number(walletDetails.balance) < Number(totalAmount)) {
        return errorResponse('You have no sufficent to withdraw!');
      }

      await PrismaClient.withdrawTransaction.create({
        data: {
          userId: user.id,
          walletId: walletDetails.id,
          requested_amount: payload.requested_amount,
          requested_payment_details: payload.requested_payment_details,
          admin_fee_amount: adminFeeAmountDecimal,
        },
      });
      await PrismaClient.wallet.updateMany({
        where: {
          userId: user.id,
        },
        data: {
          balance: {
            decrement: payload.requested_amount + adminFeeAmount,
          },
          total_pending_withdraw: {
            increment: payload.requested_amount,
          },
          admin_earning: {
            increment: adminFeeAmount,
          },
        },
      });

      await PrismaClient.wallet.update({
        where: {
          id: adminWallet.id,
        },
        data: {
          balance: {
            decrement: payload.requested_amount + adminFeeAmount,
          },
          total_pending_withdraw: {
            increment: payload.requested_amount,
          },
        },
      });

      return successResponse('Withdraw request is submitted successfully!');
    } catch (error) {
      processException(error);
    }
  }

  async getWithdrawListForInstructor(user: User, payload: any) {
    try {
      const paginate = await paginatioOptions(payload);
      const whereCondition = {
        userId: user.id,
      };
      const withdrawList = await PrismaClient.withdrawTransaction.findMany({
        where: whereCondition,
        orderBy: {
          created_at: 'desc',
        },
        ...paginate,
      });

      const paginationMeta = await paginationMetaData(
        'withdrawTransaction',
        payload,
        whereCondition,
      );
      const data = {
        list: withdrawList,
        meta: paginationMeta,
      };

      return successResponse('Withdraw list', data);
    } catch (error) {
      processException(error);
    }
  }

  async getWithdrawEarningForAdmin(payload: any) {
    try {
      const adminUserDetails = await PrismaClient.user.findFirst({
        where: {
          roles: {
            contains: '2',
          },
        },
      });

      const adminWallet = await PrismaClient.wallet.findFirst({
        where: {
          userId: adminUserDetails.id,
          is_admin_wallet: true,
        },
      });

      if (!adminWallet) {
        return errorResponse('Invalid Admin wallet!');
      }

      const paginate = await paginatioOptions(payload);

      const withdrawList = await PrismaClient.withdrawTransaction.findMany({
        include: {
          User: {
            select: {
              id: true,
              email: true,
              first_name: true,
              last_name: true,
              user_name: true,
              phone: true,
              photo: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
        ...paginate,
      });

      withdrawList.map((withdrawDetails) => {
        withdrawDetails.payment_accepted_document =
          withdrawDetails.payment_accepted_document
            ? addPhotoPrefix(withdrawDetails.payment_accepted_document)
            : withdrawDetails.payment_accepted_document;

        withdrawDetails.User.photo = withdrawDetails.User.photo
          ? addPhotoPrefix(withdrawDetails.User.photo)
          : withdrawDetails.User.photo;
      });

      const paginationMeta = await paginationMetaData(
        'withdrawTransaction',
        payload,
      );

      const data = {
        admin_wallet_details: adminWallet,
        list: withdrawList,
        meta: paginationMeta,
      };

      return successResponse('Withdraw list', data);
    } catch (error) {
      processException(error);
    }
  }

  async updateWithdrawRequest(payload: WithdrawStatusUpdatedDto, file: any) {
    try {
      const status = Number(payload.status);
      const withdraw_transaction_id = Number(payload.withdraw_transaction_id);
      const instructor_id = Number(payload.instructor_id);
      const withdrawTransaction =
        await PrismaClient.withdrawTransaction.findFirst({
          where: {
            id: withdraw_transaction_id,
          },
        });

      if (!withdrawTransaction) {
        return errorResponse('Invalid request!');
      }

      if (withdrawTransaction.status !== WithdrawStatusConstant.PENDING) {
        return errorResponse(
          'Invalid request, this status already has been changed in previous!',
        );
      }

      const adminUserDetails = await PrismaClient.user.findFirst({
        where: {
          roles: {
            contains: '2',
          },
        },
      });

      const adminWallet = await PrismaClient.wallet.findFirst({
        where: {
          userId: adminUserDetails.id,
          is_admin_wallet: true,
        },
      });

      if (!adminWallet) {
        return errorResponse('Invalid Admin wallet!');
      }

      const instructorWallet = await PrismaClient.wallet.findFirst({
        where: {
          userId: instructor_id,
        },
      });

      if (!instructorWallet) {
        return errorResponse('Invalid Instructor wallet!');
      }

      const requested_amount = withdrawTransaction.requested_amount;
      const admin_fee_amount = withdrawTransaction.admin_fee_amount;

      const totalAmount = requested_amount.add(admin_fee_amount);
      if (status === WithdrawStatusConstant.ACCEPTED) {
        await PrismaClient.wallet.update({
          where: {
            id: adminWallet.id,
          },
          data: {
            total_pending_withdraw: {
              decrement: requested_amount,
            },
            total_withdrawn_amount: {
              increment: requested_amount,
            },
            admin_earning: {
              increment: admin_fee_amount,
            },
          },
        });

        await PrismaClient.wallet.update({
          where: {
            id: instructorWallet.id,
          },
          data: {
            total_pending_withdraw: {
              decrement: requested_amount,
            },
            total_withdrawn_amount: {
              increment: requested_amount,
            },
          },
        });

        await PrismaClient.withdrawTransaction.update({
          where: {
            id: withdrawTransaction.id,
          },
          data: {
            status: WithdrawStatusConstant.ACCEPTED,
            payment_accepted_document: file ? `/${file.path}` : null,
          },
        });

        return successResponse('Withdraw request is accepted successfully!');
      }

      if (status === WithdrawStatusConstant.REJECTED) {
        await PrismaClient.wallet.update({
          where: {
            id: adminWallet.id,
          },
          data: {
            balance: {
              increment: totalAmount,
            },
            total_pending_withdraw: {
              decrement: requested_amount,
            },
          },
        });

        await PrismaClient.wallet.update({
          where: {
            id: instructorWallet.id,
          },
          data: {
            balance: {
              increment: totalAmount,
            },
            total_pending_withdraw: {
              decrement: requested_amount,
            },
            admin_earning: {
              decrement: admin_fee_amount,
            },
          },
        });

        await PrismaClient.withdrawTransaction.update({
          where: {
            id: withdrawTransaction.id,
          },
          data: {
            status: WithdrawStatusConstant.REJECTED,
          },
        });

        return successResponse('Withdraw request is rejected successfully!');
      }

      return errorResponse('Invalid Request');
    } catch (error) {
      processException(error);
    }
  }

  async getWithdrawAdminFee(user: User, payload: WithdrawAdminFeeDto) {
    try {
      const walletDetails = await PrismaClient.wallet.findFirst({
        where: {
          userId: user.id,
        },
      });

      if (!walletDetails) {
        return errorResponse('Invalid wallet!');
      }

      const withdrawPercentage = await adminSettingsValueBySlug(
        'withdraw_percentage',
      );

      let adminFeeAmount = 0;
      if (withdrawPercentage) {
        adminFeeAmount =
          (Number(withdrawPercentage) * payload.requested_amount) / 100;
      }
      const data = {
        admin_fee: adminFeeAmount,
      };
      return successResponse('Withdraw admin fee', data);
    } catch (error) {
      processException(error);
    }
  }
  async getInstructorSelfEarningDetails(user: User, payload: any) {
    try {
      const walletDetails = await PrismaClient.wallet.findFirst({
        where: {
          userId: user.id,
        },
      });

      if (!walletDetails) {
        return errorResponse('Wallet Not Found!');
      }

      const paginate = await paginatioOptions(payload);
      const whereCondition = {
        userId: user.id,
      };
      const withdrawList = await PrismaClient.withdrawTransaction.findMany({
        where: whereCondition,
        orderBy: {
          created_at: 'desc',
        },
        ...paginate,
      });

      withdrawList.map((withdraw) => {
        withdraw.payment_accepted_document = withdraw.payment_accepted_document
          ? addPhotoPrefix(withdraw.payment_accepted_document)
          : withdraw.payment_accepted_document;
      });
      const data = {
        wallet_details: walletDetails,
        withdraw_list: withdrawList,
        meta: await paginationMetaData(
          'withdrawTransaction',
          payload,
          whereCondition,
        ),
      };

      return successResponse('Instructor wallet details', data);
    } catch (error) {
      processException(error);
    }
  }

  async getInstructorWalletList(payload: any) {
    try {
      const paginate = await paginatioOptions(payload);

      const roles = String(coreConstant.ROLES.INSTRUCTOR);

      const whereCondition = {
        roles: {
          contains: roles,
        },
      };

      const instructorList = await PrismaClient.user.findMany({
        where: {
          roles: {
            contains: roles,
          },
        },
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          Wallet: true,
        },
      });

      const data = {
        instructor_list: instructorList,
        meta: await paginationMetaData('user', payload, whereCondition),
      };

      return successResponse('Instructor list with wallet', data);
    } catch (error) {
      processException(error);
    }
  }
}
