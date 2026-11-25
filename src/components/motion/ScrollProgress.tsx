import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

export const ScrollProgress: React.FC = () => {
  const { pathname } = useLocation();
  const isProjectDetail = pathname.startsWith('/projects/');
  const { scrollTo } = useSmoothScroll();
  const { scrollYProgress } = useScroll();
  const prefersReducedMotion = useReducedMotion();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowTop(window.scrollY > 440);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    scrollTo(0, {
      duration: 0.9,
      immediate: Boolean(prefersReducedMotion),
    });
  };

  return (
    <>
      {!isProjectDetail && (
        <motion.div
          aria-hidden="true"
          style={{ scaleX: prefersReducedMotion ? scrollYProgress : scaleX }}
          className="fixed top-0 left-0 right-0 h-[2px] bg-linear-to-r from-mocha via-champagne to-ivory origin-left z-[55] pointer-events-none"
        />
      )}

      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Kembali ke atas halaman"
        data-cursor="TOP"
        className={`fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 inline-flex items-center justify-center gap-2 size-11 sm:size-auto sm:px-3.5 sm:py-2.5 rounded-full border border-champagne/30 bg-obsidian/90 backdrop-blur-md text-champagne shadow-xl transition-all duration-300 hover:bg-espresso hover:border-champagne/70 hover:-translate-y-0.5 ${
          showTop
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <ArrowUp className="size-3.5" aria-hidden="true" />
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase hidden sm:inline">
          Ke Atas
        </span>
      </button>
    </>
  );
};
