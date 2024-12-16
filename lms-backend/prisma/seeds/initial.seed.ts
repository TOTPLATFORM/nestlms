import { PrismaClient } from '@prisma/client';
import { coreConstant } from '../../src/shared/helpers/coreConstant';
import { hashedPassword } from '../../src/shared/helpers/functions';

export async function initialSeed(prisma: PrismaClient) {
  try {
    await prisma.user.createMany({
      data: [
        {
          email: 'admin@email.com',
          password: (
            await hashedPassword(coreConstant.COMMON_PASSWORD)
          ).toString(),
          first_name: 'Mr',
          last_name: 'Admin',
          user_name: 'admin',
          roles: `${coreConstant.ROLES.ADMIN},${coreConstant.ROLES.SUPER_ADMIN}`,
          status: coreConstant.STATUS_ACTIVE,
          email_verified: coreConstant.IS_VERIFIED,
        },
        {
          email: 'student@email.com',
          password: (
            await hashedPassword(coreConstant.COMMON_PASSWORD)
          ).toString(),
          first_name: 'Mr',
          last_name: 'Student',
          user_name: 'student',
          roles: `${coreConstant.ROLES.STUDENT}`,
          status: coreConstant.STATUS_ACTIVE,
          email_verified: coreConstant.IS_VERIFIED,
        },
        {
          email: 'instructor@email.com',
          password: (
            await hashedPassword(coreConstant.COMMON_PASSWORD)
          ).toString(),
          first_name: 'Mr',
          last_name: 'Instructor',
          user_name: 'instructor',
          roles: `${coreConstant.ROLES.INSTRUCTOR},${coreConstant.ROLES.STUDENT}`,
          status: coreConstant.STATUS_ACTIVE,
          email_verified: coreConstant.IS_VERIFIED,
        },
      ],
      skipDuplicates: true,
    });
  } catch (error) {
    console.error('Error seeding the database:', error);
    throw error;
  }
}
