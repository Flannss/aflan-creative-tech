import type { Transition, Variants } from 'framer-motion';

/**
 * Luxury editorial easing curves tuned to feel equivalent to GSAP power4.out / expo.out:
 * immediate decisive onset followed by a long, unhurried architectural rest.
 */
export const EASE_LUXURY: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const EASE_EDITORIAL: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const EASE_EXIT: [number, number, number, number] = [0.65, 0, 0.35, 1];

export const luxuryTransition: Transition = {
  duration: 0.9,
  ease: EASE_LUXURY,
};

export const pageContentVariants: Variants = {
  initial: {
    opacity: 0,
    y: 22,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.78,
      delay: 0.08,
      ease: EASE_LUXURY,
    },
  },
  exit: {
    opacity: 0,
    y: -14,
    transition: {
      duration: 0.36,
      ease: EASE_EXIT,
    },
  },
};

export const reducedPageVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.16 } },
};
