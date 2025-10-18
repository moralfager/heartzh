import { prisma } from './prisma';
import { RealTestResult } from './dataStorage';

// Функция для сохранения результатов теста в БД
export async function saveTestResult(result: RealTestResult) {
  try {
    await prisma.testResult.create({
      data: {
        sessionId: result.sessionId,
        testId: result.testId,
        testTitle: result.testTitle,
        completedAt: new Date(result.completedAt),
        answers: result.answers,
        results: result.results,
      },
    });
    
    console.log('Test result saved to database:', result.sessionId);
    return true;
  } catch (error) {
    console.error('Error saving test result to database:', error);
    return false;
  }
}

// Функция для получения всех сохраненных результатов из БД
export async function getStoredTestResults(): Promise<RealTestResult[]> {
  try {
    const results = await prisma.testResult.findMany({
      orderBy: { completedAt: 'desc' },
    });
    
    return results.map(result => ({
      sessionId: result.sessionId,
      testId: result.testId,
      testTitle: result.testTitle,
      completedAt: result.completedAt.toISOString(),
      answers: result.answers as RealTestResult['answers'],
      results: result.results as RealTestResult['results'],
    }));
  } catch (error) {
    console.error('Error loading test results from database:', error);
    return [];
  }
}

// Функция для очистки всех результатов из БД
export async function clearStoredTestResults() {
  try {
    await prisma.testResult.deleteMany();
    console.log('All test results cleared from database');
    return true;
  } catch (error) {
    console.error('Error clearing test results from database:', error);
    return false;
  }
}

// Функция для получения результатов по тесту из БД
export async function getTestResultsByTestId(testId: string): Promise<RealTestResult[]> {
  try {
    const results = await prisma.testResult.findMany({
      where: { testId },
      orderBy: { completedAt: 'desc' },
    });
    
    return results.map(result => ({
      sessionId: result.sessionId,
      testId: result.testId,
      testTitle: result.testTitle,
      completedAt: result.completedAt.toISOString(),
      answers: result.answers as RealTestResult['answers'],
      results: result.results as RealTestResult['results'],
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
