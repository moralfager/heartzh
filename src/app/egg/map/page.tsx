'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useProgressStore, ChapterId } from '@/app/egg/_store/progressStore';
import GlassCard from '@/app/egg/_components/ui/GlassCard';
import AudioController from '@/app/egg/_components/layout/AudioController';
import { CHAPTERS } from '@/app/egg/_lib/constants';

export default function MapPage() {
  const router = useRouter();
  const { chapters, current } = useProgressStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const chapterIds: ChapterId[] = ['ch1', 'ch2', 'ch3', 'ch4', 'ch5'];

  const handleChapterClick = (chapterId: ChapterId) => {
    const status = chapters[chapterId];
    
    if (status === 'locked') {
      // Show locked message
      return;
    }

    // Navigate to chapter
    const chapterNum = chapterId.replace('ch', '');
    router.push(`/chapter/${chapterNum}`);
  };

  return (
    <div className="min-h-screen p-6 relative overflow-hidden">
      <AudioController />

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-radial from-lavender/20 via-rose/10 to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            className="text-5xl md:text-7xl mb-4"
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 2, -2, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            🗺️
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-display text-ink mb-4 leading-tight px-4">
            Карта путешествия
          </h1>
          <p className="text-base md:text-lg text-ink/70 font-sans px-4">
            Твой путь к сердцу
            <br className="md:hidden" />
            <span className="hidden md:inline"> — </span>
            каждая глава приближает к цели
          </p>
        </motion.div>

        {/* Chapter map */}
        <div className="space-y-6">
          {chapterIds.map((chapterId, index) => {
            const chapter = CHAPTERS[chapterId];
            const status = chapters[chapterId];
            const isLocked = status === 'locked';
            const isCompleted = status === 'completed';
            const isCurrent = current === chapterId;

            return (
              <motion.div
                key={chapterId}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard
                  className={`
                    cursor-pointer
                    ${isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:scale-102'}
                    ${isCurrent ? 'ring-2 ring-lavender' : ''}
                  `}
                  onClick={() => handleChapterClick(chapterId)}
                  whileHover={!isLocked ? { scale: 1.02 } : {}}
                  whileTap={!isLocked ? { scale: 0.98 } : {}}
                >
                  <div className="flex items-center gap-3 md:gap-6">
                    {/* Chapter number/icon */}
                    <motion.div
                      className={`
                        flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-full
                        flex items-center justify-center
                        text-xl md:text-2xl font-display font-bold
                        transition-all duration-300
                        ${
                          isCompleted
                            ? 'bg-lavender text-glow shadow-lg shadow-lavender/50'
                            : status === 'unlocked'
                            ? 'bg-blush text-ink shadow-lg shadow-blush/50'
                            : 'bg-ink/10 text-ink/30'
                        }
                      `}
                      whileHover={!isLocked ? { scale: 1.1, rotate: 5 } : {}}
                    >
                      {isCompleted ? '✓' : index + 1}
                    </motion.div>

                    {/* Chapter info */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`
                          text-lg md:text-2xl font-display mb-1 md:mb-2
                          truncate sm:whitespace-normal
                          ${isLocked ? 'text-ink/30' : 'text-ink'}
                        `}
                      >
                        {chapter.title}
                      </h3>
                      <p
                        className={`
                          text-xs md:text-sm font-sans
                          line-clamp-2 sm:line-clamp-none
                          ${isLocked ? 'text-ink/20' : 'text-ink/70'}
                        `}
                      >
                        {chapter.description}
                      </p>
                    </div>

                    {/* Status indicator */}
                    <div className="flex-shrink-0">
                      {isLocked && (
                        <div className="text-2xl md:text-3xl opacity-30">🔒</div>
                      )}
                      {isCompleted && (
                        <motion.div
                          className="text-2xl md:text-3xl"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: 'spring' }}
                        >
                          ✨
                        </motion.div>
                      )}
                      {status === 'unlocked' && !isCompleted && isCurrent && (
                        <motion.div
                          className="w-2 h-2 md:w-3 md:h-3 bg-lavender rounded-full"
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [1, 0.5, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Letter reveal indicator */}
                  {isCompleted && (
                    <motion.div
                      className="mt-4 pt-4 border-t border-ink/10 text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <span className="text-sm text-ink/50 font-sans">
                        Буква раскрыта:{' '}
                      </span>
                      <span className="text-lg font-display text-lavender">
                        {chapter.letterReveal}
                      </span>
                    </motion.div>
                  )}
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        {/* Back to home */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <button
            onClick={() => router.push('/')}
            className="
              px-6 py-3 rounded-[16px]
              glass-strong
              text-ink font-sans
              hover:scale-105 active:scale-95
              transition-all duration-300
            "
          >
            ← Вернуться на главную
          </button>
        </motion.div>
      </div>
    </div>
  );
}

