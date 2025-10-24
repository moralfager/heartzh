'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import GlassCard from '@/app/egg/_components/ui/GlassCard';
import CodeInput from '@/app/egg/_components/ui/CodeInput';
import HeartButton from '@/app/egg/_components/ui/HeartButton';
import BackButton from '@/app/egg/_components/layout/BackButton';
import { useProgressStore } from '@/app/egg/_store/progressStore';
import { CHAPTERS } from '@/app/egg/_lib/constants';
import { animateFadeToBlackWithStars } from '@/app/egg/_lib/animations';

type Stage = 'intro' | 'palette' | 'darkness' | 'revelation' | 'complete';

export default function Chapter4() {
  const [stage, setStage] = useState<Stage>('intro');
  const router = useRouter();
  const { completeChapter } = useProgressStore();
  const darknessRef = useRef<HTMLDivElement>(null);

  const handleIntroContinue = () => {
    setStage('palette');
  };

  const handleCodeSubmit = async (code: string) => {
    // Check if correct color
    try {
      const response = await fetch('/api/egg/check-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapterId: 'ch4',
          code: code,
        }),
      });

      const data = await response.json();

      if (data.valid) {
        // Transition to darkness stage
        setTimeout(() => {
          setStage('darkness');
        }, 1000);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error validating color:', error);
      return false;
    }
  };

  useEffect(() => {
    if (stage === 'darkness' && darknessRef.current) {
      // Start fade to black with stars animation
      animateFadeToBlackWithStars(darknessRef.current, 50, () => {
        // Animation complete, wait and transition
        console.log('Animation complete, transitioning to revelation');
      });
      
      // Auto-transition after 6 seconds (text appears at 2s + 4s to read)
      const timer = setTimeout(() => {
        console.log('Auto-transitioning to revelation');
        setStage('revelation');
      }, 6000);
      
      return () => clearTimeout(timer);
    }
  }, [stage]);

  const handleComplete = () => {
    completeChapter('ch4', CHAPTERS.ch4.letterReveal);
    setStage('complete');
    
    setTimeout(() => {
      router.push('/egg/chapter/5');
    }, 2000);
  };

  return (
    <div className="min-h-screen relative">
      <BackButton />
      <AnimatePresence mode="wait">
        {/* Stage 1: Intro */}
        {stage === 'intro' && (
          <motion.div
            key="intro"
            className="min-h-screen flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <GlassCard className="max-w-2xl text-center space-y-8">
              <motion.div
                className="text-7xl mb-4"
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                🎨
              </motion.div>

              <h1 className="text-4xl md:text-6xl font-display text-ink">
                Цвет
              </h1>

              <div className="space-y-6 text-lg md:text-xl text-ink/80 font-sans">
                <p>
                  У каждого из нас есть любимый цвет.
                  <br />
                  Он рассказывает о нас больше, чем мы думаем.
                </p>
                <p className="text-2xl font-display text-ink">
                  Какой мой любимый цвет? <br />
                </p>
              </div>

              <div className="flex justify-center">
                <motion.button
                  onClick={handleIntroContinue}
                  className="
                    px-8 py-4 rounded-[16px]
                    bg-gradient-to-br from-blush to-lavender
                    text-ink font-sans font-medium text-lg
                    shadow-glass
                  "
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Узнать
                </motion.button>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Stage 2: Color Input with Animation */}
        {stage === 'palette' && (
          <motion.div
            key="palette"
            className="min-h-screen flex items-center justify-center p-6 py-20 relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Floating colored particles */}
            <div className="absolute inset-0 pointer-events-none">
              {[
                { color: '#E63946', delay: 0 },
                { color: '#FF8500', delay: 0.2 },
                { color: '#FFB703', delay: 0.4 },
                { color: '#06A77D', delay: 0.6 },
                { color: '#0077B6', delay: 0.8 },
                { color: '#7209B7', delay: 1.0 },
                { color: '#FF006E', delay: 1.2 },
                { color: '#000000', delay: 1.4 },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="absolute w-16 h-16 md:w-20 md:h-20 rounded-full opacity-30"
                  style={{
                    backgroundColor: item.color,
                    left: `${(i * 12.5)}%`,
                    top: '10%',
                    boxShadow: `0 0 40px ${item.color}`,
                  }}
                  animate={{
                    y: [0, -30, 0],
                    x: [0, Math.sin(i) * 20, 0],
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 4 + i * 0.5,
                    repeat: Infinity,
                    delay: item.delay,
                    ease: 'easeInOut',
                  }}
                />
              ))}
              
              {/* Bottom particles */}
              {[
                { color: '#E63946', delay: 0.5 },
                { color: '#FFB703', delay: 0.7 },
                { color: '#0077B6', delay: 0.9 },
                { color: '#7209B7', delay: 1.1 },
                { color: '#000000', delay: 1.3 },
              ].map((item, i) => (
                <motion.div
                  key={`bottom-${i}`}
                  className="absolute w-12 h-12 md:w-16 md:h-16 rounded-full opacity-20"
                  style={{
                    backgroundColor: item.color,
                    left: `${10 + (i * 18)}%`,
                    bottom: '15%',
                    boxShadow: `0 0 30px ${item.color}`,
                  }}
                  animate={{
                    y: [0, 20, 0],
                    x: [0, -Math.sin(i) * 15, 0],
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.5, 0.2],
                  }}
                  transition={{
                    duration: 3.5 + i * 0.4,
                    repeat: Infinity,
                    delay: item.delay,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </div>

            <GlassCard className="max-w-md text-center space-y-8 relative z-10">
              <motion.div
                className="text-7xl mb-4"
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                🎨
              </motion.div>

              <h2 className="text-3xl font-display text-ink">
                Какой мой любимый цвет?
              </h2>

              <motion.p
                className="text-ink/70 font-sans"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Напиши название цвета...
              </motion.p>

              <CodeInput
                onSubmit={handleCodeSubmit}
                placeholder="Введи цвет..."
                hint="Позвони нашему общему другу который недавно сделал предложение, если не знаешь ответ"
              />

              <motion.p
                className="text-sm text-ink/50 font-sans italic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                🌈 Красный? Синий? Или что-то неожиданное?
              </motion.p>
            </GlassCard>
          </motion.div>
        )}

        {/* Stage 3: Darkness with Stars - Interactive */}
        {stage === 'darkness' && (
          <motion.div
            key="darkness"
            ref={darknessRef}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 p-6"
            style={{ backgroundColor: '#F7CAD0' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Floating sparkles that appear gradually */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {Array.from({ length: 30 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-glow rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    boxShadow: '0 0 8px #FFF7F1',
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0.5, 1], 
                    scale: [0, 1.5, 1, 1.2] 
                  }}
                  transition={{
                    duration: 2,
                    delay: 2 + (i * 0.1),
                    repeat: Infinity,
                    repeatDelay: Math.random() * 3,
                  }}
                />
              ))}
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center gap-8 max-w-2xl mx-auto">
              <motion.div
                className="text-center space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
              >
                <motion.p
                  className="text-2xl md:text-4xl font-display text-glow leading-relaxed px-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 2, duration: 1.5 }}
                >
                  Даже в темноте <br className="md:hidden" />
                  можно найти свет...
                </motion.p>

                <motion.p
                  className="text-base md:text-lg font-sans text-glow/80 italic px-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 3.5 }}
                >
                  Когда рядом тот, кто освещает твой путь 💫
                </motion.p>
              </motion.div>

              <motion.button
                onClick={() => setStage('revelation')}
                className="
                  px-10 py-5 rounded-[20px]
                  bg-gradient-to-br from-blush to-lavender
                  backdrop-blur-md
                  text-ink font-sans font-semibold text-lg
                  shadow-2xl shadow-lavender/30
                  border-2 border-glow/20
                  relative overflow-hidden
                  group
                "
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 4.5 }}
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Button glow effect */}
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
                <span className="relative z-10 flex items-center gap-2">
                  Найти свет ✨
                </span>
              </motion.button>

              <motion.p
                className="text-xs md:text-sm text-glow/60 font-sans text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 5.5 }}
              >
                Нажми, когда будешь готова
              </motion.p>
            </div>
          </motion.div>
        )}

        {/* Stage 4: Revelation - Heart appears */}
        {stage === 'revelation' && (
          <motion.div
            key="revelation"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Stars background */}
            <div className="absolute inset-0">
              {Array.from({ length: 100 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-glow rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    boxShadow: '0 0 4px #FFF7F1',
                  }}
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    scale: [0.5, 1.5, 0.5],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>

            {/* Glowing heart */}
            <motion.div
              className="relative z-10"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: 'spring',
                stiffness: 150,
                damping: 10,
                delay: 0.5,
              }}
            >
              <motion.div
                className="text-8xl md:text-9xl"
                animate={{
                  scale: [1, 1.1, 1],
                  filter: [
                    'drop-shadow(0 0 20px #FFD6E7)',
                    'drop-shadow(0 0 40px #E8E3FF)',
                    'drop-shadow(0 0 20px #FFD6E7)',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                ❤️
              </motion.div>

              <motion.p
                className="text-xl md:text-2xl font-display text-glow text-center mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
              >
                ...если рядом тот, кто тебе дорог.
              </motion.p>

              <div className="flex justify-center mt-12">
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
                  transition={{ delay: 2.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Продолжить путешествие
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Stage 5: Complete */}
        {stage === 'complete' && (
          <motion.div
            key="complete"
            className="fixed inset-0 flex items-center justify-center bg-rose z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="text-center space-y-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              <div className="text-8xl">🎨</div>
              <h2 className="text-4xl font-display text-ink">
                Буква {CHAPTERS.ch4.letterReveal} раскрыта
              </h2>
              <p className="text-lg text-ink/70">
                Последняя глава ждёт тебя...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

