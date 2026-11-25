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

const AppRoutes: React.FC<{ introReady: boolean }> = ({ introReady }) => {
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

  useEffect(() => warmUpCoreRoutes(), []);

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
