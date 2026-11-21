import React from 'react';
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

  return (
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
  );
};

export const App: React.FC = () => {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Layout>
          <ErrorBoundary>
            <AppRoutes />
          </ErrorBoundary>
        </Layout>
      </BrowserRouter>
    </MotionConfig>
  );
};

export default App;
