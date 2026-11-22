import React from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface StackingCardProps {
  children: React.ReactNode;
  containerRef: React.RefObject<HTMLDivElement | null>;
  index: number;
  total: number;
  className?: string;
  baseTopPx?: number;
  offsetStepPx?: number;
  id?: string;
}

/**
 * Scroll-driven editorial stacking card:
 * - Tracks parent deck scroll progress so covered cards smoothly scale down slightly
 *   and dim via a GPU-composited scrim overlay as subsequent cards layer above them.
 * - On mobile (< 768px) or reduced-motion: relaxes cleanly into static flow to prevent layout crowding.
 */
export const StackingCard: React.FC<StackingCardProps> = ({
  children,
  containerRef,
  index,
  total,
  className = '',
  baseTopPx = 112,
  offsetStepPx = 18,
  id,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const isTabletOrDesktop = useMediaQuery('(min-width: 768px)');
  const enableStacking = isTabletOrDesktop && !prefersReducedMotion && total > 1;
  const isLast = index >= total - 1;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const startRange = total > 1 ? index / total : 0;
  const targetScale = isLast ? 1 : Math.max(0.91, 1 - (total - 1 - index) * 0.028);
  const targetDim = isLast ? 0 : Math.min(0.36, (total - 1 - index) * 0.12);

  const scale = useTransform(
    scrollYProgress,
    [startRange, 1],
    enableStacking && !isLast ? [1, targetScale] : [1, 1],
  );
  const dimOpacity = useTransform(
    scrollYProgress,
    [startRange, 1],
    enableStacking && !isLast ? [0, targetDim] : [0, 0],
  );

  const stickyTop = baseTopPx + Math.min(index, 5) * offsetStepPx;

  return (
    <div
      id={id}
      style={
        enableStacking
          ? {
              position: 'sticky',
              top: `${stickyTop}px`,
              zIndex: index + 1,
            }
          : undefined
      }
      className={`scroll-mt-28 ${className}`}
    >
      <motion.div
        style={{ scale }}
        className="relative origin-top will-change-transform"
      >
        {children}
        {enableStacking && !isLast && (
          <motion.div
            aria-hidden="true"
            style={{ opacity: dimOpacity }}
            className="pointer-events-none absolute inset-0 bg-obsidian"
          />
        )}
      </motion.div>
    </div>
  );
};
