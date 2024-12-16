import { PrismaClient } from '@prisma/client';

export async function languageSeed(prisma: PrismaClient) {
  try {
    console.log('Seeding languages...');

    // Create English language (default)
    await prisma.language.upsert({
      where: { code: 'en' },
      update: {},
      create: {
        code: 'en',
        name: 'English',
        direction: 'ltr',
        is_default: true,
        status: 1,
        locale_code: 'en-US',
        flag_icon: 'flag-en.png'
      },
    });

    // Create Arabic language
    await prisma.language.upsert({
      where: { code: 'ar' },
      update: {},
      create: {
        code: 'ar',
        name: 'العربية',
        direction: 'rtl',
        is_default: false,
        status: 1,
        locale_code: 'ar-SA',
        flag_icon: 'flag-ar.png'
      },
    });

    // Add system messages for both languages
    const languages = await prisma.language.findMany();
    
    for (const lang of languages) {
      // Common messages for English
      if (lang.code === 'en') {
        await prisma.systemMessage.createMany({
          skipDuplicates: true,
          data: [
            {
              language_id: lang.id,
              key: 'common.welcome',
              value: 'Welcome',
              category: 'common'
            },
            {
              language_id: lang.id,
              key: 'common.error',
              value: 'An error occurred',
              category: 'error'
            },
            {
              language_id: lang.id,
              key: 'common.success',
              value: 'Operation successful',
              category: 'success'
            },
            {
              language_id: lang.id,
              key: 'auth.login.success',
              value: 'Login successful',
              category: 'auth'
            },
            {
              language_id: lang.id,
              key: 'auth.register.success',
              value: 'Registration successful',
              category: 'auth'
            }
          ]
        });
      }
      
      // Common messages for Arabic
      if (lang.code === 'ar') {
        await prisma.systemMessage.createMany({
          skipDuplicates: true,
          data: [
            {
              language_id: lang.id,
              key: 'common.welcome',
              value: 'مرحباً',
              category: 'common'
            },
            {
              language_id: lang.id,
              key: 'common.error',
              value: 'حدث خطأ',
              category: 'error'
            },
            {
              language_id: lang.id,
              key: 'common.success',
              value: 'تمت العملية بنجاح',
              category: 'success'
            },
            {
              language_id: lang.id,
              key: 'auth.login.success',
              value: 'تم تسجيل الدخول بنجاح',
              category: 'auth'
            },
            {
              language_id: lang.id,
              key: 'auth.register.success',
              value: 'تم التسجيل بنجاح',
              category: 'auth'
            }
          ]
        });
      }
    }

    console.log('Language seed completed successfully');
  } catch (error) {
    console.error('Error seeding languages:', error);
    throw error;
  }
}
