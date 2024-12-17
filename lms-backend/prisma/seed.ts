import { PrismaClient } from '@prisma/client';
import { usersSeed } from './seeds/users.seed';
import { coursesSeed } from './seeds/courses.seed';
import { faqsSeed } from './seeds/faqs.seed';
import { blogsSeed } from './seeds/blogs.seed';
import { languageSeed } from './seeds/language.seed';

const prisma = new PrismaClient();

async function main() {
  try {
    // First seed languages since they're needed for translations
    await languageSeed(prisma);
    console.log('Languages seeding completed');

    // Then seed users since they're referenced by other entities
    await usersSeed(prisma);
    console.log('Users seeding completed');

    // Then seed courses which may reference users (instructors)
    await coursesSeed(prisma);
    console.log('Courses seeding completed');

    // Seed FAQs
    await faqsSeed(prisma);
    console.log('FAQs seeding completed');

    // Finally seed blogs which may reference users (authors)
    await blogsSeed(prisma);
    console.log('Blogs seeding completed');

  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
