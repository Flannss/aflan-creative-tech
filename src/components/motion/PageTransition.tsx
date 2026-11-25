import React, { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  EASE_LUXURY,
  biDirectionalPageVariants,
  reducedPageVariants,
  type PageTransitionCustom,
  type RouteTransitionKind,
} from '@/utils/motion';

let hasCompletedInitialRender = false;

interface PageTransitionProps {
  children: React.ReactNode;
  direction?: 1 | -1;
  kind?: RouteTransitionKind;
}

/**
 * Bi-Directional Symmetric Route Transition:
 * - Forward (`direction = 1`) and Backward (`direction = -1`) mirror one another cleanly
 *   (`enter: 0.34s`, `exit: 0.20s`, `±24px / ±22px`, scale depth `0.99`).
 * - Showcase routes add a gentle `10px` upward aperture lift; editorial routes stay purely lateral.
 */
export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  direction = 1,
  kind = 'editorial',
}) => {
  const prefersReducedMotion = useReducedMotion();
  const skipInitialEntrance = !hasCompletedInitialRender;

  useEffect(() => {
    hasCompletedInitialRender = true;
  }, []);

  const customPayload: PageTransitionCustom = { direction, kind };

  return (
    <motion.div
      custom={customPayload}
      variants={prefersReducedMotion ? reducedPageVariants : biDirectionalPageVariants}
      initial={skipInitialEntrance ? false : 'initial'}
      animate="animate"
      exit="exit"
      className="relative will-change-[transform,opacity]"
    >
      {children}
    </motion.div>
  );
};

interface RouteSweepIndicatorProps {
  transitionId: number;
  direction: 1 | -1;
  visible: boolean;
}

/**
 * Top Champagne-to-Caramel hairline sweep aligned with editorial navigation direction.
 */
export const RouteSweepIndicator: React.FC<RouteSweepIndicatorProps> = ({
  transitionId,
  direction,
  visible,
}) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion || !visible || transitionId <= 0) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 inset-x-0 z-[75] h-[2px] overflow-hidden"
    >
      <motion.span
        key={transitionId}
        initial={{ x: direction === 1 ? '-100%' : '100%', opacity: 0 }}
        animate={{
          x: direction === 1 ? '100%' : '-100%',
          opacity: [0, 0.95, 0],
        }}
        transition={{ duration: 0.38, ease: EASE_LUXURY }}
        className="block h-full w-3/5 bg-linear-to-r from-transparent via-champagne to-brass will-change-transform"
      />
    </div>
  );
};
