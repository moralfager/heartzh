"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Save, FileText, Settings, BookOpen } from "lucide-react";
import { TestDefinition } from "@/lib/types";
import QuestionEditor from "./QuestionEditor";

interface TestManagerProps {
  onTestUpdate: (tests: TestDefinition[]) => void;
}

export default function TestManager({ onTestUpdate }: TestManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<TestDefinition | null>(null);
  const [editingQuestions, setEditingQuestions] = useState<string | null>(null);
  const [tests, setTests] = useState<TestDefinition[]>([]);

  useEffect(() => {
    // Обработчик для перехода к редактированию вопросов
    const handleEditQuestionsEvent = (event: CustomEvent) => {
      setEditingQuestions(event.detail.testId);
    };
    
    window.addEventListener('editQuestions', handleEditQuestionsEvent as EventListener);
    
    return () => {
      window.removeEventListener('editQuestions', handleEditQuestionsEvent as EventListener);
    };
  }, []);

  // Загружаем существующие тесты
  const loadTests = async () => {
    try {
      const response = await fetch('/api/tests');
      if (response.ok) {
        const testsData = await response.json();
        setTests(testsData);
      } else {
        console.error("Error loading tests:", response.statusText);
      }
    } catch (error) {
      console.error("Error loading tests:", error);
    }
  };

  const handleEditTest = (test: TestDefinition) => {
    setEditingTest(test);
    setIsOpen(true);
  };

  const handleDeleteTest = (testId: string) => {
    if (confirm("Вы уверены, что хотите удалить этот тест?")) {
      const updatedTests = tests.filter(test => test.meta.id !== testId);
      setTests(updatedTests);
      onTestUpdate(updatedTests);
    }
  };

  const handleEditQuestions = (testId: string) => {
    setEditingQuestions(testId);
  };

  const handleSaveQuestions = (updatedTest: TestDefinition) => {
    const updatedTests = tests.map(test => 
      test.meta.id === updatedTest.meta.id ? updatedTest : test
    );
    setTests(updatedTests);
    onTestUpdate(updatedTests);
    setEditingQuestions(null);
  };

  const handleSaveTest = (testData: TestDefinition) => {
    if (editingTest) {
      // Обновляем существующий тест
      const updatedTests = tests.map(test => 
        test.meta.id === testData.meta.id ? testData : test
      );
      setTests(updatedTests);
    } else {
      // Добавляем новый тест
      setTests([...tests, testData]);
    }
    
    onTestUpdate(tests);
    setIsOpen(false);
    setEditingTest(null);
    
    // Автоматически переходим к редактированию вопросов для нового теста
    if (!editingTest) {
      setEditingQuestions(testData.meta.id);
    }
  };

  const handleAddNewTest = () => {
    const newTest: TestDefinition = {
      meta: {
        id: `test-${Date.now()}`,
        slug: `new-test-${Date.now()}`,
        title: "Новый тест",
        subtitle: "Описание нового теста",
        category: "relationships",
        tags: [],
        estMinutes: 5,
        questionsCount: 0,
        isPseudo: false,
        languages: ["ru"]
      },
      questions: [],
      scoring: {
        type: "weighted-domains" as const
      },
      resultRules: []
    };
    
    setEditingTest(newTest);
    setIsOpen(true);
  };

  return (
    <>
      {/* Test Manager Button */}
      <button
        onClick={() => {
          loadTests();
          setIsOpen(true);
        }}
        className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
      >
        <Settings className="h-5 w-5 mr-2" />
        Управление тестами
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  Управление тестами
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={handleAddNewTest}
                    className="btn-primary flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить тест
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Tests List */}
              <div className="space-y-4">
                {tests.map((test) => (
                  <div key={test.meta.id} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">
                          {test.meta.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {test.meta.subtitle}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>ID: {test.meta.id}</span>
                          <span>Slug: {test.meta.slug}</span>
                          <span>Вопросов: {test.meta.questionsCount}</span>
                          <span>Время: {test.meta.estMinutes} мин</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditQuestions(test.meta.id)}
                          className="text-green-600 hover:text-green-700 p-2"
                          title="Редактировать вопросы"
                        >
                          <BookOpen className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditTest(test)}
                          className="text-blue-600 hover:text-blue-700 p-2"
                          title="Редактировать тест"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTest(test.meta.id)}
                          className="text-red-600 hover:text-red-700 p-2"
                          title="Удалить тест"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {tests.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Тесты не найдены</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Test Editor Modal */}
      {editingTest && (
        <TestEditor
          test={editingTest}
          onSave={handleSaveTest}
          onClose={() => {
            setEditingTest(null);
            setIsOpen(false);
          }}
        />
      )}

      {/* Question Editor Modal */}
      {editingQuestions && (
        <QuestionEditor
          testId={editingQuestions}
          onClose={() => setEditingQuestions(null)}
          onSave={handleSaveQuestions}
        />
      )}
    </>
  );
}

// Компонент для редактирования теста
interface TestEditorProps {
  test: TestDefinition;
  onSave: (test: TestDefinition) => void;
  onClose: () => void;
}

function TestEditor({ test, onSave, onClose }: TestEditorProps) {
  const [editedTest, setEditedTest] = useState<TestDefinition>(test);

  const handleSave = () => {
    onSave(editedTest);
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800">
              {test.meta.id ? 'Редактировать тест' : 'Новый тест'}
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="btn-primary flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Сохранить
              </button>
              <button
                onClick={() => {
                  handleSave();
                  // Переходим к редактированию вопросов
                  setTimeout(() => {
                    if (typeof window !== 'undefined') {
                      window.dispatchEvent(new CustomEvent('editQuestions', { 
                        detail: { testId: test.meta.id } 
                      }));
                    }
                  }, 100);
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Редактировать вопросы
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
          </div>

          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Название теста
              </label>
              <input
                type="text"
                value={editedTest.meta.title}
                onChange={(e) => setEditedTest({
                  ...editedTest,
                  meta: { ...editedTest.meta, title: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Описание
              </label>
              <textarea
                value={editedTest.meta.subtitle}
                onChange={(e) => setEditedTest({
                  ...editedTest,
                  meta: { ...editedTest.meta, subtitle: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug (URL)
                </label>
                <input
                  type="text"
                  value={editedTest.meta.slug}
                  onChange={(e) => setEditedTest({
                    ...editedTest,
                    meta: { ...editedTest.meta, slug: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Время (минуты)
                </label>
                <input
                  type="number"
                  value={editedTest.meta.estMinutes}
                  onChange={(e) => setEditedTest({
                    ...editedTest,
                    meta: { ...editedTest.meta, estMinutes: parseInt(e.target.value) || 5 }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
