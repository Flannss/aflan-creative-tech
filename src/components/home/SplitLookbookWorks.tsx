import React, { useState } from 'react';
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
 * - Desktop (>=1024px): Editorial Split Lookbook Stage — left typographic index rows
 *   control a sticky framed right showcase stage with silky crossfade & counter-scale.
 * - Tablet & Mobile (<1024px): crisp editorial cards showing visuals directly without hover dependency.
 */
export const SplitLookbookWorks: React.FC<SplitLookbookWorksProps> = ({
  projects,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [activeSlug, setActiveSlug] = useState<string>(
    () => projects[0]?.slug ?? '',
  );
  const [previewProject, setPreviewProject] = useState<ProjectEntry | null>(null);

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

  if (!activeProject) return null;

  return (
    <>
      {/* DESKTOP SPLIT LOOKBOOK STAGE (>= 1024px) */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-12 xl:gap-16 items-start">
        {/* Left: Minimalist Monumental Project Index */}
        <div className="lg:col-span-6 divide-y divide-champagne/15 border-y border-champagne/15">
          {projects.map((project) => {
            const isActive = activeProject.slug === project.slug;
            return (
              <Link
                key={project.slug}
                to={`/projects/${project.slug}`}
                data-cursor-label="EXPLORE"
                onClick={(e) => handleOpen(e, project)}
                onMouseEnter={() => setActiveSlug(project.slug)}
                onFocus={() => setActiveSlug(project.slug)}
                className={`relative group flex items-center justify-between gap-6 py-8 pl-5 pr-3 transition-colors duration-300 ${
                  isActive ? 'bg-obsidian/35' : 'hover:bg-obsidian/20'
                }`}
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
                    <span className="text-champagne">{project.index}</span>
                    <span className="text-champagne/30">/</span>
                    <span className="text-taupe">{project.category}</span>
                    <span className="text-champagne/30">·</span>
                    <span className="text-champagne/75">{project.yearLabel}</span>
                  </div>

                  <h3
                    className={`font-serif text-2xl xl:text-3xl font-light leading-tight transition-all duration-300 ${
                      isActive
                        ? 'text-champagne translate-x-1'
                        : 'text-ivory group-hover:text-champagne/90'
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
                      : { opacity: 0, scale: 1.04 }
                  }
                  animate={{ opacity: 1, scale: 1 }}
                  exit={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, scale: 0.985 }
                  }
                  transition={{
                    duration: prefersReducedMotion ? 0.14 : 0.42,
                    ease: EASE_LUXURY,
                  }}
                  className="w-full h-full will-change-[transform,opacity]"
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

      {/* TABLET & MOBILE EDITORIAL LOOKBOOK CARDS (< 1024px) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:hidden">
        {projects.map((project, idx) => (
          <Link
            key={project.slug}
            to={`/projects/${project.slug}`}
            onClick={(e) => handleOpen(e, project)}
            className={`group flex flex-col bg-obsidian border border-champagne/20 hover:border-champagne/55 active:border-champagne transition-colors overflow-hidden ${
              projects.length % 2 === 1 && idx === projects.length - 1
                ? 'md:col-span-2'
                : ''
            }`}
          >
            <ApertureFrame className="aspect-video border-b border-champagne/15">
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
                      objectPosition: project.previewObjectPosition ?? 'center',
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

            <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 font-mono text-[10px] tracking-[0.18em] uppercase">
                  <span className="text-champagne">
                    {project.index} · {project.category}
                  </span>
                  <span className="text-taupe">{project.yearLabel}</span>
                </div>
                <h3 className="font-serif text-2xl font-light text-ivory group-hover:text-champagne transition-colors">
                  {project.title}
                </h3>
                <p className="font-sans text-sm text-ivory/75 line-clamp-2 leading-relaxed">
                  {project.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-champagne/15 flex items-center justify-between gap-3 font-mono text-[10px] tracking-[0.16em] uppercase text-champagne min-h-[44px]">
                <span className="truncate text-taupe">{project.role}</span>
                <span className="inline-flex items-center gap-1 shrink-0">
                  Preview
                  <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <ProjectPreviewModal
        project={previewProject}
        onClose={() => setPreviewProject(null)}
      />
    </>
  );
};
