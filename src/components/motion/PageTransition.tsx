import React, { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  EASE_PAGE_ENTER,
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
 * Bi-Directional Depth Parallax Route Transition:
 * - Calibrated fluid rhythm: exit (`0.20s`, `±24px`, `scale: 0.99`, `[0.4, 0, 0.2, 1]`)
 *   flows seamlessly into entrance (`0.40s`, `∓28px -> 0`, `y: 8/6px -> 0`, `scale: 0.99 -> 1`, `[0.16, 1, 0.3, 1]`).
 * - Syncs with RouteSweepIndicator warm Champagne-Caramel veil and Lenis top reset in `onExitComplete`.
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
 * Layered Warm Silk Editorial Veil + Crisp Champagne-Caramel Hairline Sweep:
 * Sweeps GPU-only layers along the navigation direction (`0.44s`, `[0.16, 1, 0.3, 1]`),
 * delivering fast initial acceleration, smooth deceleration, and zero leftover artifact.
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
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[74] overflow-hidden"
      >
        <motion.div
          key={`veil-${transitionId}`}
          initial={{ x: direction === 1 ? '-45%' : '125%', opacity: 0 }}
          animate={{
            x: direction === 1 ? '125%' : '-45%',
            opacity: [0, 1, 0],
          }}
          transition={{ duration: 0.44, ease: EASE_PAGE_ENTER }}
          className="relative h-full w-[38vw] min-w-[200px] will-change-[transform,opacity]"
          style={{
            background:
              direction === 1
                ? 'linear-gradient(90deg, transparent 0%, rgba(110, 79, 58, 0.08) 48%, rgba(223, 200, 166, 0.14) 94%, transparent 100%)'
                : 'linear-gradient(270deg, transparent 0%, rgba(110, 79, 58, 0.08) 48%, rgba(223, 200, 166, 0.14) 94%, transparent 100%)',
          }}
        >
          <span
            className={`absolute inset-y-0 w-[1.5px] bg-linear-to-b from-transparent via-champagne/45 to-transparent ${
              direction === 1 ? 'right-0' : 'left-0'
            }`}
          />
        </motion.div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 inset-x-0 z-[75] h-[1.5px] overflow-hidden"
      >
        <motion.span
          key={`hairline-${transitionId}`}
          initial={{ x: direction === 1 ? '-100%' : '100%', opacity: 0 }}
          animate={{
            x: direction === 1 ? '100%' : '-100%',
            opacity: [0, 0.95, 0],
          }}
          transition={{ duration: 0.44, ease: EASE_PAGE_ENTER }}
          className="block h-full w-3/5 bg-linear-to-r from-transparent via-champagne to-brass will-change-transform"
        />
      </div>
    </>
  );
};
