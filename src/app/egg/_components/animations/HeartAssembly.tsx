'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { animateLetterAssembly, animateHeartPulse } from '@/app/egg/_lib/animations';

interface HeartAssemblyProps {
  onComplete?: () => void;
}

export default function HeartAssembly({ onComplete }: HeartAssemblyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<HTMLSpanElement[]>([]);
  const heartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || lettersRef.current.length === 0) return;

    // Wait a moment before starting animation
    const timeout = setTimeout(() => {
      // Animate letters flying in
      animateLetterAssembly(lettersRef.current, () => {
        // After letters assemble, pulse the heart
        if (heartRef.current) {
          animateHeartPulse(heartRef.current);
        }

        // Call onComplete after a delay
        setTimeout(() => {
          onComplete?.();
        }, 2000);
      });
    }, 500);

    return () => clearTimeout(timeout);
  }, [onComplete]);

  const letters = ['H', 'E', 'A', 'R', 'T', 'O', 'F', 'Z', 'H', 'A'];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-radial from-lavender/20 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      />

      {/* Heart container */}
      <div
        ref={heartRef}
        className="relative flex flex-wrap items-center justify-center gap-2 max-w-2xl"
      >
        {letters.map((letter, index) => (
          <span
            key={index}
            ref={(el) => {
              if (el) lettersRef.current[index] = el;
            }}
            className="
              text-6xl md:text-8xl font-display font-bold
              text-transparent bg-clip-text
              bg-gradient-to-br from-blush via-lavender to-rose
              inline-block
            "
            style={{
              textShadow: '0 0 30px rgba(232, 227, 255, 0.5)',
            }}
          >
            {letter}
          </span>
        ))}
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blush/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Subtitle */}
      <motion.p
        className="absolute bottom-20 text-center text-ink/60 font-sans text-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
      >
        Journey to Her Heart
      </motion.p>
    </div>
  );
}

