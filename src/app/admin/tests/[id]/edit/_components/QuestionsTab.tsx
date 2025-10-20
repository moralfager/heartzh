'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';

interface AnswerOption {
  id: string;
  text: string;
  value: number;
  weights: Record<string, number>;
}

interface Question {
  id: string;
  order: number;
  text: string;
  type: string;
  options: AnswerOption[];
}

interface QuestionsTabProps {
  testId: string;
  questions: Question[];
  onRefresh: () => void;
}

export function QuestionsTab({ testId, questions, onRefresh }: QuestionsTabProps) {
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  const toggleExpand = (questionId: string) => {
    setExpandedQuestion(prev => prev === questionId ? null : questionId);
  };

  const handleDelete = async (questionId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот вопрос?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/tests/${testId}/questions/${questionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Вопрос удалён');
        onRefresh();
      } else {
        alert('Ошибка при удалении вопроса');
      }
    } catch (error) {
      console.error('Error deleting question:', error);
      alert('Ошибка при удалении вопроса');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Вопросы теста
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Всего вопросов: {questions.length}
          </p>
        </div>
        <button
          className="inline-flex items-center px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-xl transition-colors font-medium"
        >
          <Plus className="h-5 w-5 mr-2" />
          Добавить вопрос
        </button>
      </div>

      {/* Questions List */}
      <div className="divide-y divide-gray-100">
        {questions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-2">Нет вопросов</p>
            <p className="text-sm text-gray-500">
              Добавьте первый вопрос или импортируйте из JSON
            </p>
          </div>
        ) : (
          questions.map((question) => (
            <div key={question.id} className="group hover:bg-gray-50 transition-colors">
              {/* Question Header */}
              <div className="p-4 flex items-start gap-4">
                {/* Drag Handle */}
                <div className="flex-shrink-0 pt-1 cursor-move opacity-0 group-hover:opacity-50 transition-opacity">
                  <GripVertical className="h-5 w-5 text-gray-400" />
                </div>

                {/* Order Number */}
                <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-medium text-gray-600">
                  {question.order}
                </div>

                {/* Question Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-gray-800 font-medium leading-relaxed">
                        {question.text}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                          {question.type}
                        </span>
                        <span className="text-sm text-gray-500">
                          {question.options.length} вариант(ов)
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => toggleExpand(question.id)}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Развернуть"
                      >
                        {expandedQuestion === question.id ? (
                          <ChevronUp className="h-5 w-5 text-gray-600" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-600" />
                        )}
                      </button>
                      <button
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Редактировать"
                      >
                        <Edit2 className="h-5 w-5 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(question.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Удалить"
                      >
                        <Trash2 className="h-5 w-5 text-red-600" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Options */}
                  {expandedQuestion === question.id && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        Варианты ответов:
                      </p>
                      {question.options.map((option, idx) => (
                        <div
                          key={option.id}
                          className="bg-gray-50 rounded-lg p-3 text-sm"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <span className="font-medium text-gray-700">
                                {idx + 1}. {option.text}
                              </span>
                              <div className="mt-1 text-gray-500 text-xs">
                                Значение: {option.value}
                                {Object.keys(option.weights).length > 0 && (
                                  <>
                                    {' • Веса: '}
                                    {Object.entries(option.weights)
                                      .map(([key, val]) => `${key}=${val}`)
                                      .join(', ')}
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

