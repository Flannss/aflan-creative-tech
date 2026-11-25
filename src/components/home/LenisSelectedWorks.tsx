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

interface FeaturedWorkSpreadProps {
  project: ProjectEntry;
  enableParallax: boolean;
}

const FeaturedWorkSpread: React.FC<FeaturedWorkSpreadProps> = ({
  project,
  enableParallax,
}) => {
  const spreadRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: spreadRef,
    offset: ['start end', 'end start'],
  });
  const mediaY = useTransform(
    scrollYProgress,
    [0, 1],
    enableParallax ? [-20, 20] : [0, 0],
  );
  const mediaScale = useTransform(
    scrollYProgress,
    [0, 0.5],
    enableParallax ? [1.06, 1] : [1, 1],
  );

  const targetSlug = `/projects/${project.slug}`;

  return (
    <article ref={spreadRef} className="group">
      <Link
        to={targetSlug}
        data-cursor-label="CASE STUDY"
        onMouseEnter={() => prefetchRoute(targetSlug)}
        onFocus={() => prefetchRoute(targetSlug)}
        onTouchStart={() => prefetchRoute(targetSlug)}
        aria-label={`Buka studi kasus ${project.title}`}
        className="relative block border border-champagne/25 hover:border-champagne/60 bg-obsidian overflow-hidden transition-colors duration-500 shadow-[0_24px_70px_rgba(0,0,0,0.34)]"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-0 inset-x-0 z-30 h-[2px] bg-linear-to-r from-champagne via-brass to-champagne origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        />

        <ApertureFrame className="aspect-[16/9] lg:aspect-[21/9]">
          <motion.div
            style={{ y: mediaY, scale: mediaScale }}
            className="w-full h-full will-change-transform"
          >
            {project.previewImage ? (
              <div
                className="w-full h-full relative"
                style={{ backgroundColor: project.previewBg ?? '#251B16' }}
              >
                <img
                  src={project.previewImage}
                  alt={project.previewCaption}
                  loading="lazy"
                  decoding="async"
                  style={{
                    objectPosition: project.previewObjectPosition ?? 'center',
                  }}
                  className={`w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] ${
                    project.previewImageFit === 'contain'
                      ? 'object-contain p-8 lg:p-12'
                      : 'object-cover'
                  }`}
                />
              </div>
            ) : (
              <TypographicDossierPlate project={project} className="w-full h-full border-0" />
            )}
          </motion.div>
        </ApertureFrame>

        <div className="relative z-20 border-t border-champagne/20 bg-obsidian/92 px-6 py-5 lg:px-8 lg:py-6 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.22em] uppercase text-champagne">
              <span>{project.index} · FEATURED SPREAD</span>
              <span aria-hidden="true" className="w-4 h-px bg-champagne/40" />
              <span className="text-taupe">{project.yearLabel}</span>
            </div>
            <h3 className="font-serif text-3xl lg:text-[2.45rem] font-light text-ivory group-hover:text-champagne transition-colors leading-tight">
              {project.title}
            </h3>
            <p className="font-sans text-sm text-ivory/75">{project.role}</p>
          </div>

          <span className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-full bg-linear-to-r from-[#DFC9A8] to-[#B0875E] text-[#191310] font-mono text-xs tracking-[0.16em] uppercase font-medium group-hover:brightness-110 transition-all shrink-0">
            <span>Case Study</span>
            <ArrowUpRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </span>
        </div>
      </Link>
    </article>
  );
};

interface SecondaryWorkCardProps {
  project: ProjectEntry;
  spanClass: string;
  aspectClass: string;
  offsetClass?: string;
  enableParallax: boolean;
}

const SecondaryWorkCard: React.FC<SecondaryWorkCardProps> = ({
  project,
  spanClass,
  aspectClass,
  offsetClass = '',
  enableParallax,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });
  const mediaY = useTransform(
    scrollYProgress,
    [0, 1],
    enableParallax ? [-14, 14] : [0, 0],
  );
  const mediaScale = useTransform(
    scrollYProgress,
    [0, 0.55],
    enableParallax ? [1.05, 1] : [1, 1],
  );

  const targetSlug = `/projects/${project.slug}`;

  return (
    <article ref={cardRef} className={`${spanClass} ${offsetClass}`}>
      <Link
        to={targetSlug}
        data-cursor-label="CASE STUDY"
        onMouseEnter={() => prefetchRoute(targetSlug)}
        onFocus={() => prefetchRoute(targetSlug)}
        onTouchStart={() => prefetchRoute(targetSlug)}
        aria-label={`Buka studi kasus ${project.title}`}
        className="group relative block border border-champagne/25 hover:border-champagne/60 bg-obsidian overflow-hidden transition-colors duration-500 shadow-[0_20px_56px_rgba(0,0,0,0.3)]"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-0 inset-x-0 z-30 h-[2px] bg-linear-to-r from-champagne via-brass to-champagne origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        />

        <ApertureFrame className={`${aspectClass} relative`}>
          <motion.div
            style={{ y: mediaY, scale: mediaScale }}
            className="w-full h-full will-change-transform"
          >
            {project.previewImage ? (
              <div
                className="relative w-full h-full"
                style={{ backgroundColor: project.previewBg ?? '#251B16' }}
              >
                <img
                  src={project.previewImage}
                  alt={project.previewCaption}
                  loading="lazy"
                  decoding="async"
                  style={{
                    objectPosition: project.previewObjectPosition ?? 'center',
                  }}
                  className={`w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] ${
                    project.previewImageFit === 'contain'
                      ? 'object-contain p-6 sm:p-8'
                      : 'object-cover'
                  }`}
                />
                {/* Warm Espresso tonal veil at rest, clearing smoothly on hover */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[#251B16]/35 mix-blend-multiply group-hover:opacity-0 transition-opacity duration-500"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#191310]/70 via-transparent to-transparent group-hover:opacity-35 transition-opacity duration-500"
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

        <div className="p-6 lg:p-7 space-y-4 border-t border-champagne/15">
          <div className="flex items-center justify-between gap-2 font-mono text-[10px] tracking-[0.2em] uppercase text-champagne">
            <span>{project.index} · {project.category}</span>
            <span className="text-taupe">{project.yearLabel}</span>
          </div>

          <div className="space-y-1.5">
            <h3 className="font-serif text-2xl lg:text-3xl font-light text-ivory group-hover:text-champagne transition-colors leading-snug">
              {project.title}
            </h3>
            <p className="font-sans text-sm text-ivory/75 line-clamp-1">
              {project.role}
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end">
            <span className="inline-flex items-center gap-2 min-h-[44px] font-mono text-xs tracking-[0.18em] uppercase text-champagne group-hover:text-ivory transition-colors">
              <span className="border-b border-champagne/55 pb-0.5 group-hover:border-ivory transition-colors">
                Case Study
              </span>
              <ArrowUpRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
};

/**
 * Variative Editorial Showcase (anti-uniform zig-zag):
 * - Desktop & Tablet (>=768px): Lead full-span editorial spread (#01 SatuRuangCreative)
 *   above an asymmetric 7:5 offset pair (#02 SOMASII with warm espresso veil & #03 ASIS wireframe).
 * - Mobile (<768px): Tactile Horizontal Lookbook Swipe Deck with live progress bar.
 */
export const LenisSelectedWorks: React.FC<LenisSelectedWorksProps> = ({
  projects,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [mobileActiveIdx, setMobileActiveIdx] = useState(0);
  const mobileTrackRef = useRef<HTMLDivElement | null>(null);
  const enableParallax = !prefersReducedMotion;

  const [leadProject, secondProject, thirdProject] = projects;

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
      {/* DESKTOP & TABLET VARIATIVE ASYMMETRIC SHOWCASE (>= 768px) */}
      <div className="hidden md:block space-y-10 lg:space-y-14">
        {leadProject && (
          <FeaturedWorkSpread
            project={leadProject}
            enableParallax={enableParallax}
          />
        )}

        {(secondProject || thirdProject) && (
          <div className="grid grid-cols-12 gap-7 lg:gap-10 items-start">
            {secondProject && (
              <SecondaryWorkCard
                project={secondProject}
                spanClass={thirdProject ? 'col-span-7' : 'col-span-12'}
                aspectClass="aspect-[16/10]"
                enableParallax={enableParallax}
              />
            )}
            {thirdProject && (
              <SecondaryWorkCard
                project={thirdProject}
                spanClass={secondProject ? 'col-span-5' : 'col-span-12'}
                aspectClass="aspect-[4/3] lg:aspect-[5/4]"
                offsetClass="md:mt-10 lg:mt-14"
                enableParallax={enableParallax}
              />
            )}
          </div>
        )}
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
                  <ApertureFrame className="aspect-[16/10] border-b border-champagne/15 relative">
                    {project.previewImage ? (
                      <div
                        className="relative w-full h-full"
                        style={{ backgroundColor: project.previewBg ?? '#251B16' }}
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
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 bg-[#251B16]/25 mix-blend-multiply"
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
