"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, ArrowLeft, Users, BarChart3, Download, Eye, MessageSquare, LogOut, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import LoginForm from "@/components/LoginForm";
import ClearResultsModal from "@/components/ClearResultsModal";
import TestManager from "@/components/TestManager";
import { getStoredTestResults, clearStoredTestResults } from "@/lib/dataStorage";

interface UserAnswer {
  questionId: string;
  questionText: string;
  block: number;
  answer: string | number | string[];
  timestamp: number;
}

interface AdminResult {
  sessionId: string;
  testId: string;
  completedAt: string;
  summaryType: string;
  answers: UserAnswer[];
  attachment: {
    secure: number;
    anxious: number;
    avoidant: number;
  };
  values: {
    support: number;
    passion: number;
    security: number;
    growth: number;
  };
  loveLanguage: {
    words: number;
    time: number;
    gifts: number;
    service: number;
    touch: number;
  };
  conflict: {
    collab: number;
    comprom: number;
    avoid: number;
    accom: number;
    compete: number;
  };
}

export default function AdminPage() {
  const { isAuthenticated, isLoading: authLoading, login, logout } = useAuth();
  const [results, setResults] = useState<AdminResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState<AdminResult | null>(null);
  const [showAnswers, setShowAnswers] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    
    // Загружаем реальные данные из localStorage
    const loadRealData = () => {
      try {
        const storedResults = getStoredTestResults();
        
        // Преобразуем данные в формат AdminResult
        const adminResults: AdminResult[] = storedResults.map(result => ({
          sessionId: result.sessionId,
          testId: result.testId,
          completedAt: result.completedAt,
          summaryType: result.results.summaryType,
          answers: result.answers,
          attachment: result.results.attachment || { secure: 0, anxious: 0, avoidant: 0 },
          values: result.results.values || { support: 0, passion: 0, security: 0, growth: 0 },
          loveLanguage: result.results.loveLanguage || { words: 0, time: 0, gifts: 0, service: 0, touch: 0 },
          conflict: result.results.conflict || { collab: 0, comprom: 0, avoid: 0, accom: 0, compete: 0 }
        }));
        
        setResults(adminResults);
        
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setIsLoading(false);
      }
    };
    
    loadRealData();
  }, [isAuthenticated]);

  const clearAllResults = () => {
    clearStoredTestResults();
    setResults([]);
    setSelectedResult(null);
    setShowAnswers(false);
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Session ID', 'Test ID', 'Completed At', 'Summary Type', 'Secure', 'Anxious', 'Avoidant', 'Support', 'Passion', 'Security', 'Growth', 'Words', 'Time', 'Gifts', 'Service', 'Touch', 'Collaborate', 'Compromise', 'Avoid', 'Accommodate', 'Compete'].join(','),
      ...results.map(result => [
        result.sessionId,
        result.testId,
        result.completedAt,
        result.summaryType,
        result.attachment.secure,
        result.attachment.anxious,
        result.attachment.avoidant,
        result.values.support,
        result.values.passion,
        result.values.security,
        result.values.growth,
        result.loveLanguage.words,
        result.loveLanguage.time,
        result.loveLanguage.gifts,
        result.loveLanguage.service,
        result.loveLanguage.touch,
        result.conflict.collab,
        result.conflict.comprom,
        result.conflict.avoid,
        result.conflict.accom,
        result.conflict.compete
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `psychology-love-results-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Показываем форму логина если не аутентифицирован
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Загрузка...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Загружаем результаты...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-pink-500" />
            <span className="text-2xl font-bold text-gray-800">Психология Любви</span>
          </Link>
          <div className="flex items-center space-x-4">
            <TestManager onTestUpdate={() => {}} />
            <button
              onClick={() => setShowClearModal(true)}
              className="inline-flex items-center text-red-600 hover:text-red-700 transition-colors"
            >
              <Trash2 className="h-5 w-5 mr-2" />
              Очистить результаты
            </button>
            <button
              onClick={logout}
              className="inline-flex items-center text-gray-600 hover:text-gray-700 transition-colors"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Выйти
            </button>
            <Link
              href="/"
              className="inline-flex items-center text-gray-600 hover:text-pink-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              На главную
            </Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Админ-панель
            </h1>
            <p className="text-xl text-gray-600">
              Просмотр результатов тестов и аналитика
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-800">{results.length}</h3>
              <p className="text-gray-600">Всего тестов</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <BarChart3 className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-800">
                {Math.round(results.reduce((acc, r) => acc + r.attachment.secure, 0) / results.length)}%
              </h3>
              <p className="text-gray-600">Средний надёжный тип</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <Heart className="h-8 w-8 text-pink-500 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-800">
                {Math.round(results.reduce((acc, r) => acc + r.loveLanguage.words, 0) / results.length)}%
              </h3>
              <p className="text-gray-600">Средний язык слов</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <Eye className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-800">
                {new Set(results.map(r => r.summaryType)).size}
              </h3>
              <p className="text-gray-600">Уникальных типов</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Результаты тестов
            </h2>
            <button
              onClick={exportToCSV}
              className="btn-primary flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Экспорт CSV
            </button>
          </div>

          {/* Results Table */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Сессия
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Дата
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Тип личности
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Привязанность
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Язык любви
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.map((result, index) => (
                    <tr key={`${result.sessionId}-${index}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                        {result.sessionId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(result.completedAt).toLocaleDateString('ru-RU')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-sm">
                          {result.summaryType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex space-x-2">
                          <span className="text-green-600">{result.attachment.secure}%</span>
                          <span className="text-yellow-600">{result.attachment.anxious}%</span>
                          <span className="text-red-600">{result.attachment.avoidant}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex space-x-1">
                          <span className="text-pink-600">{result.loveLanguage.words}%</span>
                          <span className="text-purple-600">{result.loveLanguage.time}%</span>
                          <span className="text-blue-600">{result.loveLanguage.gifts}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedResult(result);
                              setShowAnswers(false);
                            }}
                            className="text-pink-600 hover:text-pink-900 transition-colors"
                          >
                            Результаты
                          </button>
                          <button
                            onClick={() => {
                              setSelectedResult(result);
                              setShowAnswers(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                          >
                            Ответы
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detail Modal */}
          {selectedResult && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-4">
                      <h3 className="text-2xl font-bold text-gray-800">
                        {showAnswers ? 'Ответы пользователя' : 'Детальные результаты'}
                      </h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setShowAnswers(false)}
                          className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                            !showAnswers 
                              ? 'bg-pink-100 text-pink-600' 
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          Результаты
                        </button>
                        <button
                          onClick={() => setShowAnswers(true)}
                          className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                            showAnswers 
                              ? 'bg-blue-100 text-blue-600' 
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          Ответы
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedResult(null)}
                      className="text-gray-400 hover:text-gray-600 text-2xl"
                    >
                      ×
                    </button>
                  </div>

                  {showAnswers ? (
                    /* Answers View */
                    <div className="space-y-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex items-center mb-2">
                          <MessageSquare className="h-5 w-5 text-blue-500 mr-2" />
                          <h4 className="font-semibold text-blue-800">Информация о сессии</h4>
                        </div>
                        <p className="text-blue-700 text-sm">
                          <strong>Сессия:</strong> {selectedResult.sessionId} | 
                          <strong> Завершено:</strong> {new Date(selectedResult.completedAt).toLocaleString('ru-RU')} | 
                          <strong> Тип:</strong> {selectedResult.summaryType}
                        </p>
                      </div>

                      <div className="space-y-4">
                        {selectedResult.answers.map((answer, index) => (
                          <div key={`${answer.questionId}-${index}`} className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <span className="bg-pink-100 text-pink-600 px-2 py-1 rounded-full text-xs font-medium">
                                  Блок {answer.block}
                                </span>
                                <span className="text-gray-500 text-sm">
                                  Вопрос {index + 1}
                                </span>
                              </div>
                              <span className="text-gray-400 text-xs">
                                {new Date(answer.timestamp).toLocaleTimeString('ru-RU')}
                              </span>
                            </div>
                            <p className="text-gray-800 mb-3 font-medium">
                              {answer.questionText}
                            </p>
                            <div className="bg-white rounded-lg p-3 border-l-4 border-pink-500">
                              <p className="text-gray-700">
                                <strong>Ответ:</strong> {
                                  Array.isArray(answer.answer) 
                                    ? answer.answer.join(', ') 
                                    : answer.answer
                                }
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Results View */
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Attachment */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="font-semibold text-gray-800 mb-3">Тип привязанности</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Надёжный</span>
                            <span className="font-medium">{selectedResult.attachment.secure}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tревожный</span>
                            <span className="font-medium">{selectedResult.attachment.anxious}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Избегающий</span>
                            <span className="font-medium">{selectedResult.attachment.avoidant}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Values */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="font-semibold text-gray-800 mb-3">Ценности</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Поддержка</span>
                            <span className="font-medium">{selectedResult.values.support}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Страсть</span>
                            <span className="font-medium">{selectedResult.values.passion}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Безопасность</span>
                            <span className="font-medium">{selectedResult.values.security}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Рост</span>
                            <span className="font-medium">{selectedResult.values.growth}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Love Language */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="font-semibold text-gray-800 mb-3">Язык любви</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Слова</span>
                            <span className="font-medium">{selectedResult.loveLanguage.words}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Время</span>
                            <span className="font-medium">{selectedResult.loveLanguage.time}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Подарки</span>
                            <span className="font-medium">{selectedResult.loveLanguage.gifts}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Забота</span>
                            <span className="font-medium">{selectedResult.loveLanguage.service}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Прикосновения</span>
                            <span className="font-medium">{selectedResult.loveLanguage.touch}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Conflict */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="font-semibold text-gray-800 mb-3">Стиль конфликтов</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Сотрудничество</span>
                            <span className="font-medium">{selectedResult.conflict.collab}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Компромисс</span>
                            <span className="font-medium">{selectedResult.conflict.comprom}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Избегание</span>
                            <span className="font-medium">{selectedResult.conflict.avoid}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Приспособление</span>
                            <span className="font-medium">{selectedResult.conflict.accom}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Соперничество</span>
                            <span className="font-medium">{selectedResult.conflict.compete}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Clear Results Modal */}
      <ClearResultsModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={clearAllResults}
        resultsCount={results.length}
      />
    </div>
  );
}
