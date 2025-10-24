'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { animateRoseBloom } from '@/app/egg/_lib/animations';

interface RoseBloomProps {
  onComplete?: () => void;
}

export default function RoseBloom({ onComplete }: RoseBloomProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const petalsRef = useRef<SVGPathElement[]>([]);

  useEffect(() => {
    if (!containerRef.current || petalsRef.current.length === 0) return;

    // Start bloom animation
    const timeline = animateRoseBloom(
      petalsRef.current as unknown as HTMLElement[],
      () => {
        // Zoom into rose after bloom
        if (containerRef.current) {
          gsap.to(containerRef.current, {
            scale: 3,
            opacity: 0,
            duration: 1.5,
            ease: 'power2.in',
            onComplete,
          });
        }
      }
    );

    return () => {
      timeline.kill();
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-rose z-50">
      <motion.div
        ref={containerRef}
        className="relative w-64 h-64"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full"
          style={{ filter: 'drop-shadow(0 0 20px rgba(255, 214, 231, 0.6))' }}
        >
          {/* Center of rose */}
          <circle cx="100" cy="100" r="15" fill="#FFD6E7" opacity="0.8" />

          {/* Petals - arranged in circular pattern */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => {
            const angle = (index / 8) * Math.PI * 2;
            const cx = 100 + Math.cos(angle) * 30;
            const cy = 100 + Math.sin(angle) * 30;

            return (
              <ellipse
                key={index}
                ref={(el) => {
                  if (el) petalsRef.current[index] = el as unknown as SVGPathElement;
                }}
                cx={cx}
                cy={cy}
                rx="25"
                ry="35"
                fill="url(#petal-gradient)"
                transform={`rotate(${(index * 360) / 8} ${cx} ${cy})`}
                opacity="0.9"
              />
            );
          })}

          {/* Outer petals */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((index) => {
            const angle = (index / 12) * Math.PI * 2 + Math.PI / 12;
            const cx = 100 + Math.cos(angle) * 55;
            const cy = 100 + Math.sin(angle) * 55;

            return (
              <ellipse
                key={`outer-${index}`}
                ref={(el) => {
                  if (el)
                    petalsRef.current[index + 8] = el as unknown as SVGPathElement;
                }}
                cx={cx}
                cy={cy}
                rx="22"
                ry="32"
                fill="url(#petal-gradient-outer)"
                transform={`rotate(${(index * 360) / 12} ${cx} ${cy})`}
                opacity="0.85"
              />
            );
          })}

          {/* Gradients */}
          <defs>
            <radialGradient id="petal-gradient">
              <stop offset="0%" stopColor="#FFD6E7" />
              <stop offset="100%" stopColor="#F7CAD0" />
            </radialGradient>
            <radialGradient id="petal-gradient-outer">
              <stop offset="0%" stopColor="#F7CAD0" />
              <stop offset="100%" stopColor="#E8E3FF" />
            </radialGradient>
          </defs>
        </svg>

        {/* Sparkle effect */}
        <div className="absolute inset-0">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-glow rounded-full"
              style={{
                left: `${50 + (Math.random() - 0.5) * 80}%`,
                top: `${50 + (Math.random() - 0.5) * 80}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 1 + Math.random(),
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Text */}
      <motion.p
        className="absolute bottom-20 text-center text-ink/70 font-display text-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ delay: 1, duration: 2 }}
      >
        Входим в историю...
      </motion.p>
    </div>
  );
}

