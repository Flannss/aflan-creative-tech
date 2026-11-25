import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';

export const ScrollProgress: React.FC = () => {
  const { pathname } = useLocation();
  const isProjectDetail = pathname.startsWith('/projects/');
  const { scrollYProgress } = useScroll();
  const prefersReducedMotion = useReducedMotion();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  if (isProjectDetail) {
    return null;
  }

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX: prefersReducedMotion ? scrollYProgress : scaleX }}
      className="fixed top-0 left-0 right-0 h-[2px] bg-linear-to-r from-mocha via-champagne to-ivory origin-left z-[55] pointer-events-none"
    />
  );
};
