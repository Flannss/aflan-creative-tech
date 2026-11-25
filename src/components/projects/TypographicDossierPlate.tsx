import React from 'react';
import { MonogramMark } from '@/components/brand/Monogram';
import type { ProjectEntry } from '@/data/projects';

interface TypographicDossierPlateProps {
  project: ProjectEntry;
  compact?: boolean;
  className?: string;
}

/**
 * Architectural wireframe + typographic dossier plate for NDA-protected systems
 * such as ASIS Builder. Styled in layered Mocha–Chestnut tones with a subtle
 * structural layout schematic behind the typography.
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
      style={{
        background:
          'linear-gradient(140deg, #2C2019 0%, #3A271D 48%, #1E1612 100%)',
      }}
      className={`relative flex flex-col justify-between text-ivory border border-champagne/25 overflow-hidden ${
        compact ? 'p-5 sm:p-6' : 'p-7 sm:p-11'
      } ${className}`}
    >
      {/* Subtle Architectural Wireframe Page-Builder Schematic */}
      <svg
        viewBox="0 0 420 260"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 w-full h-full opacity-25"
      >
        <rect x="28" y="32" width="364" height="196" rx="4" fill="none" stroke="#DFC9A8" strokeWidth="0.8" />
        <line x1="28" y1="58" x2="392" y2="58" stroke="#DFC9A8" strokeWidth="0.7" />
        <circle cx="42" cy="45" r="2.2" fill="#B0875E" />
        <circle cx="52" cy="45" r="2.2" fill="#B0875E" />
        <rect x="44" y="74" width="116" height="138" fill="none" stroke="#B0875E" strokeWidth="0.75" strokeDasharray="3 4" />
        <rect x="174" y="74" width="202" height="62" fill="none" stroke="#DFC9A8" strokeWidth="0.75" />
        <rect x="174" y="150" width="94" height="62" fill="none" stroke="#B0875E" strokeWidth="0.75" />
        <rect x="282" y="150" width="94" height="62" fill="none" stroke="#B0875E" strokeWidth="0.75" />
      </svg>

      <div className="relative z-10 flex items-center justify-between gap-3 border-b border-champagne/20 pb-3">
        <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-champagne">
          {display.eyebrow}
        </span>
        <MonogramMark size={compact ? 22 : 28} className="text-champagne/80 shrink-0" />
      </div>

      <div className={`relative z-10 my-auto ${compact ? 'py-4' : 'py-8 sm:py-12'} space-y-2`}>
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

      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-t border-champagne/20 pt-3 font-mono text-[10px] tracking-[0.2em] uppercase text-taupe">
        <span>{display.footerNote}</span>
        <span className="text-champagne/90">DOSSIER · {project.index}</span>
      </div>
    </div>
  );
};
