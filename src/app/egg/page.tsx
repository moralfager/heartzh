'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useProgressStore } from '@/app/egg/_store/progressStore';
import HeartButton from '@/app/egg/_components/ui/HeartButton';
import GlassCard from '@/app/egg/_components/ui/GlassCard';
import AudioController from '@/app/egg/_components/layout/AudioController';

export default function Home() {
  const router = useRouter();
  const { current, chapters, startedAt } = useProgressStore();
  const [isClient, setIsClient] = useState(false);
  const [showResumeLink, setShowResumeLink] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('');
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Проверяем доступ
    if (typeof window !== 'undefined') {
      const access = localStorage.getItem('egg_access_granted');
      if (!access) {
        // Нет доступа - редиректим на about
        router.push('/about');
      } else {
        setHasAccess(true);
      }
    }
  }, [router]);

  const hasStarted = startedAt !== null;
  const currentChapterNum = current ? parseInt(current.replace('ch', '')) : 1;

  const handleStart = () => {
    router.push('/egg/chapter/1');
  };

  const handleContinue = () => {
    router.push(`/egg/chapter/${currentChapterNum}`);
  };

  const handleGenerateResumeLink = async () => {
    try {
      const progress = useProgressStore.getState();
      const response = await fetch('/api/egg/generate-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progress }),
      });

      const data = await response.json();
      setResumeUrl(data.resumeUrl);
      setShowResumeLink(true);

      // Copy to clipboard
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(data.resumeUrl);
      }
    } catch (error) {
      console.error('Error generating resume link:', error);
    }
  };

  if (!isClient || !hasAccess) {
    return null; // Prevent hydration mismatch and unauthorized access
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <AudioController />

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-blush/30 via-rose/20 to-transparent" />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-lavender/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <GlassCard className="max-w-2xl text-center space-y-8 relative z-10">
        {/* Logo/Title with animated heart */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <motion.div
            className="text-6xl md:text-8xl mb-4"
            animate={{
              scale: [1, 1.1, 1],
              filter: [
                'drop-shadow(0 0 10px rgba(232, 227, 255, 0.5))',
                'drop-shadow(0 0 20px rgba(255, 214, 231, 0.8))',
                'drop-shadow(0 0 10px rgba(232, 227, 255, 0.5))',
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            ❤️
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-display text-ink mb-4 leading-tight">
            Heart of Zh.A.
          </h1>
          <p className="text-xl md:text-2xl font-display text-ink/70 italic">
            Journey to Her Heart
          </p>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="text-lg text-ink/60 font-sans max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Интерактивный квест из 5 глав о чувствах, кодах и доверии
        </motion.p>

        {/* Buttons */}
        <motion.div
          className="space-y-4 pt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          {hasStarted ? (
            <>
              <div className="flex justify-center w-full">
                <HeartButton
                  variant="heart"
                  size="lg"
                  onClick={handleContinue}
                  className="min-w-[240px] max-w-sm px-12"
                >
                  Продолжить (Глава {currentChapterNum})
                </HeartButton>
              </div>

              <div className="flex justify-center w-full">
                <HeartButton
                  variant="secondary"
                  size="md"
                  onClick={() => router.push('/egg/map')}
                  className="min-w-[240px] max-w-sm px-12"
                >
                  Карта путешествия
                </HeartButton>
              </div>

              <button
                onClick={handleGenerateResumeLink}
                className="text-sm text-ink/60 hover:text-ink underline transition-colors"
              >
                Получить ссылку для возврата
              </button>

              {showResumeLink && (
                <motion.div
                  className="p-4 rounded-xl glass text-sm"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-ink/70 mb-2">
                    Ссылка скопирована в буфер обмена!
                  </p>
                  <p className="text-xs text-ink/50 break-all font-mono">
                    {resumeUrl}
                  </p>
                </motion.div>
              )}
            </>
          ) : (
            <>
              <div className="flex justify-center w-full">
                <HeartButton
                  variant="heart"
                  size="lg"
                  onClick={handleStart}
                  className="min-w-[240px] max-w-sm px-12"
                  icon={<span>❤️</span>}
                >
                  Начать путешествие
                </HeartButton>
              </div>

              <p className="text-sm text-ink/50 font-sans text-center">
                Приготовь сердце к приключению...
              </p>
            </>
          )}
        </motion.div>

        {/* Footer hint */}
        <motion.p
          className="text-xs text-ink/40 font-sans pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          Создано с любовью для Жаният
        </motion.p>
      </GlassCard>
    </main>
  );
}
