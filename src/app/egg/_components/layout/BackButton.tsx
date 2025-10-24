'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface BackButtonProps {
  to?: string;
  label?: string;
}

export default function BackButton({ to = '/map', label = 'Карта' }: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(to);
  };

  return (
    <motion.button
      onClick={handleClick}
      className="
        fixed top-6 left-6 z-50
        px-4 py-2
        rounded-full
        glass-strong
        flex items-center gap-2
        hover:scale-105 active:scale-95
        transition-all duration-300
        group
      "
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3, type: 'spring' }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Вернуться к ${label}`}
    >
      <svg
        className="w-5 h-5 text-ink/70 group-hover:text-ink transition-colors"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      <span className="text-sm font-sans text-ink/70 group-hover:text-ink transition-colors">
        {label}
      </span>
    </motion.button>
  );
}

