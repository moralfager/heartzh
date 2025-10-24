'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import ComicFrame from '@/app/egg/_components/animations/ComicFrame';
import GlassCard from '@/app/egg/_components/ui/GlassCard';
import HeartButton from '@/app/egg/_components/ui/HeartButton';
import { useProgressStore } from '@/app/egg/_store/progressStore';
import { COMIC_SCENES, CHAPTERS } from '@/app/egg/_lib/constants';

type Stage = 'intro' | 'scenes' | 'outro' | 'complete';

export default function Chapter2() {
  const [stage, setStage] = useState<Stage>('intro');
  const [currentScene, setCurrentScene] = useState(0);
  const router = useRouter();
  const { completeChapter } = useProgressStore();

  const handleStartStory = () => {
    setStage('scenes');
  };

  const handleNextScene = () => {
    if (currentScene < COMIC_SCENES.length - 1) {
      setCurrentScene(currentScene + 1);
    } else {
      setStage('outro');
    }
  };

  const handlePrevScene = () => {
    if (currentScene > 0) {
      setCurrentScene(currentScene - 1);
    }
  };

  const handleComplete = () => {
    // Mark chapter as complete
    completeChapter('ch2', CHAPTERS.ch2.letterReveal);
    setStage('complete');
    
    // Navigate to next chapter after delay
    setTimeout(() => {
      router.push('/egg/chapter/3');
    }, 2000);
  };

  return (
    <div className="min-h-screen relative">
      <AnimatePresence mode="wait">
        {/* Stage 1: Intro */}
        {stage === 'intro' && (
          <motion.div
            key="intro"
            className="min-h-screen flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <GlassCard className="max-w-2xl text-center space-y-8">
              <motion.div
                className="text-7xl mb-4"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                📖
              </motion.div>

              <motion.h1
                className="text-4xl md:text-6xl font-display text-ink"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Наша история
              </motion.h1>

              <motion.div
                className="space-y-6 text-base md:text-lg lg:text-xl text-ink/80 font-sans px-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  Каждая история начинается с момента,
                  <br className="hidden md:block" />
                  который меняет всё.
                </motion.p>
                <motion.p
                  className="text-ink/70"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 }}
                >
                  Первый взгляд. Первые слова. Первые чувства.
                  <br className="hidden md:block" />
                  Всё это складывается в картину того, что мы создаем.
                </motion.p>
                <motion.div
                  className="pt-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.3 }}
                >
                  <p className="text-xl md:text-2xl lg:text-3xl font-display text-ink leading-relaxed">
                    Это — наша история 📖
                  </p>
                  <p className="text-base md:text-lg font-display text-ink/80 mt-2 italic">
                    Пролистай страницы нашего знакомства
                  </p>
                </motion.div>
              </motion.div>

              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <HeartButton
                  variant="heart"
                  size="lg"
                  onClick={handleStartStory}
                  className="min-w-[200px] max-w-sm px-12"
                >
                  Начать историю
                </HeartButton>
              </motion.div>
            </GlassCard>
          </motion.div>
        )}

        {/* Stage 2: Comic Scenes */}
        {stage === 'scenes' && (
          <motion.div
            key="scenes"
            className="min-h-screen flex flex-col items-center justify-center p-6 py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Scene counter */}
            <motion.div
              className="mb-8 glass-strong px-6 py-2 rounded-full"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-sm text-ink/70 font-sans">
                Сцена {currentScene + 1} из {COMIC_SCENES.length}
              </p>
            </motion.div>

            {/* Comic frame */}
            <AnimatePresence mode="wait">
              <ComicFrame
                key={currentScene}
                title={COMIC_SCENES[currentScene].title}
                text={COMIC_SCENES[currentScene].text}
                image={COMIC_SCENES[currentScene].image}
                emoji={
                  currentScene === 0
                    ? '🤝'
                    : currentScene === 1
                    ? '💫'
                    : currentScene === 2
                    ? '🫂'
                    : currentScene === 3
                    ? '💭'
                    : currentScene === 4
                    ? '🔒'
                    : '💞'
                }
                gradient={
                  currentScene === 0
                    ? 'from-blush to-lavender'
                    : currentScene === 1
                    ? 'from-lavender to-rose'
                    : currentScene === 2
                    ? 'from-rose to-blush'
                    : currentScene === 3
                    ? 'from-blush to-lavender'
                    : currentScene === 4
                    ? 'from-lavender to-rose'
                    : 'from-rose to-blush'
                }
                index={currentScene}
              />
            </AnimatePresence>

            {/* Navigation buttons */}
            <motion.div
              className="flex gap-4 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {currentScene > 0 && (
                <HeartButton
                  variant="secondary"
                  size="md"
                  onClick={handlePrevScene}
                  icon={<span>←</span>}
                >
                  Назад
                </HeartButton>
              )}

              <HeartButton
                variant="heart"
                size="md"
                onClick={handleNextScene}
                icon={currentScene < COMIC_SCENES.length - 1 ? <span>→</span> : undefined}
              >
                {currentScene < COMIC_SCENES.length - 1
                  ? 'Дальше'
                  : 'Завершить'}
              </HeartButton>
            </motion.div>

            {/* Swipe hint */}
            {currentScene === 0 && (
              <motion.p
                className="mt-6 text-sm text-ink/50 font-sans"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                Используйте кнопки для навигации
              </motion.p>
            )}
          </motion.div>
        )}

        {/* Stage 3: Outro - QR Unlock Info */}
        {stage === 'outro' && (
          <motion.div
            key="outro"
            className="min-h-screen flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <GlassCard className="max-w-2xl text-center space-y-8">
              <motion.div
                className="text-7xl mb-4"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 10,
                }}
              >
                🎁
              </motion.div>

              <h2 className="text-3xl md:text-4xl font-display text-ink">
                История продолжается...
              </h2>

              <div className="space-y-4 text-lg text-ink/80 font-sans">
                <p>
                  Каждый момент нашей истории — это шаг к чему-то особенному.
                </p>
                <p className="text-xl font-display text-ink">
                  А теперь — следующая глава ждёт тебя.
                </p>
              </div>

            

              <div className="flex justify-center">
                <HeartButton
                  variant="heart"
                  size="lg"
                  onClick={handleComplete}
                  className="min-w-[240px] max-w-sm px-12"
                >
                  Я готова продолжить ❤️
                </HeartButton>
              </div>

              <div className="flex justify-center">
                <button
                  className="text-sm text-ink/60 hover:text-ink underline"
                  onClick={() => setStage('scenes')}
                >
                  ← Вернуться к истории
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Stage 4: Complete - Transition */}
        {stage === 'complete' && (
          <motion.div
            key="complete"
            className="fixed inset-0 flex items-center justify-center bg-rose z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center space-y-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              <div className="text-8xl">✨</div>
              <h2 className="text-4xl font-display text-ink">
                Глава {CHAPTERS.ch2.letterReveal} раскрыта
              </h2>
              <p className="text-lg text-ink/70">Переходим к следующей главе...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

