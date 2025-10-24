'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

interface TrustHandsProps {
  onComplete?: () => void;
}

export default function TrustHands({ onComplete }: TrustHandsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftHandRef = useRef<SVGGElement>(null);
  const rightHandRef = useRef<SVGGElement>(null);
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!leftHandRef.current || !rightHandRef.current) return;

    // Enhanced initial animation - hands come from sides with bounce
    const timeline = gsap.timeline();

    timeline
      .from(leftHandRef.current, {
        x: -300,
        y: -50,
        opacity: 0,
        rotation: -15,
        scale: 0.8,
        duration: 1.8,
        ease: 'elastic.out(1, 0.5)',
      })
      .from(
        rightHandRef.current,
        {
          x: 300,
          y: -50,
          opacity: 0,
          rotation: 15,
          scale: 0.8,
          duration: 1.8,
          ease: 'elastic.out(1, 0.5)',
        },
        '-=1.8'
      )
      // Gentle floating animation after appearing
      .to(
        [leftHandRef.current, rightHandRef.current],
        {
          y: '+=5',
          duration: 2,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        },
        '+=0.5'
      );

    return () => {
      timeline.kill();
    };
  }, []);

  useEffect(() => {
    if (progress >= 100 && onComplete) {
      setTimeout(onComplete, 500);
    }
  }, [progress, onComplete]);

  const handleMouseDown = () => {
    setIsHolding(true);
    
    // Enhanced animation - hands moving together with rotation and scale
    if (leftHandRef.current && rightHandRef.current) {
      gsap.to(leftHandRef.current, {
        x: 40,
        rotation: 5,
        scale: 1.1,
        duration: 2,
        ease: 'power2.inOut',
      });
      gsap.to(rightHandRef.current, {
        x: -40,
        rotation: -5,
        scale: 1.1,
        duration: 2,
        ease: 'power2.inOut',
      });
    }

    // Progress bar
    let currentProgress = 0;
    holdTimerRef.current = setInterval(() => {
      currentProgress += 2;
      setProgress(Math.min(currentProgress, 100));
    }, 40);
  };

  const handleMouseUp = () => {
    setIsHolding(false);
    
    if (progress < 100) {
      // Reset if not completed
      setProgress(0);
      
      if (leftHandRef.current && rightHandRef.current) {
        gsap.to(leftHandRef.current, {
          x: 0,
          duration: 0.5,
          ease: 'power2.out',
        });
        gsap.to(rightHandRef.current, {
          x: 0,
          duration: 0.5,
          ease: 'power2.out',
        });
      }
    }

    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-2xl mx-auto"
    >
      {/* SVG hands */}
      <svg
        viewBox="0 0 400 300"
        className="w-full h-auto"
        style={{ filter: 'drop-shadow(0 8px 30px rgba(232, 227, 255, 0.5))' }}
      >
        {/* Left hand - more detailed */}
        <g ref={leftHandRef}>
          {/* Palm */}
          <path
            d="M 60 150 Q 60 135, 75 130 L 100 125 Q 110 123, 115 130 L 120 145 Q 122 155, 115 165 L 100 175 Q 90 178, 75 170 Q 60 165, 60 150 Z"
            fill="url(#handGradient1)"
            stroke="#E8E3FF"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Fingers */}
          <path
            d="M 90 125 Q 92 115, 95 110 Q 97 108, 99 110 Q 100 115, 98 125"
            fill="url(#handGradient1)"
            stroke="#E8E3FF"
            strokeWidth="2"
          />
          <path
            d="M 100 123 Q 103 112, 107 107 Q 109 105, 111 107 Q 112 112, 109 123"
            fill="url(#handGradient1)"
            stroke="#E8E3FF"
            strokeWidth="2"
          />
          {/* Highlight */}
          <ellipse cx="85" cy="145" rx="8" ry="12" fill="#FFF7F1" opacity="0.3" />
        </g>

        {/* Right hand - more detailed */}
        <g ref={rightHandRef}>
          {/* Palm */}
          <path
            d="M 340 150 Q 340 135, 325 130 L 300 125 Q 290 123, 285 130 L 280 145 Q 278 155, 285 165 L 300 175 Q 310 178, 325 170 Q 340 165, 340 150 Z"
            fill="url(#handGradient2)"
            stroke="#FFD6E7"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Fingers */}
          <path
            d="M 310 125 Q 308 115, 305 110 Q 303 108, 301 110 Q 300 115, 302 125"
            fill="url(#handGradient2)"
            stroke="#FFD6E7"
            strokeWidth="2"
          />
          <path
            d="M 300 123 Q 297 112, 293 107 Q 291 105, 289 107 Q 288 112, 291 123"
            fill="url(#handGradient2)"
            stroke="#FFD6E7"
            strokeWidth="2"
          />
          {/* Highlight */}
          <ellipse cx="315" cy="145" rx="8" ry="12" fill="#FFF7F1" opacity="0.3" />
        </g>

        {/* Enhanced particles when hands get close */}
        {progress > 40 && (
          <>
            {Array.from({ length: 16 }).map((_, i) => (
              <motion.circle
                key={i}
                cx={200 + (Math.random() - 0.5) * 60}
                cy={150 + (Math.random() - 0.5) * 50}
                r={Math.random() * 2 + 1}
                fill={i % 3 === 0 ? '#E8E3FF' : i % 3 === 1 ? '#FFD6E7' : '#FFF7F1'}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 0.8, 0],
                  scale: [0, 1.5, 0],
                  y: [0, (Math.random() - 0.5) * 30],
                  x: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 40],
                }}
                transition={{
                  duration: 1.5 + Math.random(),
                  repeat: Infinity,
                  delay: i * 0.08,
                  ease: 'easeOut',
                }}
              />
            ))}
          </>
        )}
        
        {/* Heart glow effect when hands are very close */}
        {progress > 70 && (
          <motion.circle
            cx="200"
            cy="150"
            r="30"
            fill="url(#glowGradient)"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.2, 0.4, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}

        {/* Enhanced key appears when complete */}
        {progress >= 100 && (
          <motion.g
            initial={{ opacity: 0, scale: 0, rotate: -180, y: -50 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              rotate: 0,
              y: 0,
            }}
            transition={{ 
              type: 'spring', 
              stiffness: 150, 
              damping: 12,
              delay: 0.2,
            }}
          >
            {/* Key glow */}
            <circle 
              cx="200" 
              cy="150" 
              r="25" 
              fill="url(#keyGlowGradient)" 
              opacity="0.6"
            >
              <animate
                attributeName="r"
                values="25;30;25"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.4;0.6;0.4"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            
            {/* Key body */}
            <path
              d="M 185 140 L 210 140 L 210 147 Q 217 147, 217 153 Q 217 159, 210 159 L 210 165 L 185 165 L 185 159 L 192 159 L 192 147 L 185 147 Z"
              fill="url(#keyGradient)"
              stroke="#F7CAD0"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Key head */}
            <circle cx="198" cy="152" r="6" fill="#E8E3FF" stroke="#FFD6E7" strokeWidth="2" />
            <circle cx="198" cy="152" r="3" fill="#FFF7F1" />
            
            {/* Key teeth */}
            <rect x="210" y="147" width="3" height="5" fill="#E8E3FF" />
            <rect x="210" y="154" width="3" height="5" fill="#E8E3FF" />
          </motion.g>
        )}

        {/* Gradients */}
        <defs>
          <linearGradient id="handGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E8E3FF" />
            <stop offset="50%" stopColor="#FFD6E7" />
            <stop offset="100%" stopColor="#F7CAD0" />
          </linearGradient>
          <linearGradient id="handGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F7CAD0" />
            <stop offset="50%" stopColor="#FFD6E7" />
            <stop offset="100%" stopColor="#E8E3FF" />
          </linearGradient>
          <linearGradient id="keyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD6E7" />
            <stop offset="50%" stopColor="#E8E3FF" />
            <stop offset="100%" stopColor="#F7CAD0" />
          </linearGradient>
          <radialGradient id="glowGradient" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#FFD6E7" stopOpacity="0.6" />
            <stop offset="70%" stopColor="#E8E3FF" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#F7CAD0" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="keyGlowGradient" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#FFF7F1" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FFD6E7" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#E8E3FF" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      {/* Interactive button */}
      {progress < 100 && (
        <div className="text-center mt-8">
          <motion.button
            className="
              px-8 py-4 rounded-full
              bg-gradient-to-br from-blush to-lavender
              text-ink font-sans font-medium
              shadow-glass
              cursor-pointer select-none
            "
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isHolding ? 'Держи...' : 'Нажми и держи'}
          </motion.button>

          {/* Progress bar */}
          {progress > 0 && (
            <motion.div
              className="mt-4 h-2 bg-ink/10 rounded-full overflow-hidden max-w-xs mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-blush to-lavender rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </motion.div>
          )}
        </div>
      )}

      {/* Completion message */}
      {progress >= 100 && (
        <motion.p
          className="text-center mt-8 text-xl font-display text-ink"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Ключ доверия раскрыт ✨
        </motion.p>
      )}
    </div>
  );
}

