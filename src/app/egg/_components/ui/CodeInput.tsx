'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import HeartButton from './HeartButton';

interface CodeInputProps {
  onSubmit: (code: string) => Promise<boolean>;
  placeholder?: string;
  hint?: string;
  showHint?: boolean;
  disabled?: boolean;
}

export default function CodeInput({
  onSubmit,
  placeholder = 'Введите код...',
  hint,
  showHint = true,
  disabled = false,
}: CodeInputProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHintText, setShowHintText] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!code.trim() || isLoading || disabled) return;

    setIsLoading(true);
    setError('');

    try {
      const isValid = await onSubmit(code.trim().toLowerCase());
      
      if (!isValid) {
        setError('Неверный код. Попробуй ещё раз...');
        setCode('');
        
        // Shake animation on error
        const input = document.getElementById('code-input');
        input?.classList.add('animate-shake');
        setTimeout(() => input?.classList.remove('animate-shake'), 500);
      }
    } catch (err) {
      setError('Что-то пошло не так. Попробуй снова.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
    setError('');
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <motion.input
            id="code-input"
            type="text"
            value={code}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled || isLoading}
            className="
              w-full px-6 py-4
              rounded-[16px]
              glass-strong
              text-ink font-mono text-center text-lg
              placeholder:text-ink/40
              focus:outline-none focus:ring-2 focus:ring-lavender
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-300
            "
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          />
          
          {error && (
            <motion.p
              className="absolute -bottom-6 left-0 text-sm text-red-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.p>
          )}
        </div>

        <div className="flex justify-center w-full">
          <HeartButton
            type="submit"
            variant="heart"
            size="lg"
            disabled={disabled || isLoading || !code.trim()}
            className="min-w-[200px] max-w-sm px-12"
          >
            {isLoading ? 'Проверяю...' : 'Открыть'}
          </HeartButton>
        </div>
      </form>

      {showHint && hint && (
        <div className="text-center">
          {!showHintText ? (
            <button
              type="button"
              onClick={() => setShowHintText(true)}
              className="text-sm text-ink/60 hover:text-ink underline transition-colors"
            >
              Нужна подсказка?
            </button>
          ) : (
            <motion.p
              className="text-sm text-ink/80 italic"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              💡 {hint}
            </motion.p>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}

