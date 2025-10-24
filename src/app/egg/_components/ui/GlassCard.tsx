'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  variant?: 'default' | 'strong';
  className?: string;
}

export default function GlassCard({
  children,
  variant = 'default',
  className = '',
  ...props
}: GlassCardProps) {
  const baseClasses = 'rounded-[20px] p-6 transition-all duration-300';
  const variantClasses =
    variant === 'strong' ? 'glass-strong' : 'glass';

  return (
    <motion.div
      className={`${baseClasses} ${variantClasses} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

