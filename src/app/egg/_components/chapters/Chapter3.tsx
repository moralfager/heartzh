'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import TrustHands from '@/app/egg/_components/animations/TrustHands';
import GlassCard from '@/app/egg/_components/ui/GlassCard';
import CodeInput from '@/app/egg/_components/ui/CodeInput';
import { useProgressStore } from '@/app/egg/_store/progressStore';
import { HINTS, CHAPTERS } from '@/app/egg/_lib/constants';

type Stage = 'intro' | 'narrative' | 'interactive' | 'code' | 'complete';

export default function Chapter3() {
  const [stage, setStage] = useState<Stage>('intro');
  const router = useRouter();
  const { completeChapter } = useProgressStore();

  const handleIntroContinue = () => {
    setStage('narrative');
  };

  const handleNarrativeContinue = () => {
    setStage('interactive');
  };

  const handleInteractiveComplete = () => {
    setStage('code');
  };

  const handleCodeSubmit = async (code: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/egg/check-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapterId: 'ch3',
          code,
        }),
      });

      const data = await response.json();

      if (data.valid) {
        completeChapter('ch3', CHAPTERS.ch3.letterReveal);
        setStage('complete');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error validating code:', error);
      return false;
    }
  };

  const handleComplete = () => {
    router.push('/egg/chapter/4');
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
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                🤝
              </motion.div>

              <h1 className="text-4xl md:text-6xl font-display text-ink">
                Доверие
              </h1>

              <motion.div
                className="space-y-4 text-base md:text-lg lg:text-xl text-ink/80 font-sans px-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p>
                  Каждый шаг к сердцу начинается с доверия.
                </p>
                <p className="text-ink/70">
                  Это основа всего, что мы строим вместе.
                  <br className="hidden md:block" />
                  Без доверия невозможна настоящая близость.
                </p>
                <p className="text-xl md:text-2xl font-display text-ink pt-2">
                  Давай проверим, готовы ли мы доверять друг другу? 💫
                </p>
              </motion.div>

              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <motion.button
                  onClick={handleIntroContinue}
                  className="
                    px-10 py-5 rounded-[20px]
                    bg-gradient-to-br from-blush to-lavender
                    text-ink font-sans font-semibold text-lg
                    shadow-2xl shadow-lavender/30
                    border-2 border-glow/20
                    relative overflow-hidden
                  "
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-lavender/0 via-glow/30 to-lavender/0"
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                  <span className="relative z-10">Продолжить</span>
                </motion.button>
              </motion.div>
            </GlassCard>
          </motion.div>
        )}

        {/* Stage 2: Narrative */}
        {stage === 'narrative' && (
          <motion.div
            key="narrative"
            className="min-h-screen flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <GlassCard className="max-w-3xl space-y-8">
              <h2 className="text-3xl md:text-4xl font-display text-ink text-center">
                Что значит доверие?
              </h2>

              <div className="space-y-6 text-lg text-ink/80 font-sans">
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Я не прошу верить сразу. Я прошу доверить мне твоё время,
                  внимание и сердце.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Потому что я хочу вкладываться в нас — в наши разговоры,
                  наши планы, наше будущее.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  Я буду бережным к твоим границам и щедрым к нашим мечтам.
                </motion.p>

                <motion.div
                  className="p-6 rounded-xl glass mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <p className="text-xl font-display text-ink text-center italic">
                    "Доверие — это когда ты знаешь,
                    <br />
                    что твоё сердце в надёжных руках."
                  </p>
                </motion.div>
              </div>

              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                <motion.button
                  onClick={handleNarrativeContinue}
                  className="
                    px-10 py-5 rounded-[20px]
                    bg-gradient-to-br from-blush to-lavender
                    text-ink font-sans font-semibold text-lg
                    shadow-2xl shadow-lavender/30
                    border-2 border-glow/20
                    relative overflow-hidden
                  "
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-lavender/0 via-glow/30 to-lavender/0"
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                  <span className="relative z-10">
                    Я понимаю
                  </span>
                </motion.button>
              </motion.div>
            </GlassCard>
          </motion.div>
        )}

        {/* Stage 3: Interactive TrustHands */}
        {stage === 'interactive' && (
          <motion.div
            key="interactive"
            className="min-h-screen flex flex-col items-center justify-center p-6 py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.h2
              className="text-3xl md:text-4xl font-display text-ink text-center mb-12"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Давай вместе создадим доверие
            </motion.h2>

            <TrustHands onComplete={handleInteractiveComplete} />

            <motion.p
              className="mt-8 text-center text-ink/60 font-sans max-w-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Нажми и держи кнопку, чтобы руки соединились.
              <br />
              Это символ нашего доверия друг к другу.
            </motion.p>
          </motion.div>
        )}

        {/* Stage 3: Code Input */}
        {stage === 'code' && (
          <motion.div
            key="code"
            className="min-h-screen flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <GlassCard className="max-w-md text-center space-y-8">
              <motion.div
                className="text-7xl mb-4"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              >
                🔑
              </motion.div>

              <h2 className="text-3xl md:text-4xl font-display text-ink">
                Ключ доверия
              </h2>

              <p className="text-ink/70 font-sans text-base md:text-lg">
                Теперь введи слово, которое символизирует эту главу.
                <br />
                Это слово — основа всех отношений.
              </p>

              <CodeInput
                onSubmit={handleCodeSubmit}
                placeholder="Введи слово доверия..."
                hint={HINTS.ch3}
              />


            </GlassCard>
          </motion.div>
        )}

        {/* Stage 5: Complete */}
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
              <div className="text-8xl">🤝</div>
              <h2 className="text-4xl font-display text-ink">
                Буква {CHAPTERS.ch3.letterReveal} раскрыта
              </h2>
              <p className="text-lg text-ink/70">
                Доверие установлено. Переходим дальше...
              </p>

              <motion.button
                onClick={handleComplete}
                className="
                  px-8 py-4 rounded-[16px]
                  bg-gradient-to-br from-blush to-lavender
                  text-ink font-sans font-medium
                  shadow-glass
                "
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                К следующей главе →
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

