import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { ProjectEntry } from '@/data/projects';
import { ApertureFrame } from '@/components/motion/ApertureFrame';
import { TypographicDossierPlate } from '@/components/projects/TypographicDossierPlate';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { prefetchRoute } from '@/utils/routePrefetch';

interface LenisSelectedWorksProps {
  projects: ProjectEntry[];
}

interface ScrollWorkRowProps {
  project: ProjectEntry;
  index: number;
  enableParallax: boolean;
  isDesktopOrTablet: boolean;
}

const ScrollWorkRow: React.FC<ScrollWorkRowProps> = ({
  project,
  index,
  enableParallax,
  isDesktopOrTablet,
}) => {
  const rowRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ['start end', 'end start'],
  });

  const mediaY = useTransform(
    scrollYProgress,
    [0, 1],
    enableParallax ? (isDesktopOrTablet ? [-22, 22] : [-10, 10]) : [0, 0],
  );
  const mediaScale = useTransform(
    scrollYProgress,
    [0, 0.55],
    enableParallax ? [1.07, 1.0] : [1, 1],
  );

  const isOdd = index % 2 === 1;
  const targetSlug = `/projects/${project.slug}`;

  return (
    <article
      ref={rowRef}
      className="grid grid-cols-1 md:grid-cols-12 gap-7 md:gap-8 lg:gap-12 items-center"
    >
      {/* Visual Plate synced with Lenis scroll progress */}
      <div
        className={`md:col-span-7 ${isOdd ? 'md:order-2' : 'md:order-1'}`}
      >
        <Link
          to={targetSlug}
          data-cursor-label="CASE STUDY"
          onMouseEnter={() => prefetchRoute(targetSlug)}
          onFocus={() => prefetchRoute(targetSlug)}
          onTouchStart={() => prefetchRoute(targetSlug)}
          aria-label={`Buka studi kasus ${project.title}`}
          className="group block border border-brass/25 hover:border-brass/60 bg-obsidian transition-colors duration-500 overflow-hidden"
        >
          <ApertureFrame className="aspect-[16/10] md:aspect-video">
            <motion.div
              style={{ y: mediaY, scale: mediaScale }}
              className="w-full h-full will-change-transform"
            >
              {project.previewImage ? (
                <div
                  className="w-full h-full"
                  style={{ backgroundColor: project.previewBg ?? '#1B1512' }}
                >
                  <img
                    src={project.previewImage}
                    alt={project.previewCaption}
                    loading="lazy"
                    decoding="async"
                    style={{
                      objectPosition:
                        project.previewObjectPosition ?? 'center',
                    }}
                    className={`w-full h-full ${
                      project.previewImageFit === 'contain'
                        ? 'object-contain p-6 sm:p-10'
                        : 'object-cover'
                    }`}
                  />
                </div>
              ) : (
                <TypographicDossierPlate
                  project={project}
                  compact
                  className="w-full h-full border-0"
                />
              )}
            </motion.div>
          </ApertureFrame>
        </Link>
      </div>

      {/* Essential Minimalist Metadata */}
      <div
        className={`md:col-span-5 ${
          isOdd ? 'md:order-1 md:pr-4' : 'md:order-2 md:pl-4'
        } space-y-5`}
      >
        <div className="flex items-center gap-3 font-mono text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-brass">
          <span>{project.index}</span>
          <span aria-hidden="true" className="w-5 h-px bg-brass/40" />
          <span className="text-taupe">{project.yearLabel}</span>
        </div>

        <h3 className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-light leading-[1.1] tracking-tight text-ivory">
          {project.title}
        </h3>

        <p className="font-sans text-sm md:text-base text-ivory/75">
          {project.role}
        </p>

        <div className="pt-1">
          <Link
            to={targetSlug}
            onMouseEnter={() => prefetchRoute(targetSlug)}
            onFocus={() => prefetchRoute(targetSlug)}
            onTouchStart={() => prefetchRoute(targetSlug)}
            className="group inline-flex items-center gap-2 min-h-[44px] pr-2 font-mono text-xs tracking-[0.18em] uppercase text-champagne hover:text-ivory transition-colors"
          >
            <span className="border-b border-brass/55 pb-0.5 group-hover:border-ivory transition-colors">
              Case Study
            </span>
            <ArrowUpRight
              className="size-4 text-brass transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </article>
  );
};

/**
 * Scroll-driven Selected Works showcase synced with Lenis smooth scroll:
 * - Features only the 3 primary flagship works (`01`..`03`).
 * - Minimal editorial copy so the artwork and whitespace invite exploration.
 */
export const LenisSelectedWorks: React.FC<LenisSelectedWorksProps> = ({
  projects,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const isDesktopOrTablet = useMediaQuery('(min-width: 768px)');
  const enableParallax = !prefersReducedMotion;

  return (
    <div className="space-y-16 sm:space-y-20 md:space-y-24 lg:space-y-32">
      {projects.map((project, idx) => (
        <ScrollWorkRow
          key={project.slug}
          project={project}
          index={idx}
          enableParallax={enableParallax}
          isDesktopOrTablet={isDesktopOrTablet}
        />
      ))}
    </div>
  );
};
