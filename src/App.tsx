import React, { Suspense, lazy, useEffect } from 'react';
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { PageTransition } from '@/components/motion/PageTransition';
import { HomePage } from '@/pages/HomePage';

const loadAboutPage = () => import('@/pages/AboutPage');
const loadJourneyPage = () => import('@/pages/JourneyPage');
const loadSkillsPage = () => import('@/pages/SkillsPage');
const loadProjectsPage = () => import('@/pages/ProjectsPage');
const loadProjectDetailPage = () => import('@/pages/ProjectDetailPage');
const loadCreativeLabPage = () => import('@/pages/CreativeLabPage');
const loadGalleryPage = () => import('@/pages/GalleryPage');
const loadAchievementsPage = () => import('@/pages/AchievementsPage');
const loadContactPage = () => import('@/pages/ContactPage');
const loadNotFoundPage = () => import('@/pages/NotFoundPage');

const AboutPage = lazy(() => loadAboutPage().then((m) => ({ default: m.AboutPage })));
const JourneyPage = lazy(() => loadJourneyPage().then((m) => ({ default: m.JourneyPage })));
const SkillsPage = lazy(() => loadSkillsPage().then((m) => ({ default: m.SkillsPage })));
const ProjectsPage = lazy(() => loadProjectsPage().then((m) => ({ default: m.ProjectsPage })));
const ProjectDetailPage = lazy(() =>
  loadProjectDetailPage().then((m) => ({ default: m.ProjectDetailPage })),
);
const CreativeLabPage = lazy(() =>
  loadCreativeLabPage().then((m) => ({ default: m.CreativeLabPage })),
);
const GalleryPage = lazy(() => loadGalleryPage().then((m) => ({ default: m.GalleryPage })));
const AchievementsPage = lazy(() =>
  loadAchievementsPage().then((m) => ({ default: m.AchievementsPage })),
);
const ContactPage = lazy(() => loadContactPage().then((m) => ({ default: m.ContactPage })));
const NotFoundPage = lazy(() => loadNotFoundPage().then((m) => ({ default: m.NotFoundPage })));

const RouteFallback: React.FC = () => (
  <div
    aria-busy="true"
    className="min-h-[60vh] bg-obsidian text-champagne flex flex-col items-center justify-center gap-2"
  >
    <span className="font-serif italic text-2xl tracking-[0.12em]">AFLAN</span>
    <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-taupe">
      MEMUAT BAB
    </span>
  </div>
);

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  // Pre-warm lazy route modules in the background on idle so SPA navigation switches instantly
  useEffect(() => {
    const preloadAll = () => {
      void Promise.allSettled([
        loadAboutPage(),
        loadProjectsPage(),
        loadJourneyPage(),
        loadSkillsPage(),
        loadProjectDetailPage(),
        loadCreativeLabPage(),
        loadGalleryPage(),
        loadAchievementsPage(),
        loadContactPage(),
      ]);
    };

    const win = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (typeof win.requestIdleCallback === 'function') {
      const id = win.requestIdleCallback(preloadAll, { timeout: 1200 });
      return () => win.cancelIdleCallback?.(id);
    }

    const timer = window.setTimeout(preloadAll, 350);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <Suspense fallback={<RouteFallback />}>
      <PageTransition key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/journey" element={<JourneyPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
          <Route path="/lab" element={<CreativeLabPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </PageTransition>
    </Suspense>
  );
};

export const App: React.FC = () => {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Layout>
          <ErrorBoundary>
            <AnimatedRoutes />
          </ErrorBoundary>
        </Layout>
      </BrowserRouter>
    </MotionConfig>
  );
};

export default App;
