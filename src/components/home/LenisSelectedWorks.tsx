import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import type { ProjectEntry } from '@/data/projects';
import { ApertureFrame } from '@/components/motion/ApertureFrame';
import { TypographicDossierPlate } from '@/components/projects/TypographicDossierPlate';
import { prefetchRoute } from '@/utils/routePrefetch';

interface LenisSelectedWorksProps {
  projects: ProjectEntry[];
}

/**
 * Compact Curated Works Grid:
 * - Responsive 1-col (Mobile 375px) and balanced 2x2 grid (Tablet 768px & Desktop 1440px).
 * - Compact 16:10 thumbnails on Soft Warm Ivory (`#F6F1E9`) cards tailored for luminous Almond Cream bands.
 * - Preserves warm tonal glaze on `Kompresor Media` and `SOMASII` at rest (clearing cleanly on hover)
 *   and architectural typographic wireframe plate on NDA-protected `ASIS Builder`.
 * - Separates external `Live App` link cleanly as a sibling element outside `<Link>` for valid semantics.
 */
export const LenisSelectedWorks: React.FC<LenisSelectedWorksProps> = ({
  projects,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
      {projects.map((project) => {
        const targetSlug = `/projects/${project.slug}`;
        const hasWarmGlaze =
          project.slug === 'kompresor-media' ||
          project.slug === 'somasii-lost-and-found';

        return (
          <article
            key={project.slug}
            className="group relative flex flex-col h-full rounded-2xl border border-bronze/25 hover:border-brass bg-ivory overflow-hidden hover:-translate-y-1 transition-[border-color,transform,box-shadow] duration-300 shadow-[0_12px_32px_rgba(33,24,20,0.08)] hover:shadow-[0_20px_44px_rgba(33,24,20,0.14)]"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-0 inset-x-0 z-30 h-[2px] bg-linear-to-r from-brass via-champagne to-bronze origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:hidden"
            />

            <Link
              to={targetSlug}
              data-cursor-label="CASE STUDY"
              onMouseEnter={() => prefetchRoute(targetSlug)}
              onFocus={() => prefetchRoute(targetSlug)}
              onTouchStart={() => prefetchRoute(targetSlug)}
              aria-label={`Buka studi kasus ${project.title}`}
              className="flex-1 flex flex-col min-w-0 focus-visible:outline-2 focus-visible:outline-cognac"
            >
              <ApertureFrame className="aspect-[16/10] border-b border-bronze/20 relative">
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
                      className={`w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] motion-reduce:transform-none ${
                        project.previewImageFit === 'contain'
                          ? 'object-contain p-5'
                          : 'object-cover'
                      }`}
                    />
                    {hasWarmGlaze && (
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-[#33241C]/28 mix-blend-multiply group-hover:opacity-0 transition-opacity duration-500"
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

              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 font-mono text-[10px] tracking-[0.18em] uppercase">
                    <span className="text-cognac font-medium truncate tabular-nums">
                      {project.index} · {project.category}
                    </span>
                    <span className="text-bronze shrink-0 tabular-nums">
                      {project.yearLabel}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-[1.4rem] font-light text-obsidian group-hover:text-cognac transition-colors leading-snug line-clamp-2">
                    {project.title}
                  </h3>

                  <p className="font-sans text-xs sm:text-sm text-obsidian/75 line-clamp-1">
                    {project.role}
                  </p>
                </div>
              </div>
            </Link>

            <div className="px-5 sm:px-6 pb-5 pt-3.5 border-t border-bronze/18 flex flex-wrap items-center justify-between gap-3">
              <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-cognac/80 truncate min-w-0 flex-1">
                {project.platform}
              </span>

              <div className="flex items-center gap-2 shrink-0">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor-label="LIVE APP"
                    className="inline-flex items-center gap-1.5 min-h-[44px] px-3.5 py-2 rounded-full border border-bronze/35 text-cognac hover:bg-obsidian hover:text-ivory hover:border-obsidian font-mono text-[10px] tracking-[0.14em] uppercase font-medium transition-colors"
                  >
                    <span>{project.liveUrlLabel ?? 'Live App'}</span>
                    <ExternalLink className="size-3 shrink-0" aria-hidden="true" />
                  </a>
                )}

                <Link
                  to={targetSlug}
                  data-cursor-label="CASE STUDY"
                  onMouseEnter={() => prefetchRoute(targetSlug)}
                  onFocus={() => prefetchRoute(targetSlug)}
                  onTouchStart={() => prefetchRoute(targetSlug)}
                  className="inline-flex items-center gap-1.5 min-h-[44px] px-2 font-mono text-[11px] tracking-[0.16em] uppercase font-medium text-obsidian hover:text-cognac transition-colors shrink-0"
                >
                  <span>Case Study</span>
                  <ArrowUpRight
                    className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};
