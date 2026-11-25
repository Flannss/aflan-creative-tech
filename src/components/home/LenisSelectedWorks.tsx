import React, { useRef, useState } from 'react';
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
import { EASE_LUXURY } from '@/utils/motion';
import { prefetchRoute } from '@/utils/routePrefetch';

interface LenisSelectedWorksProps {
  projects: ProjectEntry[];
}

interface ScrollWorkRowProps {
  project: ProjectEntry;
  index: number;
  enableParallax: boolean;
}

const ScrollWorkRow: React.FC<ScrollWorkRowProps> = ({
  project,
  index,
  enableParallax,
}) => {
  const rowRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ['start end', 'end start'],
  });

  const mediaY = useTransform(
    scrollYProgress,
    [0, 1],
    enableParallax ? [-22, 22] : [0, 0],
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
          className="group relative block border border-champagne/20 hover:border-champagne/55 bg-obsidian transition-colors duration-500 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.28)]"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-0 inset-x-0 z-20 h-[2px] bg-champagne origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          />
          <ApertureFrame className="aspect-[16/10] md:aspect-video">
            <motion.div
              style={{ y: mediaY, scale: mediaScale }}
              className="w-full h-full will-change-transform"
            >
              {project.previewImage ? (
                <div
                  className="w-full h-full"
                  style={{ backgroundColor: project.previewBg ?? '#241B17' }}
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
                    className={`w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] ${
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

      {/* Concise Editorial Metadata */}
      <div
        className={`md:col-span-5 ${
          isOdd ? 'md:order-1 md:pr-4' : 'md:order-2 md:pl-4'
        } space-y-5`}
      >
        <div className="flex items-center gap-3 font-mono text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-champagne">
          <span>{project.index}</span>
          <span aria-hidden="true" className="w-5 h-px bg-champagne/40" />
          <span className="text-taupe">{project.yearLabel}</span>
        </div>

        <h3 className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-light leading-[1.1] tracking-tight text-ivory">
          {project.title}
        </h3>

        <p className="font-sans text-sm md:text-base text-ivory/80">
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
            <span className="border-b border-champagne/55 pb-0.5 group-hover:border-ivory transition-colors">
              Case Study
            </span>
            <ArrowUpRight
              className="size-4 text-champagne transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </article>
  );
};

/**
 * Dynamic Selected Works showcase:
 * - Desktop & Tablet (>=768px): Alternating `md:grid-cols-12` layout synced with Lenis
 *   smooth scroll parallax (`y` + subtle scale settle).
 * - Mobile (<768px): Tactile Horizontal Lookbook Swipe Deck (`84vw` peek cards + `01 / 03`
 *   counter and Champagne scroll-progress hairline).
 */
export const LenisSelectedWorks: React.FC<LenisSelectedWorksProps> = ({
  projects,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [mobileActiveIdx, setMobileActiveIdx] = useState(0);
  const mobileTrackRef = useRef<HTMLDivElement | null>(null);
  const enableParallax = !prefersReducedMotion;

  const handleMobileScroll = () => {
    const track = mobileTrackRef.current;
    if (!track || projects.length === 0) return;
    const firstCard = track.firstElementChild as HTMLElement | null;
    const cardStride = (firstCard?.offsetWidth ?? track.clientWidth * 0.84) + 16;
    const nextIdx = Math.max(
      0,
      Math.min(projects.length - 1, Math.round(track.scrollLeft / cardStride)),
    );
    if (nextIdx !== mobileActiveIdx) {
      setMobileActiveIdx(nextIdx);
    }
  };

  const totalStr = String(projects.length).padStart(2, '0');
  const activeMobileStr = String(mobileActiveIdx + 1).padStart(2, '0');
  const mobileProgressRatio =
    projects.length > 0 ? (mobileActiveIdx + 1) / projects.length : 1;

  return (
    <>
      {/* DESKTOP & TABLET LENIS SCROLL PARALLAX ROWS (>= 768px) */}
      <div className="hidden md:block space-y-24 lg:space-y-32">
        {projects.map((project, idx) => (
          <ScrollWorkRow
            key={project.slug}
            project={project}
            index={idx}
            enableParallax={enableParallax}
          />
        ))}
      </div>

      {/* MOBILE TACTILE HORIZONTAL LOOKBOOK DECK (< 768px) */}
      <div className="md:hidden space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-champagne tabular-nums shrink-0">
              {activeMobileStr} / {totalStr}
            </span>
            <span className="relative h-px flex-1 bg-champagne/20 overflow-hidden">
              <span
                style={{ transform: `scaleX(${mobileProgressRatio})` }}
                className="block h-full w-full bg-champagne origin-left transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
              />
            </span>
          </div>
          <span className="font-mono text-[9px] tracking-[0.24em] uppercase text-taupe shrink-0">
            SWIPE DECK
          </span>
        </div>

        <div
          ref={mobileTrackRef}
          onScroll={handleMobileScroll}
          aria-label="Galeri geser karya unggulan"
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-5 px-5 pb-2 scroll-pl-5"
        >
          {projects.map((project) => {
            const targetSlug = `/projects/${project.slug}`;
            return (
              <motion.article
                key={project.slug}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.985 }}
                transition={{ duration: 0.2, ease: EASE_LUXURY }}
                className="w-[84vw] max-w-[332px] shrink-0 snap-start flex flex-col bg-obsidian border border-champagne/25 overflow-hidden shadow-[0_14px_40px_rgba(0,0,0,0.3)]"
              >
                <Link
                  to={targetSlug}
                  onTouchStart={() => prefetchRoute(targetSlug)}
                  aria-label={`Buka studi kasus ${project.title}`}
                  className="block focus-visible:outline-2 focus-visible:outline-champagne"
                >
                  <ApertureFrame className="aspect-[16/10] border-b border-champagne/15">
                    {project.previewImage ? (
                      <div
                        className="w-full h-full"
                        style={{ backgroundColor: project.previewBg ?? '#241B17' }}
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
                              ? 'object-contain p-5'
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
                  </ApertureFrame>
                </Link>

                <div className="flex-1 p-5 flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 font-mono text-[10px] tracking-[0.2em] uppercase">
                      <span className="text-champagne">{project.index}</span>
                      <span className="text-taupe">{project.yearLabel}</span>
                    </div>

                    <h3 className="font-serif text-2xl font-light text-ivory leading-snug">
                      {project.title}
                    </h3>

                    <p className="font-sans text-xs text-ivory/75 line-clamp-1">
                      {project.role}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-champagne/15 flex items-center justify-end">
                    <Link
                      to={targetSlug}
                      onTouchStart={() => prefetchRoute(targetSlug)}
                      className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-full border border-champagne/35 bg-umber font-mono text-[10px] tracking-[0.16em] uppercase text-champagne active:bg-champagne active:text-obsidian transition-colors"
                    >
                      <span>Case Study</span>
                      <ArrowUpRight className="size-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </>
  );
};
