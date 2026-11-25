import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import type { ProjectEntry } from '@/data/projects';
import { ApertureFrame } from '@/components/motion/ApertureFrame';
import { TypographicDossierPlate } from '@/components/projects/TypographicDossierPlate';
import { ProjectTransitionPortal } from '@/components/projects/ProjectClickTransition';
import { useProjectTransition } from '@/hooks/useProjectTransition';
import { useCanHoverFine, useMediaQuery } from '@/hooks/useMediaQuery';

interface ProjectPreviewListProps {
  projects: ProjectEntry[];
}

/**
 * Editorial project index rows featuring:
 * - Wide desktop (>= 1280px, fine pointer): smooth RAF-interpolated floating visual preview positioned outside text columns.
 * - Mobile / tablet: crisp inline responsive visual card inside each row.
 * - Cinematic click/tap preview expansion before route navigation.
 */
export const ProjectPreviewList: React.FC<ProjectPreviewListProps> = ({ projects }) => {
  const [activeProject, setActiveProject] = useState<ProjectEntry | null>(null);
  const canHoverFine = useCanHoverFine();
  const isWideDesktop = useMediaQuery('(min-width: 1280px)');
  const prefersReducedMotion = useReducedMotion();
  const canHover = canHoverFine && isWideDesktop && !prefersReducedMotion;

  const { transitionState, transitioningSlug, triggerProjectTransition } =
    useProjectTransition();

  const previewRef = useRef<HTMLDivElement | null>(null);
  const pointerTarget = useRef({ x: 0, y: 0 });
  const pointerCurrent = useRef({ x: 0, y: 0 });
  const isInsideList = useRef(false);

  const isPreviewVisible =
    canHover && activeProject !== null && transitioningSlug === null;

  useEffect(() => {
    if (!isPreviewVisible) return;

    let rafId = 0;

    const animate = () => {
      const dx = pointerTarget.current.x - pointerCurrent.current.x;
      const dy = pointerTarget.current.y - pointerCurrent.current.y;
      pointerCurrent.current.x += dx * 0.14;
      pointerCurrent.current.y += dy * 0.14;

      const tilt = Math.max(-4.5, Math.min(4.5, dx * 0.075));

      if (previewRef.current) {
        const cardWidth = previewRef.current.offsetWidth || 300;
        const cardHeight = previewRef.current.offsetHeight || 220;
        const viewportW = window.innerWidth;
        const viewportH = window.innerHeight;

        const isPointerOnRightSide = pointerCurrent.current.x > viewportW * 0.62;
        const targetPosX = isPointerOnRightSide
          ? 24
          : Math.max(viewportW - cardWidth - 24, pointerCurrent.current.x + 180);

        const clampedX = Math.min(Math.max(targetPosX, 24), viewportW - cardWidth - 24);
        const clampedY = Math.min(
          Math.max(pointerCurrent.current.y - cardHeight / 2, 92),
          viewportH - cardHeight - 24,
        );

        previewRef.current.style.transform = `translate3d(${clampedX}px, ${clampedY}px, 0) rotate(${tilt.toFixed(2)}deg)`;
        previewRef.current.style.opacity = '1';
      }

      rafId = window.requestAnimationFrame(animate);
    };

    rafId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(rafId);
  }, [isPreviewVisible]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!canHover) return;
    pointerTarget.current.x = e.clientX;
    pointerTarget.current.y = e.clientY;
    if (!isInsideList.current) {
      isInsideList.current = true;
      pointerCurrent.current.x = e.clientX;
      pointerCurrent.current.y = e.clientY;
    }
  };

  const handleLeaveList = () => {
    isInsideList.current = false;
    setActiveProject(null);
  };

  const handleRowClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    project: ProjectEntry,
  ) => {
    const inlinePreview = e.currentTarget.querySelector<HTMLElement>(
      '[data-project-preview]',
    );
    const floatingEl =
      isPreviewVisible && previewRef.current ? previewRef.current : null;
    const inlineRect = inlinePreview?.getBoundingClientRect();
    const hasVisibleInlinePreview =
      Boolean(inlineRect && inlineRect.width > 24 && inlineRect.height > 24);

    const originEl = hasVisibleInlinePreview ? inlinePreview : floatingEl;
    setActiveProject(null);
    triggerProjectTransition(e, project, originEl);
  };

  return (
    <div
      className="relative overflow-x-clip"
      onPointerMove={handlePointerMove}
      onPointerLeave={handleLeaveList}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:block gap-0 md:gap-6 lg:gap-0 divide-y md:divide-y-0 lg:divide-y divide-champagne/15 border-y md:border-y-0 lg:border-y border-champagne/15">
        {projects.map((project, idx) => {
          const isOrphanOnTablet =
            projects.length % 2 === 1 && idx === projects.length - 1;
          const isSelected = transitioningSlug === project.slug;
          const isDimmed = transitioningSlug !== null && !isSelected;

          return (
            <Link
              key={project.slug}
              to={`/projects/${project.slug}`}
              onClick={(e) => handleRowClick(e, project)}
              onMouseEnter={() =>
                canHover && transitioningSlug === null && setActiveProject(project)
              }
              onFocus={() =>
                canHover && transitioningSlug === null && setActiveProject(project)
              }
              onBlur={() => canHover && setActiveProject(null)}
              className={`relative group block md:flex md:flex-col md:h-full lg:block lg:h-auto py-8 sm:py-10 md:p-6 lg:py-10 lg:px-5 px-2 sm:px-4 md:mx-0 lg:-mx-5 md:border md:border-champagne/20 md:bg-obsidian/45 md:hover:border-champagne/55 md:active:border-champagne lg:border-0 lg:bg-transparent transition-all duration-300 hover:bg-espresso/45 active:bg-espresso/60 active:scale-[0.99] lg:active:scale-100 ${
                isOrphanOnTablet ? 'md:col-span-2' : ''
              } ${isDimmed ? 'opacity-30' : ''} ${
                isSelected ? 'bg-espresso/65' : ''
              }`}
            >
              <span
                aria-hidden="true"
                className="hidden lg:block pointer-events-none absolute inset-x-5 bottom-0 h-px bg-champagne/65 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:hidden"
              />
              <div className="grid grid-cols-1 md:flex md:flex-col md:flex-1 lg:grid lg:grid-cols-12 gap-5 lg:gap-8 items-center md:items-stretch lg:items-center">
                <div className="lg:col-span-2 flex items-center lg:flex-col lg:items-start justify-between gap-2">
                  <span className="font-mono text-xs tracking-[0.26em] text-champagne">
                    {project.index}
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-taupe">
                    {project.yearLabel}
                  </span>
                </div>

                <div className="lg:col-span-6 space-y-2.5">
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

                <div className="lg:col-span-4 md:mt-auto md:pt-4 md:border-t md:border-champagne/15 lg:mt-0 lg:pt-0 lg:border-t-0 flex items-center justify-between lg:justify-end gap-5">
                  <div className="lg:text-right">
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
                  <ApertureFrame className="aspect-video border border-champagne/20">
                    {project.previewImage ? (
                      <div
                        className="relative w-full h-full overflow-hidden"
                        style={{ backgroundColor: project.previewBg ?? '#2B1D17' }}
                      >
                        <img
                          src={project.previewImage}
                          alt={project.previewCaption}
                          loading="lazy"
                          style={{ objectPosition: project.previewObjectPosition ?? 'center' }}
                          className={`w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] motion-reduce:transform-none ${
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
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {isPreviewVisible && activeProject && (
        <div
          ref={previewRef}
          aria-hidden="true"
          style={{ opacity: 0 }}
          className="hidden xl:block pointer-events-none fixed top-0 left-0 z-40 w-[300px] overflow-hidden border border-champagne/25 bg-obsidian shadow-[0_24px_60px_rgba(0,0,0,0.55)] transition-opacity duration-200"
        >
          <div>
            {activeProject.previewImage ? (
              <div
                className="relative aspect-video overflow-hidden"
                style={{ backgroundColor: activeProject.previewBg ?? '#2B1D17' }}
              >
                <img
                  src={activeProject.previewImage}
                  alt=""
                  style={{ objectPosition: activeProject.previewObjectPosition ?? 'center' }}
                  className={`w-full h-full ${
                    activeProject.previewImageFit === 'contain'
                      ? 'object-contain p-5'
                      : 'object-cover'
                  }`}
                />
              </div>
            ) : (
              <TypographicDossierPlate
                project={activeProject}
                compact
                className="aspect-video"
              />
            )}
            <div className="px-4 py-3 bg-obsidian border-t border-champagne/15 flex items-center justify-between gap-3">
              <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-champagne truncate">
                {activeProject.platform}
              </span>
              <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-taupe shrink-0">
                Buka Dossier →
              </span>
            </div>
          </div>
        </div>
      )}

      <ProjectTransitionPortal state={transitionState} />
    </div>
  );
};
