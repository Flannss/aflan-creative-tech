import React, { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { directionalPageVariants, reducedPageVariants } from '@/utils/motion';

let hasCompletedInitialRender = false;

interface PageTransitionProps {
  children: React.ReactNode;
  direction?: number;
}

/**
 * Directional Silk Route Transition:
 * - Glides subtly along the route index axis (`±12px`, `0.24s` settle / `0.09s` exit).
 * - Zero initial delay on first hydration and crisp fade under `prefers-reduced-motion`.
 */
export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  direction = 1,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const skipInitialEntrance = !hasCompletedInitialRender;

  useEffect(() => {
    hasCompletedInitialRender = true;
  }, []);

  return (
    <motion.div
      custom={direction}
      variants={prefersReducedMotion ? reducedPageVariants : directionalPageVariants}
      initial={skipInitialEntrance ? false : 'initial'}
      animate="animate"
      exit="exit"
      className="relative will-change-[transform,opacity]"
    >
      {children}
    </motion.div>
  );
};
