import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useIsCoarsePointer } from '@/hooks/useMediaQuery';

interface ParallaxFrameProps {
  children: React.ReactNode;
  className?: string;
  offset?: number;
}

/**
 * Subtle editorial image parallax frame.
 * Gently shifts and settles inner photography on scroll across desktop, tablet, and mobile;
 * automatically remains static when OS reduced-motion is enabled.
 */
export const ParallaxFrame: React.FC<ParallaxFrameProps> = ({
  children,
  className = '',
  offset = 24,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const isCoarsePointer = useIsCoarsePointer();
  const effectiveOffset = prefersReducedMotion
    ? 0
    : isCoarsePointer
      ? Math.round(offset * 0.55)
      : offset;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    effectiveOffset === 0 ? [0, 0] : [-effectiveOffset, effectiveOffset],
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    prefersReducedMotion ? [1, 1, 1] : [1.06, 1.02, 1.05],
  );

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y, scale }} className="w-full h-full will-change-transform">
        {children}
      </motion.div>
    </div>
  );
};
