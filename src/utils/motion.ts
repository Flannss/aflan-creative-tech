import type { Variants } from 'framer-motion';

/**
 * Editorial easing curve for smooth, decisive transitions.
 */
export const EASE_LUXURY: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const pageContentVariants: Variants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.26,
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
