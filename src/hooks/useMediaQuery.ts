import { useSyncExternalStore } from 'react';

function subscribeMediaQuery(query: string, onChange: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const mql = window.matchMedia(query);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
}

function getMediaQuerySnapshot(query: string): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(query).matches;
}

/**
 * Idiomatic React 19 media query hook using useSyncExternalStore.
 * Eliminates synchronous setState inside useEffect and prevents hydration mismatches.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onStoreChange) => subscribeMediaQuery(query, onStoreChange),
    () => getMediaQuerySnapshot(query),
    () => false,
  );
}

export function useIsCoarsePointer(): boolean {
  return useMediaQuery('(pointer: coarse)');
}

export function useCanHoverFine(): boolean {
  const fineHover = useMediaQuery('(hover: hover) and (pointer: fine)');
  const coarse = useMediaQuery('(pointer: coarse)');
  return fineHover && !coarse;
}
