import React, { useEffect, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { EASE_LUXURY } from '@/utils/motion';

/**
 * Architectural Back-to-Top button with live SVG Champagne progress ring.
 * Appears smoothly after scrolling past 360px and uses Lenis smooth scroll.
 */
export const BackToTop: React.FC = () => {
  const { scrollTo } = useSmoothScroll();
  const { scrollYProgress } = useScroll();
  const prefersReducedMotion = useReducedMotion();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 360);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = () => {
    scrollTo(0, {
      duration: 0.9,
      immediate: Boolean(prefersReducedMotion),
    });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="aflan-back-to-top"
          type="button"
          onClick={handleClick}
          aria-label="Kembali ke atas halaman"
          data-cursor="TOP"
          initial={
            prefersReducedMotion
              ? { opacity: 0 }
              : { opacity: 0, y: 12, scale: 0.92 }
          }
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={
            prefersReducedMotion
              ? { opacity: 0 }
              : { opacity: 0, y: 10, scale: 0.94 }
          }
          whileHover={prefersReducedMotion ? undefined : { y: -2 }}
          whileTap={{ scale: 0.94 }}
          transition={{
            duration: prefersReducedMotion ? 0.14 : 0.28,
            ease: EASE_LUXURY,
          }}
          className="group fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40 size-12 rounded-full bg-[#231915]/[0.96] border border-champagne/28 text-champagne shadow-[0_12px_32px_rgba(20,14,11,0.48)] flex items-center justify-center hover:bg-espresso hover:text-ivory transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-brass"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 48 48"
            className="pointer-events-none absolute inset-0 size-full -rotate-90"
          >
            <circle
              cx="24"
              cy="24"
              r="21.5"
              fill="none"
              stroke="rgba(201,169,124,0.2)"
              strokeWidth="1.5"
            />
            <motion.circle
              cx="24"
              cy="24"
              r="21.5"
              fill="none"
              stroke="#DFC8A6"
              strokeWidth="1.5"
              strokeLinecap="round"
              style={{
                pathLength: prefersReducedMotion ? scrollYProgress : smoothProgress,
              }}
            />
          </svg>
          <ArrowUp
            className="relative z-10 size-4 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5 motion-reduce:transform-none"
            aria-hidden="true"
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
