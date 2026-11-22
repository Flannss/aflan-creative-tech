import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE_LUXURY, MOTION_DURATION } from '@/utils/motion';

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
  duration = MOTION_DURATION,
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
      viewport={{ once, amount: 'some' }}
      transition={{
        duration,
        delay,
        ease: EASE_LUXURY,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface StaggerGroupProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
}

/**
 * Orchestrated staggered entrance container for editorial grids and lists.
 */
export const StaggerGroup: React.FC<StaggerGroupProps> = ({
  children,
  className = '',
  stagger = 0.075,
  delayChildren = 0.04,
}) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 'some' }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: stagger,
            delayChildren,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
}

export const StaggerItem: React.FC<StaggerItemProps> = ({
  children,
  className = '',
}) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 22, scale: 0.985 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: MOTION_DURATION,
            ease: EASE_LUXURY,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
