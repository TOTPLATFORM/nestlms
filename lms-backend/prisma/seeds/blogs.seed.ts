import { PrismaClient } from '@prisma/client';
import { coreConstant } from '../../src/shared/helpers/coreConstant';

export async function blogsSeed(prisma: PrismaClient) {
  try {
    console.log('Seeding blogs...');

    // Get languages
    const english = await prisma.language.findUnique({ where: { code: 'en' } });
    const arabic = await prisma.language.findUnique({ where: { code: 'ar' } });

    if (!english || !arabic) {
      throw new Error('Languages must be seeded first');
    }

    // Get admin user for author
    const admin = await prisma.user.findFirst({
      where: {
        roles: {
          contains: String(coreConstant.ROLES.ADMIN)
        }
      }
    });

    if (!admin) {
      throw new Error('Admin user must be seeded first');
    }

    // Create blog categories with translations
    const categories = [
      {
        name: 'E-Learning Tips',
        translations: {
          ar: {
            name: 'نصائح التعلم الإلكتروني'
          }
        }
      },
      {
        name: 'Teaching Strategies',
        translations: {
          ar: {
            name: 'استراتيجيات التدريس'
          }
        }
      }
    ];

    for (const cat of categories) {
      const category = await prisma.blogCategory.upsert({
        where: { name: cat.name },
        update: { status: 1 },
        create: {
          name: cat.name,
          status: 1
        }
      });

      // Add Arabic translation
      await prisma.translation.upsert({
        where: {
          unique_translation: {
            language_id: arabic.id,
            table_name: 'blog_categories',
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
          table_name: 'blog_categories',
          table_id: category.id,
          field_name: 'name',
          translation: cat.translations.ar.name,
          is_approved: true
        }
      });
    }

    // Create blog tags
    const tags = [
      'online learning',
      'education',
      'teaching tips',
      'student success'
    ];

    for (const tagName of tags) {
      await prisma.blogTag.upsert({
        where: { name: tagName },
        update: { status: 1 },
        create: {
          name: tagName,
          status: 1
        }
      });
    }

    // Get categories for blogs
    const categories_db = await prisma.blogCategory.findMany();

    // Create blogs with translations
    const blogs = [
      {
        title: 'Getting Started with Online Learning',
        slug: 'getting-started-with-online-learning',
        description: 'A comprehensive guide to help you succeed in your online learning journey.',
        tag: 'online learning, education',
        allow_comment: true,
        is_featured: true,
        thumbnail_link: '/images/blogs/online-learning.jpg',
        translations: {
          ar: {
            title: 'البدء في التعلم عبر الإنترنت',
            description: 'دليل شامل لمساعدتك في النجاح في رحلة التعلم عبر الإنترنت.'
          }
        }
      },
      {
        title: 'Effective Teaching Methods for Online Classes',
        slug: 'effective-teaching-methods-online-classes',
        description: 'Learn about proven teaching methods that work well in an online environment.',
        tag: 'teaching tips, education',
        allow_comment: true,
        is_featured: true,
        thumbnail_link: '/images/blogs/teaching-methods.jpg',
        translations: {
          ar: {
            title: 'طرق التدريس الفعالة للفصول الدراسية عبر الإنترنت',
            description: 'تعرف على طرق التدريس المثبتة التي تعمل بشكل جيد في البيئة الإلكترونية.'
          }
        }
      }
    ];

    for (let i = 0; i < blogs.length; i++) {
      const blog = blogs[i];
      const category = categories_db[i % categories_db.length];

      const createdBlog = await prisma.blog.upsert({
        where: { slug: blog.slug },
        update: {
          title: blog.title,
          description: blog.description,
          tag: blog.tag,
          allow_comment: blog.allow_comment,
          is_featured: blog.is_featured,
          thumbnail_link: blog.thumbnail_link,
          status: 1,
          authorId: admin.id,
          blogCategoryId: category.id,
          views: Math.floor(Math.random() * 1000)
        },
        create: {
          title: blog.title,
          slug: blog.slug,
          description: blog.description,
          tag: blog.tag,
          allow_comment: blog.allow_comment,
          is_featured: blog.is_featured,
          thumbnail_link: blog.thumbnail_link,
          status: 1,
          authorId: admin.id,
          blogCategoryId: category.id,
          views: Math.floor(Math.random() * 1000)
        }
      });

      // Add Arabic translations
      for (const field of ['title', 'description'] as const) {
        await prisma.translation.upsert({
          where: {
            unique_translation: {
              language_id: arabic.id,
              table_name: 'blogs',
              table_id: createdBlog.id,
              field_name: field
            }
          },
          update: {
            translation: blog.translations.ar[field],
            is_approved: true
          },
          create: {
            language_id: arabic.id,
            table_name: 'blogs',
            table_id: createdBlog.id,
            field_name: field,
            translation: blog.translations.ar[field],
            is_approved: true
          }
        });
      }

      // Add some sample comments
      const comments = [
        {
          message: 'Great article! Very helpful.',
          translations: {
            ar: {
              message: 'مقال رائع! مفيد جداً.'
            }
          }
        },
        {
          message: 'Thanks for sharing these insights.',
          translations: {
            ar: {
              message: 'شكراً لمشاركة هذه الرؤى.'
            }
          }
        }
      ];

      for (const comment of comments) {
        const existingComment = await prisma.blogComment.findFirst({
          where: {
            message: comment.message,
            blog_id: createdBlog.id,
            userId: admin.id
          }
        });

        const createdComment = existingComment || await prisma.blogComment.create({
          data: {
            message: comment.message,
            status: 1,
            blog_id: createdBlog.id,
            userId: admin.id
          }
        });

        await prisma.translation.upsert({
          where: {
            unique_translation: {
              language_id: arabic.id,
              table_name: 'blog_comments',
              table_id: createdComment.id,
              field_name: 'message'
            }
          },
          update: {
            translation: comment.translations.ar.message,
            is_approved: true
          },
          create: {
            language_id: arabic.id,
            table_name: 'blog_comments',
            table_id: createdComment.id,
            field_name: 'message',
            translation: comment.translations.ar.message,
            is_approved: true
          }
        });
      }
    }

    console.log('Blogs seed completed successfully');
  } catch (error) {
    console.error('Error seeding blogs:', error);
    throw error;
  }
}
