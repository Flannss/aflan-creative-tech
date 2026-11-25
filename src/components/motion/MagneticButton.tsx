import React from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion';
import { useCanHoverFine } from '@/hooks/useMediaQuery';

interface MagneticButtonProps {
  children: React.ReactNode;
  maxPull?: number;
  className?: string;
}

/**
 * Tactile magnetic cursor wrapper that pulls its inner CTA gently toward the pointer
 * on fine-pointer desktop devices without React state updates or layout shifts.
 */
export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  maxPull = 7,
  className = '',
}) => {
  const canHoverFine = useCanHoverFine();
  const prefersReducedMotion = useReducedMotion();
  const active = canHoverFine && !prefersReducedMotion;

  const pullX = useMotionValue(0);
  const pullY = useMotionValue(0);
  const springConfig = { stiffness: 220, damping: 20, mass: 0.5 };
  const smoothX = useSpring(pullX, springConfig);
  const smoothY = useSpring(pullY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!active) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const relY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    pullX.set(Math.max(-maxPull, Math.min(maxPull, relX * maxPull)));
    pullY.set(Math.max(-maxPull, Math.min(maxPull, relY * maxPull)));
  };

  const handleMouseLeave = () => {
    if (!active) return;
    pullX.set(0);
    pullY.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={active ? { x: smoothX, y: smoothY } : undefined}
      className={`inline-flex ${active ? 'will-change-transform' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
};
