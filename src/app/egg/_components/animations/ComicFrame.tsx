'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ComicFrameProps {
  image?: string;
  title: string;
  text: string;
  gradient?: string;
  emoji?: string;
  index: number;
}

export default function ComicFrame({
  image,
  title,
  text,
  gradient = 'from-blush to-lavender',
  emoji = '💖',
  index,
}: ComicFrameProps) {
  return (
    <motion.div
      className="relative w-full max-w-2xl mx-auto"
      initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      exit={{ opacity: 0, scale: 0.9, rotateY: 10 }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 15,
        delay: index * 0.1,
      }}
    >
      {/* Comic card */}
      <div className="glass-strong rounded-[24px] overflow-hidden shadow-glass">
        {/* Image/Visual section */}
        <div className="relative h-64 md:h-80 overflow-hidden">
          {image ? (
            // Real image
            <motion.img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          ) : (
            // Placeholder with gradient and emoji
            <motion.div
              className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center relative overflow-hidden`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {/* Floating emoji */}
              <motion.div
                className="text-9xl opacity-30 absolute"
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                {emoji}
              </motion.div>

              {/* Particles */}
              <div className="absolute inset-0">
                {Array.from({ length: 10 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-glow/30 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [0, -20, 0],
                      opacity: [0.2, 0.8, 0.2],
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>

              {/* Center emoji */}
              <motion.div
                className="text-8xl z-10"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 10,
                  delay: 0.3,
                }}
              >
                {emoji}
              </motion.div>
            </motion.div>
          )}

          {/* Parallax overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-ink/30 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          />
        </div>

        {/* Text section */}
        <div className="p-8 space-y-4">
          {/* Title */}
          <motion.h2
            className="text-2xl md:text-3xl font-display text-ink"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {title}
          </motion.h2>

          {/* Text */}
          <motion.p
            className="text-base md:text-lg text-ink/80 font-sans leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {text}
          </motion.p>

          {/* Decorative line */}
          <motion.div
            className="h-1 bg-gradient-to-r from-blush via-lavender to-transparent rounded-full"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ delay: 0.8, duration: 0.8 }}
          />
        </div>
      </div>

      {/* Comic-style border accent */}
      <motion.div
        className="absolute -top-2 -left-2 w-8 h-8 bg-lavender rounded-full opacity-50"
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      />
      <motion.div
        className="absolute -bottom-2 -right-2 w-6 h-6 bg-blush rounded-full opacity-50"
        animate={{
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: 0.5,
        }}
      />
    </motion.div>
  );
}

