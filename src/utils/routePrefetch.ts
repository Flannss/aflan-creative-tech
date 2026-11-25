const prefetchedKeys = new Set<string>();

export const loadAboutPage = () =>
  import('@/pages/AboutPage').then((m) => ({ default: m.AboutPage }));

export const loadJourneyPage = () =>
  import('@/pages/JourneyPage').then((m) => ({ default: m.JourneyPage }));

export const loadSkillsPage = () =>
  import('@/pages/SkillsPage').then((m) => ({ default: m.SkillsPage }));

export const loadProjectsPage = () =>
  import('@/pages/ProjectsPage').then((m) => ({ default: m.ProjectsPage }));

export const loadProjectDetailPage = () =>
  import('@/pages/ProjectDetailPage').then((m) => ({
    default: m.ProjectDetailPage,
  }));

export const loadCreativeLabPage = () =>
  import('@/pages/CreativeLabPage').then((m) => ({
    default: m.CreativeLabPage,
  }));

export const loadGalleryPage = () =>
  import('@/pages/GalleryPage').then((m) => ({ default: m.GalleryPage }));

export const loadAchievementsPage = () =>
  import('@/pages/AchievementsPage').then((m) => ({
    default: m.AchievementsPage,
  }));

export const loadContactPage = () =>
  import('@/pages/ContactPage').then((m) => ({ default: m.ContactPage }));

export const loadNotFoundPage = () =>
  import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }));

const ROUTE_LOADERS: Record<string, () => Promise<unknown>> = {
  '/about': loadAboutPage,
  '/journey': loadJourneyPage,
  '/skills': loadSkillsPage,
  '/projects': loadProjectsPage,
  '/lab': loadCreativeLabPage,
  '/creative-lab': loadCreativeLabPage,
  '/gallery': loadGalleryPage,
  '/achievements': loadAchievementsPage,
  '/contact': loadContactPage,
};

/**
 * Prefetches the JS chunk for a route at most once per session.
 * Called on link hover/focus/touchStart and during idle warm-up for zero-lag route switches.
 */
export function prefetchRoute(path: string): void {
  const cleanPath = path.split('#')[0].split('?')[0] || '/';
  if (cleanPath === '/') return;

  const key = cleanPath.startsWith('/projects/') ? '/projects/:slug' : cleanPath;
  if (prefetchedKeys.has(key)) return;

  const loader = cleanPath.startsWith('/projects/')
    ? loadProjectDetailPage
    : ROUTE_LOADERS[cleanPath];

  if (!loader) return;

  prefetchedKeys.add(key);
  void loader().catch(() => {
    prefetchedKeys.delete(key);
  });
}

const CORE_WARMUP_ROUTES = [
  '/projects',
  '/about',
  '/journey',
  '/skills',
  '/lab',
  '/gallery',
  '/achievements',
  '/contact',
] as const;

/**
 * Silently warms up navigation chunks only after `delayMs` and when the main thread
 * becomes idle so entry gate & initial LCP stay uncontested.
 */
export function warmUpCoreRoutes(delayMs = 1800): () => void {
  if (typeof window === 'undefined') return () => {};

  let idleId: number | null = null;
  let fallbackId: number | null = null;

  const runWarmup = () => {
    for (const route of CORE_WARMUP_ROUTES) {
      prefetchRoute(route);
    }
  };

  const delayTimer = window.setTimeout(() => {
    if (typeof window.requestIdleCallback === 'function') {
      idleId = window.requestIdleCallback(runWarmup, { timeout: 2200 });
    } else {
      fallbackId = window.setTimeout(runWarmup, 400);
    }
  }, delayMs);

  return () => {
    window.clearTimeout(delayTimer);
    if (idleId !== null && typeof window.cancelIdleCallback === 'function') {
      window.cancelIdleCallback(idleId);
    }
    if (fallbackId !== null) {
      window.clearTimeout(fallbackId);
    }
  };
}
