import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { instructorsData, studentsData, instructorBios, instructorExpertise } from './data/users.data';
import { coreConstant } from '../../src/shared/helpers/coreConstant';

export async function usersSeed(prisma: PrismaClient) {
  try {
    console.log('Seeding users...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
      data: {
        email: 'admin@totplatform.com',
        password: adminPassword,
        first_name: 'Admin',
        last_name: 'User',
        user_name: 'admin',
        roles: `${coreConstant.ROLES.ADMIN},${coreConstant.ROLES.SUPER_ADMIN}`,
        status: 1,
        email_verified: 1,
        phone_verified: 1
      }
    });

    // Get Arabic language for translations
    const arabic = await prisma.language.findFirst({
      where: { code: 'ar' }
    });

    if (!arabic) {
      throw new Error('Arabic language must be seeded first');
    }

    // Create instructors
    for (let i = 0; i < instructorsData.length; i++) {
      const instructor = instructorsData[i];
      const password = await bcrypt.hash('instructor123', 10);

      const createdInstructor = await prisma.user.create({
        data: {
          email: instructor.email,
          password,
          first_name: instructor.first_name,
          last_name: instructor.last_name,
          user_name: instructor.user_name,
          roles: `${coreConstant.ROLES.INSTRUCTOR},${coreConstant.ROLES.STUDENT}`,
          status: 1,
          email_verified: 1,
          phone_verified: 1,
          country: instructor.country
        }
      });

      // Create translations for instructor's name
      await prisma.translation.create({
        data: {
          language_id: arabic.id,
          table_name: 'users',
          table_id: createdInstructor.id,
          field_name: 'first_name',
          translation: instructor.translations.ar.first_name,
          is_approved: true
        }
      });

      await prisma.translation.create({
        data: {
          language_id: arabic.id,
          table_name: 'users',
          table_id: createdInstructor.id,
          field_name: 'last_name',
          translation: instructor.translations.ar.last_name,
          is_approved: true
        }
      });

      // Create instructor application
      await prisma.instructorApplication.create({
        data: {
          userId: createdInstructor.id,
          status: 1
        }
      });

      // Create instructor settings
      const settings = [
        {
          slug: `bio_${instructor.user_name}`,
          value: JSON.stringify({
            en: instructorBios.en[i],
            ar: instructorBios.ar[i]
          })
        },
        {
          slug: `expertise_${instructor.user_name}`,
          value: JSON.stringify({
            en: instructorExpertise.en[i],
            ar: instructorExpertise.ar[i]
          })
        }
      ];

      for (const setting of settings) {
        await prisma.instructorSettings.upsert({
          where: {
            slug: setting.slug
          },
          update: {
            value: setting.value
          },
          create: {
            userId: createdInstructor.id,
            slug: setting.slug,
            value: setting.value
          }
        });
      }

      // Create wallet
      await prisma.wallet.create({
        data: {
          userId: createdInstructor.id,
          balance: 0,
          total_withdrawn_amount: 0,
          total_pending_withdraw: 0
        }
      });
    }

    // Create students
    for (const student of studentsData) {
      const password = await bcrypt.hash('student123', 10);

      const createdStudent = await prisma.user.create({
        data: {
          email: student.email,
          password,
          first_name: student.first_name,
          last_name: student.last_name,
          user_name: student.user_name,
          roles: `${coreConstant.ROLES.STUDENT}`,
          status: 1,
          email_verified: 1,
          phone_verified: 1,
          country: student.country
        }
      });

      // Create translations for student's name
      await prisma.translation.create({
        data: {
          language_id: arabic.id,
          table_name: 'users',
          table_id: createdStudent.id,
          field_name: 'first_name',
          translation: student.translations.ar.first_name,
          is_approved: true
        }
      });

      await prisma.translation.create({
        data: {
          language_id: arabic.id,
          table_name: 'users',
          table_id: createdStudent.id,
          field_name: 'last_name',
          translation: student.translations.ar.last_name,
          is_approved: true
        }
      });

      // Create wallet for student
      await prisma.wallet.create({
        data: {
          userId: createdStudent.id,
          balance: 0,
          total_withdrawn_amount: 0,
          total_pending_withdraw: 0
        }
      });
    }

    console.log('Users seed completed successfully');
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}
