import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { MonogramMark } from '@/components/brand/Monogram';
import { navigationRoutes } from '@/data/personal';
import { projectsData } from '@/data/projects';
import {
  EASE_VEIL,
  pageContentVariants,
  reducedPageVariants,
} from '@/utils/motion';

let hasCompletedInitialRender = false;

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * Architectural Veil Page Transition:
 * - Zero delay on very first render and instant fallback under `prefers-reduced-motion`.
 * - On client-side navigation, sweeps a non-blocking Espresso curtain upward (`scaleY: 1 -> 0`)
 *   with a razor-thin Champagne leading hairline and brief AMDZ chapter flash.
 */
export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const { pathname } = useLocation();
  const prefersReducedMotion = useReducedMotion();
  const skipInitialEntrance = !hasCompletedInitialRender;
  const [veilVisible, setVeilVisible] = useState(!skipInitialEntrance);

  useEffect(() => {
    hasCompletedInitialRender = true;
  }, []);

  const destination = useMemo(() => {
    const matchedRoute = navigationRoutes.find((r) => r.path === pathname);
    if (matchedRoute) {
      return {
        code: `BAB ${matchedRoute.index}`,
        label: matchedRoute.label.toUpperCase(),
      };
    }

    if (pathname.startsWith('/projects/')) {
      const slug = pathname.slice('/projects/'.length);
      const matchedProject = projectsData.find((p) => p.slug === slug);
      if (matchedProject) {
        return {
          code: `ENTRI ${matchedProject.index}`,
          label: matchedProject.title.toUpperCase(),
        };
      }
    }

    return {
      code: 'AMDZ',
      label: 'AFLAN DOSSIER',
    };
  }, [pathname]);

  return (
    <>
      {!prefersReducedMotion && veilVisible && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-[75] pointer-events-none select-none overflow-hidden"
        >
          <motion.div
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            transition={{ duration: 0.5, ease: EASE_VEIL }}
            onAnimationComplete={() => setVeilVisible(false)}
            className="absolute inset-0 origin-top bg-[#1A1412] will-change-transform"
          >
            <span className="absolute inset-x-0 bottom-0 h-px bg-champagne/65" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0.95, y: 0 }}
            animate={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.26, ease: EASE_VEIL }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 px-6 text-center"
          >
            <MonogramMark size={24} className="text-champagne/90" />
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.26em] text-champagne max-w-md truncate">
              {destination.code} · {destination.label}
            </span>
          </motion.div>
        </div>
      )}

      <motion.div
        variants={prefersReducedMotion ? reducedPageVariants : pageContentVariants}
        initial={skipInitialEntrance ? false : 'initial'}
        animate="animate"
        className="relative"
      >
        {children}
      </motion.div>
    </>
  );
};
