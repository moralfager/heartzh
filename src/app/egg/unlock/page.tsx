'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useProgressStore } from '@/app/egg/_store/progressStore';
import GlassCard from '@/app/egg/_components/ui/GlassCard';

function UnlockContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Проверяем код...');
  const { unlockChapter } = useProgressStore();

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Токен не найден. Проверь QR код.');
      return;
    }

    // Verify token via API
    fetch('/api/egg/verify-unlock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.valid && data.chapterId) {
          // Unlock the chapter
          const chapterId = data.chapterId as 'ch1' | 'ch2' | 'ch3' | 'ch4' | 'ch5';
          unlockChapter(chapterId);

          setStatus('success');
          setMessage(`Глава ${chapterId.replace('ch', '')} разблокирована!`);

          // Redirect to the chapter after a delay
          setTimeout(() => {
            router.push(`/chapter/${chapterId.replace('ch', '')}`);
          }, 2000);
        } else {
          setStatus('error');
          setMessage(data.error || 'Неверный или истёкший код. Попробуй снова.');
        }
      })
      .catch((error) => {
        console.error('Error unlocking chapter:', error);
        setStatus('error');
        setMessage('Ошибка проверки токена. Попробуй снова.');
      });
  }, [searchParams, router, unlockChapter]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <GlassCard className="max-w-md text-center space-y-6">
        {status === 'loading' && (
          <>
            <motion.div
              className="w-16 h-16 mx-auto border-4 border-lavender border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <p className="text-lg text-ink/70 font-sans">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <motion.div
              className="text-6xl"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
            >
              ✨
            </motion.div>
            <h2 className="text-3xl font-display text-ink">Успех!</h2>
            <p className="text-lg text-ink/70 font-sans">{message}</p>
            <p className="text-sm text-ink/50">Перенаправляем...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <motion.div
              className="text-6xl"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
            >
              ❌
            </motion.div>
            <h2 className="text-3xl font-display text-ink">Ошибка</h2>
            <p className="text-lg text-ink/70 font-sans">{message}</p>
            <button
              onClick={() => router.push('/')}
              className="
                px-6 py-3 rounded-[16px]
                bg-gradient-to-br from-blush to-lavender
                text-ink font-sans font-medium
                hover:scale-105 active:scale-95
                transition-all duration-300
              "
            >
              Вернуться на главную
            </button>
          </>
        )}
      </GlassCard>
    </div>
  );
}

export default function UnlockPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-6">
          <GlassCard className="max-w-md text-center space-y-6">
            <motion.div
              className="w-16 h-16 mx-auto border-4 border-lavender border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <p className="text-lg text-ink/70 font-sans">Загрузка...</p>
          </GlassCard>
        </div>
      }
    >
      <UnlockContent />
    </Suspense>
  );
}

