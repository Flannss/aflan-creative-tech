import type { Transition, Variants } from 'framer-motion';

/**
 * Curated luxury editorial easing curve: cubic-bezier(0.22, 1, 0.36, 1).
 */
export const EASE_LUXURY: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Crisp deceleration exit easing curve: cubic-bezier(0.32, 0.72, 0, 1).
 */
export const EASE_EXIT: [number, number, number, number] = [0.32, 0.72, 0, 1];

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
 * Damped tactile spring for lightbox swipe snapback and draggable frames.
 */
export const SPRING_TACTILE = {
  type: 'spring' as const,
  stiffness: 360,
  damping: 34,
  mass: 0.75,
};

/**
 * Calibrated editorial reveal duration matching Lenis cadence without "PPT pop".
 */
export const MOTION_DURATION = 0.45;

export const LUXURY_TRANSITION: Transition = {
  duration: MOTION_DURATION,
  ease: EASE_LUXURY,
};

export type RouteTransitionKind = 'editorial' | 'showcase';

export interface PageTransitionCustom {
  direction: 1 | -1;
  kind: RouteTransitionKind;
}

export const biDirectionalPageVariants: Variants = {
  initial: (custom?: PageTransitionCustom) => {
    const direction = custom?.direction ?? 1;
    const kind = custom?.kind ?? 'editorial';
    return {
      opacity: 0,
      x: direction * 28,
      y: kind === 'showcase' ? 12 : 4,
      scale: 0.985,
    };
  },
  animate: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.42,
      ease: EASE_LUXURY,
    },
  },
  exit: (custom?: PageTransitionCustom) => {
    const direction = custom?.direction ?? 1;
    const kind = custom?.kind ?? 'editorial';
    return {
      opacity: 0,
      x: direction * -32,
      y: kind === 'showcase' ? -6 : 0,
      scale: 0.98,
      transition: {
        duration: 0.24,
        ease: EASE_EXIT,
      },
    };
  },
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
  animate: { opacity: 1, transition: { duration: 0.12 } },
  exit: { opacity: 0, transition: { duration: 0.08 } },
};
