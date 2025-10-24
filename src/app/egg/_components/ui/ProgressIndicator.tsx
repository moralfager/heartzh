'use client';

import { motion } from 'framer-motion';
import { useProgressStore } from '@/app/egg/_store/progressStore';

export default function ProgressIndicator() {
  const chapters = useProgressStore((state) => state.chapters);
  const current = useProgressStore((state) => state.current);

  const chapterIds = ['ch1', 'ch2', 'ch3', 'ch4', 'ch5'] as const;
  
  const completedCount = chapterIds.filter(
    (id) => chapters[id] === 'completed'
  ).length;
  
  const progress = (completedCount / chapterIds.length) * 100;

  return (
    <div className="w-full max-w-md mx-auto space-y-3">
      {/* Progress bar */}
      <div className="relative h-2 rounded-full glass overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-blush to-lavender rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>

      {/* Chapter dots */}
      <div className="flex justify-between items-center px-1">
        {chapterIds.map((id, index) => {
          const status = chapters[id];
          const isCurrent = current === id;

          return (
            <motion.div
              key={id}
              className="relative flex flex-col items-center"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Dot */}
              <motion.div
                className={`
                  w-4 h-4 rounded-full border-2
                  transition-all duration-300
                  ${
                    status === 'completed'
                      ? 'bg-lavender border-lavender'
                      : status === 'unlocked'
                      ? 'bg-glow border-blush'
                      : 'bg-transparent border-ink/20'
                  }
                  ${isCurrent ? 'ring-4 ring-lavender/30' : ''}
                `}
                animate={
                  isCurrent
                    ? {
                        scale: [1, 1.2, 1],
                        transition: {
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        },
                      }
                    : {}
                }
              />

              {/* Chapter number */}
              <span
                className={`
                  mt-2 text-xs font-mono
                  ${
                    status !== 'locked'
                      ? 'text-ink'
                      : 'text-ink/30'
                  }
                `}
              >
                {index + 1}
              </span>

              {/* Checkmark for completed */}
              {status === 'completed' && (
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-lavender rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                >
                  <svg
                    className="w-2 h-2 text-glow"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Progress text */}
      <p className="text-center text-sm text-ink/60 font-sans">
        Глава {chapterIds.indexOf(current) + 1} из {chapterIds.length}
      </p>
    </div>
  );
}

