import React, { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { pageContentVariants, reducedPageVariants } from '@/utils/motion';

let hasCompletedInitialRender = false;

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * Silk Atmospheric Cross-Glide page wrapper:
 * - Zero delay on very first render and clean fade fallback under `prefers-reduced-motion`.
 * - Pure GPU opacity/transform glide with no blocking overlay curtain.
 */
export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const prefersReducedMotion = useReducedMotion();
  const skipInitialEntrance = !hasCompletedInitialRender;

  useEffect(() => {
    hasCompletedInitialRender = true;
  }, []);

  return (
    <motion.div
      variants={prefersReducedMotion ? reducedPageVariants : pageContentVariants}
      initial={skipInitialEntrance ? false : 'initial'}
      animate="animate"
      exit="exit"
      className="relative will-change-[transform,opacity]"
    >
      {children}
    </motion.div>
  );
};
