import { PrismaClient } from '@prisma/client';

export async function landingTranslationsSeed(prisma: PrismaClient) {
  try {
    console.log('Seeding landing page translations...');

    // Get languages
    const english = await prisma.language.findUnique({ where: { code: 'en' } });
    const arabic = await prisma.language.findUnique({ where: { code: 'ar' } });

    if (!english || !arabic) {
      throw new Error('Languages must be seeded first');
    }

    // Create system messages for landing page
    const landingMessages = [
      // Hero Section
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
          en: 'Architect client-centered total linkage for intuitive benefits. Restore convergence before real-time partnerships.',
          ar: 'نقدم حلولاً تعليمية متكاملة تركز على احتياجات المتعلم. نجمع بين الخبرة والابتكار لتقديم تجربة تعليمية فريدة.'
        }
      },
      {
        key: 'landing.hero.view_course',
        category: 'landing',
        translations: {
          en: 'View Course',
          ar: 'عرض الدورة'
        }
      },

      // Instructor Section
      {
        key: 'landing.instructor.title',
        category: 'landing',
        translations: {
          en: "Instructor's",
          ar: 'المدربون'
        }
      },
      {
        key: 'landing.instructor.subtitle',
        category: 'landing',
        translations: {
          en: 'Our Expert Instructors',
          ar: 'مدربونا الخبراء'
        }
      },
      {
        key: 'landing.instructor.view_all',
        category: 'landing',
        translations: {
          en: 'View All',
          ar: 'عرض الكل'
        }
      },

      // Course Section
      {
        key: 'landing.course.featured',
        category: 'landing',
        translations: {
          en: 'Featured Courses',
          ar: 'الدورات المميزة'
        }
      },
      {
        key: 'landing.course.popular',
        category: 'landing',
        translations: {
          en: 'Popular Courses',
          ar: 'الدورات الشائعة'
        }
      },
      {
        key: 'landing.course.new',
        category: 'landing',
        translations: {
          en: 'New Courses',
          ar: 'الدورات الجديدة'
        }
      },

      // Call to Action
      {
        key: 'landing.cta.start_learning',
        category: 'landing',
        translations: {
          en: 'Start Learning Today',
          ar: 'ابدأ التعلم اليوم'
        }
      },
      {
        key: 'landing.cta.join_us',
        category: 'landing',
        translations: {
          en: 'Join as Instructor',
          ar: 'انضم كمدرب'
        }
      },

      // Stats
      {
        key: 'landing.stats.students',
        category: 'landing',
        translations: {
          en: 'Active Students',
          ar: 'طلاب نشطون'
        }
      },
      {
        key: 'landing.stats.instructors',
        category: 'landing',
        translations: {
          en: 'Expert Instructors',
          ar: 'مدربون خبراء'
        }
      },
      {
        key: 'landing.stats.courses',
        category: 'landing',
        translations: {
          en: 'Total Courses',
          ar: 'إجمالي الدورات'
        }
      }
    ];

    for (const msg of landingMessages) {
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

    console.log('Landing page translations seed completed successfully');
  } catch (error) {
    console.error('Error seeding landing page translations:', error);
    throw error;
  }
}
