import { createContext, useContext } from 'react';

export interface SmoothScrollOptions {
  offset?: number;
  immediate?: boolean;
  duration?: number;
}

export interface SmoothScrollContextValue {
  scrollTo: (
    target: number | string | HTMLElement,
    options?: SmoothScrollOptions,
  ) => void;
  pauseScroll: () => void;
  resumeScroll: () => void;
}

export const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  scrollTo: (target, options) => {
    if (typeof window === 'undefined') return;
    const top =
      typeof target === 'number'
        ? target + (options?.offset ?? 0)
        : 0;
    window.scrollTo({
      top: Math.max(0, top),
      left: 0,
      behavior: options?.immediate ? 'auto' : 'smooth',
    });
  },
  pauseScroll: () => {},
  resumeScroll: () => {},
});

export function useSmoothScroll(): SmoothScrollContextValue {
  return useContext(SmoothScrollContext);
}
