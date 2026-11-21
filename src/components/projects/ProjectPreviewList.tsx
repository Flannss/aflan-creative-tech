import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import type { ProjectEntry } from '@/data/projects';
import { TypographicDossierPlate } from '@/components/projects/TypographicDossierPlate';
import { useCanHoverFine } from '@/hooks/useMediaQuery';

interface ProjectPreviewListProps {
  projects: ProjectEntry[];
}

/**
 * Editorial project index rows featuring:
 * - Desktop fine pointer: smooth RAF-interpolated floating visual preview with subtle velocity tilt.
 * - Mobile / touch: crisp inline responsive visual card inside each row.
 */
export const ProjectPreviewList: React.FC<ProjectPreviewListProps> = ({ projects }) => {
  const [activeProject, setActiveProject] = useState<ProjectEntry | null>(null);
  const canHoverFine = useCanHoverFine();
  const prefersReducedMotion = useReducedMotion();
  const canHover = canHoverFine && !prefersReducedMotion;

  const previewRef = useRef<HTMLDivElement | null>(null);
  const pointerTarget = useRef({ x: 0, y: 0 });
  const pointerCurrent = useRef({ x: 0, y: 0 });
  const isInsideList = useRef(false);

  const isPreviewVisible = canHover && activeProject !== null;

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

        // Place preview strictly outside the center title/subtitle zone:
        // Anchor to far-right rail when hovering left/center text, or far-left rail when hovering the right column.
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

  return (
    <div
      className="relative"
      onPointerMove={handlePointerMove}
      onPointerLeave={handleLeaveList}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:block gap-0 md:gap-6 lg:gap-0 divide-y md:divide-y-0 lg:divide-y divide-champagne/15 border-y md:border-y-0 lg:border-y border-champagne/15">
        {projects.map((project, idx) => {
          const isOrphanOnTablet =
            projects.length % 2 === 1 && idx === projects.length - 1;
          return (
          <Link
            key={project.slug}
            to={`/projects/${project.slug}`}
            onMouseEnter={() => canHover && setActiveProject(project)}
            onFocus={() => canHover && setActiveProject(project)}
            onBlur={() => canHover && setActiveProject(null)}
            className={`group block md:flex md:flex-col md:h-full lg:block lg:h-auto py-8 sm:py-10 md:p-6 lg:py-10 lg:px-5 px-2 sm:px-5 -mx-2 sm:-mx-5 md:mx-0 lg:-mx-5 md:border md:border-champagne/20 md:bg-obsidian/45 md:hover:border-champagne/55 md:active:border-champagne lg:border-0 lg:bg-transparent transition-all duration-300 hover:bg-espresso/45 active:bg-espresso/60 active:scale-[0.99] lg:active:scale-100 ${
              isOrphanOnTablet ? 'md:col-span-2' : ''
            }`}
          >
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
                <p className="font-sans text-[15px] sm:text-base lg:text-sm text-ivory/75 max-w-2xl leading-relaxed">
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
                    className="size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                    aria-hidden="true"
                  />
                </span>
              </div>

              {/* Mobile / Tablet Inline Visual Preview */}
              <div className="md:order-first lg:hidden mt-2 md:mt-0">
                {project.previewImage ? (
                  <div
                    className="relative aspect-video overflow-hidden border border-champagne/20"
                    style={{ backgroundColor: project.previewBg ?? '#2B1D17' }}
                  >
                    <img
                      src={project.previewImage}
                      alt={project.previewCaption}
                      loading="lazy"
                      style={{ objectPosition: project.previewObjectPosition ?? 'center' }}
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
                    className="aspect-video"
                  />
                )}
              </div>
            </div>
          </Link>
          );
        })}
      </div>

      {canHover && (
        <div
          ref={previewRef}
          aria-hidden="true"
          className={`hidden xl:block pointer-events-none fixed top-0 left-0 z-40 w-[300px] overflow-hidden border border-champagne/25 bg-obsidian shadow-[0_24px_60px_rgba(0,0,0,0.55)] transition-opacity duration-300 ${
            activeProject ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {activeProject && (
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
          )}
        </div>
      )}
    </div>
  );
};
