import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import type { ProjectEntry } from '@/data/projects';
import { ApertureFrame } from '@/components/motion/ApertureFrame';
import { FloatingProjectPreview } from '@/components/projects/FloatingProjectPreview';
import { ProjectPreviewModal } from '@/components/projects/ProjectPreviewModal';
import { TypographicDossierPlate } from '@/components/projects/TypographicDossierPlate';
import { BookmarkButton } from '@/components/ui/BookmarkButton';
import { useCanHoverFine, useMediaQuery } from '@/hooks/useMediaQuery';

interface ProjectPreviewListProps {
  projects: ProjectEntry[];
}

const CARD_WIDTH = 310;
const CARD_HEIGHT = 224;
const OFFSET_X = 28;
const VIEWPORT_MARGIN = 20;
const MIN_VIEWPORT_Y = 92;

function getClampedFloatingPos(clientX: number, clientY: number) {
  const viewportW = window.innerWidth;
  const viewportH = window.innerHeight;

  let x = clientX + OFFSET_X;
  if (x + CARD_WIDTH > viewportW - VIEWPORT_MARGIN) {
    x = clientX - CARD_WIDTH - OFFSET_X;
  }
  x = Math.max(VIEWPORT_MARGIN, Math.min(x, viewportW - CARD_WIDTH - VIEWPORT_MARGIN));

  const maxY = Math.max(MIN_VIEWPORT_Y, viewportH - CARD_HEIGHT - VIEWPORT_MARGIN);
  const y = Math.max(MIN_VIEWPORT_Y, Math.min(clientY - CARD_HEIGHT / 2, maxY));

  return { x, y };
}

/**
 * Editorial project index rows featuring:
 * - Desktop (>= 1024px, fine pointer): portal-mounted floating visual preview with viewport-clamped spring cursor tracking.
 * - Mobile / tablet (< 1024px): crisp inline responsive visual card inside each row.
 * - Silky editorial preview modal on primary click while preserving Ctrl/Cmd+Click to open new tab.
 */
export const ProjectPreviewList: React.FC<ProjectPreviewListProps> = ({ projects }) => {
  const [activeProject, setActiveProject] = useState<ProjectEntry | null>(null);
  const [previewProject, setPreviewProject] = useState<ProjectEntry | null>(null);
  const location = useLocation();
  const canHoverFine = useCanHoverFine();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const prefersReducedMotion = useReducedMotion();
  const canHover = canHoverFine && isDesktop;

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const smoothX = useSpring(rawX, { stiffness: 260, damping: 28, mass: 0.5 });
  const smoothY = useSpring(rawY, { stiffness: 260, damping: 28, mass: 0.5 });
  const hasActivePreviewRef = useRef(false);

  const isPreviewVisible =
    canHover && activeProject !== null && previewProject === null;

  useEffect(() => {
    hasActivePreviewRef.current = false;
    setActiveProject(null);
  }, [location.pathname]);

  const syncPosition = (clientX: number, clientY: number, immediate: boolean) => {
    const { x, y } = getClampedFloatingPos(clientX, clientY);
    if (immediate) {
      rawX.jump(x);
      rawY.jump(y);
      smoothX.jump(x);
      smoothY.jump(y);
    } else {
      rawX.set(x);
      rawY.set(y);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canHover || !hasActivePreviewRef.current) return;
    syncPosition(e.clientX, e.clientY, Boolean(prefersReducedMotion));
  };

  const handleRowEnter = (
    e: React.MouseEvent<HTMLAnchorElement>,
    project: ProjectEntry,
  ) => {
    if (!canHover || previewProject !== null) return;
    const isFirstHover = !hasActivePreviewRef.current;
    syncPosition(e.clientX, e.clientY, isFirstHover || Boolean(prefersReducedMotion));
    hasActivePreviewRef.current = true;
    setActiveProject(project);
  };

  const handleRowFocus = (
    e: React.FocusEvent<HTMLAnchorElement>,
    project: ProjectEntry,
  ) => {
    if (!canHover || previewProject !== null) return;
    const rect = e.currentTarget.getBoundingClientRect();
    syncPosition(rect.right - 160, rect.top + rect.height / 2, true);
    hasActivePreviewRef.current = true;
    setActiveProject(project);
  };

  const handleRowBlur = () => {
    if (!canHover) return;
    hasActivePreviewRef.current = false;
    setActiveProject(null);
  };

  const handleLeaveList = () => {
    hasActivePreviewRef.current = false;
    setActiveProject(null);
  };

  const handleRowClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    project: ProjectEntry,
  ) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    e.preventDefault();
    hasActivePreviewRef.current = false;
    setActiveProject(null);
    setPreviewProject(project);
  };

  return (
    <div
      className="relative overflow-x-clip"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleLeaveList}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:block gap-0 md:gap-6 lg:gap-0 divide-y md:divide-y-0 lg:divide-y divide-champagne/15 border-y md:border-y-0 lg:border-y border-champagne/15">
        {projects.map((project, idx) => {
          const isOrphanOnTablet =
            projects.length % 2 === 1 && idx === projects.length - 1;
          const isSelected = previewProject?.slug === project.slug;

          return (
            <article
              key={project.slug}
              className={`relative md:h-full lg:h-auto lg:-mx-5 ${
                isOrphanOnTablet ? 'md:col-span-2' : ''
              }`}
            >
              <BookmarkButton
                slug={project.slug}
                projectTitle={project.title}
                variant="icon"
                surface="dark"
                className="absolute top-6 right-3 sm:right-5 md:top-8 md:right-8 lg:top-1/2 lg:-translate-y-1/2 lg:right-5 z-20"
              />
              <Link
                to={`/projects/${project.slug}`}
                data-cursor-label="EXPLORE"
                onClick={(e) => handleRowClick(e, project)}
                onMouseEnter={(e) => handleRowEnter(e, project)}
                onFocus={(e) => handleRowFocus(e, project)}
                onBlur={handleRowBlur}
                className={`relative group block md:flex md:flex-col md:h-full lg:block lg:h-auto py-8 sm:py-10 md:p-6 md:rounded-2xl lg:rounded-none lg:py-10 lg:pl-5 lg:pr-20 px-3 sm:px-5 md:mx-0 md:border md:border-champagne/20 md:bg-obsidian/45 md:hover:border-champagne/55 md:active:border-champagne lg:border-0 lg:bg-transparent transition-all duration-300 hover:bg-espresso/45 active:bg-espresso/60 active:scale-[0.99] lg:active:scale-100 ${
                  isSelected ? 'bg-espresso/65' : ''
                }`}
              >
                <span
                  aria-hidden="true"
                  className="hidden lg:block pointer-events-none absolute inset-x-5 bottom-0 h-px bg-champagne/65 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:hidden"
                />
                <div className="grid grid-cols-1 md:flex md:flex-col md:flex-1 lg:grid lg:grid-cols-12 gap-5 lg:gap-8 items-center md:items-stretch lg:items-center">
                  <div className="lg:col-span-2 flex flex-wrap items-center lg:flex-col lg:items-start justify-between gap-2.5 pr-14 md:pr-0">
                    <span className="font-mono text-xs tracking-[0.26em] text-champagne">
                      {project.index}
                    </span>
                    <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-taupe">
                      {project.yearLabel}
                    </span>
                  </div>

                  <div className="lg:col-span-6 space-y-3">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono text-[10px] tracking-[0.2em] uppercase px-2.5 py-0.5 border border-champagne/25 text-champagne/90">
                        {project.category}
                      </span>
                      <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-taupe">
                        {project.verificationState}
                      </span>
                    </div>
                    <h3 className="font-serif text-2xl sm:text-3xl md:text-[1.9rem] lg:text-[2.65rem] leading-[1.08] lg:leading-[1.06] font-light text-ivory group-hover:text-champagne group-hover:translate-x-1.5 transition-all duration-500">
                      {project.title}
                    </h3>
                    <p className="font-sans text-sm md:text-base text-ivory/80 max-w-2xl leading-relaxed">
                      {project.subtitle}
                    </p>
                  </div>

                  <div className="lg:col-span-4 md:mt-auto md:pt-4 md:border-t md:border-champagne/15 lg:mt-0 lg:pt-0 lg:border-t-0 flex items-center justify-between lg:justify-end gap-4 sm:gap-5">
                    <div className="lg:text-right min-w-0">
                      <span className="block font-mono text-[10px] tracking-[0.2em] uppercase text-taupe">
                        Ruang Lingkup
                      </span>
                      <span className="block font-sans text-sm text-ivory/85 mt-1 max-w-[26ch]">
                        {project.role}
                      </span>
                    </div>
                    <span className="shrink-0 size-11 rounded-full border border-champagne/30 flex items-center justify-center text-champagne group-hover:bg-champagne group-hover:text-obsidian transition-all duration-300">
                      <ArrowUpRight
                        className="size-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none"
                        aria-hidden="true"
                      />
                    </span>
                  </div>

                  {/* Mobile / Tablet Inline Visual Preview */}
                  <div
                    data-project-preview
                    className={`md:order-first lg:hidden mt-2 md:mt-0 overflow-hidden transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isSelected ? 'scale-[1.03]' : ''
                    }`}
                  >
                    <ApertureFrame className="aspect-[16/10] border border-champagne/20 rounded-xl md:rounded-lg overflow-hidden">
                      {project.previewImage ? (
                        <div
                          className="relative w-full h-full overflow-hidden"
                          style={{ backgroundColor: project.previewBg ?? '#33241C' }}
                        >
                          <img
                            src={project.previewImage}
                            alt={project.previewCaption}
                            loading="lazy"
                            decoding="async"
                            style={{ objectPosition: project.previewObjectPosition ?? 'center' }}
                            className={`w-full h-full transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transform-none ${
                              project.previewImageFit === 'contain'
                                ? 'object-contain p-5'
                                : 'object-cover'
                            }`}
                          />
                          {(project.slug === 'kompresor-media' ||
                            project.slug === 'somasii-lost-and-found') && (
                            <div
                              aria-hidden="true"
                              className="pointer-events-none absolute inset-0 bg-[#33241C]/26 mix-blend-multiply group-hover:opacity-0 transition-opacity duration-500"
                            />
                          )}
                        </div>
                      ) : (
                        <TypographicDossierPlate
                          project={project}
                          compact
                          className="w-full h-full border-0"
                        />
                      )}
                    </ApertureFrame>
                  </div>
                </div>
              </Link>
            </article>
          );
        })}
      </div>

      <FloatingProjectPreview
        project={isPreviewVisible ? activeProject : null}
        x={smoothX}
        y={smoothY}
      />

      <ProjectPreviewModal
        project={previewProject}
        onClose={() => setPreviewProject(null)}
      />
    </div>
  );
};
