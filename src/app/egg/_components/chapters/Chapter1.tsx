'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import HeartAssembly from '@/app/egg/_components/animations/HeartAssembly';
import RoseBloom from '@/app/egg/_components/animations/RoseBloom';
import GlassCard from '@/app/egg/_components/ui/GlassCard';
import CodeInput from '@/app/egg/_components/ui/CodeInput';
import { useProgressStore } from '@/app/egg/_store/progressStore';
import { HINTS, CHAPTERS } from '@/app/egg/_lib/constants';

type Stage = 'assembly' | 'narrative' | 'code' | 'bloom' | 'complete';

export default function Chapter1() {
  const [stage, setStage] = useState<Stage>('assembly');
  const router = useRouter();
  const { completeChapter } = useProgressStore();

  const handleAssemblyComplete = () => {
    setStage('narrative');
  };

  const handleNarrativeContinue = () => {
    setStage('code');
  };

  const handleCodeSubmit = async (code: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/egg/check-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapterId: 'ch1',
          code,
        }),
      });

      const data = await response.json();

      if (data.valid) {
        // Mark chapter as complete and unlock next
        completeChapter('ch1', CHAPTERS.ch1.letterReveal);
        setStage('bloom');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error validating code:', error);
      return false;
    }
  };

  const handleBloomComplete = () => {
    setStage('complete');
    // Navigate to next chapter
    setTimeout(() => {
      router.push('/egg/chapter/2');
    }, 500);
  };

  return (
    <div className="min-h-screen relative">
      <AnimatePresence mode="wait">
        {/* Stage 1: Heart Assembly */}
        {stage === 'assembly' && (
          <motion.div
            key="assembly"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <HeartAssembly onComplete={handleAssemblyComplete} />
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
            <GlassCard className="max-w-2xl text-center space-y-8">
              <motion.h1
                className="text-4xl md:text-6xl font-display text-ink"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Heart of Zhaniyat
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
                  Это история о чувствах...
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 }}
                  className="text-ink/70"
                >
                  Здесь 5 глав.
                  <br className="hidden md:block" />
                  Каждая раскрывает букву тайного послания.
                </motion.p>
                <motion.div
                  className="pt-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.3 }}
                >
                  <p className="text-xl md:text-2xl font-display text-ink leading-relaxed">
                    Чтобы начать путешествие, <br className="md:hidden" />
                    введи название цветка,
                  </p>
                  <p className="text-lg md:text-xl font-display text-ink/80 mt-2 italic">
                    который я подарил тебе при последней встрече 🌹
                  </p>
                </motion.div>
              </motion.div>

              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 }}
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
                  <span className="relative z-10">Продолжить</span>
                </motion.button>
              </motion.div>
            </GlassCard>
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
            <GlassCard className="max-w-md text-center space-y-8 relative overflow-hidden">
              {/* Floating petals around the rose */}
              <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-3xl opacity-40"
                    style={{
                      left: `${20 + (i * 10)}%`,
                      top: `${15 + (i % 3) * 20}%`,
                    }}
                    animate={{
                      y: [0, -15, 0],
                      rotate: [0, 360],
                      opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{
                      duration: 4 + i * 0.3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.2,
                    }}
                  >
                    🌸
                  </motion.div>
                ))}
              </div>

              <motion.div className="relative z-10">
                <motion.div
                  className="text-7xl md:text-8xl mb-4 relative inline-block"
                  animate={{
                    scale: [1, 1.15, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  🌹
                  {/* Glow effect */}
                  <motion.div
                    className="absolute inset-0 blur-2xl opacity-30"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    style={{
                      background: 'radial-gradient(circle, #F7CAD0 0%, transparent 70%)',
                    }}
                  />
                </motion.div>

                <motion.h2
                  className="text-3xl md:text-4xl font-display text-ink mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Первый ключ
                </motion.h2>

                <motion.div
                  className="space-y-4 mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-ink/80 font-sans text-lg">
                    Это цветок такой же элегантный как ты
                  </p>
                  <p className="text-ink/60 font-sans italic">
                    Один из твоих любимых видов 💕
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <CodeInput
                    onSubmit={handleCodeSubmit}
                    placeholder="Введи название цветка..."
                    hint={HINTS.ch1}
                  />
                </motion.div>
              </motion.div>
            </GlassCard>
          </motion.div>
        )}

        {/* Stage 4: Rose Bloom Transition */}
        {stage === 'bloom' && (
          <motion.div key="bloom">
            <RoseBloom onComplete={handleBloomComplete} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

