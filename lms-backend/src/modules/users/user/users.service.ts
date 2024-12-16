import { Injectable, Request } from '@nestjs/common';
import {
  PrismaClient,
  addDayWithCurrentDate,
  addPhotoPrefix,
  createUniqueCode,
  errorResponse,
  generateMailKey,
  hashedPassword,
  paginatioOptions,
  paginationMetaData,
  processException,
  successResponse,
  userRolesPermissionObject,
} from 'src/shared/helpers/functions';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponse } from './dto/user-response';
import { User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  DefaultPaginationMetaData,
  coreConstant,
} from 'src/shared/helpers/coreConstant';
import { UserVerificationCodeService } from '../../verification_code/user-verify-code.service';
import { ResponseModel } from 'src/shared/models/response.model';
import { use } from 'passport';
import { UpdateUserDto } from './dto/update-user.dto';
import { isNumber } from 'class-validator';
import { User as UserEntity } from '../entities/user.entity';
import { randomUUID } from 'crypto';
import { ChangePasswordDto } from '../../auth/dto/change-password.dto';
import { compare } from 'bcrypt';
import { MailerService } from 'src/shared/mail/mailer.service';

// export type User = any;
@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userCodeService: UserVerificationCodeService,
    private readonly mailService: MailerService,
  ) {}
  async getInstructirDashboardInfo(user: User): Promise<ResponseModel> {
    try {
      const instructor_wallet = await PrismaClient.wallet.findFirst({
        where: {
          userId: user.id,
        },
      });
      const userInfo = await PrismaClient.user.findUnique({
        where: {
          id: user.id,
        },
        include: {
          Review: true,
          Course: {
            orderBy: {
              created_at: 'desc',
            },
            include: {
              CourseEnrollment: true,
            },
          },
        },
      });

      const enrolledStudents = await PrismaClient.courseEnrollment.findMany({
        where: {
          course: {
            instructorId: user.id,
          },
        },
        include: {
          user: true,
        },
      });

      const uniqueUserIds = new Set<number>();
      const formattedStudents = enrolledStudents.reduce(
        (result, enrollment) => {
          const { id } = enrollment.user;

          if (!uniqueUserIds.has(id)) {
            uniqueUserIds.add(id);

            const { password, ...userWithoutPassword } = enrollment.user;

            const formattedStudent = {
              user: {
                ...userWithoutPassword,
                photo: addPhotoPrefix(enrollment.user.photo),
              },
              created_at: enrollment.created_at,
            };

            result.push(formattedStudent);
          }

          return result;
        },
        [],
      );

      let review_count = userInfo.Review.length;
      let data = {};

      let last_courses = [];
      userInfo?.Course?.slice(0, 5)?.forEach((item) => {
        let local = { ...item };
        local.thumbnail_link = addPhotoPrefix(local.thumbnail_link);
        last_courses.push(local);
      });
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      const enrollments = await PrismaClient.courseEnrollment.findMany({
        where: {
          course: {
            instructorId: user.id,
          },
          created_at: {
            gte: startDate,
          },
        },
        orderBy: {
          created_at: 'asc',
        },
      });

      const enrollmentData = enrollments.reduce((data, enrollment) => {
        const date = enrollment.created_at.toISOString().split('T')[0];

        if (!data[date]) {
          data[date] = 1;
        } else {
          data[date]++;
        }

        return data;
      }, {});

      const dates = Object.keys(enrollmentData).sort();
      const counts = dates.map((date) => enrollmentData[date]);

      const enrollmentChart = {
        labels: dates,
        datasets: [
          {
            name: 'Enrollments',
            values: counts,
          },
        ],
      };
      data['review_count'] = review_count;
      data['reviews'] = userInfo.Review;
      data['students'] = formattedStudents.length;
      data['students_data'] = formattedStudents.slice(0, 5);
      data['courses'] = userInfo.Course.length;
      data['last_courses'] = last_courses;
      data['instructor_wallet'] = instructor_wallet ? instructor_wallet : null;
      data['enrollmentChart'] = enrollmentChart;
      return successResponse('Dashboard Info', data);
    } catch (error) {
      console.log(error, 'error');
      processException(error);
    }
  }

  async getProfile(user: UserEntity): Promise<ResponseModel> {
    if (!user) {
      return errorResponse('Please login inorder to get profile data');
    }
    const userProfile = await PrismaClient.user.findUnique({
      where: { id: user.id },
      include: {
        Course: {
          where: {
            status: coreConstant.ACTIVE,
          },
        },
      },
    });
    delete userProfile.password;
    if (userProfile.photo) {
      userProfile.photo = addPhotoPrefix(userProfile.photo);
    }

    const data = {
      user: userProfile,
      user_roles: await userRolesPermissionObject(userProfile.roles),
    };

    return successResponse('Response successfully', data);
  }
  // unique check email and nick name
  async checkEmailNickName(email: string, nickName: string) {
    const checkUniqueEmail = await this.prisma.user.findUnique({
      where: { email: email },
    });
    if (checkUniqueEmail) {
      return errorResponse('Email already exists', []);
    }
    const checkUniqueNickName = await this.prisma.user.findUnique({
      where: { user_name: nickName },
    });
    if (checkUniqueNickName) {
      return errorResponse('Nickname already exists', []);
    }
    return successResponse('success', []);
  }

  /** Creates a new user */
  async create(payload: CreateUserDto): Promise<any> {
    try {
      const checkUniqueEmail = await this.checkEmailNickName(
        payload.email,
        payload.user_name,
      );
      if (checkUniqueEmail.success == false) {
        return checkUniqueEmail;
      }
      const hashPassword = await hashedPassword(coreConstant.COMMON_PASSWORD);
      const lowerCaseEmail = payload.email.toLowerCase();
      const data = {
        ...payload,
        email: lowerCaseEmail,
        password: hashPassword,
      };
      const user = await this.createNewUser(data);
      if (user.success == true) {
        return successResponse('New user created successful', user.data);
      } else {
        return user;
      }
    } catch (err) {
      console.log(err);
    }
    return errorResponse('Something went wrong', []);
  }

  // create new user process
  async createNewUser(payload: any, sendMail = true) {
    try {
      const user = await this.prisma.user.create({
        data: {
          ...payload,
          unique_code: createUniqueCode(),
        },
      });
      if (user && sendMail) {
        const mailKey = generateMailKey();
        const codeData = {
          user_id: user.id,
          code: mailKey,
          type: coreConstant.VERIFICATION_TYPE_EMAIL,
        };
        await this.userCodeService.createUserCode(codeData);

        const mailData = {
          verification_code: mailKey,
        };
        await this.userCodeService.createUserCode(codeData);

        const mailResponse = await this.mailService.sendMail(
          user.email,
          'New Registration',
          'otp-email.hbs',
          {
            name: user.first_name + ' ' + user.last_name,
            verification_code: mailKey,
          },
        );

        if (mailResponse.success) {
          return successResponse(
            'Registration successful, please, check your mail to verify your mail',
            user,
          );
        }

        return successResponse('New user created successfully', user);
      }
      return successResponse('New user created successfully', user);
    } catch (err) {
      console.log(err);
    }
    return errorResponse('Something went wrong', []);
  }

  // get user by email
  async findByEmail(email: string): Promise<User> {
    const lowerCaseEmail = email.toLowerCase();

    return this.prisma.user.findUnique({ where: { email: lowerCaseEmail } });
  }

  // get user by id
  async findById(id: number): Promise<User> {
    return this.prisma.user.findUnique({ where: { id: id } });
  }

  // get user list
  async userList(payload: any) {
    try {
      const search = payload.search ? payload.search : '';
      const paginate = await paginatioOptions(payload);
      const whereCondition = {
        OR: [
          {
            email: {
              contains: search,
            },
          },
          {
            first_name: {
              contains: search,
            },
          },
          {
            last_name: {
              contains: search,
            },
          },
          {
            user_name: {
              contains: search,
            },
          },
        ],
      };

      const userList = await this.prisma.user.findMany({
        where: whereCondition,
        orderBy: {
          created_at: 'desc',
        },
        ...paginate,
      });

      const userListWithoutPassword = userList.map((user) => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });

      const paginationMeta =
        userListWithoutPassword.length > 0
          ? await paginationMetaData('user', payload, whereCondition)
          : DefaultPaginationMetaData;

      const data = {
        list: userListWithoutPassword,
        meta: paginationMeta,
      };
      return successResponse('User List', data);
    } catch (error) {
      processException(error);
    }
  }

  async statusChangeUser(payload: { user_id: number; status_type: number }) {
    try {
      const userDetails = await this.prisma.user.findFirst({
        where: {
          id: payload.user_id,
        },
      });
      if (!userDetails) {
        return errorResponse('Invalid request!');
      }

      if (payload.status_type === 2 && !userDetails.email) {
        return errorResponse('Email is not provided by user!');
      }

      if (payload.status_type === 3 && !userDetails.phone) {
        return errorResponse('Phone number is not provided by user!');
      }

      const data =
        payload.status_type == 1
          ? {
              status:
                userDetails.status == coreConstant.ACTIVE
                  ? coreConstant.INACTIVE
                  : coreConstant.ACTIVE,
            }
          : payload.status_type == 2
          ? {
              email_verified:
                userDetails.email_verified == coreConstant.ACTIVE
                  ? coreConstant.INACTIVE
                  : coreConstant.ACTIVE,
            }
          : payload.status_type == 3
          ? {
              phone_verified:
                userDetails.phone_verified == coreConstant.ACTIVE
                  ? coreConstant.INACTIVE
                  : coreConstant.ACTIVE,
            }
          : {};
      await this.prisma.user.update({
        where: {
          id: userDetails.id,
        },
        data: data,
      });

      return successResponse('Status is changed successfully!');
    } catch (error) {
      processException(error);
    }
  }
  async createUserCode(payload: any) {
    try {
      const checkExists = await this.prisma.userVerificationCodes.findMany({
        where: {
          user_id: payload.user_id,
          type: payload.type,
        },
      });
      if (checkExists.length > 0) {
        await this.prisma.userVerificationCodes.deleteMany({
          where: {
            user_id: payload.user_id,
            type: payload.type,
          },
        });
      }
      const createData = await this.prisma.userVerificationCodes.create({
        data: {
          user_id: payload.user_id,
          code: payload.code.toString(),
          type: payload.type,
          status: coreConstant.STATUS_ACTIVE,
          expired_at: addDayWithCurrentDate(5),
        },
      });
      return successResponse('Success', createData);
    } catch (err) {
      return errorResponse('Something went wrong');
    }
  }
  // send forgot password email
  async sendForgotPasswordEmailProcess(email: string) {
    try {
      const user = await this.findByEmail(email);
      if (user) {
        const mailKey = generateMailKey();
        const codeData = {
          user_id: user.id,
          code: mailKey,
          type: coreConstant.VERIFICATION_TYPE_EMAIL,
        };

        await this.createUserCode(codeData);

        const mailData = {
          verification_code: mailKey,
        };

        const mailResponse = await this.mailService.sendMail(
          user.email,
          'Password Reset',
          'reset-password.hbs',
          {
            name: user.first_name + ' ' + user.last_name,
            verification_code: mailKey,
          },
        );
        if (mailResponse.success) {
          return successResponse(mailResponse.message);
        } else {
          return errorResponse(mailResponse.message);
        }
      } else {
        return successResponse('User not found', []);
      }
    } catch (err) {
      console.log(err);
    }
    return errorResponse('Something went wrong');
  }

  async updateProfile(
    user: User,
    payload: UpdateUserDto,
  ): Promise<ResponseModel> {
    try {
      const exist = await this.prisma.user.findFirst({
        where: {
          email: {
            not: {
              equals: user.email,
            },
          },
          user_name: payload.user_name,
        },
      });
      if (exist) {
        return errorResponse('Username has been already taken!');
      }

      let image_url = null;
      if (payload.file_id) {
        const fileDetails = await this.prisma.myUploads.findFirst({
          where: {
            id: payload.file_id,
          },
        });

        if (!fileDetails) {
          return errorResponse('Invalid image request!');
        }

        image_url = fileDetails.file_path;
      }

      const updatedUser = await this.prisma.user.update({
        where: {
          email: user.email,
        },
        data: {
          first_name: payload.first_name,
          last_name: payload.last_name,
          user_name: payload.user_name,
          phone: payload.phone,
          country: payload.country,
          birth_date: new Date(payload.birth_date),
          gender: Number(payload.gender),
          photo: image_url ? image_url : user.photo,
        },
      });

      return successResponse('Profile is updated successfully!', updatedUser);
    } catch (error) {
      processException(error);
    }
  }

  async checkUserNameIsUnique(
    user: User,
    payload: {
      user_name: string;
    },
  ) {
    try {
      const checkUserNameExists = await this.prisma.user.findFirst({
        where: {
          email: {
            not: {
              equals: user.email,
            },
          },
          user_name: payload.user_name,
        },
      });

      if (checkUserNameExists) {
        return errorResponse('This name has been already taken!');
      } else {
        return successResponse('This name is unique!');
      }
    } catch (error) {
      processException(error);
    }
  }

  async becomeAnInstructor(user: User): Promise<ResponseModel> {
    try {
      const userProfile = await PrismaClient.user.findUnique({
        where: {
          id: user.id,
        },
      });
      const userRoles = await userRolesPermissionObject(userProfile.roles);

      if (!userRoles.is_instructor) {
        const existingApplication =
          await PrismaClient.instructorApplication.findUnique({
            where: {
              userId: user.id,
            },
          });

        if (existingApplication) {
          const updatedApplication =
            await PrismaClient.instructorApplication.update({
              where: {
                id: existingApplication.id,
              },
              data: {
                status: coreConstant.STATUS_PENDING,
              },
            });

          return successResponse(
            'Instructor application submitted successfully!',
            updatedApplication,
          );
        } else {
          const newApplication =
            await PrismaClient.instructorApplication.create({
              data: {
                userId: user.id,
                status: coreConstant.STATUS_PENDING,
              },
            });

          return successResponse(
            'Instructor application submitted successfully!',
            newApplication,
          );
        }
      }

      return successResponse('Already an instructor', userProfile);
    } catch (error) {
      processException(error);
    }
  }

  async assignInstructor(user_id: number): Promise<ResponseModel> {
    try {
      const userProfile = await PrismaClient.user.findUnique({
        where: {
          id: user_id,
        },
      });
      if (!userProfile) {
        return errorResponse('User not found');
      }

      const INSTRUCTOR = coreConstant.ROLES.INSTRUCTOR;

      const userRoles = await userRolesPermissionObject(userProfile.roles);

      if (!userRoles.is_instructor) {
        const updatedUser = await PrismaClient.user.update({
          where: {
            id: user_id,
          },
          data: {
            roles: `${userProfile.roles},${INSTRUCTOR}`,
          },
        });
        await PrismaClient.instructorApplication.update({
          where: {
            userId: user_id,
          },
          data: {
            status: coreConstant.ACTIVE,
          },
        });

        return successResponse('Assigned as an instructor!', updatedUser);
      }

      return successResponse('Already an instructor', userProfile);
    } catch (error) {
      processException(error);
    }
  }
  async getPendingInstructorApplications(payload: any): Promise<ResponseModel> {
    try {
      const paginate = await paginatioOptions(payload);

      let pendingApplications =
        await PrismaClient.instructorApplication.findMany({
          where: {
            status: coreConstant.STATUS_PENDING,
          },
          include: {
            user: true,
          },
          ...paginate,
        });
      const formattedPendings = pendingApplications.reduce(
        (result, pending) => {
          const { password, ...userWithoutPassword } = pending.user;

          const formattedPending = {
            ...pending,
            user: {
              ...userWithoutPassword,
              photo: pending.user.photo
                ? addPhotoPrefix(pending.user.photo)
                : '',
            },
          };

          result.push(formattedPending);

          return result;
        },
        [],
      );
      const paginationMeta = await paginationMetaData(
        'instructorApplication',
        payload,
      );
      const data = {
        list: formattedPendings,
        meta: paginationMeta,
      };

      return successResponse('List of pending instructor applications', data);
    } catch (error) {
      console.log(error, 'error');
      processException(error);
    }
  }

  async getInstructorApplicationStatus(user: User): Promise<ResponseModel> {
    try {
      const applicationStatus =
        await PrismaClient.instructorApplication.findFirst({
          where: {
            userId: user.id,
          },
        });
      if (applicationStatus?.status) {
        return successResponse('Instructor application status', {
          status: applicationStatus.status,
        });
      } else {
        return successResponse(
          'No instructor application found for the user',
          null,
        );
      }
    } catch (error) {
      console.log(error, 'errorerrorerror');
      processException(error);
    }
  }
  async changeStatus(payload: { user_id: number }) {
    try {
      if (!payload.user_id) {
        return errorResponse('User Id field is required!');
      }

      const user_id = Number(payload.user_id);
      const userDetails = await this.prisma.user.findFirst({
        where: {
          id: user_id,
        },
      });
      if (userDetails) {
        const status =
          coreConstant.STATUS_ACTIVE == userDetails.status
            ? coreConstant.STATUS_INACTIVE
            : coreConstant.STATUS_ACTIVE;

        const updateUserDetails = await this.prisma.user.update({
          where: {
            id: Number(payload.user_id),
          },
          data: {
            status: status,
          },
        });
        delete updateUserDetails.password;
        return successResponse(
          'Status is updated successfully!',
          updateUserDetails,
        );
      } else {
        return errorResponse('User is not found!');
      }
    } catch (error) {
      processException(error);
    }
  }

  async userListByCountryWise() {
    try {
      const userList = await this.prisma.user.groupBy({
        by: ['country'],
        _count: true,
      });

      console.log(userList);

      return successResponse('Country wise user list', userList);
    } catch (error) {
      processException(error);
    }
  }

  async userProfileDetails(payload: { user_id: number }) {
    try {
      if (!payload.user_id) {
        return errorResponse('User Id field is required!');
      }

      const user_id = Number(payload.user_id);
      const userDetails = await this.prisma.user.findFirst({
        where: {
          id: user_id,
        },
      });

      if (userDetails) {
        delete userDetails.password;

        return successResponse('User Details', userDetails);
      } else {
        return errorResponse('User is not found!');
      }
    } catch (error) {
      processException(error);
    }
  }
  async updateEmail(
    user: User,
    payload: {
      email: string;
    },
  ) {
    try {
      if (!payload.email) {
        return errorResponse('Email field is required!');
      }

      const checkEmailExists = await this.prisma.user.findFirst({
        where: {
          email: {
            not: {
              equals: user.email,
            },
            equals: payload.email,
          },
        },
      });

      if (checkEmailExists) {
        return errorResponse('This email has been already taken!');
      } else {
        const userDetails = await this.prisma.user.update({
          where: {
            email: user.email,
          },
          data: {
            email: payload.email,
          },
        });
        delete userDetails.password;

        return successResponse('Email is updated successfully!', userDetails);
      }
    } catch (error) {
      processException(error);
    }
  }

  async userRegistrationBySocialMedia(payload: any) {
    try {
      const userDetails = await this.prisma.user.findFirst({
        where: {
          email: payload.email,
        },
      });

      if (userDetails) {
        return successResponse('User is already registered!', userDetails);
      } else {
        const lowerCaseEmail = payload.email.toLocaleLowerCase();
        const hashPassword = await hashedPassword(randomUUID());

        const userRegistrationData: any = {
          unique_code: createUniqueCode(),
          first_name: payload.first_name,
          last_name: payload.last_name,
          email: lowerCaseEmail,
          password: hashPassword,
          email_verified: coreConstant.IS_VERIFIED,
          provider: payload.provider,
          provider_id: payload.providerId,
        };

        const user = await this.prisma.user.create({
          data: {
            ...userRegistrationData,
          },
        });
        return successResponse('New user is registered successfully!', user);
      }
    } catch (error) {
      processException(error);
    }
  }
  async testTextGen(payload: { text: string }): Promise<ResponseModel> {
    try {
      return successResponse('Text is generated successfully!');
    } catch (error) {
      processException(error);
    }
  }

  async changePassword(user: User, payload: ChangePasswordDto) {
    try {
      const userDetails = await this.prisma.user.findFirst({
        where: {
          email: user.email,
        },
      });

      if (!userDetails) {
        return errorResponse('Invalid Request!');
      }

      const isPasswordValid = await compare(
        payload.current_password,
        userDetails.password,
      );

      if (!isPasswordValid) {
        return errorResponse('Your current password is not match!');
      }

      if (payload.password !== payload.confirm_password) {
        return errorResponse('Password and confirm password do not match!');
      }

      const hashPassword = await hashedPassword(payload.password);

      await this.prisma.user.update({
        where: {
          id: userDetails.id,
        },
        data: {
          password: hashPassword,
        },
      });

      return successResponse('Password is changed successfully!');
    } catch (error) {
      processException(error);
    }
  }
}
