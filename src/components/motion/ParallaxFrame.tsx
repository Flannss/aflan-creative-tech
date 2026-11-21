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
 * Gently shifts and settles inner photography on scroll on desktop pointer devices;
 * automatically remains static on coarse touch pointers and reduced-motion setups.
 */
export const ParallaxFrame: React.FC<ParallaxFrameProps> = ({
  children,
  className = '',
  offset = 24,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const isCoarsePointer = useIsCoarsePointer();
  const disabled = Boolean(prefersReducedMotion || isCoarsePointer);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], disabled ? [0, 0] : [-offset, offset]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], disabled ? [1, 1, 1] : [1.08, 1.03, 1.06]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y, scale }} className="w-full h-full will-change-transform">
        {children}
      </motion.div>
    </div>
  );
};
