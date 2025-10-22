const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkTests() {
  try {
    console.log('🔍 Проверяем состояние тестов в БД...\n');
    
    // Получаем все тесты
    const allTests = await prisma.test.findMany({
      include: {
        _count: {
          select: {
            questions: true,
            scales: true,
            rules: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`📊 Всего тестов в БД: ${allTests.length}\n`);

    allTests.forEach((test, index) => {
      console.log(`${index + 1}. ${test.title}`);
      console.log(`   Slug: ${test.slug}`);
      console.log(`   Published: ${test.published}`);
      console.log(`   Version: ${test.version}`);
      console.log(`   Questions: ${test._count.questions}`);
      console.log(`   Scales: ${test._count.scales}`);
      console.log(`   Rules: ${test._count.rules}`);
      console.log(`   Created: ${test.createdAt}`);
      console.log('');
    });

    // Проверяем опубликованные тесты
    const publishedTests = allTests.filter(test => test.published);
    console.log(`✅ Опубликованных тестов: ${publishedTests.length}`);

    // Проверяем тесты с вопросами
    const testsWithQuestions = allTests.filter(test => test._count.questions > 0);
    console.log(`❓ Тестов с вопросами: ${testsWithQuestions.length}`);

    // Проверяем готовые к показу тесты
    const readyTests = allTests.filter(test => test.published && test._count.questions > 0);
    console.log(`🚀 Готовых к показу тестов: ${readyTests.length}\n`);

    if (readyTests.length > 0) {
      console.log('Готовые тесты:');
      readyTests.forEach(test => {
        console.log(`- ${test.title} (${test.slug})`);
      });
    }

  } catch (error) {
    console.error('❌ Ошибка:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTests();



