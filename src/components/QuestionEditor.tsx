"use client";

import { useState, useEffect } from "react";
import { Edit, Save, X, Plus, Trash2 } from "lucide-react";
import { TestDefinition, Question, Domain } from "@/lib/types";

interface QuestionEditorProps {
  testId: string;
  onClose: () => void;
  onSave: (test: TestDefinition) => void;
}

export default function QuestionEditor({ testId, onClose, onSave }: QuestionEditorProps) {
  const [test, setTest] = useState<TestDefinition | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState<Partial<Question> & { domain?: Domain }>({
    id: "",
    text: "",
    options: [],
    block: 1,
    domain: "A_SECURE"
  });

  useEffect(() => {
    const loadTestData = async () => {
      try {
        const response = await fetch(`/api/tests`);
        const tests = await response.json();
        const currentTest = tests.find((t: TestDefinition) => t.meta.id === testId);
        if (currentTest) {
          setTest(currentTest);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading test:', error);
        setIsLoading(false);
      }
    };
    
    loadTestData();
  }, [testId]);


  const handleEditQuestion = (questionId: string) => {
    const question = test?.questions.find(q => q.id === questionId);
    if (question) {
      setNewQuestion(question);
      setEditingQuestion(questionId);
    }
  };

  const handleAddNewQuestion = () => {
    setNewQuestion({
      id: `q_${Date.now()}`,
      text: "",
      options: [],
      block: 1,
      domain: "A_SECURE"
    });
    setEditingQuestion("new");
  };

  const handleSaveQuestion = () => {
    if (!test || !newQuestion.text?.trim()) return;

    const updatedTest = { ...test };
    
    if (editingQuestion === "new") {
      // Добавляем новый вопрос
      updatedTest.questions.push(newQuestion as Question);
    } else {
      // Обновляем существующий вопрос
      const questionIndex = updatedTest.questions.findIndex(q => q.id === editingQuestion);
      if (questionIndex !== -1) {
        updatedTest.questions[questionIndex] = newQuestion as Question;
      }
    }

    setTest(updatedTest);
    setEditingQuestion(null);
    setNewQuestion({
      id: "",
      text: "",
      options: [],
      block: 1,
      domain: "A_SECURE"
    });
  };

  const handleDeleteQuestion = (questionId: string) => {
    if (!test) return;
    
    const updatedTest = {
      ...test,
      questions: test.questions.filter(q => q.id !== questionId)
    };
    
    setTest(updatedTest);
  };

  const handleSaveTest = () => {
    if (test) {
      onSave(test);
    }
  };

  const addOption = () => {
    setNewQuestion(prev => ({
      ...prev,
      options: [...(prev.options || []), { id: `opt_${Date.now()}`, label: "", weight: 0 }]
    }));
  };

  const updateOption = (index: number, field: 'label' | 'weight', value: string | number) => {
    setNewQuestion(prev => ({
      ...prev,
      options: prev.options?.map((opt, i) => 
        i === index ? { ...opt, [field]: value } : opt
      ) || []
    }));
  };

  const removeOption = (index: number) => {
    setNewQuestion(prev => ({
      ...prev,
      options: prev.options?.filter((_, i) => i !== index) || []
    }));
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6">
          <p className="text-red-600">Тест не найден</p>
          <button onClick={onClose} className="btn-primary mt-4">Закрыть</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Редактирование вопросов</h2>
              <p className="text-gray-600">{test.meta.title}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleSaveTest}
                className="btn-primary flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Сохранить тест
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
          </div>

          {/* Add New Question Button */}
          <div className="mb-6">
            <button
              onClick={handleAddNewQuestion}
              className="btn-primary flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Добавить вопрос
            </button>
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            {test.questions.map((question, index) => (
              <div key={question.id} className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="bg-pink-100 text-pink-600 px-2 py-1 rounded-full text-sm font-medium">
                      Вопрос {index + 1}
                    </span>
                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-sm">
                      Блок {question.block}
                    </span>
                    <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-sm">
                      {(question as Question & { domain?: Domain }).domain || 'Не указан'}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditQuestion(question.id)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(question.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-800 font-medium mb-2">{question.text}</p>
                {question.options && question.options.length > 0 && (
                  <div className="space-y-1">
                        {question.options.map((option, optIndex) => (
                          <div key={optIndex} className="flex items-center space-x-2 text-sm">
                            <span className="text-gray-500">{optIndex + 1}.</span>
                            <span className="text-gray-700">{option.label}</span>
                            <span className="text-gray-400">({option.weight} баллов)</span>
                          </div>
                        ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Question Editor Form */}
          {editingQuestion && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
              <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">
                      {editingQuestion === "new" ? "Новый вопрос" : "Редактирование вопроса"}
                    </h3>
                    <button
                      onClick={() => setEditingQuestion(null)}
                      className="text-gray-400 hover:text-gray-600 text-2xl"
                    >
                      ×
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Question Text */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Текст вопроса
                      </label>
                      <textarea
                        value={newQuestion.text || ""}
                        onChange={(e) => setNewQuestion(prev => ({ ...prev, text: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        rows={3}
                        placeholder="Введите текст вопроса..."
                      />
                    </div>

                    {/* Block and Domain */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Блок
                        </label>
                        <select
                          value={newQuestion.block || 1}
                          onChange={(e) => setNewQuestion(prev => ({ ...prev, block: parseInt(e.target.value) as 1 | 2 | 3 | 4 }))}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        >
                          <option value={1}>1. Партнер в любви</option>
                          <option value={2}>2. Ценности</option>
                          <option value={3}>3. Язык любви</option>
                          <option value={4}>4. Реакции на конфликты</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Домен
                        </label>
                        <select
                          value={newQuestion.domain || "A_SECURE"}
                          onChange={(e) => setNewQuestion(prev => ({ ...prev, domain: e.target.value as Domain }))}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        >
                          <optgroup label="Привязанность">
                            <option value="A_SECURE">Надёжный</option>
                            <option value="A_ANXIOUS">Тревожный</option>
                            <option value="A_AVOIDANT">Избегающий</option>
                          </optgroup>
                          <optgroup label="Ценности">
                            <option value="V_SUPPORT">Поддержка</option>
                            <option value="V_PASSION">Страсть</option>
                            <option value="V_SECURITY">Безопасность</option>
                            <option value="V_GROWTH">Рост</option>
                          </optgroup>
                          <optgroup label="Язык любви">
                            <option value="L_WORDS">Слова</option>
                            <option value="L_TIME">Время</option>
                            <option value="L_GIFTS">Подарки</option>
                            <option value="L_SERVICE">Забота</option>
                            <option value="L_TOUCH">Прикосновения</option>
                          </optgroup>
                          <optgroup label="Конфликты">
                            <option value="C_COLLAB">Сотрудничество</option>
                            <option value="C_COMPROM">Компромисс</option>
                            <option value="C_AVOID">Избегание</option>
                            <option value="C_ACCOM">Приспособление</option>
                            <option value="C_COMPETE">Соперничество</option>
                          </optgroup>
                        </select>
                      </div>
                    </div>

                    {/* Options */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Варианты ответов
                        </label>
                        <button
                          onClick={addOption}
                          className="text-pink-600 hover:text-pink-800 flex items-center text-sm"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Добавить вариант
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        {newQuestion.options?.map((option, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-500 text-sm">{index + 1}.</span>
                            <input
                              type="text"
                              value={option.label}
                              onChange={(e) => updateOption(index, 'label', e.target.value)}
                              className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                              placeholder="Текст варианта ответа"
                            />
                            <input
                              type="number"
                              value={option.weight}
                              onChange={(e) => updateOption(index, 'weight', parseInt(e.target.value) || 0)}
                              className="w-20 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                              placeholder="Баллы"
                            />
                            <button
                              onClick={() => removeOption(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Save/Cancel */}
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                      <button
                        onClick={() => setEditingQuestion(null)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        Отмена
                      </button>
                      <button
                        onClick={handleSaveQuestion}
                        className="btn-primary flex items-center"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Сохранить вопрос
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
