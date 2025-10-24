'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import ConfettiPetals from '@/app/egg/_components/animations/ConfettiPetals';
import GlassCard from '@/app/egg/_components/ui/GlassCard';
import HeartButton from '@/app/egg/_components/ui/HeartButton';
import CodeInput from '@/app/egg/_components/ui/CodeInput';
import { useProgressStore } from '@/app/egg/_store/progressStore';
import { FINAL_QUESTIONS, CHAPTERS, CONTACT } from '@/app/egg/_lib/constants';

type Stage = 'intro' | 'location-check' | 'questions' | 'pause' | 'final-question' | 'celebration' | 'cta';

export default function Chapter5() {
  const [stage, setStage] = useState<Stage>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const router = useRouter();
  const { completeChapter } = useProgressStore();

  const handleStartQuestions = () => {
    setStage('location-check');
  };

  const handleAnswer = () => {
    const newAnswers = [...answers, true];
    setAnswers(newAnswers);

    if (currentQuestion < FINAL_QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 500);
    } else {
      // All questions answered
      setTimeout(() => {
        setStage('pause');
      }, 500);

      // After pause, show location check
      setTimeout(() => {
        setStage('location-check');
      }, 3500);
    }
  };

  const handleLocationCheck = async (code: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/egg/check-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapterId: 'ch5',
          code: code.toLowerCase(), // normalize to lowercase
        }),
      });

      const data = await response.json();

      if (data.valid) {
        // Location is correct, show questions
        setStage('questions');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error validating code:', error);
      return false;
    }
  };

  const handleFinalAnswer = () => {
    completeChapter('ch5', CHAPTERS.ch5.letterReveal);
    setStage('celebration');

    // Move to CTA after celebration
    setTimeout(() => {
      setStage('cta');
    }, 4000);
  };

  const handleCall = () => {
    window.location.href = `tel:${CONTACT.phone}`;
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
          >
            <GlassCard className="max-w-2xl text-center space-y-8">
              <motion.div
                className="text-8xl mb-4"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                💝
              </motion.div>

              <h1 className="text-4xl md:text-6xl font-display text-ink">
                Последний вопрос
              </h1>

              <motion.div
                className="space-y-6 text-base md:text-lg lg:text-xl text-ink/80 font-sans px-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  Мы прошли весь этот путь вместе.
                  <br className="hidden md:block" />
                  От первого цветка до этого момента.
                </motion.p>
                <motion.p
                  className="text-ink/70"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  Мы узнали истории, открылись друг другу,
                  <br className="hidden md:block" />
                  нашли свет в темноте и собрали все буквы.
                </motion.p>
                <motion.div
                  className="pt-4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.0 }}
                >
                  <p className="text-xl md:text-2xl lg:text-3xl font-display text-ink leading-relaxed">
                    Прежде чем я задам главный вопрос,
                  </p>
                  <p className="text-lg md:text-xl font-display text-ink/80 mt-2 italic">
                    ответь мне на несколько простых... 💫
                  </p>
                </motion.div>
              </motion.div>

              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                <HeartButton
                  variant="heart"
                  size="lg"
                  onClick={handleStartQuestions}
                  className="min-w-[200px] max-w-sm px-12"
                  icon={<span>❤️</span>}
                >
                  Я готова
                </HeartButton>
              </motion.div>
            </GlassCard>
          </motion.div>
        )}

        {/* Stage 2: Location Check */}
        {stage === 'location-check' && (
          <motion.div
            key="location"
            className="min-h-screen flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <GlassCard className="max-w-2xl text-center space-y-8">
              <motion.div
                className="text-8xl md:text-9xl"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 150,
                  damping: 10,
                }}
              >
                
              </motion.div>

              <motion.h1
                className="text-3xl md:text-5xl font-display text-ink px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                В каком мы сидим заведении?
              </motion.h1>

              <motion.p
                className="text-base md:text-lg text-ink/70 font-sans px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                Введи название на русском или английском
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <CodeInput
                  onSubmit={handleLocationCheck}
                  placeholder="Введи название..."
                  hint="Подсказка: Это фруктовое название..."
                />
              </motion.div>
            </GlassCard>
          </motion.div>
        )}

        {/* Stage 3: Questions */}
        {stage === 'questions' && (
          <motion.div
            key="questions"
            className="min-h-screen flex flex-col items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Progress */}
            <motion.div
              className="mb-8 glass-strong px-6 py-2 rounded-full"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-sm text-ink/70 font-sans">
                Вопрос {currentQuestion + 1} из {FINAL_QUESTIONS.length}
              </p>
            </motion.div>

            {/* Question card */}
            <AnimatePresence mode="wait">
              <GlassCard
                key={currentQuestion}
                className="max-w-2xl text-center space-y-8"
              >
                <motion.h2
                  className="text-2xl md:text-3xl font-display text-ink"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {FINAL_QUESTIONS[currentQuestion]}
                </motion.h2>

                <motion.div
                  className="flex justify-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <HeartButton
                    variant="heart"
                    size="lg"
                    onClick={handleAnswer}
                    className="min-w-[120px] max-w-xs px-12 text-2xl"
                  >
                    ❤️
                  </HeartButton>
                </motion.div>

                {/* Hearts collected */}
                <div className="flex justify-center gap-2 mt-6">
                  {Array.from({ length: FINAL_QUESTIONS.length }).map((_, i) => (
                    <motion.div
                      key={i}
                      className={`w-3 h-3 rounded-full ${
                        i < answers.length ? 'bg-lavender' : 'bg-ink/10'
                      }`}
                      initial={i === answers.length - 1 ? { scale: 0 } : {}}
                      animate={i === answers.length - 1 ? { scale: 1 } : {}}
                      transition={{ type: 'spring' }}
                    />
                  ))}
                </div>
              </GlassCard>
            </AnimatePresence>
          </motion.div>
        )}

        {/* Stage 4: Pause */}
        {stage === 'pause' && (
          <motion.div
            key="pause"
            className="min-h-screen flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.p
              className="text-3xl md:text-4xl font-display text-ink text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              Тогда остался один вопрос...
            </motion.p>
          </motion.div>
        )}

        {/* Stage 5: Final Question */}
        {stage === 'final-question' && (
          <motion.div
            key="final"
            className="min-h-screen flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <GlassCard className="max-w-2xl text-center space-y-12">
              <motion.div
                className="text-9xl"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 150,
                  damping: 10,
                }}
              >
                💖
              </motion.div>

              <motion.h1
                className="text-4xl md:text-6xl font-display text-ink"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Давай начнём встречаться?
              </motion.h1>

              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <HeartButton
                  variant="heart"
                  size="lg"
                  onClick={handleFinalAnswer}
                  className="min-w-[200px] max-w-sm px-12 text-3xl py-6"
                >
                  ❤️ ДА ❤️
                </HeartButton>
              </motion.div>
            </GlassCard>
          </motion.div>
        )}

        {/* Stage 6: Celebration */}
        {stage === 'celebration' && (
          <motion.div
            key="celebration"
            className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blush via-lavender to-rose z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <ConfettiPetals count={40} />

            <motion.div
              className="text-center space-y-8 relative z-10"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 150, damping: 10 }}
            >
              <motion.div
                className="text-9xl"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                }}
              >
                🎉
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-display text-glow">
                Все буквы собраны!
              </h1>

              <motion.div
                className="text-6xl md:text-8xl font-display tracking-wider"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-glow via-blush to-lavender">
                  H E A R T
                </span>
              </motion.div>

              <p className="text-2xl md:text-3xl font-sans text-glow">
                Спасибо, что прошла этот путь со мной ❤️
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* Stage 7: CTA */}
        {stage === 'cta' && (
          <motion.div
            key="cta"
            className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-rose via-blush to-lavender z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <ConfettiPetals count={20} />

            <GlassCard className="max-w-3xl text-center space-y-10 relative z-10">
              <motion.div
                className="text-8xl"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                💕
              </motion.div>

              <motion.h2
                className="text-3xl md:text-5xl font-display text-ink leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Что же будет дальше?...
              </motion.h2>

              <motion.div
                className="space-y-6 text-lg md:text-2xl font-display text-ink/70 italic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <p>to be continued</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
              >

              </motion.div>

              <div className="pt-8 border-t border-ink/10 flex justify-center">
                <button
                  onClick={() => router.push('/')}
                  className="text-ink/60 hover:text-ink underline text-sm"
                >
                  Вернуться на главную
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

