import { Injectable } from '@nestjs/common';
import { AddNewKycDto } from './admin/dto/add-new-kyc.dto';
import {
  PrismaClient,
  addPhotoPrefix,
  errorResponse,
  paginatioOptions,
  paginationMetaData,
  processException,
  successResponse,
} from 'src/shared/helpers/functions';
import { User } from '@prisma/client';
import { coreConstant } from 'src/shared/helpers/coreConstant';
import { SubmitKycDto } from './user/dto/submit-kyc.dto';
import { VerifyUserKycDto } from './admin/dto/verify-user-kyc.dto';

@Injectable()
export class KycService {
  constructor() {}

  async addNewKyc(payload: AddNewKycDto) {
    try {
      const kycDetails = await PrismaClient.kycVerificationList.create({
        data: {
          name: payload.name,
          description: payload.description,
          status: payload.status,
          is_file_required: payload.is_file_required,
          is_text_required: payload.is_text_required,
          verification_for: coreConstant.ROLES.INSTRUCTOR,
        },
      });
      return successResponse('Kyc is added successfully!', kycDetails);
    } catch (error) {
      processException(error);
    }
  }

  async updateKyc(id: number, payload: AddNewKycDto) {
    try {
      const kycDetails = await PrismaClient.kycVerificationList.findFirst({
        where: {
          id: id,
        },
      });

      if (!kycDetails) {
        return errorResponse('Invalid Request!');
      }
      const updateKyc = await PrismaClient.kycVerificationList.update({
        where: {
          id: id,
        },
        data: {
          name: payload.name,
          description: payload.description,
          status: payload.status,
          is_file_required: payload.is_file_required,
          is_text_required: payload.is_text_required,
          verification_for: coreConstant.ROLES.INSTRUCTOR,
        },
      });

      return successResponse('Kyc is updated successfully!', updateKyc);
    } catch (error) {
      processException(error);
    }
  }

  async getKycListAdmin(payload: any) {
    try {
      const paginate = await paginatioOptions(payload);
      const whereCondition = payload.search
        ? {
            OR: [
              {
                name: {
                  contains: payload.search,
                },
              },
              {
                description: {
                  contains: payload.search,
                },
              },
            ],
          }
        : {};

      const kycList = await PrismaClient.kycVerificationList.findMany({
        where: whereCondition,
        ...paginate,
      });

      const data = {
        list: kycList,
        meta: await paginationMetaData(
          'kycVerificationList',
          payload,
          whereCondition,
        ),
      };

      return successResponse('Kyc list for admin', data);
    } catch (error) {
      processException(error);
    }
  }

  async getKycDetails(id: number) {
    try {
      const kycDetails = await PrismaClient.kycVerificationList.findFirst({
        where: {
          id: id,
        },
      });
      if (!kycDetails) {
        return errorResponse('Invalid Request!');
      }

      return successResponse('Kyc details', kycDetails);
    } catch (error) {
      processException(error);
    }
  }

  async deleteKyc(id: number) {
    try {
      const kycDetails = await PrismaClient.kycVerificationList.findFirst({
        where: {
          id: id,
        },
      });
      if (!kycDetails) {
        return errorResponse('Invalid Request!');
      }

      await PrismaClient.kycVerificationList.delete({
        where: {
          id: kycDetails.id,
        },
      });

      return successResponse('Kyc is deleted successfully!');
    } catch (error) {
      processException(error);
    }
  }

  async checkKycValidation(user: User) {
    try {
      const kycVerificationList =
        await PrismaClient.kycVerificationList.findMany({
          where: {
            status: coreConstant.ACTIVE,
          },
        });
      if (kycVerificationList.length > 0) {
        const userKycVerifiedList =
          await PrismaClient.userKycVerificationList.findMany({
            where: {
              userId: user.id,
              status: coreConstant.STATUS_ACTIVE,
            },
          });

        var errorMessage = [];
        kycVerificationList.forEach((kycDetails) => {
          const exists = userKycVerifiedList.some(
            (userKycDetails) =>
              userKycDetails.kycVerificationListId === kycDetails.id,
          );
          var tempMessage = {};
          if (!exists) {
            tempMessage['message'] = 'please verify your ' + kycDetails.name;
            errorMessage.push(tempMessage);
          }
        });

        if (errorMessage.length > 0) {
          return errorResponse('Kyc verification is incomplete!', errorMessage);
        }
      }
      return successResponse('Kyc verification is complete!');
    } catch (error) {
      processException(error);
    }
  }

  async getUserKycVerificationList(user: User) {
    try {
      const kycList = await PrismaClient.kycVerificationList.findMany({
        where: {
          status: coreConstant.STATUS_ACTIVE,
        },
        include: {
          UserKycVerificationList: {
            where: {
              userId: user.id,
            },
          },
        },
      });

      // Extracting necessary fields and adding verified status
      const formattedKycList = kycList.map((kyc) => {
        const userKycDetails =
          kyc.UserKycVerificationList[kyc.UserKycVerificationList.length - 1]; // Assuming there's only one entry per user
        return {
          id: kyc.id,
          name: kyc.name,
          description: kyc.description,
          verified: userKycDetails
            ? userKycDetails.status === coreConstant.IS_VERIFIED
            : false,
          status: userKycDetails ? userKycDetails.status : null,
          submitted: userKycDetails ? true : false,

          is_text_required: kyc.is_text_required,
          is_file_required: kyc.is_file_required,
          verification_for: kyc.verification_for,
          created_at: kyc.created_at,
          updated_at: kyc.updated_at,
        };
      });

      return successResponse('Kyc list', formattedKycList);
    } catch (error) {
      processException(error);
    }
  }

  async submitKyc(user: User, payload: SubmitKycDto) {
    try {
      const kycDetails = await PrismaClient.kycVerificationList.findFirst({
        where: {
          id: payload.kyc_verification_id,
        },
      });
      if (!kycDetails) {
        return errorResponse('Invalid Request!');
      }
      if (kycDetails.is_text_required && !payload.text) {
        return errorResponse('Please, enter your details!');
      }

      if (kycDetails.is_file_required && !payload.file_id) {
        return errorResponse('Please, enter your file!');
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

      const userKycDetails =
        await PrismaClient.userKycVerificationList.findFirst({
          where: {
            userId: user.id,
            kycVerificationListId: payload.kyc_verification_id,
            status: coreConstant.STATUS_PENDING,
          },
        });

      if (userKycDetails) {
        if (userKycDetails.status == coreConstant.IS_NOT_VERIFIED) {
          return errorResponse(
            'You can not update, your ' +
              kycDetails.name +
              ' is not verified yet',
          );
        }
        if (userKycDetails.status == coreConstant.IS_VERIFIED) {
          return errorResponse(
            'You can not update, your ' +
              kycDetails.name +
              ' is already verified!',
          );
        }

        await PrismaClient.userKycVerificationList.update({
          where: {
            id: userKycDetails.id,
          },
          data: {
            userId: user.id,
            text: payload.text,
            file_url: file_url ? file_url : userKycDetails.file_url,
            kycVerificationListId: kycDetails.id,
          },
        });
        return successResponse(
          'Your ' + kycDetails.name + ' is updated successfully!',
        );
      } else {
        await PrismaClient.userKycVerificationList.create({
          data: {
            userId: user.id,
            text: payload.text,
            file_url: file_url,
            kycVerificationListId: kycDetails.id,
          },
        });
        return successResponse(
          'Your ' + kycDetails.name + ' is submitted successfully!',
        );
      }
    } catch (error) {
      processException(error);
    }
  }
  async getUserKycList(payload: any) {
    try {
      const conditions = [
        ...(payload.status ? [{ status: Number(payload.status) }] : []),
        ...(payload.kyc_verification_id
          ? [{ kycVerificationListId: Number(payload.kyc_verification_id) }]
          : []),
      ];

      const whereCondition = conditions.length > 0 ? { OR: conditions } : {};

      const paginate = await paginatioOptions(payload);
      const userKycList = await PrismaClient.userKycVerificationList.findMany({
        where: whereCondition,
        include: {
          User: true,
          KycVerificationList: true,
        },
        orderBy: {
          created_at: 'desc',
        },
        ...paginate,
      });
      let userKycListWithFilePrefix = [];
      if (userKycList.length > 0) {
        userKycListWithFilePrefix = userKycList.map((userKyc) => {
          return {
            ...userKyc,
            file_url: addPhotoPrefix(userKyc.file_url),
          };
        });
      }

      const data = {
        list: userKycListWithFilePrefix,
        meta: await paginationMetaData(
          'userKycVerificationList',
          payload,
          whereCondition,
        ),
      };
      return successResponse('User kyc list', data);
    } catch (error) {
      processException(error);
    }
  }
  async verifyUserKyc(payload: VerifyUserKycDto) {
    try {
      const userKycDetails =
        await PrismaClient.userKycVerificationList.findFirst({
          where: {
            id: payload.user_kyc_id,
          },
        });

      if (!userKycDetails) {
        return errorResponse('Invalid Request!');
      }
      await PrismaClient.userKycVerificationList.update({
        where: {
          id: userKycDetails.id,
        },
        data: {
          status: payload.status,
        },
      });

      return successResponse('Kyc status is changed successfully!');
    } catch (error) {
      processException(error);
    }
  }
}
