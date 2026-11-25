import type { Transition, Variants } from 'framer-motion';

/**
 * Curated luxury editorial easing curve: cubic-bezier(0.22, 1, 0.36, 1).
 */
export const EASE_LUXURY: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Silk spring physics without bouncy overshoot for gliding pills and navigation underlines.
 */
export const SPRING_SILK = {
  type: 'spring' as const,
  stiffness: 320,
  damping: 32,
  mass: 0.85,
};

/**
 * Calibrated editorial reveal duration matching Lenis cadence without "PPT pop".
 */
export const MOTION_DURATION = 0.45;

export const LUXURY_TRANSITION: Transition = {
  duration: MOTION_DURATION,
  ease: EASE_LUXURY,
};

export const directionalPageVariants: Variants = {
  initial: (direction = 1) => ({
    opacity: 0,
    x: direction * 12,
  }),
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.24,
      ease: EASE_LUXURY,
    },
  },
  exit: (direction = 1) => ({
    opacity: 0,
    x: direction * -10,
    transition: {
      duration: 0.09,
      ease: EASE_LUXURY,
    },
  }),
};

export const pageContentVariants: Variants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.24,
      ease: EASE_LUXURY,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.09,
      ease: EASE_LUXURY,
    },
  },
};

export const reducedPageVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.1 } },
  exit: { opacity: 0, transition: { duration: 0.06 } },
};
