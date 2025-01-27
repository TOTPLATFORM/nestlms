import { PrismaClient } from '@prisma/client';

export async function uiTranslationsSeed(prisma: PrismaClient) {
  try {
    console.log('Seeding UI translations...');

    // Get languages
    const english = await prisma.language.findUnique({ where: { code: 'en' } });
    const arabic = await prisma.language.findUnique({ where: { code: 'ar' } });

    if (!english || !arabic) {
      throw new Error('Languages must be seeded first');
    }

    // Create system messages for UI elements
    const uiMessages = [
      // Navigation
      {
        key: 'nav.home',
        category: 'navigation',
        translations: { en: 'Home', ar: 'الرئيسية' }
      },
      {
        key: 'nav.courses',
        category: 'navigation',
        translations: { en: 'Courses', ar: 'الدورات' }
      },
      {
        key: 'nav.blog',
        category: 'navigation',
        translations: { en: 'Blog', ar: 'المدونة' }
      },
      {
        key: 'nav.about',
        category: 'navigation',
        translations: { en: 'About', ar: 'عن المنصة' }
      },
      {
        key: 'nav.contact',
        category: 'navigation',
        translations: { en: 'Contact', ar: 'اتصل بنا' }
      },

      // Auth
      {
        key: 'auth.login',
        category: 'auth',
        translations: { en: 'Login', ar: 'تسجيل الدخول' }
      },
      {
        key: 'auth.register',
        category: 'auth',
        translations: { en: 'Register', ar: 'التسجيل' }
      },
      {
        key: 'auth.logout',
        category: 'auth',
        translations: { en: 'Logout', ar: 'تسجيل الخروج' }
      },

      // Course related
      {
        key: 'course.enroll',
        category: 'course',
        translations: { en: 'Enroll Now', ar: 'سجل الآن' }
      },
      {
        key: 'course.price',
        category: 'course',
        translations: { en: 'Price', ar: 'السعر' }
      },
      {
        key: 'course.duration',
        category: 'course',
        translations: { en: 'Duration', ar: 'المدة' }
      },
      {
        key: 'course.level',
        category: 'course',
        translations: { en: 'Level', ar: 'المستوى' }
      },

      // Profile
      {
        key: 'profile.my_courses',
        category: 'profile',
        translations: { en: 'My Courses', ar: 'دوراتي' }
      },
      {
        key: 'profile.settings',
        category: 'profile',
        translations: { en: 'Settings', ar: 'الإعدادات' }
      },
      {
        key: 'profile.edit',
        category: 'profile',
        translations: { en: 'Edit Profile', ar: 'تعديل الملف الشخصي' }
      },

      // Common actions
      {
        key: 'action.save',
        category: 'common',
        translations: { en: 'Save', ar: 'حفظ' }
      },
      {
        key: 'action.cancel',
        category: 'common',
        translations: { en: 'Cancel', ar: 'إلغاء' }
      },
      {
        key: 'action.submit',
        category: 'common',
        translations: { en: 'Submit', ar: 'إرسال' }
      },
      {
        key: 'action.search',
        category: 'common',
        translations: { en: 'Search', ar: 'بحث' }
      }
    ];

    for (const msg of uiMessages) {
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

    console.log('UI translations seed completed successfully');
  } catch (error) {
    console.error('Error seeding UI translations:', error);
    throw error;
  }
}
