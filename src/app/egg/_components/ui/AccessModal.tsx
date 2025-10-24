'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AccessModal({ isOpen, onClose, onSuccess }: AccessModalProps) {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const checkAnswer = () => {
    const normalizedAnswer = answer.trim().toLowerCase();
    const correctAnswers = ['arman', 'арман'];
    
    if (correctAnswers.includes(normalizedAnswer)) {
      // Правильный ответ - сохраняем в localStorage и переходим
      localStorage.setItem('egg_access_granted', 'true');
      setError('');
      onSuccess();
    } else {
      // Неправильный ответ
      setError('Неправильный ответ, попробуй ещё раз 💔');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setAnswer('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim()) {
      checkAnswer();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ 
                scale: isShaking ? [1, 1.02, 0.98, 1.02, 1] : 1, 
                opacity: 1 
              }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative"
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Heart icon */}
              <div className="flex justify-center mb-6">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center"
                >
                  <span className="text-4xl">❤️</span>
                </motion.div>
              </div>

              {/* Question */}
              <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
                Вопрос для доступа
              </h2>
              <p className="text-gray-600 text-center mb-6">
                Введи имя своего младшего братишки
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Введи имя..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-400 focus:outline-none transition-colors text-center text-lg font-medium"
                    autoFocus
                  />
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm text-center"
                  >
                    {error}
                  </motion.div>
                )}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-400 to-purple-400 text-white font-semibold py-3 rounded-xl hover:from-pink-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105"
                >
                  Проверить
                </button>
              </form>

              <p className="text-xs text-gray-400 text-center mt-4">
                Подсказка: имя на латинице или кириллице 💭
              </p>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

