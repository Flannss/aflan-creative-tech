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
 * Unified editorial reveal duration for calm, fluid pacing across all pages.
 */
export const MOTION_DURATION = 0.56;

export const LUXURY_TRANSITION: Transition = {
  duration: MOTION_DURATION,
  ease: EASE_LUXURY,
};

export const pageContentVariants: Variants = {
  initial: {
    opacity: 0,
    y: 14,
    scale: 0.994,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.42,
      ease: EASE_LUXURY,
    },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: {
      duration: 0.18,
      ease: EASE_LUXURY,
    },
  },
};

export const reducedPageVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.12 } },
  exit: { opacity: 0, transition: { duration: 0.08 } },
};
