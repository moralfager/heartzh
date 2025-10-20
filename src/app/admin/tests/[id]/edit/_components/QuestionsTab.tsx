'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { QuestionEditor } from './QuestionEditor';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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

// Sortable Question Item Component
function SortableQuestionItem({
  question,
  index,
  expandedQuestion,
  onToggleExpand,
  onEdit,
  onDelete,
}: {
  question: Question;
  index: number;
  expandedQuestion: string | null;
  onToggleExpand: (id: string) => void;
  onEdit: (q: Question) => void;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group hover:bg-gray-50 transition-colors"
    >
      <div className="p-4 flex items-start gap-4">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="flex-shrink-0 pt-1 cursor-move opacity-50 hover:opacity-100 transition-opacity"
        >
          <GripVertical className="h-5 w-5 text-gray-400" />
        </div>

        {/* Order Number */}
        <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-medium text-gray-600">
          {index + 1}
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
                onClick={() => onToggleExpand(question.id)}
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
                onClick={() => onEdit(question)}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                title="Редактировать"
              >
                <Edit2 className="h-5 w-5 text-blue-600" />
              </button>
              <button
                onClick={() => onDelete(question.id)}
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
                <div key={option.id} className="bg-gray-50 rounded-lg p-3 text-sm">
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
  );
}

export function QuestionsTab({ testId, questions, onRefresh }: QuestionsTabProps) {
  const [localQuestions, setLocalQuestions] = useState<Question[]>(questions);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Sync local state with props
  useEffect(() => {
    setLocalQuestions(questions);
  }, [questions]);

  const toggleExpand = (questionId: string) => {
    setExpandedQuestion(prev => prev === questionId ? null : questionId);
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setIsEditorOpen(true);
  };

  const handleAdd = () => {
    setEditingQuestion(null);
    setIsEditorOpen(true);
  };

  const handleEditorClose = () => {
    setIsEditorOpen(false);
    setEditingQuestion(null);
  };

  const handleEditorSave = () => {
    onRefresh();
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = localQuestions.findIndex((q) => q.id === active.id);
    const newIndex = localQuestions.findIndex((q) => q.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    // Optimistic update
    const newQuestions = arrayMove(localQuestions, oldIndex, newIndex);
    setLocalQuestions(newQuestions);

    // Save to server
    setIsSaving(true);
    try {
      const questionIds = newQuestions.map((q) => q.id);
      const response = await fetch(`/api/admin/tests/${testId}/questions/reorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questionIds }),
      });

      if (!response.ok) {
        // Revert on error
        setLocalQuestions(questions);
        alert('Ошибка при изменении порядка вопросов');
      }
    } catch (error) {
      console.error('Error reordering questions:', error);
      setLocalQuestions(questions);
      alert('Ошибка при изменении порядка вопросов');
    } finally {
      setIsSaving(false);
    }
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
          onClick={handleAdd}
          className="inline-flex items-center px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-xl transition-colors font-medium"
        >
          <Plus className="h-5 w-5 mr-2" />
          Добавить вопрос
        </button>
      </div>

      {/* Questions List */}
      <div className="divide-y divide-gray-100 relative">
        {isSaving && (
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/50 flex items-center justify-center z-10">
            <div className="bg-white rounded-lg shadow-lg p-4 flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-pink-500"></div>
              <span className="text-gray-700">Сохранение порядка...</span>
            </div>
          </div>
        )}
        
        {localQuestions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-2">Нет вопросов</p>
            <p className="text-sm text-gray-500">
              Добавьте первый вопрос или импортируйте из JSON
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={localQuestions.map((q) => q.id)}
              strategy={verticalListSortingStrategy}
            >
              {localQuestions.map((question, index) => (
                <SortableQuestionItem
                  key={question.id}
                  question={question}
                  index={index}
                  expandedQuestion={expandedQuestion}
                  onToggleExpand={toggleExpand}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Question Editor Modal */}
      {isEditorOpen && (
        <QuestionEditor
          testId={testId}
          question={editingQuestion}
          onSave={handleEditorSave}
          onClose={handleEditorClose}
        />
      )}
    </div>
  );
}

