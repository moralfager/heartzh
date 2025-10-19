import { prisma } from './prisma';
import { RealTestResult } from './dataStorage';
import { getOrCreateSession } from './session';

// Функция для сохранения результатов теста в БД (legacy wrapper)
// Используется старым кодом, адаптирует к новой схеме
export async function saveTestResult(result: RealTestResult) {
  try {
    // Получаем или создаем сессию
    const session = await getOrCreateSession();
    
    // Сохраняем результат в новой схеме
    await prisma.result.create({
      data: {
        testId: result.testId,
        sessionId: session.id,
        version: 1, // Default version
        summary: {
          answers: result.answers,
          results: result.results,
          testTitle: result.testTitle,
          completedAt: result.completedAt,
        },
      },
    });
    
    console.log('Test result saved to database:', session.id);
    return true;
  } catch (error) {
    console.error('Error saving test result to database:', error);
    return false;
  }
}

// Функция для получения всех сохраненных результатов из БД (legacy wrapper)
export async function getStoredTestResults(): Promise<RealTestResult[]> {
  try {
    const results = await prisma.result.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        session: true,
      },
    });
    
    return results.map((result: any) => ({
      sessionId: result.sessionId,
      testId: result.testId,
      testTitle: result.summary?.testTitle || 'Unknown Test',
      completedAt: result.summary?.completedAt || result.createdAt.toISOString(),
      answers: result.summary?.answers || {},
      results: result.summary?.results || {},
    }));
  } catch (error) {
    console.error('Error loading test results from database:', error);
    return [];
  }
}

// Функция для очистки всех результатов из БД (legacy wrapper)
export async function clearStoredTestResults() {
  try {
    // Удаляем все сессии (каскадное удаление результатов)
    await prisma.session.deleteMany();
    console.log('All test results cleared from database');
    return true;
  } catch (error) {
    console.error('Error clearing test results from database:', error);
    return false;
  }
}

// Функция для получения результатов по тесту из БД (legacy wrapper)
export async function getTestResultsByTestId(testId: string): Promise<RealTestResult[]> {
  try {
    const results = await prisma.result.findMany({
      where: { testId },
      orderBy: { createdAt: 'desc' },
      include: {
        session: true,
      },
    });
    
    return results.map((result: any) => ({
      sessionId: result.sessionId,
      testId: result.testId,
      testTitle: result.summary?.testTitle || 'Unknown Test',
      completedAt: result.summary?.completedAt || result.createdAt.toISOString(),
      answers: result.summary?.answers || {},
      results: result.summary?.results || {},
    }));
  } catch (error) {
    console.error('Error loading test results by testId:', error);
    return [];
  }
}

// Функция для получения статистики из БД
export async function getTestStatistics() {
  try {
    const results = await getStoredTestResults();
    
    const stats = {
      totalTests: results.length,
      testsByType: {} as Record<string, number>,
      averageCompletionTime: 0,
      mostPopularTest: '',
      recentResults: results.slice(0, 10) // Последние 10 результатов
    };
    
    // Подсчитываем тесты по типам
    results.forEach(result => {
      stats.testsByType[result.testId] = (stats.testsByType[result.testId] || 0) + 1;
    });
    
    // Находим самый популярный тест
    const mostPopular = Object.entries(stats.testsByType)
      .sort(([,a], [,b]) => b - a)[0];
    stats.mostPopularTest = mostPopular ? mostPopular[0] : '';
    
    return stats;
  } catch (error) {
    console.error('Error getting test statistics:', error);
    return {
      totalTests: 0,
      testsByType: {},
      averageCompletionTime: 0,
      mostPopularTest: '',
      recentResults: []
    };
  }
}
