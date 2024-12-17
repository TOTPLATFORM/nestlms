import { PrismaClient } from '@prisma/client';

export async function translationsSeed(prisma: PrismaClient) {
  try {
    console.log('Seeding translations...');

    // First, ensure we have our languages
    const english = await prisma.language.create({
      data: {
        code: 'en',
        name: 'English',
        direction: 'ltr',
        is_default: true,
        status: 1,
        locale_code: 'en-US',
        flag_icon: 'flag-en.svg'
      },
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
      },
    });

    // Create categories with translations
    const categories = [
      {
        name: 'Programming',
        slug: 'programming',
        logo: '/images/categories/programming.png',
        translations: {
          ar: {
            name: 'البرمجة'
          }
        }
      },
      {
        name: 'Design',
        slug: 'design',
        logo: '/images/categories/design.png',
        translations: {
          ar: {
            name: 'التصميم'
          }
        }
      }
    ];

    for (const cat of categories) {
      const category = await prisma.category.create({
        data: {
          name: cat.name,
          slug: cat.slug,
          logo: cat.logo,
          status: 1
        }
      });

      // Add Arabic translation
      await prisma.translation.create({
        data: {
          language_id: arabic.id,
          table_name: 'categories',
          table_id: category.id,
          field_name: 'name',
          translation: cat.translations.ar.name,
          is_approved: true
        }
      });
    }

    // Create courses with translations
    const courses = [
      {
        name: 'Web Development Fundamentals',
        slug: 'web-development-fundamentals',
        short_description: 'Learn the basics of web development',
        description: 'A comprehensive course on web development basics',
        translations: {
          ar: {
            name: 'أساسيات تطوير الويب',
            short_description: 'تعلم أساسيات تطوير الويب',
            description: 'دورة شاملة في أساسيات تطوير الويب'
          }
        }
      },
      {
        name: 'UI/UX Design Principles',
        slug: 'ui-ux-design-principles',
        short_description: 'Master the principles of UI/UX design',
        description: 'Learn how to create user-friendly interfaces',
        translations: {
          ar: {
            name: 'مبادئ تصميم واجهة المستخدم',
            short_description: 'إتقان مبادئ تصميم واجهة المستخدم',
            description: 'تعلم كيفية إنشاء واجهات سهلة الاستخدام'
          }
        }
      }
    ];

    for (const course of courses) {
      const createdCourse = await prisma.course.create({
        data: {
          name: course.name,
          slug: course.slug,
          short_description: course.short_description,
          description: course.description,
          status: 1
        }
      });

      // Add Arabic translations
      for (const field of ['name', 'short_description', 'description'] as const) {
        await prisma.translation.create({
          data: {
            language_id: arabic.id,
            table_name: 'courses',
            table_id: createdCourse.id,
            field_name: field,
            translation: course.translations.ar[field],
            is_approved: true
          }
        });
      }
    }

    // Create blog categories with translations
    const blogCategories = [
      {
        name: 'Technology',
        translations: {
          ar: {
            name: 'التكنولوجيا'
          }
        }
      },
      {
        name: 'Education',
        translations: {
          ar: {
            name: 'التعليم'
          }
        }
      }
    ];

    for (const blogCat of blogCategories) {
      const category = await prisma.blogCategory.create({
        data: {
          name: blogCat.name,
          status: 1
        }
      });

      await prisma.translation.create({
        data: {
          language_id: arabic.id,
          table_name: 'blog_categories',
          table_id: category.id,
          field_name: 'name',
          translation: blogCat.translations.ar.name,
          is_approved: true
        }
      });
    }

    // Create system messages
    const systemMessages = [
      {
        key: 'common.welcome',
        category: 'common',
        translations: {
          en: 'Welcome to our platform',
          ar: 'مرحباً بكم في منصتنا'
        }
      },
      {
        key: 'common.courses',
        category: 'navigation',
        translations: {
          en: 'Courses',
          ar: 'الدورات'
        }
      },
      {
        key: 'common.instructors',
        category: 'navigation',
        translations: {
          en: 'Instructors',
          ar: 'المدربون'
        }
      },
      {
        key: 'common.about',
        category: 'navigation',
        translations: {
          en: 'About',
          ar: 'عن المنصة'
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
        key: 'auth.register.success',
        category: 'auth',
        translations: {
          en: 'Successfully registered',
          ar: 'تم التسجيل بنجاح'
        }
      }
    ];

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

    // Create email templates
    const emailTemplates = [
      {
        name: 'welcome_email',
        subjects: {
          en: 'Welcome to our platform',
          ar: 'مرحباً بك في منصتنا'
        },
        contents: {
          en: 'Dear {name},\n\nWelcome to our learning platform.',
          ar: 'عزيزي {name}،\n\nمرحباً بك في منصة التعلم الخاصة بنا.'
        },
        variables: ['name']
      },
      {
        name: 'reset_password',
        subjects: {
          en: 'Reset Your Password',
          ar: 'إعادة تعيين كلمة المرور'
        },
        contents: {
          en: 'Click the following link to reset your password: {reset_link}',
          ar: 'انقر على الرابط التالي لإعادة تعيين كلمة المرور: {reset_link}'
        },
        variables: ['reset_link']
      }
    ];

    for (const template of emailTemplates) {
      await prisma.emailTemplate.create({
        data: {
          name: template.name,
          subject: template.subjects,
          content: template.contents,
          variables: template.variables
        }
      });
    }

    console.log('Translations seed completed successfully');
  } catch (error) {
    console.error('Error seeding translations:', error);
    throw error;
  }
}
