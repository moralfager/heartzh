"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, EyeOff, FileText, CheckCircle, XCircle } from "lucide-react";

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

export default function TestsListPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadTests();
  }, [filter]);

  const loadTests = async () => {
    try {
      setIsLoading(true);
      const url = filter === 'all' 
        ? '/api/admin/tests'
        : `/api/admin/tests?published=${filter === 'published'}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (response.ok) {
        setTests(data.tests);
      } else {
        console.error('Error loading tests:', data.error);
      }
    } catch (error) {
      console.error('Error loading tests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/tests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          published: !currentStatus,
        }),
      });

      if (response.ok) {
        loadTests();
      } else {
        const data = await response.json();
        console.error('Error toggling published status:', data.error);
        alert('Ошибка при изменении статуса публикации');
      }
    } catch (error) {
      console.error('Error toggling published status:', error);
      alert('Ошибка при изменении статуса публикации');
    }
  };

  const deleteTest = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/tests/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setDeleteConfirm(null);
        loadTests();
      } else {
        const data = await response.json();
        console.error('Error deleting test:', data.error);
        alert('Ошибка при удалении теста');
      }
    } catch (error) {
      console.error('Error deleting test:', error);
      alert('Ошибка при удалении теста');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  const filteredTests = tests;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Управление тестами</h2>
          <p className="text-gray-600 mt-1">
            Всего тестов: {tests.length}
          </p>
        </div>
        <Link
          href="/admin/tests/new"
          className="inline-flex items-center px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-xl transition-colors font-medium"
        >
          <Plus className="h-5 w-5 mr-2" />
          Создать тест
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 border-b border-gray-200">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
            filter === 'all'
              ? 'border-pink-500 text-pink-600'
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          Все
        </button>
        <button
          onClick={() => setFilter('published')}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
            filter === 'published'
              ? 'border-pink-500 text-pink-600'
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          Опубликованные
        </button>
        <button
          onClick={() => setFilter('draft')}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
            filter === 'draft'
              ? 'border-pink-500 text-pink-600'
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          Черновики
        </button>
      </div>

      {/* Tests Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTests.map((test) => (
          <div
            key={test.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
          >
            {/* Test Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {test.title}
                </h3>
                <p className="text-sm text-gray-500 font-mono">
                  {test.slug}
                </p>
              </div>
              <button
                onClick={() => togglePublished(test.id, test.published)}
                className={`p-2 rounded-lg transition-colors ${
                  test.published
                    ? 'bg-green-100 text-green-600 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={test.published ? 'Опубликован' : 'Черновик'}
              >
                {test.published ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Description */}
            {test.description && (
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {test.description}
              </p>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-blue-50 rounded-lg p-2 text-center">
                <p className="text-xs text-blue-600 mb-1">Вопросы</p>
                <p className="text-lg font-semibold text-blue-800">
                  {test._count.questions}
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-2 text-center">
                <p className="text-xs text-purple-600 mb-1">Шкалы</p>
                <p className="text-lg font-semibold text-purple-800">
                  {test._count.scales}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-2 text-center">
                <p className="text-xs text-green-600 mb-1">Правила</p>
                <p className="text-lg font-semibold text-green-800">
                  {test._count.rules}
                </p>
              </div>
            </div>

            {/* Metadata */}
            <div className="text-xs text-gray-500 mb-4 space-y-1">
              <div className="flex items-center justify-between">
                <span>Версия:</span>
                <span className="font-medium">{test.version}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Создан:</span>
                <span className="font-medium">
                  {new Date(test.createdAt).toLocaleDateString('ru-RU')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Обновлён:</span>
                <span className="font-medium">
                  {new Date(test.updatedAt).toLocaleDateString('ru-RU')}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <Link
                href={`/admin/tests/${test.id}/edit`}
                className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors text-sm"
              >
                <Edit className="h-4 w-4 mr-1" />
                Редактировать
              </Link>
              <button
                onClick={() => setDeleteConfirm(test.id)}
                className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTests.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            {filter === 'all' 
              ? 'Нет тестов. Создайте первый тест!'
              : filter === 'published'
              ? 'Нет опубликованных тестов'
              : 'Нет черновиков'}
          </p>
          {filter === 'all' && (
            <Link
              href="/admin/tests/new"
              className="inline-flex items-center px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl transition-colors font-medium"
            >
              <Plus className="h-5 w-5 mr-2" />
              Создать первый тест
            </Link>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                Удалить тест?
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Вы уверены, что хотите удалить этот тест? Это действие нельзя отменить.
              Все связанные вопросы, шкалы и правила также будут удалены.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl transition-colors font-medium"
              >
                Отмена
              </button>
              <button
                onClick={() => deleteTest(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors font-medium"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

