"use client";

import { useState, useEffect } from "react";
import { Download, Eye, MessageSquare, Trash2 } from "lucide-react";
import ClearResultsModal from "@/components/ClearResultsModal";

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

export default function AdminResultsPage() {
  const [results, setResults] = useState<AdminResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState<AdminResult | null>(null);
  const [showAnswers, setShowAnswers] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      console.log('🔍 Loading results from API...');
      const response = await fetch('/api/internal/results', {
        cache: 'no-store',
      });
      
      if (!response.ok) {
        console.error('❌ API response not OK:', response.status);
        setIsLoading(false);
        return;
      }
      
      const data = await response.json();
      console.log('📊 Results from API:', data);
      
      const apiResults = data.results || [];
      
      const adminResults: AdminResult[] = apiResults.map((result: any) => ({
        sessionId: result.sessionId || result.id,
        testId: result.testId,
        completedAt: result.createdAt,
        summaryType: result.summary?.summaryType || 'Неизвестно',
        answers: Object.entries(result.answers || {}).map(([questionId, answer]: [string, any]) => ({
          questionId,
          questionText: answer.questionText || '',
          block: answer.block || 1,
          answer: answer.value,
          timestamp: answer.timestamp || Date.now(),
        })),
        attachment: result.summary?.attachment || { secure: 0, anxious: 0, avoidant: 0 },
        values: result.summary?.values || { support: 0, passion: 0, security: 0, growth: 0 },
        loveLanguage: result.summary?.loveLanguage || { words: 0, time: 0, gifts: 0, service: 0, touch: 0 },
        conflict: result.summary?.conflict || { collab: 0, comprom: 0, avoid: 0, accom: 0, compete: 0 }
      }));
      
      console.log('✅ Processed results:', adminResults);
      setResults(adminResults);
      setIsLoading(false);
    } catch (error) {
      console.error('❌ Error loading results from API:', error);
      setIsLoading(false);
    }
  };

  const clearAllResults = async () => {
    // TODO: Implement API endpoint to delete all results
    console.warn('Clear all results not implemented yet');
    alert('Функция очистки всех результатов будет доступна в следующей версии');
    setShowClearModal(false);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Результаты тестов</h2>
          <p className="text-gray-600 mt-1">
            Всего результатов: {results.length}
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={exportToCSV}
            className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Экспорт CSV
          </button>
          <button
            onClick={() => setShowClearModal(true)}
            className="inline-flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Очистить все
          </button>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Сессия
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Тест
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Тип
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Привязанность
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {results.map((result, index) => (
                <tr key={`${result.sessionId}-${index}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                    {result.sessionId.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {result.testId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(result.completedAt).toLocaleDateString('ru-RU')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-xs font-medium">
                      {result.summaryType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <span className="text-green-600 font-medium">{result.attachment.secure}%</span>
                      <span className="text-yellow-600">{result.attachment.anxious}%</span>
                      <span className="text-red-600">{result.attachment.avoidant}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedResult(result);
                          setShowAnswers(false);
                        }}
                        className="text-pink-600 hover:text-pink-800 transition-colors font-medium"
                      >
                        <Eye className="h-4 w-4 inline mr-1" />
                        Результаты
                      </button>
                      <button
                        onClick={() => {
                          setSelectedResult(result);
                          setShowAnswers(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
                      >
                        <MessageSquare className="h-4 w-4 inline mr-1" />
                        Ответы
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {results.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Нет результатов для отображения</p>
            </div>
          )}
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
                          ? 'bg-pink-100 text-pink-600 font-medium' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      Результаты
                    </button>
                    <button
                      onClick={() => setShowAnswers(true)}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        showAnswers 
                          ? 'bg-blue-100 text-blue-600 font-medium' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      Ответы
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedResult(null)}
                  className="text-gray-400 hover:text-gray-600 text-3xl font-light"
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
                        <span className="font-medium text-green-600">{selectedResult.attachment.secure}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tревожный</span>
                        <span className="font-medium text-yellow-600">{selectedResult.attachment.anxious}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Избегающий</span>
                        <span className="font-medium text-red-600">{selectedResult.attachment.avoidant}%</span>
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

