"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, FileText, HelpCircle, BarChart, GitBranch } from "lucide-react";
import { QuestionsTab } from "./_components/QuestionsTab";
import { ScalesTab } from "./_components/ScalesTab";
import { RulesTab } from "./_components/RulesTab";

interface Test {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  version: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    questions: number;
    scales: number;
    rules: number;
  };
}

export default function EditTestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [test, setTest] = useState<Test | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'info' | 'questions' | 'scales' | 'rules'>('info');

  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    description: '',
    version: 1,
    published: false,
    rating: 4.8,
  });

  useEffect(() => {
    loadTest();
  }, [resolvedParams.id]);

  const loadTest = async () => {
    try {
      const response = await fetch(`/api/admin/tests/${resolvedParams.id}`);
      const data = await response.json();

      if (response.ok) {
        setTest(data);
        setFormData({
          slug: data.slug,
          title: data.title,
          description: data.description || '',
          version: data.version,
          published: data.published,
          rating: data.rating || 4.8,
        });
      } else {
        console.error('Error loading test:', data.error);
        alert('Тест не найден');
        router.push('/admin/tests');
      }
    } catch (error) {
      console.error('Error loading test:', error);
      alert('Ошибка при загрузке теста');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch(`/api/admin/tests/${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Success! Reload test data
        await loadTest();
        alert('Тест успешно обновлён');
      } else {
        // Handle validation errors
        if (data.details) {
          const fieldErrors: Record<string, string> = {};
          data.details.forEach((error: any) => {
            fieldErrors[error.path[0]] = error.message;
          });
          setErrors(fieldErrors);
        } else {
          alert(data.error || 'Ошибка при обновлении теста');
        }
      }
    } catch (error) {
      console.error('Error updating test:', error);
      alert('Ошибка при обновлении теста');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!test) {
    return null;
  }

  const tabs = [
    { id: 'info', name: 'Основная информация', icon: FileText },
    { id: 'questions', name: `Вопросы (${test._count.questions})`, icon: HelpCircle },
    { id: 'scales', name: `Шкалы (${test._count.scales})`, icon: BarChart },
    { id: 'rules', name: `Правила (${test._count.rules})`, icon: GitBranch },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/tests"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </Link>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">{test.title}</h2>
            <p className="text-gray-600 mt-1 font-mono text-sm">
              {test.slug}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            test.published
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-700'
          }`}>
            {test.published ? 'Опубликован' : 'Черновик'}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'info' && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Info Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Название теста <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              {/* Slug */}
              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                  URL slug <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleChange('slug', e.target.value.toLowerCase())}
                  className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 font-mono text-sm ${
                    errors.slug ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Только строчные буквы, цифры и дефисы
                </p>
                {errors.slug && (
                  <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Описание
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={4}
                  className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
              </div>

              {/* Version */}
              <div>
                <label htmlFor="version" className="block text-sm font-medium text-gray-700 mb-2">
                  Версия
                </label>
                <input
                  type="number"
                  id="version"
                  value={formData.version}
                  onChange={(e) => handleChange('version', parseInt(e.target.value))}
                  min="1"
                  className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${
                    errors.version ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.version && (
                  <p className="text-red-500 text-sm mt-1">{errors.version}</p>
                )}
              </div>

              {/* Published */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => handleChange('published', e.target.checked)}
                  className="w-5 h-5 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
                />
                <label htmlFor="published" className="text-sm font-medium text-gray-700">
                  Опубликован
                </label>
              </div>

              {/* Rating */}
              <div>
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                  Рейтинг (от 0 до 5)
                </label>
                <input
                  type="number"
                  id="rating"
                  value={formData.rating || 4.8}
                  onChange={(e) => handleChange('rating', parseFloat(e.target.value))}
                  min="0"
                  max="5"
                  step="0.1"
                  className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${
                    errors.rating ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.rating && (
                  <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
                )}
              </div>
            </div>
          </div>

          {/* Metadata Card */}
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Метаданные</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">ID:</span>
                <span className="font-mono text-gray-800 ml-2">{test.id}</span>
              </div>
              <div>
                <span className="text-gray-600">Версия:</span>
                <span className="font-medium text-gray-800 ml-2">{test.version}</span>
              </div>
              <div>
                <span className="text-gray-600">Создан:</span>
                <span className="font-medium text-gray-800 ml-2">
                  {new Date(test.createdAt).toLocaleString('ru-RU')}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Обновлён:</span>
                <span className="font-medium text-gray-800 ml-2">
                  {new Date(test.updatedAt).toLocaleString('ru-RU')}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <Link
              href="/admin/tests"
              className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Назад к списку
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-xl transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Сохранение...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Сохранить изменения
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {activeTab === 'questions' && (
        <QuestionsTab
          testId={test.id}
          questions={test.questions || []}
          onRefresh={loadTest}
        />
      )}

      {activeTab === 'scales' && (
        <ScalesTab testId={test.id} onRefresh={loadTest} />
      )}

      {activeTab === 'rules' && (
        <RulesTab testId={test.id} onRefresh={loadTest} />
      )}
    </div>
  );
}

