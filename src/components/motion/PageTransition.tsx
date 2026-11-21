import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  pageContentVariants,
  reducedPageVariants,
} from '@/utils/motion';
import { useIsCoarsePointer } from '@/hooks/useMediaQuery';

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * Fast, non-blocking editorial route transition:
 * Old route unmounts immediately on URL change (zero overlap), while incoming content
 * glides into view cleanly in ~260ms without a blocking curtain delay.
 */
export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const prefersReducedMotion = useReducedMotion();
  const isCoarsePointer = useIsCoarsePointer();
  const lightweight = Boolean(prefersReducedMotion || isCoarsePointer);

  return (
    <motion.div
      variants={lightweight ? reducedPageVariants : pageContentVariants}
      initial="initial"
      animate="animate"
      className="relative"
    >
      {children}
    </motion.div>
  );
};
