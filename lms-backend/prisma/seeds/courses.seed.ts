import { PrismaClient } from '@prisma/client';
import { coreConstant } from '../../src/shared/helpers/coreConstant';

export async function coursesSeed(prisma: PrismaClient) {
  try {
    console.log('Seeding courses...');

    // Get languages
    const english = await prisma.language.findUnique({ where: { code: 'en' } });
    const arabic = await prisma.language.findUnique({ where: { code: 'ar' } });

    if (!english || !arabic) {
      throw new Error('Languages must be seeded first');
    }

    // Get instructors
    const instructors = await prisma.user.findMany({
      where: {
        roles: {
          contains: `${coreConstant.ROLES.INSTRUCTOR}`
        }
      }
    });

    if (instructors.length === 0) {
      throw new Error('Instructors must be seeded first');
    }

    // Create categories with translations
    const categories = [
      {
        name: 'Web Development',
        slug: 'web-development',
        logo: '/images/categories/web-dev.png',
        translations: {
          ar: {
            name: 'تطوير الويب'
          }
        }
      },
      {
        name: 'Mobile Development',
        slug: 'mobile-development',
        logo: '/images/categories/mobile-dev.png',
        translations: {
          ar: {
            name: 'تطوير تطبيقات الموبايل'
          }
        }
      }
    ];

    for (const cat of categories) {
      const category = await prisma.category.upsert({
        where: { name: cat.name },
        update: {
          slug: cat.slug,
          logo: cat.logo,
          status: 1
        },
        create: {
          name: cat.name,
          slug: cat.slug,
          logo: cat.logo,
          status: 1
        }
      });

      // Add Arabic translation
      await prisma.translation.upsert({
        where: {
          unique_translation: {
            language_id: arabic.id,
            table_name: 'categories',
            table_id: category.id,
            field_name: 'name'
          }
        },
        update: {
          translation: cat.translations.ar.name,
          is_approved: true
        },
        create: {
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
        name: 'Complete Web Development Bootcamp',
        slug: 'complete-web-development-bootcamp',
        short_description: 'Learn full-stack web development from scratch',
        description: 'A comprehensive course covering HTML, CSS, JavaScript, React, Node.js, and more',
        course_level: 1,
        price: 99.99,
        payable_price: 89.99,
        duration: 4800, // 80 hours in minutes
        translations: {
          ar: {
            name: 'معسكر تطوير الويب الشامل',
            short_description: 'تعلم تطوير الويب الشامل من الصفر',
            description: 'دورة شاملة تغطي HTML و CSS و JavaScript و React و Node.js والمزيد'
          }
        }
      },
      {
        name: 'Mobile App Development with React Native',
        slug: 'mobile-app-development-react-native',
        short_description: 'Build cross-platform mobile apps',
        description: 'Learn to develop mobile applications for iOS and Android using React Native',
        course_level: 2,
        price: 129.99,
        payable_price: 119.99,
        duration: 3600, // 60 hours in minutes
        translations: {
          ar: {
            name: 'تطوير تطبيقات الموبايل باستخدام React Native',
            short_description: 'بناء تطبيقات الموبايل لجميع المنصات',
            description: 'تعلم تطوير تطبيقات الموبايل لنظامي iOS و Android باستخدام React Native'
          }
        }
      }
    ];

    const categories_db = await prisma.category.findMany();

    for (let i = 0; i < courses.length; i++) {
      const course = courses[i];
      const instructor = instructors[i % instructors.length];
      const category = categories_db[i % categories_db.length];

      const createdCourse = await prisma.course.upsert({
        where: { name: course.name },
        update: {
          slug: course.slug,
          short_description: course.short_description,
          description: course.description,
          course_level: course.course_level,
          price: course.price,
          payable_price: course.payable_price,
          duration: course.duration,
          status: 1,
          instructorId: instructor.id,
          category_id: category.id
        },
        create: {
          name: course.name,
          slug: course.slug,
          short_description: course.short_description,
          description: course.description,
          course_level: course.course_level,
          price: course.price,
          payable_price: course.payable_price,
          duration: course.duration,
          status: 1,
          instructorId: instructor.id,
          category_id: category.id
        }
      });

      // Add Arabic translations
      for (const field of ['name', 'short_description', 'description'] as const) {
        await prisma.translation.upsert({
          where: {
            unique_translation: {
              language_id: arabic.id,
              table_name: 'courses',
              table_id: createdCourse.id,
              field_name: field
            }
          },
          update: {
            translation: course.translations.ar[field],
            is_approved: true
          },
          create: {
            language_id: arabic.id,
            table_name: 'courses',
            table_id: createdCourse.id,
            field_name: field,
            translation: course.translations.ar[field],
            is_approved: true
          }
        });
      }

      // Create sections
      const sections = [
        {
          title: 'Introduction',
          translations: {
            ar: {
              title: 'مقدمة'
            }
          },
          lessons: [
            {
              title: 'Course Overview',
              description: 'Overview of what you will learn in this course',
              video_upload_source: 1,
              video_url: 'https://example.com/videos/intro.mp4',
              translations: {
                ar: {
                  title: 'نظرة عامة على الدورة',
                  description: 'نظرة عامة على ما ستتعلمه في هذه الدورة'
                }
              }
            }
          ]
        },
        {
          title: 'Getting Started',
          translations: {
            ar: {
              title: 'البداية'
            }
          },
          lessons: [
            {
              title: 'Setting Up Your Development Environment',
              description: 'Learn how to set up your development environment',
              video_upload_source: 1,
              video_url: 'https://example.com/videos/setup.mp4',
              translations: {
                ar: {
                  title: 'إعداد بيئة التطوير',
                  description: 'تعلم كيفية إعداد بيئة التطوير الخاصة بك'
                }
              }
            }
          ]
        }
      ];

      for (const section of sections) {
        const createdSection = await prisma.section.upsert({
          where: {
            id: await prisma.section.findFirst({
              where: {
                title: section.title,
                course_id: createdCourse.id
              }
            }).then(s => s?.id ?? -1)
          },
          update: {
            title: section.title,
            course_id: createdCourse.id
          },
          create: {
            title: section.title,
            course_id: createdCourse.id
          }
        });

        // Add Arabic translation for section
        await prisma.translation.upsert({
          where: {
            unique_translation: {
              language_id: arabic.id,
              table_name: 'sections',
              table_id: createdSection.id,
              field_name: 'title'
            }
          },
          update: {
            translation: section.translations.ar.title,
            is_approved: true
          },
          create: {
            language_id: arabic.id,
            table_name: 'sections',
            table_id: createdSection.id,
            field_name: 'title',
            translation: section.translations.ar.title,
            is_approved: true
          }
        });

        // Create lessons for this section
        for (const lesson of section.lessons) {
          const createdLesson = await prisma.lesson.upsert({
            where: {
              id: await prisma.lesson.findFirst({
                where: {
                  title: lesson.title,
                  course_id: createdCourse.id,
                  section_id: createdSection.id
                }
              }).then(l => l?.id ?? -1)
            },
            update: {
              title: lesson.title,
              description: lesson.description,
              video_upload_source: lesson.video_upload_source,
              video_url: lesson.video_url,
              course_id: createdCourse.id,
              section_id: createdSection.id
            },
            create: {
              title: lesson.title,
              description: lesson.description,
              video_upload_source: lesson.video_upload_source,
              video_url: lesson.video_url,
              course_id: createdCourse.id,
              section_id: createdSection.id
            }
          });

          // Add Arabic translations for lesson
          for (const field of ['title', 'description'] as const) {
            await prisma.translation.upsert({
              where: {
                unique_translation: {
                  language_id: arabic.id,
                  table_name: 'lessons',
                  table_id: createdLesson.id,
                  field_name: field
                }
              },
              update: {
                translation: lesson.translations.ar[field],
                is_approved: true
              },
              create: {
                language_id: arabic.id,
                table_name: 'lessons',
                table_id: createdLesson.id,
                field_name: field,
                translation: lesson.translations.ar[field],
                is_approved: true
              }
            });
          }
        }
      }
    }

    console.log('Courses seed completed successfully');
  } catch (error) {
    console.error('Error seeding courses:', error);
    throw error;
  }
}
