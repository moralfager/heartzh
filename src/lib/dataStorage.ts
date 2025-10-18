// Система для сбора и хранения реальных данных тестов
export interface RealTestResult {
  sessionId: string;
  testId: string;
  testTitle: string;
  completedAt: string;
  answers: Array<{
    questionId: string;
    questionText: string;
    block: number;
    answer: string | number | string[];
    timestamp: number;
  }>;
  results: {
    attachment?: {
      secure: number;
      anxious: number;
      avoidant: number;
    };
    values?: {
      support: number;
      passion: number;
      security: number;
      growth: number;
    };
    loveLanguage?: {
      words: number;
      time: number;
      gifts: number;
      service: number;
      touch: number;
    };
    conflict?: {
      collab: number;
      comprom: number;
      avoid: number;
      accom: number;
      compete: number;
    };
    expressions?: {
      words: number;
      time: number;
      gifts: number;
      service: number;
      touch: number;
      romantic: number;
      surprise: number;
    };
    gifts?: {
      luxury: number;
      practical: number;
      handmade: number;
      emotional: number;
      experience: number;
      spontaneous: number;
      traditional: number;
    };
    dates?: {
      luxury: number;
      homey: number;
      active: number;
      romantic: number;
      adventure: number;
      planning: number;
      surprise: number;
      variety: number;
    };
    care?: {
      words: number;
      time: number;
      gifts: number;
      service: number;
      touch: number;
      frequency: number;
      planning: number;
      compliments: number;
      thoughtfulness: number;
    };
    summaryType: string;
    summary: string;
    tips: string[];
  };
}

// Функция для сохранения результатов теста
export function saveTestResult(result: RealTestResult) {
  try {
    // Получаем существующие результаты
    const existingResults = getStoredTestResults();
    
    // Добавляем новый результат
    const updatedResults = [...existingResults, result];
    
    // Сохраняем в localStorage
    localStorage.setItem('psychotest-results', JSON.stringify(updatedResults));
    
    console.log('Test result saved:', result.sessionId);
    return true;
  } catch (error) {
    console.error('Error saving test result:', error);
    return false;
  }
}

// Функция для получения всех сохраненных результатов
export function getStoredTestResults(): RealTestResult[] {
  try {
    const stored = localStorage.getItem('psychotest-results');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading test results:', error);
    return [];
  }
}

// Функция для очистки всех результатов
export function clearStoredTestResults() {
  try {
    localStorage.removeItem('psychotest-results');
    console.log('All test results cleared');
    return true;
  } catch (error) {
    console.error('Error clearing test results:', error);
    return false;
  }
}

// Функция для получения результатов по тесту
export function getTestResultsByTestId(testId: string): RealTestResult[] {
  const allResults = getStoredTestResults();
  return allResults.filter(result => result.testId === testId);
}

// Функция для получения статистики
export function getTestStatistics() {
  const results = getStoredTestResults();
  
  const stats = {
    totalTests: results.length,
    testsByType: {} as Record<string, number>,
    averageCompletionTime: 0,
    mostPopularTest: '',
    recentResults: results.slice(-10) // Последние 10 результатов
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
}
