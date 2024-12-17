import { PrismaClient } from '@prisma/client';

export async function allTranslationsSeed(prisma: PrismaClient) {
  try {
    console.log('Seeding all translations...');

    // Create languages
    const english = await prisma.language.create({
      data: {
        code: 'en',
        name: 'English',
        direction: 'ltr',
        is_default: true,
        status: 1,
        locale_code: 'en-US',
        flag_icon: 'flag-en.svg'
      }
    });

    const arabic = await prisma.language.create({
      data: {
        code: 'ar',
        name: 'العربية',
        direction: 'rtl',
        is_default: false,
        status: 1,
        locale_code: 'ar-SA',
        flag_icon: 'flag-ar.svg'
      }
    });

    // System Messages
    const systemMessages = [
      // Navigation
      {
        key: 'nav.language',
        category: 'navigation',
        translations: { en: 'Switch language', ar: 'تغيير اللغة' }
      },
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
        key: 'nav.instructors',
        category: 'navigation',
        translations: { en: 'Instructors', ar: 'المدربون' }
      },
      {
        key: 'nav.about',
        category: 'navigation',
        translations: { en: 'About', ar: 'عن المنصة' }
      },

      // Landing Page
      {
        key: 'landing.hero.title',
        category: 'landing',
        translations: {
          en: 'Perfect Place For Your Education Next Level',
          ar: 'المكان المثالي لمستواك التعليمي القادم'
        }
      },
      {
        key: 'landing.hero.description',
        category: 'landing',
        translations: {
          en: 'Architect client-centered total linkage for intuitive benefits.',
          ar: 'نقدم حلولاً تعليمية متكاملة تركز على احتياجات المتعلم.'
        }
      },
      {
        key: 'landing.hero.view_course',
        category: 'landing',
        translations: { en: 'View Course', ar: 'عرض الدورة' }
      },

      // How it Works Section
      {
        key: 'landing.how_it_works.title',
        category: 'landing',
        translations: { en: 'How it Works', ar: 'كيف يعمل' }
      },
      {
        key: 'landing.how_it_works.subtitle',
        category: 'landing',
        translations: {
          en: 'Check How We Work in Easy Steps',
          ar: 'تعرف على كيفية عملنا في خطوات سهلة'
        }
      },
      {
        key: 'landing.how_it_works.step1.title',
        category: 'landing',
        translations: { en: 'Discover and Enroll', ar: 'اكتشف وسجل' }
      },
      {
        key: 'landing.how_it_works.step2.title',
        category: 'landing',
        translations: { en: 'Engage and Learn', ar: 'شارك وتعلم' }
      },
      {
        key: 'landing.how_it_works.step3.title',
        category: 'landing',
        translations: { en: 'Get Certified', ar: 'احصل على الشهادة' }
      },

      // Why Choose Us Section
      {
        key: 'landing.why_choose_us.title',
        category: 'landing',
        translations: { en: 'Why Choose Us', ar: 'لماذا تختارنا' }
      },
      {
        key: 'landing.why_choose_us.feature1.title',
        category: 'landing',
        translations: { en: 'Flexible Learning', ar: 'تعلم مرن' }
      },
      {
        key: 'landing.why_choose_us.feature2.title',
        category: 'landing',
        translations: { en: 'Expert Instructors', ar: 'مدربون خبراء' }
      },
      {
        key: 'landing.why_choose_us.feature3.title',
        category: 'landing',
        translations: { en: 'Lifetime Access', ar: 'وصول مدى الحياة' }
      },

      // Auth Messages
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

      // Common Actions
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

    // Create system messages
    for (const msg of systemMessages) {
      // English message
      await prisma.systemMessage.create({
        data: {
          language_id: english.id,
          key: msg.key,
          value: msg.translations.en,
          category: msg.category
        }
      });

      // Arabic message
      await prisma.systemMessage.create({
        data: {
          language_id: arabic.id,
          key: msg.key,
          value: msg.translations.ar,
          category: msg.category
        }
      });
    }

    console.log('All translations seeded successfully');
  } catch (error) {
    console.error('Error seeding translations:', error);
    throw error;
  }
}
