import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE_LUXURY } from '@/utils/motion';

type RevealVariant = 'up' | 'left' | 'right' | 'fade' | 'clip';

interface RevealProps {
  children: React.ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  variant = 'up',
  delay = 0,
  duration = 0.78,
  className = '',
  once = true,
}) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const initialMap = {
    up: { opacity: 0, y: 24 },
    left: { opacity: 0, x: -20 },
    right: { opacity: 0, x: 20 },
    fade: { opacity: 0 },
    clip: { opacity: 0, clipPath: 'inset(10% 0% 0% 0%)', scale: 1.03 },
  };

  const visibleMap = {
    up: { opacity: 1, y: 0 },
    left: { opacity: 1, x: 0 },
    right: { opacity: 1, x: 0 },
    fade: { opacity: 1 },
    clip: { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', scale: 1 },
  };

  return (
    <motion.div
      initial={initialMap[variant]}
      whileInView={visibleMap[variant]}
      viewport={{ once, amount: 0.1 }}
      transition={{
        duration: variant === 'clip' ? Math.max(duration, 0.88) : duration,
        delay,
        ease: EASE_LUXURY,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
