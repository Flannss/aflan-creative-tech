import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import Lenis from 'lenis';
import { useReducedMotion } from 'framer-motion';
import {
  SmoothScrollContext,
  type SmoothScrollOptions,
} from '@/hooks/useSmoothScroll';

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

/**
 * Lightweight Lenis smooth scroll provider with atomic reference-counted modal locking,
 * tab-visibility RAF pause, and automatic disablement under `prefers-reduced-motion: reduce`.
 */
export const SmoothScrollProvider: React.FC<SmoothScrollProviderProps> = ({
  children,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);
  const lockCountRef = useRef<number>(0);
  const prevBodyOverflowRef = useRef<string>('');

  useEffect(() => {
    if (prefersReducedMotion) {
      lenisRef.current = null;
      return;
    }

    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 0.95,
      syncTouch: false,
      touchMultiplier: 1,
    });

    lenisRef.current = lenis;
    if (lockCountRef.current > 0) {
      lenis.stop();
    }

    let rafId = 0;
    const raf = (time: number) => {
      rafId = 0;
      if (document.hidden) return;
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };

    const startRaf = () => {
      if (!rafId && !document.hidden) {
        rafId = window.requestAnimationFrame(raf);
      }
    };

    const stopRaf = () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    const handleVisibility = () => {
      if (document.hidden) {
        stopRaf();
      } else {
        startRaf();
      }
    };

    startRaf();
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      stopRaf();
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    return () => {
      if (lockCountRef.current > 0 && typeof document !== 'undefined') {
        document.body.style.overflow = prevBodyOverflowRef.current;
        lockCountRef.current = 0;
      }
    };
  }, []);

  const pauseScroll = useCallback(() => {
    if (lockCountRef.current === 0 && typeof document !== 'undefined') {
      prevBodyOverflowRef.current = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    lockCountRef.current += 1;
    lenisRef.current?.stop();
  }, []);

  const resumeScroll = useCallback(() => {
    lockCountRef.current = Math.max(0, lockCountRef.current - 1);
    if (lockCountRef.current === 0) {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = prevBodyOverflowRef.current;
      }
      lenisRef.current?.start();
    }
  }, []);

  const scrollTo = useCallback(
    (
      target: number | string | HTMLElement,
      options?: SmoothScrollOptions,
    ) => {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(target, {
          offset: options?.offset ?? 0,
          immediate: options?.immediate ?? false,
          duration: options?.duration,
          force: options?.immediate ?? false,
        });
        return;
      }

      if (typeof window === 'undefined') return;
      let resolvedTop = 0;
      if (typeof target === 'number') {
        resolvedTop = target;
      } else if (typeof target === 'string') {
        const el = document.querySelector<HTMLElement>(target);
        if (el) {
          resolvedTop = el.getBoundingClientRect().top + window.scrollY;
        }
      } else {
        resolvedTop = target.getBoundingClientRect().top + window.scrollY;
      }

      window.scrollTo({
        top: Math.max(0, resolvedTop + (options?.offset ?? 0)),
        left: 0,
        behavior: options?.immediate || prefersReducedMotion ? 'auto' : 'smooth',
      });
    },
    [prefersReducedMotion],
  );

  const value = useMemo(
    () => ({
      scrollTo,
      pauseScroll,
      resumeScroll,
    }),
    [scrollTo, pauseScroll, resumeScroll],
  );

  return (
    <SmoothScrollContext.Provider value={value}>
      {children}
    </SmoothScrollContext.Provider>
  );
};
