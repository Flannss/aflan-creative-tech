import React from 'react';
import { Link } from 'react-router-dom';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
} from 'framer-motion';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import type { ProjectEntry } from '@/data/projects';
import { ApertureFrame } from '@/components/motion/ApertureFrame';
import { KineticLabel } from '@/components/motion/KineticLabel';
import { TypographicDossierPlate } from '@/components/projects/TypographicDossierPlate';
import { BookmarkButton } from '@/components/ui/BookmarkButton';
import { useCanHoverFine } from '@/hooks/useMediaQuery';

interface ProjectVisualGridCardProps {
  project: ProjectEntry;
  isSelected?: boolean;
  onOpenPreview: (project: ProjectEntry) => void;
}

/**
 * Editorial Visual Grid card for Flexible Portfolio view mode.
 * Features a subtle pointer radial spotlight (desktop hover), Bookmark shortlist button
 * as a clean sibling outside the interactive link, optional warm espresso tonal glaze on
 * media screenshots, and a clean sibling footer for quick dossier preview + optional Live App link.
 */
export const ProjectVisualGridCard: React.FC<ProjectVisualGridCardProps> = ({
  project,
  isSelected = false,
  onOpenPreview,
}) => {
  const canHoverFine = useCanHoverFine();
  const prefersReducedMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const spotlightBg = useMotionTemplate`radial-gradient(380px circle at ${mouseX}px ${mouseY}px, rgba(216,195,165,0.09) 0%, rgba(138,109,75,0.03) 45%, transparent 72%)`;

  const hasWarmGlaze =
    project.slug === 'kompresor-media' ||
    project.slug === 'somasii-lost-and-found';
  const statusChip = project.liveUrl
    ? 'LIVE APP'
    : project.verificationState.includes('NDA')
      ? 'NDA SPEC'
      : project.verificationState.includes('Academic')
        ? 'ACADEMIC'
        : 'LIVE WORK';

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!canHoverFine || prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <article
      onMouseMove={handleMouseMove}
      className={`group relative flex flex-col rounded-2xl bg-obsidian border transition-colors duration-300 overflow-hidden shadow-[0_20px_56px_rgba(0,0,0,0.45)] ${
        isSelected
          ? 'border-champagne/75'
          : 'border-champagne/20 hover:border-champagne/55'
      }`}
    >
      {canHoverFine && !prefersReducedMotion && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: spotlightBg }}
        />
      )}

      <BookmarkButton
        slug={project.slug}
        projectTitle={project.title}
        variant="icon"
        surface="dark"
        className="absolute top-3.5 right-3.5 z-20"
      />

      <Link
        to={`/projects/${project.slug}`}
        data-cursor-label="OPEN"
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
            return;
          }
          e.preventDefault();
          onOpenPreview(project);
        }}
        className="relative z-10 flex-1 flex flex-col min-w-0 focus-visible:outline-2 focus-visible:outline-champagne"
      >
        <div
          data-project-preview
          className="relative aspect-[16/10] overflow-hidden border-b border-champagne/15"
        >
          <span className="glass-liquid-badge pointer-events-none absolute top-3.5 left-3.5 z-20 px-2.5 py-1 rounded-full font-mono text-[9px] tracking-[0.16em] uppercase text-ivory">
            {statusChip}
          </span>
          <ApertureFrame className="w-full h-full">
            {project.previewImage ? (
              <div
                className="relative w-full h-full"
                style={{ backgroundColor: project.previewBg ?? '#33241C' }}
              >
                <img
                  src={project.previewImage}
                  alt={project.previewCaption}
                  loading="lazy"
                  decoding="async"
                  style={{
                    objectPosition: project.previewObjectPosition ?? 'center',
                  }}
                  className={`w-full h-full transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transform-none ${
                    project.previewImageFit === 'contain'
                      ? 'object-contain p-6'
                      : 'object-cover'
                  }`}
                />
                {hasWarmGlaze && (
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

        <div className="flex-1 p-5 sm:p-6 pb-4 flex flex-col justify-between gap-4">
          <div className="space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] tracking-[0.18em] uppercase">
              <span className="text-champagne tabular-nums">
                {project.index} · {project.category}
              </span>
              <span className="text-taupe tabular-nums">{project.yearLabel}</span>
            </div>

            <h3 className="font-serif text-2xl font-light text-ivory leading-snug group-hover:text-champagne transition-colors duration-300">
              {project.title}
            </h3>

            <p className="font-sans text-sm text-ivory/80 leading-relaxed line-clamp-2 sm:line-clamp-3">
              {project.summary}
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {project.stack.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 border border-champagne/20 bg-espresso/50 font-mono text-[9px] tracking-[0.14em] uppercase text-champagne/85"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>

      <div className="relative z-10 mx-5 sm:mx-6 mb-5 pt-4 border-t border-champagne/15 flex flex-wrap items-center justify-between gap-3">
        {project.liveUrl ? (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 min-h-[44px] px-3.5 py-2 rounded-full border border-champagne/30 text-champagne hover:bg-champagne hover:text-obsidian font-mono text-[10px] tracking-[0.15em] uppercase transition-colors shrink-0"
          >
            <span>{project.liveUrlLabel ?? 'Live App'}</span>
            <ExternalLink className="size-3 shrink-0" aria-hidden="true" />
          </a>
        ) : (
          <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-taupe truncate min-w-0 flex-1">
            {project.role}
          </span>
        )}

        <button
          type="button"
          onClick={() => onOpenPreview(project)}
          className="inline-flex items-center gap-1.5 min-h-[44px] px-1.5 font-mono text-[10px] tracking-[0.18em] uppercase text-champagne hover:text-ivory transition-colors cursor-pointer shrink-0"
        >
          <KineticLabel>Preview Dossier</KineticLabel>
          <ArrowUpRight
            className="size-3.5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none"
            aria-hidden="true"
          />
        </button>
      </div>
    </article>
  );
};
