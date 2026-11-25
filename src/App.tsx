import React, { useState } from 'react';
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
import { AboutPage } from '@/pages/AboutPage';
import { JourneyPage } from '@/pages/JourneyPage';
import { SkillsPage } from '@/pages/SkillsPage';
import { ProjectsPage } from '@/pages/ProjectsPage';
import { ProjectDetailPage } from '@/pages/ProjectDetailPage';
import { CreativeLabPage } from '@/pages/CreativeLabPage';
import { GalleryPage } from '@/pages/GalleryPage';
import { AchievementsPage } from '@/pages/AchievementsPage';
import { ContactPage } from '@/pages/ContactPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

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
