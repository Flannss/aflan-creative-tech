import { useCallback, useSyncExternalStore } from 'react';

const BOOKMARKS_STORAGE_KEY = 'aflan-bookmarked-projects';
const BOOKMARKS_CHANGE_EVENT = 'aflan-bookmarks-change';
const EMPTY_SLUGS: string[] = [];

let cachedRaw: string | null = null;
let cachedSlugs: string[] = EMPTY_SLUGS;

function parseSlugs(raw: string | null): string[] {
  if (!raw) return EMPTY_SLUGS;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY_SLUGS;
    const filtered = parsed.filter(
      (item): item is string => typeof item === 'string' && item.trim().length > 0,
    );
    return filtered.length > 0 ? filtered : EMPTY_SLUGS;
  } catch {
    return EMPTY_SLUGS;
  }
}

function getSnapshot(): string[] {
  if (typeof window === 'undefined') return EMPTY_SLUGS;
  try {
    const raw = window.localStorage.getItem(BOOKMARKS_STORAGE_KEY);
    if (raw === cachedRaw) {
      return cachedSlugs;
    }
    cachedRaw = raw;
    cachedSlugs = parseSlugs(raw);
    return cachedSlugs;
  } catch {
    return EMPTY_SLUGS;
  }
}

function getServerSnapshot(): string[] {
  return EMPTY_SLUGS;
}

function subscribe(onStoreChange: () => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleStorage = (e: StorageEvent) => {
    if (e.key === BOOKMARKS_STORAGE_KEY || e.key === null) {
      onStoreChange();
    }
  };

  const handleLocalChange = () => {
    onStoreChange();
  };

  window.addEventListener('storage', handleStorage);
  window.addEventListener(BOOKMARKS_CHANGE_EVENT, handleLocalChange);
  return () => {
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener(BOOKMARKS_CHANGE_EVENT, handleLocalChange);
  };
}

function writeBookmarks(nextSlugs: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    const serialized = JSON.stringify(nextSlugs);
    window.localStorage.setItem(BOOKMARKS_STORAGE_KEY, serialized);
    cachedRaw = serialized;
    cachedSlugs = nextSlugs.length > 0 ? nextSlugs : EMPTY_SLUGS;
    window.dispatchEvent(new Event(BOOKMARKS_CHANGE_EVENT));
  } catch {
    // Gracefully ignore restricted storage environments
  }
}

/**
 * Shared personal shortlist store synced via localStorage and React 19 useSyncExternalStore.
 */
export function useBookmarkedProjects() {
  const bookmarkedSlugs = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const isBookmarked = useCallback(
    (slug: string) => bookmarkedSlugs.includes(slug),
    [bookmarkedSlugs],
  );

  const toggleBookmark = useCallback((slug: string): boolean => {
    const current = getSnapshot();
    const exists = current.includes(slug);
    const next = exists
      ? current.filter((item) => item !== slug)
      : [...current, slug];
    writeBookmarks(next);
    return !exists;
  }, []);

  const clearBookmarks = useCallback(() => {
    writeBookmarks([]);
  }, []);

  return {
    bookmarkedSlugs,
    isBookmarked,
    toggleBookmark,
    clearBookmarks,
    count: bookmarkedSlugs.length,
  };
}
