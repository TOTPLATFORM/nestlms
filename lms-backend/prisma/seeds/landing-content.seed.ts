import { PrismaClient } from '@prisma/client';

export async function landingContentSeed(prisma: PrismaClient) {
  try {
    console.log('Seeding landing page content...');

    // Get languages
    const english = await prisma.language.findUnique({ where: { code: 'en' } });
    const arabic = await prisma.language.findUnique({ where: { code: 'ar' } });

    if (!english || !arabic) {
      throw new Error('Languages must be seeded first');
    }

    // Landing page content
    const landingContent = [
      {
        key: 'landing_main_banner_first_title',
        translations: {
          en: 'Perfect Place For Your Education Next Level',
          ar: 'المكان المثالي لمستواك التعليمي القادم'
        }
      },
      {
        key: 'landing_main_banner_first_description',
        translations: {
          en: 'Architect client-centered total linkage for intuitive benefits. Restore convergence before real-time partnerships.',
          ar: 'نقدم حلولاً تعليمية متكاملة تركز على احتياجات المتعلم. نجمع بين الخبرة والابتكار لتقديم تجربة تعليمية فريدة.'
        }
      },
      {
        key: 'landing_how_it_work_first_title',
        translations: {
          en: 'Check How We Work in Easy Steps',
          ar: 'تعرف على كيفية عملنا في خطوات سهلة'
        }
      },
      {
        key: 'landing_how_it_work_list_first_title',
        translations: {
          en: 'Discover and Enroll',
          ar: 'اكتشف وسجل'
        }
      },
      {
        key: 'landing_how_it_work_list_first_description',
        translations: {
          en: 'Navigate through an extensive array of courses effortlessly. Discover subjects that pique your interest and enroll with just a few clicks.',
          ar: 'تصفح مجموعة واسعة من الدورات بسهولة. اكتشف المواضيع التي تثير اهتمامك وسجل بنقرات قليلة.'
        }
      },
      {
        key: 'landing_how_it_work_list_second_title',
        translations: {
          en: 'Engage and Learn',
          ar: 'شارك وتعلم'
        }
      },
      {
        key: 'landing_how_it_work_list_second_description',
        translations: {
          en: 'Dive into your chosen courses with lightning-fast video loading, interactive assessments, and a responsive design that adapts to your device.',
          ar: 'انغمس في دوراتك المختارة مع تحميل سريع للفيديو، وتقييمات تفاعلية، وتصميم متجاوب يتكيف مع جهازك.'
        }
      },
      {
        key: 'landing_how_it_work_list_third_title',
        translations: {
          en: 'Empowerment for Instructors',
          ar: 'تمكين المدربين'
        }
      },
      {
        key: 'landing_how_it_work_list_third_description',
        translations: {
          en: 'For educators seeking to share their expertise, joining as an instructor on TOT Platform is a breeze. The platform provides a hassle-free onboarding process.',
          ar: 'للمعلمين الراغبين في مشاركة خبراتهم، الانضمام كمدرب في TOT Platform أمر سهل. توفر المنصة عملية انضمام سلسة وخالية من المتاعب.'
        }
      },
      {
        key: 'landing_choose_us_first_title',
        translations: {
          en: 'Find More About Us E-Learning Experience',
          ar: 'اكتشف المزيد عن تجربة التعلم الإلكتروني لدينا'
        }
      },
      {
        key: 'landing_choose_us_list_first_title',
        translations: {
          en: 'Flexible Learning',
          ar: 'تعلم مرن'
        }
      },
      {
        key: 'landing_choose_us_list_first_description',
        translations: {
          en: 'Providing multiple means of engage representation, and expression for all students to learn.',
          ar: 'توفير وسائل متعددة للمشاركة والتمثيل والتعبير لجميع الطلاب للتعلم.'
        }
      },
      {
        key: 'landing_choose_us_list_second_title',
        translations: {
          en: 'Expert Instructors',
          ar: 'مدربون خبراء'
        }
      },
      {
        key: 'landing_choose_us_list_second_description',
        translations: {
          en: 'Learn from industry experts who are passionate about teaching.',
          ar: 'تعلم من خبراء الصناعة المتحمسين للتدريس.'
        }
      }
    ];

    // Create translations for landing page content
    for (const content of landingContent) {
      // Create translation for English
      await prisma.translation.create({
        data: {
          language_id: english.id,
          table_name: 'landing_content',
          table_id: 1, // Using 1 as a constant ID for landing content
          field_name: content.key,
          translation: content.translations.en,
          is_approved: true
        }
      });

      // Create translation for Arabic
      await prisma.translation.create({
        data: {
          language_id: arabic.id,
          table_name: 'landing_content',
          table_id: 1,
          field_name: content.key,
          translation: content.translations.ar,
          is_approved: true
        }
      });
    }

    console.log('Landing page content seed completed successfully');
  } catch (error) {
    console.error('Error seeding landing page content:', error);
    throw error;
  }
}
