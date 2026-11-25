import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { ProjectEntry } from '@/data/projects';
import { ApertureFrame } from '@/components/motion/ApertureFrame';
import { KineticLabel } from '@/components/motion/KineticLabel';
import { ProjectPreviewModal } from '@/components/projects/ProjectPreviewModal';
import { TypographicDossierPlate } from '@/components/projects/TypographicDossierPlate';
import { EASE_LUXURY } from '@/utils/motion';

interface SplitLookbookWorksProps {
  projects: ProjectEntry[];
}

/**
 * Signature Home Selected Works showcase:
 * - Desktop (>=1024px): Editorial Split Lookbook Stage with spotlight focus dimming
 *   on left index rows and smooth aperture reveal + zoom settle (`scale: 1.05 -> 1`).
 * - Tablet (768px–1023px): Featured Lead Card (`md:col-span-2`) + symmetric 2-col grid.
 * - Mobile (<768px): Tactile Horizontal Lookbook Swipe Deck (`~84vw` card width with peek,
 *   snap physics, live `01 / 04` counter, and Champagne scroll-progress hairline).
 */
export const SplitLookbookWorks: React.FC<SplitLookbookWorksProps> = ({
  projects,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [activeSlug, setActiveSlug] = useState<string>(
    () => projects[0]?.slug ?? '',
  );
  const [isListHovered, setIsListHovered] = useState(false);
  const [mobileActiveIdx, setMobileActiveIdx] = useState(0);
  const [previewProject, setPreviewProject] = useState<ProjectEntry | null>(null);
  const mobileTrackRef = useRef<HTMLDivElement | null>(null);

  const activeProject =
    projects.find((p) => p.slug === activeSlug) ?? projects[0] ?? null;

  const handleOpen = (
    e: React.MouseEvent<HTMLAnchorElement>,
    project: ProjectEntry,
  ) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    e.preventDefault();
    setPreviewProject(project);
  };

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

  if (!activeProject) return null;

  const totalStr = String(projects.length).padStart(2, '0');
  const activeMobileStr = String(mobileActiveIdx + 1).padStart(2, '0');
  const mobileProgressRatio =
    projects.length > 0 ? (mobileActiveIdx + 1) / projects.length : 1;

  return (
    <>
      {/* DESKTOP SPLIT LOOKBOOK STAGE (>= 1024px) */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-12 xl:gap-16 items-start">
        {/* Left: Minimalist Monumental Project Index with Spotlight Focus */}
        <div
          onMouseEnter={() => setIsListHovered(true)}
          onMouseLeave={() => setIsListHovered(false)}
          className="lg:col-span-6 divide-y divide-champagne/15 border-y border-champagne/15"
        >
          {projects.map((project) => {
            const isActive = activeProject.slug === project.slug;
            const dimInactive = isListHovered && !isActive;

            return (
              <Link
                key={project.slug}
                to={`/projects/${project.slug}`}
                data-cursor-label="EXPLORE"
                onClick={(e) => handleOpen(e, project)}
                onMouseEnter={() => setActiveSlug(project.slug)}
                onFocus={() => setActiveSlug(project.slug)}
                className={`relative group flex items-center justify-between gap-6 py-8 pl-5 pr-3 transition-[background-color,opacity] duration-300 ${
                  isActive ? 'bg-obsidian/40' : 'hover:bg-obsidian/20'
                } ${dimInactive ? 'opacity-45 hover:opacity-100' : 'opacity-100'}`}
              >
                {isActive && (
                  <motion.span
                    layoutId="home-lookbook-bar"
                    aria-hidden="true"
                    transition={{
                      duration: prefersReducedMotion ? 0 : 0.36,
                      ease: EASE_LUXURY,
                    }}
                    className="pointer-events-none absolute left-0 inset-y-3 w-[2px] bg-champagne"
                  />
                )}

                <div className="min-w-0 space-y-2">
                  <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] uppercase">
                    <span
                      className={`transition-colors duration-300 ${
                        isActive
                          ? 'text-champagne font-medium'
                          : 'text-champagne/65 group-hover:text-champagne'
                      }`}
                    >
                      {project.index}
                    </span>
                    <span className="text-champagne/30">/</span>
                    <span className="text-taupe">{project.category}</span>
                    <span className="text-champagne/30">·</span>
                    <span className="text-champagne/75">{project.yearLabel}</span>
                  </div>

                  <h3
                    className={`font-serif text-2xl xl:text-3xl font-light leading-tight transition-all duration-300 ${
                      isActive
                        ? 'text-champagne translate-x-2'
                        : 'text-ivory group-hover:text-champagne/90 group-hover:translate-x-1.5'
                    }`}
                  >
                    {project.title}
                  </h3>

                  <p className="font-sans text-sm text-ivory/75 line-clamp-1 max-w-lg">
                    {project.role}
                  </p>
                </div>

                <span
                  className={`shrink-0 size-11 rounded-full border flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? 'border-champagne bg-champagne text-obsidian'
                      : 'border-champagne/30 text-champagne group-hover:border-champagne'
                  }`}
                >
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </span>
              </Link>
            );
          })}
        </div>

        {/* Right: Sticky Framed Lookbook Visual Stage */}
        <div className="lg:col-span-6 lg:sticky lg:top-28">
          <div className="border border-champagne/20 bg-obsidian overflow-hidden shadow-[0_24px_70px_rgba(0,0,0,0.45)]">
            <div className="relative aspect-video overflow-hidden border-b border-champagne/15 bg-obsidian">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProject.slug}
                  initial={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : {
                          opacity: 0,
                          scale: 1.05,
                          clipPath: 'inset(4% 0% 4% 0%)',
                        }
                  }
                  animate={{
                    opacity: 1,
                    scale: 1,
                    clipPath: 'inset(0% 0% 0% 0%)',
                  }}
                  exit={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, scale: 0.985 }
                  }
                  transition={{
                    duration: prefersReducedMotion ? 0.14 : 0.48,
                    ease: EASE_LUXURY,
                  }}
                  className="w-full h-full will-change-[transform,opacity,clip-path]"
                >
                  {activeProject.previewImage ? (
                    <div
                      className="w-full h-full"
                      style={{ backgroundColor: activeProject.previewBg ?? '#2B1D17' }}
                    >
                      <img
                        src={activeProject.previewImage}
                        alt={activeProject.previewCaption}
                        decoding="async"
                        style={{
                          objectPosition:
                            activeProject.previewObjectPosition ?? 'center',
                        }}
                        className={`w-full h-full ${
                          activeProject.previewImageFit === 'contain'
                            ? 'object-contain p-8'
                            : 'object-cover'
                        }`}
                      />
                    </div>
                  ) : (
                    <TypographicDossierPlate
                      project={activeProject}
                      compact
                      className="w-full h-full border-0"
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`meta-${activeProject.slug}`}
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -4 }}
                transition={{
                  duration: prefersReducedMotion ? 0.12 : 0.28,
                  ease: EASE_LUXURY,
                }}
                className="p-6 xl:p-7 space-y-5"
              >
                <div className="flex items-center justify-between gap-4 font-mono text-[10px] tracking-[0.2em] uppercase">
                  <span className="text-champagne">{activeProject.role}</span>
                  <span className="text-taupe">{activeProject.yearLabel}</span>
                </div>

                <p className="font-sans text-sm text-ivory/80 leading-relaxed line-clamp-2">
                  {activeProject.summary}
                </p>

                <div className="pt-4 border-t border-champagne/15 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setPreviewProject(activeProject)}
                    className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] uppercase text-champagne hover:text-ivory transition-colors cursor-pointer"
                  >
                    <KineticLabel>Quick Preview</KineticLabel>
                  </button>

                  <Link
                    to={`/projects/${activeProject.slug}`}
                    className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-champagne text-obsidian font-mono text-[11px] tracking-[0.16em] uppercase font-medium hover:bg-ivory transition-colors"
                  >
                    <span>Buka Case Study</span>
                    <ArrowUpRight
                      className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* MOBILE TACTILE HORIZONTAL LOOKBOOK SWIPE DECK (< 768px) */}
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
          aria-label="Galeri geser proyek pilihan"
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4 pb-2 scroll-pl-4"
        >
          {projects.map((project, idx) => (
            <motion.article
              key={project.slug}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.985 }}
              className="w-[84vw] max-w-[332px] shrink-0 snap-start flex flex-col bg-obsidian border border-champagne/25 overflow-hidden"
            >
              <Link
                to={`/projects/${project.slug}`}
                onClick={(e) => handleOpen(e, project)}
                aria-label={`Buka studi kasus ${project.title}`}
                className="block focus-visible:outline-2 focus-visible:outline-champagne"
              >
                <ApertureFrame className="aspect-[16/10] border-b border-champagne/15">
                  {project.previewImage ? (
                    <div
                      className="w-full h-full"
                      style={{ backgroundColor: project.previewBg ?? '#2B1D17' }}
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
                  <div className="flex items-center justify-between gap-2 font-mono text-[10px] tracking-[0.18em] uppercase">
                    <span className="inline-flex items-center gap-2 text-champagne">
                      <span>
                        {project.index} · {project.category}
                      </span>
                      {idx === 0 && (
                        <span className="px-1.5 py-0.5 border border-champagne/35 bg-champagne/10 text-[9px] tracking-[0.16em]">
                          FEATURED
                        </span>
                      )}
                    </span>
                    <span className="text-taupe">{project.yearLabel}</span>
                  </div>

                  <Link
                    to={`/projects/${project.slug}`}
                    onClick={(e) => handleOpen(e, project)}
                    className="block"
                  >
                    <h3 className="font-serif text-2xl font-light text-ivory leading-snug">
                      {project.title}
                    </h3>
                  </Link>

                  <p className="font-sans text-xs text-ivory/75 line-clamp-2 leading-relaxed">
                    {project.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-champagne/15 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewProject(project)}
                    className="inline-flex items-center min-h-[44px] pr-2 font-mono text-[10px] tracking-[0.18em] uppercase text-champagne active:text-ivory transition-colors cursor-pointer"
                  >
                    Quick Preview
                  </button>

                  <Link
                    to={`/projects/${project.slug}`}
                    onClick={(e) => handleOpen(e, project)}
                    className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-full border border-champagne/35 bg-espresso/75 font-mono text-[10px] tracking-[0.16em] uppercase text-ivory active:bg-champagne active:text-obsidian transition-colors shrink-0"
                  >
                    <span>Case Study</span>
                    <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* TABLET EDITORIAL LEAD + 2-COL LOOKBOOK GRID (768px–1023px) */}
      <div className="hidden md:grid md:grid-cols-2 gap-6 lg:hidden">
        {projects.map((project, idx) => {
          const isLead = idx === 0;
          const isOrphanTail =
            !isLead &&
            (projects.length - 1) % 2 === 1 &&
            idx === projects.length - 1;
          const spanFullOnTablet = isLead || isOrphanTail;

          return (
            <motion.article
              key={project.slug}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.985 }}
              className={`group flex flex-col bg-obsidian border border-champagne/20 hover:border-champagne/55 transition-colors overflow-hidden ${
                spanFullOnTablet ? 'md:col-span-2' : ''
              }`}
            >
              <Link
                to={`/projects/${project.slug}`}
                onClick={(e) => handleOpen(e, project)}
                aria-label={`Buka studi kasus ${project.title}`}
                className="block focus-visible:outline-2 focus-visible:outline-champagne"
              >
                <ApertureFrame
                  className={`${
                    isLead ? 'aspect-video' : 'aspect-[16/10]'
                  } border-b border-champagne/15`}
                >
                  {project.previewImage ? (
                    <div
                      className="w-full h-full"
                      style={{ backgroundColor: project.previewBg ?? '#2B1D17' }}
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
                            ? 'object-contain p-6'
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

              <div className="flex-1 p-6 flex flex-col justify-between gap-4">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2 font-mono text-[10px] tracking-[0.18em] uppercase">
                    <span className="inline-flex items-center gap-2 text-champagne">
                      <span>
                        {project.index} · {project.category}
                      </span>
                      {isLead && (
                        <span className="px-2 py-0.5 border border-champagne/35 bg-champagne/10 text-[9px] tracking-[0.18em] text-champagne">
                          FEATURED
                        </span>
                      )}
                    </span>
                    <span className="text-taupe">{project.yearLabel}</span>
                  </div>

                  <Link
                    to={`/projects/${project.slug}`}
                    onClick={(e) => handleOpen(e, project)}
                    className="block"
                  >
                    <h3
                      className={`font-serif font-light text-ivory group-hover:text-champagne transition-colors ${
                        isLead ? 'text-3xl' : 'text-2xl'
                      }`}
                    >
                      {project.title}
                    </h3>
                  </Link>

                  <p className="font-sans text-sm text-ivory/75 line-clamp-2 leading-relaxed">
                    {project.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-champagne/15 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setPreviewProject(project)}
                    className="inline-flex items-center min-h-[44px] pr-2 font-mono text-[10px] tracking-[0.18em] uppercase text-champagne hover:text-ivory transition-colors cursor-pointer"
                  >
                    Quick Preview
                  </button>

                  <Link
                    to={`/projects/${project.slug}`}
                    onClick={(e) => handleOpen(e, project)}
                    className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-full border border-champagne/35 bg-espresso/60 font-mono text-[10px] tracking-[0.16em] uppercase text-ivory hover:bg-champagne hover:text-obsidian hover:border-champagne transition-colors shrink-0"
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

      <ProjectPreviewModal
        project={previewProject}
        onClose={() => setPreviewProject(null)}
      />
    </>
  );
};
