import { PrismaClient } from '@prisma/client';

export async function faqsSeed(prisma: PrismaClient) {
  try {
    console.log('Seeding FAQs...');

    // Get languages
    const english = await prisma.language.findUnique({ where: { code: 'en' } });
    const arabic = await prisma.language.findUnique({ where: { code: 'ar' } });

    if (!english || !arabic) {
      throw new Error('Languages must be seeded first');
    }

    // Create FAQs with translations
    const faqs = [
      {
        question: 'How do I create an account?',
        answer: 'Click the "Sign Up" button in the top right corner and fill out the registration form with your details.',
        type: 1, // Getting Started
        translations: {
          ar: {
            question: 'كيف أقوم بإنشاء حساب؟',
            answer: 'انقر على زر "التسجيل" في الزاوية العلوية اليمنى واملأ نموذج التسجيل بالتفاصيل الخاصة بك.'
          }
        }
      },
      {
        question: 'How do I enroll in a course?',
        answer: 'Browse our course catalog, select a course you\'re interested in, and click the "Enroll Now" button. Follow the payment process if it\'s a paid course.',
        type: 2, // Course Related
        translations: {
          ar: {
            question: 'كيف يمكنني التسجيل في دورة؟',
            answer: 'تصفح كتالوج الدورات التدريبية لدينا، واختر الدورة التي تهمك، وانقر على زر "التسجيل الآن". اتبع عملية الدفع إذا كانت دورة مدفوعة.'
          }
        }
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept major credit cards, PayPal, and bank transfers. All payments are processed securely through our payment partners.',
        type: 3, // Payment & Pricing
        translations: {
          ar: {
            question: 'ما هي طرق الدفع التي تقبلونها؟',
            answer: 'نقبل بطاقات الائتمان الرئيسية و PayPal والتحويلات المصرفية. تتم معالجة جميع المدفوعات بشكل آمن من خلال شركاء الدفع لدينا.'
          }
        }
      }
    ];

    for (const faq of faqs) {
      const createdFaq = await prisma.faq.create({
        data: {
          question: faq.question,
          answer: faq.answer,
          type: faq.type,
          status: 1
        }
      });

      // Add Arabic translations
      for (const field of ['question', 'answer'] as const) {
        await prisma.translation.create({
          data: {
            language_id: arabic.id,
            table_name: 'faqs',
            table_id: createdFaq.id,
            field_name: field,
            translation: faq.translations.ar[field],
            is_approved: true
          }
        });
      }
    }

    console.log('FAQs seed completed successfully');
  } catch (error) {
    console.error('Error seeding FAQs:', error);
    throw error;
  }
}
