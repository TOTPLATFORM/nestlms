import { PrismaClient } from '@prisma/client';
import { languages, systemMessages } from './data/translations.data';

export async function initialDataSeed(prisma: PrismaClient) {
  try {
    console.log('Seeding languages...');

    // Create languages
    const createdLanguages = await Promise.all(
      languages.map(async (lang) => {
        return prisma.language.upsert({
          where: { code: lang.code },
          update: lang,
          create: lang
        });
      })
    );

    const english = createdLanguages.find(lang => lang.code === 'en');
    const arabic = createdLanguages.find(lang => lang.code === 'ar');

    if (!english || !arabic) {
      throw new Error('Failed to create languages');
    }

    // Create system messages
    await Promise.all(
      systemMessages.map(async (msg) => {
        // English message
        await prisma.systemMessage.upsert({
          where: {
            unique_message: {
              language_id: english.id,
              key: msg.key
            }
          },
          update: {
            value: msg.translations.en,
            category: msg.category
          },
          create: {
            language_id: english.id,
            key: msg.key,
            value: msg.translations.en,
            category: msg.category
          }
        });

        // Arabic message
        await prisma.systemMessage.upsert({
          where: {
            unique_message: {
              language_id: arabic.id,
              key: msg.key
            }
          },
          update: {
            value: msg.translations.ar,
            category: msg.category
          },
          create: {
            language_id: arabic.id,
            key: msg.key,
            value: msg.translations.ar,
            category: msg.category
          }
        });
      })
    );

    console.log('Languages and system messages seeding completed');
  } catch (error) {
    console.error('Error seeding languages:', error);
    throw error;
  }
}
