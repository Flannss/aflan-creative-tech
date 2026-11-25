import React, { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { SplashIntro } from '@/components/layout/SplashIntro';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { SmoothScrollProvider } from '@/components/motion/SmoothScrollProvider';
import { PageTransition } from '@/components/motion/PageTransition';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import {
  loadAboutPage,
  loadAchievementsPage,
  loadContactPage,
  loadCreativeLabPage,
  loadGalleryPage,
  loadJourneyPage,
  loadNotFoundPage,
  loadProjectDetailPage,
  loadProjectsPage,
  loadSkillsPage,
  prefetchRoute,
  warmUpCoreRoutes,
} from '@/utils/routePrefetch';
import { HomePage } from '@/pages/HomePage';

const AboutPage = lazy(loadAboutPage);
const JourneyPage = lazy(loadJourneyPage);
const SkillsPage = lazy(loadSkillsPage);
const ProjectsPage = lazy(loadProjectsPage);
const ProjectDetailPage = lazy(loadProjectDetailPage);
const CreativeLabPage = lazy(loadCreativeLabPage);
const GalleryPage = lazy(loadGalleryPage);
const AchievementsPage = lazy(loadAchievementsPage);
const ContactPage = lazy(loadContactPage);
const NotFoundPage = lazy(loadNotFoundPage);

const ROUTE_ORDER_MAP: Record<string, number> = {
  '/': 0,
  '/about': 1,
  '/journey': 2,
  '/skills': 3,
  '/projects': 4,
  '/lab': 5,
  '/gallery': 6,
  '/achievements': 7,
  '/contact': 8,
};

function getRouteOrderIndex(pathname: string): number {
  if (pathname.startsWith('/projects/')) return 4;
  return ROUTE_ORDER_MAP[pathname] ?? 0;
}

const RouteFallback: React.FC = () => (
  <div
    aria-live="polite"
    className="min-h-[70vh] bg-obsidian text-ivory flex flex-col items-center justify-center gap-4 px-5 md:px-8"
  >
    <span className="block w-14 h-px bg-brass/50 animate-pulse motion-reduce:animate-none" />
    <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.24em] text-brass/85">
      MEMUAT ARSIP · AMDZ
    </span>
  </div>
);

const AppRoutes: React.FC<{ introReady: boolean }> = ({ introReady }) => {
  const location = useLocation();
  const { scrollTo } = useSmoothScroll();
  const [navTrack, setNavTrack] = useState<{ path: string; dir: number }>({
    path: location.pathname,
    dir: 1,
  });

  if (navTrack.path !== location.pathname) {
    const prevIdx = getRouteOrderIndex(navTrack.path);
    const nextIdx = getRouteOrderIndex(location.pathname);
    setNavTrack({
      path: location.pathname,
      dir: nextIdx >= prevIdx ? 1 : -1,
    });
  }

  return (
    <AnimatePresence
      mode="wait"
      initial={false}
      custom={navTrack.dir}
      onExitComplete={() => {
        scrollTo(0, { immediate: true });
      }}
    >
      <PageTransition key={location.pathname} direction={navTrack.dir}>
        <Suspense fallback={<RouteFallback />}>
          <Routes location={location}>
            <Route path="/" element={<HomePage introReady={introReady} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/journey" element={<JourneyPage />} />
            <Route path="/skills" element={<SkillsPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:slug" element={<ProjectDetailPage />} />
            <Route path="/lab" element={<CreativeLabPage />} />
            <Route path="/creative-lab" element={<Navigate to="/lab" replace />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </PageTransition>
    </AnimatePresence>
  );
};

const INTRO_SEEN_KEY = 'aflan-intro-seen';

const AppShell: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    try {
      return (
        typeof window !== 'undefined' &&
        !window.sessionStorage.getItem(INTRO_SEEN_KEY)
      );
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (showSplash) return;
    return warmUpCoreRoutes(1800);
  }, [showSplash]);

  const handleEnterPortfolio = useCallback(
    (targetPath?: string) => {
      try {
        window.sessionStorage.setItem(INTRO_SEEN_KEY, '1');
      } catch {
        // Ignore restricted storage environments
      }
      if (targetPath && targetPath !== location.pathname) {
        prefetchRoute(targetPath);
        navigate(targetPath);
      }
      setShowSplash(false);
    },
    [location.pathname, navigate],
  );

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash && (
          <SplashIntro
            key="aflan-splash-intro"
            onEnter={handleEnterPortfolio}
          />
        )}
      </AnimatePresence>

      <Layout splashActive={showSplash}>
        <ErrorBoundary>
          <AppRoutes introReady={!showSplash} />
        </ErrorBoundary>
      </Layout>
    </>
  );
};

export const App: React.FC = () => (
  <MotionConfig reducedMotion="user">
    <SmoothScrollProvider>
      <ToastProvider>
        <BrowserRouter>
          <AppShell />
        </BrowserRouter>
      </ToastProvider>
    </SmoothScrollProvider>
  </MotionConfig>
);

export default App;
