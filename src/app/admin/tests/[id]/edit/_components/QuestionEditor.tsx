'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

interface AnswerOption {
  id?: string;
  text: string;
  value: number;
  weights: Record<string, number>;
}

interface Question {
  id?: string;
  text: string;
  type: string;
  order?: number;
  options: AnswerOption[];
}

interface QuestionEditorProps {
  testId: string;
  question?: Question | null;
  onSave: () => void;
  onClose: () => void;
}

export function QuestionEditor({ testId, question, onSave, onClose }: QuestionEditorProps) {
  const [formData, setFormData] = useState<Question>({
    text: '',
    type: 'single',
    options: [
      { text: '', value: 1, weights: {} },
    ],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (question) {
      setFormData(question);
    }
  }, [question]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const url = question?.id
        ? `/api/admin/tests/${testId}/questions/${question.id}`
        : `/api/admin/tests/${testId}/questions`;
      
      const method = question?.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        onSave();
        onClose();
      } else {
        if (data.details) {
          const fieldErrors: Record<string, string> = {};
          data.details.forEach((error: any) => {
            fieldErrors[error.path[0]] = error.message;
          });
          setErrors(fieldErrors);
        } else {
          alert(data.error || 'Ошибка при сохранении вопроса');
        }
      }
    } catch (error) {
      console.error('Error saving question:', error);
      alert('Ошибка при сохранении вопроса');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof Question, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleOptionChange = (index: number, field: keyof AnswerOption, value: any) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((opt, idx) =>
        idx === index ? { ...opt, [field]: value } : opt
      ),
    }));
  };

  const addOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [
        ...prev.options,
        { text: '', value: prev.options.length + 1, weights: {} },
      ],
    }));
  };

  const removeOption = (index: number) => {
    if (formData.options.length <= 1) {
      alert('Должен быть хотя бы один вариант ответа');
      return;
    }
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter((_, idx) => idx !== index),
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">
            {question?.id ? 'Редактировать вопрос' : 'Новый вопрос'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Question Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Текст вопроса *
            </label>
            <textarea
              value={formData.text}
              onChange={(e) => handleChange('text', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-none"
              placeholder="Введите текст вопроса..."
              required
            />
            {errors.text && (
              <p className="mt-1 text-sm text-red-600">{errors.text}</p>
            )}
          </div>

          {/* Question Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Тип вопроса *
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              required
            >
              <option value="single">Одиночный выбор</option>
              <option value="multi">Множественный выбор</option>
              <option value="scale">Шкала (Likert)</option>
              <option value="likert">Likert шкала</option>
            </select>
          </div>

          {/* Answer Options */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Варианты ответов *
              </label>
              <button
                type="button"
                onClick={addOption}
                className="inline-flex items-center px-3 py-1.5 bg-pink-50 hover:bg-pink-100 text-pink-600 rounded-lg transition-colors text-sm font-medium"
              >
                <Plus className="h-4 w-4 mr-1" />
                Добавить вариант
              </button>
            </div>

            <div className="space-y-3">
              {formData.options.map((option, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-white rounded-lg flex items-center justify-center text-sm font-medium text-gray-600 mt-2">
                      {index + 1}
                    </span>
                    
                    <div className="flex-1 space-y-3">
                      <input
                        type="text"
                        value={option.text}
                        onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                        placeholder="Текст варианта ответа"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                        required
                      />
                      
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <label className="block text-xs text-gray-600 mb-1">
                            Значение
                          </label>
                          <input
                            type="number"
                            value={option.value}
                            onChange={(e) => handleOptionChange(index, 'value', Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                            required
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs text-gray-600 mb-1">
                            Веса (JSON) <span className="text-gray-400">опционально</span>
                          </label>
                          <input
                            type="text"
                            value={JSON.stringify(option.weights)}
                            onChange={(e) => {
                              try {
                                const weights = JSON.parse(e.target.value || '{}');
                                handleOptionChange(index, 'weights', weights);
                              } catch {
                                // Ignore invalid JSON
                              }
                            }}
                            placeholder='{"A_SECURE": 5}'
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all font-mono text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    {formData.options.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="flex-shrink-0 p-2 hover:bg-red-50 rounded-lg transition-colors mt-2"
                        title="Удалить вариант"
                      >
                        <Trash2 className="h-5 w-5 text-red-600" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-gray-600 hover:text-gray-800 transition-colors font-medium"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-xl transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Сохранение...' : question?.id ? 'Сохранить' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

