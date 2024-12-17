import { PrismaClient } from '@prisma/client';

export async function languageSeed(prisma: PrismaClient) {
  try {
    console.log('Seeding languages...');

    // Create default languages
    const languages = [
      {
        code: 'en',
        name: 'English',
        direction: 'ltr',
        is_default: true,
        status: 1,
        flag_icon: '/images/flags/flag-en.svg',
        locale_code: 'en-US'
      },
      {
        code: 'ar',
        name: 'Arabic',
        direction: 'rtl',
        is_default: false,
        status: 1,
        flag_icon: '/images/flags/flag-ar.svg',
        locale_code: 'ar-SA'
      }
    ];

    for (const lang of languages) {
      await prisma.language.create({
        data: lang
      });
    }

    // Create some common system messages
    const systemMessages = [
      {
        key: 'common.welcome',
        category: 'general',
        translations: {
          en: 'Welcome to TOT Platform',
          ar: 'مرحباً بكم في TOT Platform'
        }
      },
      {
        key: 'auth.login.success',
        category: 'auth',
        translations: {
          en: 'Successfully logged in',
          ar: 'تم تسجيل الدخول بنجاح'
        }
      },
      {
        key: 'course.enroll.success',
        category: 'course',
        translations: {
          en: 'Successfully enrolled in course',
          ar: 'تم التسجيل في الدورة بنجاح'
        }
      }
    ];

    // Get the created languages
    const english = await prisma.language.findUnique({ where: { code: 'en' } });
    const arabic = await prisma.language.findUnique({ where: { code: 'ar' } });

    if (!english || !arabic) {
      throw new Error('Failed to create languages');
    }

    // Create system messages with translations
    for (const msg of systemMessages) {
      // Create English message
      await prisma.systemMessage.create({
        data: {
          language_id: english.id,
          key: msg.key,
          value: msg.translations.en,
          category: msg.category
        }
      });

      // Create Arabic message
      await prisma.systemMessage.create({
        data: {
          language_id: arabic.id,
          key: msg.key,
          value: msg.translations.ar,
          category: msg.category
        }
      });
    }

    console.log('Languages and system messages seeding completed');
  } catch (error) {
    console.error('Error seeding languages:', error);
    throw error;
  }
}
