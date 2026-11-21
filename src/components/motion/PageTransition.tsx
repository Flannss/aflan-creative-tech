import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  pageContentVariants,
  reducedPageVariants,
} from '@/utils/motion';

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * Fast, non-blocking editorial route transition across all devices.
 * Old route unmounts immediately on URL change (zero overlap).
 */
export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      variants={prefersReducedMotion ? reducedPageVariants : pageContentVariants}
      initial="initial"
      animate="animate"
      className="relative"
    >
      {children}
    </motion.div>
  );
};
