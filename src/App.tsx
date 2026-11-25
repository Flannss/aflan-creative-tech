import React, { Suspense, lazy, useState } from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { SplashIntro } from '@/components/layout/SplashIntro';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { SmoothScrollProvider } from '@/components/motion/SmoothScrollProvider';
import { PageTransition } from '@/components/motion/PageTransition';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { HomePage } from '@/pages/HomePage';

const AboutPage = lazy(() =>
  import('@/pages/AboutPage').then((m) => ({ default: m.AboutPage })),
);
const JourneyPage = lazy(() =>
  import('@/pages/JourneyPage').then((m) => ({ default: m.JourneyPage })),
);
const SkillsPage = lazy(() =>
  import('@/pages/SkillsPage').then((m) => ({ default: m.SkillsPage })),
);
const ProjectsPage = lazy(() =>
  import('@/pages/ProjectsPage').then((m) => ({ default: m.ProjectsPage })),
);
const ProjectDetailPage = lazy(() =>
  import('@/pages/ProjectDetailPage').then((m) => ({
    default: m.ProjectDetailPage,
  })),
);
const CreativeLabPage = lazy(() =>
  import('@/pages/CreativeLabPage').then((m) => ({
    default: m.CreativeLabPage,
  })),
);
const GalleryPage = lazy(() =>
  import('@/pages/GalleryPage').then((m) => ({ default: m.GalleryPage })),
);
const AchievementsPage = lazy(() =>
  import('@/pages/AchievementsPage').then((m) => ({
    default: m.AchievementsPage,
  })),
);
const ContactPage = lazy(() =>
  import('@/pages/ContactPage').then((m) => ({ default: m.ContactPage })),
);
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
);

const RouteFallback: React.FC = () => (
  <div
    aria-live="polite"
    className="min-h-[70vh] bg-[#1A1412] text-ivory flex flex-col items-center justify-center gap-4 px-6"
  >
    <span className="block w-14 h-px bg-champagne/45 animate-pulse motion-reduce:animate-none" />
    <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.24em] text-champagne/80">
      MEMUAT ARSIP · AMDZ
    </span>
  </div>
);

const AppRoutes: React.FC = () => {
  const location = useLocation();
  const { scrollTo } = useSmoothScroll();

  return (
    <AnimatePresence
      mode="wait"
      initial={false}
      onExitComplete={() => {
        scrollTo(0, { immediate: true });
      }}
    >
      <PageTransition key={location.pathname}>
        <Suspense fallback={<RouteFallback />}>
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
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

export const App: React.FC = () => {
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

  const handleEnterPortfolio = () => {
    try {
      window.sessionStorage.setItem(INTRO_SEEN_KEY, '1');
    } catch {
      // Ignore restricted storage environments
    }
    setShowSplash(false);
  };

  return (
    <MotionConfig reducedMotion="user">
      <SmoothScrollProvider>
        <ToastProvider>
          <AnimatePresence mode="wait">
            {showSplash && (
              <SplashIntro
                key="aflan-splash-intro"
                onEnter={handleEnterPortfolio}
              />
            )}
          </AnimatePresence>

          <BrowserRouter>
            <Layout splashActive={showSplash}>
              <ErrorBoundary>
                <AppRoutes />
              </ErrorBoundary>
            </Layout>
          </BrowserRouter>
        </ToastProvider>
      </SmoothScrollProvider>
    </MotionConfig>
  );
};

export default App;
