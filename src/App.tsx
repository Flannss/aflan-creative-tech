import React, { Suspense, lazy } from 'react';
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { PageTransition } from '@/components/motion/PageTransition';
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
  import('@/pages/ProjectDetailPage').then((m) => ({ default: m.ProjectDetailPage })),
);
const CreativeLabPage = lazy(() =>
  import('@/pages/CreativeLabPage').then((m) => ({ default: m.CreativeLabPage })),
);
const GalleryPage = lazy(() =>
  import('@/pages/GalleryPage').then((m) => ({ default: m.GalleryPage })),
);
const AchievementsPage = lazy(() =>
  import('@/pages/AchievementsPage').then((m) => ({ default: m.AchievementsPage })),
);
const ContactPage = lazy(() =>
  import('@/pages/ContactPage').then((m) => ({ default: m.ContactPage })),
);
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
);

const RouteFallback: React.FC = () => (
  <div className="min-h-[75vh] bg-obsidian text-champagne flex flex-col items-center justify-center gap-3">
    <span className="font-serif italic text-3xl">AFLAN</span>
    <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-taupe">
      MEMUAT BAB
    </span>
  </div>
);

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
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
