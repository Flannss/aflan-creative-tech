import React from 'react';
import { MonogramMark } from '@/components/brand/Monogram';
import type { ProjectEntry } from '@/data/projects';

interface TypographicDossierPlateProps {
  project: ProjectEntry;
  compact?: boolean;
  className?: string;
}

/**
 * Intentional pure-typographic architectural presentation for NDA-protected internal systems
 * (such as ASIS Builder). Contains zero placeholder labels or empty image states.
 */
export const TypographicDossierPlate: React.FC<TypographicDossierPlateProps> = ({
  project,
  compact = false,
  className = '',
}) => {
  const display = project.typographicDisplay ?? {
    eyebrow: `${project.platform.toUpperCase()} · ${project.category.toUpperCase()}`,
    primaryWord: project.title,
    secondaryWord: project.role,
    footerNote: project.stack.slice(0, 4).join(' · ').toUpperCase(),
  };

  return (
    <div
      className={`flex flex-col justify-between bg-espresso text-ivory border border-champagne/20 ${
        compact ? 'p-5' : 'p-7 sm:p-11'
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-champagne/15 pb-3">
        <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-champagne">
          {display.eyebrow}
        </span>
        <MonogramMark size={compact ? 22 : 28} className="text-champagne/75 shrink-0" />
      </div>

      <div className={`my-auto ${compact ? 'py-4' : 'py-8 sm:py-12'} space-y-2`}>
        <p
          className={`font-serif font-light uppercase tracking-[0.06em] leading-[0.94] text-ivory ${
            compact
              ? 'text-3xl sm:text-4xl'
              : 'text-4xl sm:text-6xl lg:text-[4.5rem]'
          }`}
        >
          {display.primaryWord}
        </p>
        <p
          className={`font-serif italic font-light leading-tight text-champagne ${
            compact ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-4xl'
          }`}
        >
          {display.secondaryWord}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-champagne/15 pt-3 font-mono text-[10px] tracking-[0.2em] uppercase text-taupe">
        <span>{display.footerNote}</span>
        <span className="text-champagne/80">DOSSIER · {project.index}</span>
      </div>
    </div>
  );
};
