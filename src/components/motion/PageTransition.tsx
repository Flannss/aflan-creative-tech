import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  EASE_LUXURY,
  pageContentVariants,
  reducedPageVariants,
} from '@/utils/motion';
import { useIsCoarsePointer } from '@/hooks/useMediaQuery';

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * Cinematic editorial route transition:
 * Curtain is rendered as a sibling of the transformed content node so `position: fixed`
 * stays anchored cleanly to the viewport without transform containing-block drift.
 */
export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const prefersReducedMotion = useReducedMotion();
  const isCoarsePointer = useIsCoarsePointer();
  const lightweight = Boolean(prefersReducedMotion || isCoarsePointer);

  return (
    <>
      {!lightweight && (
        <motion.div
          aria-hidden="true"
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          exit={{ scaleY: 0 }}
          transition={{ duration: 0.68, ease: EASE_LUXURY }}
          className="pointer-events-none fixed inset-0 z-70 origin-top bg-espresso border-b border-champagne/25"
        />
      )}
      <motion.div
        variants={lightweight ? reducedPageVariants : pageContentVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="relative"
      >
        {children}
      </motion.div>
    </>
  );
};
