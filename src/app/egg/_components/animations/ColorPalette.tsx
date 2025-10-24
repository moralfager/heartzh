'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

interface ColorPaletteProps {
  onColorSelected?: (color: string) => void;
  selectedColor?: string;
}

const COLORS = [
  { name: 'красный', hex: '#E63946', emoji: '❤️' },
  { name: 'оранжевый', hex: '#FF8500', emoji: '🧡' },
  { name: 'жёлтый', hex: '#FFB703', emoji: '💛' },
  { name: 'зелёный', hex: '#06A77D', emoji: '💚' },
  { name: 'синий', hex: '#0077B6', emoji: '💙' },
  { name: 'фиолетовый', hex: '#7209B7', emoji: '💜' },
  { name: 'розовый', hex: '#FF006E', emoji: '💗' },
  { name: 'чёрный', hex: '#000000', emoji: '🖤' },
];

export default function ColorPalette({
  onColorSelected,
  selectedColor,
}: ColorPaletteProps) {
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initial stagger animation
    const colors = containerRef.current.querySelectorAll('.color-circle');
    gsap.from(colors, {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'back.out(1.7)',
    });
  }, []);

  const handleColorClick = (colorName: string) => {
    onColorSelected?.(colorName);
  };

  return (
    <div ref={containerRef} className="w-full max-w-4xl mx-auto">
      {/* Title */}
      <motion.h2
        className="text-2xl md:text-3xl font-display text-ink text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Какой мой любимый цвет?
      </motion.h2>

      {/* Color grid with background */}
      <div className="bg-white rounded-3xl p-10 md:p-16 shadow-2xl border-4 border-ink/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12">
        {COLORS.map((color, index) => {
          const isSelected = selectedColor === color.name;
          const isHovered = hoveredColor === color.name;

          return (
            <motion.button
              key={color.name}
              className="color-circle relative flex flex-col items-center gap-3 group"
              onClick={() => handleColorClick(color.name)}
              onMouseEnter={() => setHoveredColor(color.name)}
              onMouseLeave={() => setHoveredColor(null)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Circle */}
              <div
                className={`
                  w-32 h-32 md:w-36 md:h-36 rounded-full
                  transition-all duration-300
                  border-[6px] border-white
                  shadow-2xl
                  ${
                    isSelected
                      ? 'ring-8 ring-lavender ring-offset-4 scale-110'
                      : isHovered
                      ? 'ring-6 ring-blush ring-offset-2 scale-105'
                      : ''
                  }
                `}
                style={{
                  backgroundColor: color.hex,
                  boxShadow: `0 10px 40px ${color.hex}80`,
                }}
              >
                {/* Emoji overlay */}
                <div
                  className="
                    absolute inset-0 flex items-center justify-center
                    text-5xl md:text-6xl
                    opacity-0 group-hover:opacity-100
                    transition-opacity duration-300
                  "
                >
                  {color.emoji}
                </div>
              </div>

              {/* Label */}
              <span
                className={`
                  text-xl md:text-2xl font-sans font-bold
                  text-ink
                  transition-all duration-300
                  ${isSelected ? 'scale-110' : ''}
                `}
              >
                {color.name}
              </span>

              {/* Selection indicator */}
              {isSelected && (
                <motion.div
                  className="absolute -top-2 -right-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                >
                  <div className="w-6 h-6 bg-lavender rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-glow"
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
                  </div>
                </motion.div>
              )}

              {/* Ripple effect on hover */}
              {isHovered && (
                <motion.div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{ backgroundColor: color.hex }}
                  initial={{ opacity: 0.3, scale: 1 }}
                  animate={{ opacity: 0, scale: 1.5 }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </motion.button>
          );
        })}
        </div>
      </div>

      {/* Hint */}
      <motion.p
        className="text-center mt-8 text-sm text-ink/70 font-sans font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        💡 Позвони нашему общему другу который недавно сделал предложение
      </motion.p>
    </div>
  );
}

