import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface ParallaxFrameProps {
  children: React.ReactNode;
  className?: string;
  offset?: number;
}

/**
 * Subtle editorial image parallax frame.
 * Active on tablet/desktop (>= 768px); stays completely static on mobile (< 768px) and reduced-motion.
 */
export const ParallaxFrame: React.FC<ParallaxFrameProps> = ({
  children,
  className = '',
  offset = 24,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const isTabletOrDesktop = useMediaQuery('(min-width: 768px)');
  const enableParallax = isTabletOrDesktop && !prefersReducedMotion;
  const effectiveOffset = enableParallax ? offset : 0;

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
    enableParallax ? [1.05, 1.02, 1.05] : [1, 1, 1],
  );

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y, scale }} className="w-full h-full will-change-transform">
        {children}
      </motion.div>
    </div>
  );
};
