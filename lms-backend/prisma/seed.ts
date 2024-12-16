import { PrismaClient } from '@prisma/client';
import { initialSeed } from './seeds/initial.seed';
import { languageSeed } from './seeds/language.seed';

const prisma = new PrismaClient({ log: ['query'] });

async function main() {
  // First seed languages as they might be required by other seeds
  await languageSeed(prisma);
  // Then run other initial seeds
  await initialSeed(prisma);
}

main()
  .catch((e) => {
    console.error(e.stack);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
