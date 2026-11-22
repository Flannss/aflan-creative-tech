import type { Transition, Variants } from 'framer-motion';

/**
 * Curated luxury editorial easing curve: cubic-bezier(0.22, 1, 0.36, 1).
 */
export const EASE_LUXURY: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Unified editorial reveal duration for calm, cohesive pacing across all pages.
 */
export const MOTION_DURATION = 0.8;

export const LUXURY_TRANSITION: Transition = {
  duration: MOTION_DURATION,
  ease: EASE_LUXURY,
};

export const pageContentVariants: Variants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.28,
      delay: 0,
      ease: EASE_LUXURY,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0,
    },
  },
};

export const reducedPageVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.12 } },
  exit: { opacity: 0, transition: { duration: 0 } },
};
