"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, FileText } from "lucide-react";

export default function NewTestPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    description: '',
    version: 1,
    published: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch('/api/admin/tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Success! Redirect to edit page
        router.push(`/admin/tests/${data.id}/edit`);
      } else {
        // Handle validation errors
        if (data.details) {
          const fieldErrors: Record<string, string> = {};
          data.details.forEach((error: any) => {
            fieldErrors[error.path[0]] = error.message;
          });
          setErrors(fieldErrors);
        } else {
          alert(data.error || 'Ошибка при создании теста');
        }
      }
    } catch (error) {
      console.error('Error creating test:', error);
      alert('Ошибка при создании теста');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Auto-generate slug from title if slug is empty
    if (field === 'title' && !formData.slug) {
      const autoSlug = value
        .toLowerCase()
        .replace(/[^a-zа-я0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData(prev => ({
        ...prev,
        slug: autoSlug,
      }));
    }

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
            <h2 className="text-3xl font-bold text-gray-800">Создать новый тест</h2>
            <p className="text-gray-600 mt-1">
              Заполните основную информацию о тесте
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <FileText className="h-6 w-6 text-pink-500" />
            <h3 className="text-xl font-semibold text-gray-800">Основная информация</h3>
          </div>

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
                placeholder="Например: Психология любви"
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
                placeholder="love-psychology"
                required
                pattern="[a-z0-9-]+"
              />
              <p className="text-sm text-gray-500 mt-1">
                Только строчные буквы, цифры и дефисы. Например: love-psychology
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
                placeholder="Краткое описание теста..."
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
              <p className="text-sm text-gray-500 mt-1">
                Версия теста для отслеживания изменений
              </p>
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
                Опубликовать сразу после создания
              </label>
            </div>
            <p className="text-sm text-gray-500 ml-8">
              Если не отмечено, тест будет создан как черновик
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <Link
            href="/admin/tests"
            className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Отмена
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-xl transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Создание...
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                Создать тест
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

