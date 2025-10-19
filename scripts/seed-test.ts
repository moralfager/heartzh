/**
 * Seed script to create a test record in the database
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding test record...');

  const test = await prisma.test.upsert({
    where: { slug: 'love-psychology' },
    update: {},
    create: {
      id: 'cltest001',
      slug: 'love-psychology',
      title: 'Психология любви',
      description: 'Тест на тему психологии любви и отношений',
      version: 1,
      published: true,
    },
  });

  console.log('✅ Test record created:', test);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

