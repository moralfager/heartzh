'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode, useState } from 'react';

interface HeartButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'heart';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  disabled?: boolean;
}

export default function HeartButton({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  disabled = false,
  onClick,
  className = '',
  ...props
}: HeartButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variantClasses = {
    primary: 'bg-blush text-ink hover:bg-lavender shadow-soft',
    secondary: 'glass-strong text-ink hover:glass',
    heart: 'bg-gradient-to-br from-blush to-lavender text-ink shadow-glass',
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    
    // Haptic feedback on supported devices
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);
    
    onClick?.(e);
  };

  return (
    <motion.button
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        rounded-[16px]
        font-sans font-medium
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        ${className}
      `}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      animate={isPressed ? { scale: 0.9 } : { scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      disabled={disabled}
      onClick={handleClick}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {children}
    </motion.button>
  );
}

