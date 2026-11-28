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
 * Bi-Directional Depth Parallax Route Transition:
 * - Forward (`direction = 1`) and Backward (`direction = -1`) glide along clean directional axes
 *   with calibrated entrance (`0.42s`, `[0.22, 1, 0.36, 1]`) and crisp exit (`0.24s`, `[0.32, 0.72, 0, 1]`).
 * - Pair-syncs with RouteSweepIndicator warm Silk Editorial Veil and Lenis top reset in `onExitComplete`.
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
 * Layered Warm Silk Editorial Veil + Leading Champagne Hairline Sweep:
 * Sweeps GPU-only layers smoothly along the navigation direction (`0.42s`),
 * adding tactile visual continuity without blocking pointer events or text legibility.
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
            opacity: [0, 0.85, 0],
          }}
          transition={{ duration: 0.42, ease: EASE_LUXURY }}
          className="relative h-full w-[42vw] min-w-[220px] will-change-[transform,opacity]"
          style={{
            background:
              direction === 1
                ? 'linear-gradient(90deg, transparent 0%, rgba(110, 79, 58, 0.14) 52%, rgba(223, 200, 166, 0.12) 94%, transparent 100%)'
                : 'linear-gradient(270deg, transparent 0%, rgba(110, 79, 58, 0.14) 52%, rgba(223, 200, 166, 0.12) 94%, transparent 100%)',
          }}
        >
          <span
            className={`absolute inset-y-0 w-px bg-linear-to-b from-transparent via-champagne/40 to-transparent ${
              direction === 1 ? 'right-0' : 'left-0'
            }`}
          />
        </motion.div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 inset-x-0 z-[75] h-[2px] overflow-hidden"
      >
        <motion.span
          key={`hairline-${transitionId}`}
          initial={{ x: direction === 1 ? '-100%' : '100%', opacity: 0 }}
          animate={{
            x: direction === 1 ? '100%' : '-100%',
            opacity: [0, 0.95, 0],
          }}
          transition={{ duration: 0.42, ease: EASE_LUXURY }}
          className="block h-full w-3/5 bg-linear-to-r from-transparent via-champagne to-brass will-change-transform"
        />
      </div>
    </>
  );
};
