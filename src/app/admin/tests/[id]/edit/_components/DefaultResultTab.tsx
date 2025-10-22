"use client";

import { useState, useEffect } from "react";
import { Save, FileJson, AlertCircle, CheckCircle } from "lucide-react";

interface DefaultResultData {
  summaryType: string;
  summary: string;
  recommendations: string[];
  scalesData: Record<string, any>;
}

export function DefaultResultTab({ testId }: { testId: string }) {
  const [data, setData] = useState<DefaultResultData>({
    summaryType: "Страстный Служебный",
    summary: "Ты — избегающий партнёр. Для тебя важны страсть и безопасность, а говорить о чувствах легче через заботу делами. В конфликтах ты стремишься к сотрудничество, что помогает находить баланс в отношениях.",
    recommendations: [
      "Развивай навыки вербального выражения чувств",
      "Работай над созданием безопасного пространства в отношениях",
      "Учись принимать уязвимость как силу, а не слабость"
    ],
    scalesData: {
      attachment: {
        secure: -25,
        anxious: -25,
        avoidant: 100
      },
      loveLanguage: {
        words: -25,
        time: -25,
        gifts: -25,
        service: 100,
        touch: 100
      },
      values: {
        support: -25,
        passion: 100,
        security: 100,
        growth: 100
      },
      conflict: {
        collab: -25,
        comprom: -25,
        avoid: -25,
        accom: -25,
        compete: -25
      }
    }
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [jsonInput, setJsonInput] = useState("");
  const [showJsonEditor, setShowJsonEditor] = useState(false);

  useEffect(() => {
    loadDefaultResult();
  }, [testId]);

  const loadDefaultResult = async () => {
    try {
      const response = await fetch(`/api/admin/tests/${testId}/default-result`);
      
      if (response.ok) {
        const result = await response.json();
        setData({
          summaryType: result.summaryType,
          summary: result.summary,
          recommendations: Array.isArray(result.recommendations) ? result.recommendations : [],
          scalesData: result.scalesData
        });
        setJsonInput(JSON.stringify(result.scalesData, null, 2));
      } else if (response.status === 404) {
        // No default result yet, use initial state
        setJsonInput(JSON.stringify(data.scalesData, null, 2));
      } else {
        console.error('Failed to load default result:', response.status);
      }
    } catch (error) {
      console.error('Error loading default result:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/tests/${testId}/default-result`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Сохранено!' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Ошибка сохранения' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Ошибка сохранения' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleJsonUpdate = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setData({ ...data, scalesData: parsed });
      setMessage({ type: 'success', text: 'JSON применён!' });
      setTimeout(() => setMessage(null), 2000);
      setShowJsonEditor(false);
    } catch (error) {
      setMessage({ type: 'error', text: 'Неверный JSON формат' });
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start space-x-3">
        <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">Результат по умолчанию</p>
          <p>Этот результат будет показан всем пользователям, когда режим расчёта установлен на "По умолчанию" во вкладке "Основная информация".</p>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`flex items-center space-x-2 p-3 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      {/* Summary Type */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Заголовок результата</h3>
        <input
          type="text"
          value={data.summaryType}
          onChange={(e) => setData({ ...data, summaryType: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          placeholder="Например: Страстный Служебный"
        />
      </div>

      {/* Summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Описание результата</h3>
        <textarea
          value={data.summary}
          onChange={(e) => setData({ ...data, summary: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          placeholder="Основное описание результата..."
        />
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Персональные рекомендации</h3>
        <div className="space-y-3">
          {data.recommendations.map((rec, index) => (
            <div key={index} className="flex items-start space-x-2">
              <span className="text-pink-500 font-bold mt-2">•</span>
              <textarea
                value={rec}
                onChange={(e) => {
                  const newRecs = [...data.recommendations];
                  newRecs[index] = e.target.value;
                  setData({ ...data, recommendations: newRecs });
                }}
                rows={2}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder={`Рекомендация ${index + 1}...`}
              />
              <button
                onClick={() => {
                  const newRecs = data.recommendations.filter((_, i) => i !== index);
                  setData({ ...data, recommendations: newRecs });
                }}
                className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors text-sm font-medium"
              >
                Удалить
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              setData({ 
                ...data, 
                recommendations: [...data.recommendations, ""] 
              });
            }}
            className="w-full px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-xl transition-colors font-medium"
          >
            + Добавить рекомендацию
          </button>
        </div>
      </div>

      {/* Scales Data */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Данные шкал</h3>
          <button
            onClick={() => setShowJsonEditor(!showJsonEditor)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium"
          >
            <FileJson className="h-4 w-4" />
            <span>{showJsonEditor ? 'Скрыть JSON' : 'Редактировать JSON'}</span>
          </button>
        </div>

        {showJsonEditor ? (
          <div className="space-y-3">
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              rows={20}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 font-mono text-sm"
            />
            <button
              onClick={handleJsonUpdate}
              className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors font-medium"
            >
              Применить JSON
            </button>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-4">
            <pre className="text-sm text-gray-700 overflow-auto">
              {JSON.stringify(data.scalesData, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Сохранение...
            </>
          ) : (
            <>
              <Save className="h-5 w-5 mr-2" />
              Сохранить
            </>
          )}
        </button>
      </div>
    </div>
  );
}

