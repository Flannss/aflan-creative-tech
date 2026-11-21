import React, { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  pageContentVariants,
  reducedPageVariants,
} from '@/utils/motion';

let hasCompletedInitialRender = false;

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * Zero-delay initial render + fast non-blocking editorial transition on client-side navigation.
 * Old route unmounts immediately on URL change (zero overlap).
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
      className="relative"
    >
      {children}
    </motion.div>
  );
};
