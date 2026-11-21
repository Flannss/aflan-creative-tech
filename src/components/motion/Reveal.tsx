import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE_LUXURY } from '@/utils/motion';
import { useIsCoarsePointer } from '@/hooks/useMediaQuery';

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
  duration = 0.88,
  className = '',
  once = true,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const isCoarsePointer = useIsCoarsePointer();

  if (prefersReducedMotion || isCoarsePointer) {
    return <div className={className}>{children}</div>;
  }

  const initialMap = {
    up: { opacity: 0, y: 26 },
    left: { opacity: 0, x: -24 },
    right: { opacity: 0, x: 24 },
    fade: { opacity: 0 },
    clip: { opacity: 0, clipPath: 'inset(12% 0% 0% 0%)', scale: 1.04 },
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
      viewport={{ once, amount: 0.14 }}
      transition={{
        duration: variant === 'clip' ? Math.max(duration, 0.98) : duration,
        delay,
        ease: EASE_LUXURY,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
