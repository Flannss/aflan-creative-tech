import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { ProjectEntry } from '@/data/projects';
import { ApertureFrame } from '@/components/motion/ApertureFrame';
import { TypographicDossierPlate } from '@/components/projects/TypographicDossierPlate';
import { prefetchRoute } from '@/utils/routePrefetch';

interface LenisSelectedWorksProps {
  projects: ProjectEntry[];
}

/**
 * Compact Curated Works Grid:
 * - Responsive 1-col (Mobile 375px), 2-col balanced (Tablet 768px), and 3-col (Desktop 1440px).
 * - Compact 16:10 thumbnails on Soft Warm Ivory (`#F6F1E9`) cards tailored for luminous Almond Cream bands.
 * - Preserves warm tonal glaze on `SOMASII` at rest (clearing cleanly on hover) and architectural
 *   typographic wireframe plate on NDA-protected `ASIS Builder`.
 */
export const LenisSelectedWorks: React.FC<LenisSelectedWorksProps> = ({
  projects,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
      {projects.map((project, idx) => {
        const targetSlug = `/projects/${project.slug}`;
        const hasWarmGlaze = project.slug === 'somasii-lost-and-found';
        const tabletBalancedSpan =
          idx === 2 && projects.length === 3 ? 'md:col-span-2 lg:col-span-1' : '';

        return (
          <article key={project.slug} className={tabletBalancedSpan}>
            <Link
              to={targetSlug}
              data-cursor-label="CASE STUDY"
              onMouseEnter={() => prefetchRoute(targetSlug)}
              onFocus={() => prefetchRoute(targetSlug)}
              onTouchStart={() => prefetchRoute(targetSlug)}
              aria-label={`Buka studi kasus ${project.title}`}
              className="group relative flex flex-col h-full rounded-2xl border border-bronze/25 hover:border-brass bg-ivory overflow-hidden hover:-translate-y-1 transition-[border-color,transform,box-shadow] duration-300 shadow-[0_12px_32px_rgba(33,24,20,0.08)] hover:shadow-[0_20px_44px_rgba(33,24,20,0.14)]"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-0 inset-x-0 z-30 h-[2px] bg-linear-to-r from-brass via-champagne to-bronze origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:hidden"
              />

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
                        className="pointer-events-none absolute inset-0 bg-[#33241C]/32 mix-blend-multiply group-hover:opacity-0 transition-opacity duration-500"
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

              <div className="p-5 flex-1 flex flex-col justify-between gap-3.5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 font-mono text-[10px] tracking-[0.18em] uppercase">
                    <span className="text-cognac font-medium truncate">
                      {project.index} · {project.category}
                    </span>
                    <span className="text-bronze shrink-0">
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

                <div className="pt-3 border-t border-bronze/18 flex items-center justify-between gap-3">
                  <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-cognac/80 truncate">
                    {project.platform}
                  </span>

                  <span className="inline-flex items-center gap-1.5 min-h-[44px] font-mono text-[11px] tracking-[0.16em] uppercase font-medium text-obsidian group-hover:text-cognac transition-colors shrink-0">
                    <span>Case Study</span>
                    <ArrowUpRight
                      className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </div>
            </Link>
          </article>
        );
      })}
    </div>
  );
};
