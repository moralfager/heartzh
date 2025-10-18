"use client";

import { useState } from "react";
import { Trash2, AlertTriangle, CheckCircle, X } from "lucide-react";

interface ClearResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  resultsCount: number;
}

export default function ClearResultsModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  resultsCount 
}: ClearResultsModalProps) {
  const [isClearing, setIsClearing] = useState(false);
  const [isCleared, setIsCleared] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsClearing(true);
    
    // Симуляция процесса очистки
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onConfirm();
    setIsClearing(false);
    setIsCleared(true);
    
    // Автоматически закрываем модал через 2 секунды
    setTimeout(() => {
      setIsCleared(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Очистка результатов
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isClearing}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {!isCleared ? (
            <>
              {/* Warning */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-800 mb-1">
                      Внимание! Это действие необратимо
                    </h4>
                    <p className="text-sm text-red-700">
                      Вы собираетесь удалить все результаты тестов ({resultsCount} записей). 
                      Это действие нельзя отменить.
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-gray-800 mb-2">Будет удалено:</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Все результаты тестов ({resultsCount} записей)</li>
                  <li>• Статистика и аналитика</li>
                  <li>• История прохождений</li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isClearing}
                >
                  Отмена
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={isClearing}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isClearing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Очистка...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Удалить все
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                Результаты успешно очищены!
              </h4>
              <p className="text-gray-600">
                Все данные удалены из системы.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
