import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, CheckCircle2, ExternalLink, ShieldCheck, X } from 'lucide-react';
import type { ProjectEntry } from '@/data/projects';
import { TypographicDossierPlate } from '@/components/projects/TypographicDossierPlate';
import { KineticLabel } from '@/components/motion/KineticLabel';
import { BookmarkButton } from '@/components/ui/BookmarkButton';
import { CopyLinkButton } from '@/components/ui/CopyLinkButton';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { EASE_LUXURY } from '@/utils/motion';

interface ProjectPreviewModalProps {
  project: ProjectEntry | null;
  onClose: () => void;
}

/**
 * High-craft editorial Project Quick Preview Modal.
 * Replaces full-screen clip-path zoom glitches with fluid GPU scaling,
 * body/Lenis scroll locking, pinned header close control, and Escape support.
 */
export const ProjectPreviewModal: React.FC<ProjectPreviewModalProps> = ({
  project,
  onClose,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const { pauseScroll, resumeScroll } = useSmoothScroll();
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const skipFocusRestoreRef = useRef(false);

  useEffect(() => {
    if (!project) return;

    skipFocusRestoreRef.current = false;
    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    pauseScroll();

    const rafId = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.cancelAnimationFrame(rafId);
      resumeScroll();
      window.removeEventListener('keydown', handleKeyDown);
      if (
        !skipFocusRestoreRef.current &&
        previousFocusRef.current &&
        previousFocusRef.current.isConnected
      ) {
        previousFocusRef.current.focus();
      }
    };
  }, [onClose, pauseScroll, project, resumeScroll]);

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {project && (
        <motion.div
          key="aflan-project-preview-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.14 : 0.25, ease: EASE_LUXURY }}
          onClick={onClose}
          className="fixed inset-0 z-[95] flex items-center justify-center p-3 sm:p-6 md:p-8 bg-[#1B1310]/[0.92] overflow-hidden overscroll-none"
        >
          <motion.div
            key={project.slug}
            role="dialog"
            aria-modal="true"
            aria-label={`Pratinjau Case Study: ${project.title}`}
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 18, scale: 0.98 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    y: 12,
                    scale: 0.985,
                    transition: { duration: 0.2, ease: EASE_LUXURY },
                  }
            }
            transition={{
              duration: prefersReducedMotion ? 0.14 : 0.38,
              ease: EASE_LUXURY,
            }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden rounded-2xl border border-champagne/28 bg-[#211814]/98 text-ivory shadow-[0_32px_100px_rgba(0,0,0,0.85)] will-change-[transform,opacity]"
          >
            {/* Pinned Header Bar */}
            <div className="shrink-0 flex items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-b border-champagne/20 bg-[#211814]/95">
              <div className="flex flex-wrap items-center gap-2.5 min-w-0">
                <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] text-champagne tabular-nums truncate">
                  DOSSIER {project.index} · {project.category}
                </span>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full border border-champagne/20 font-mono text-[10px] uppercase tracking-[0.14em] text-taupe">
                  {project.verificationState}
                </span>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Tutup pratinjau proyek"
                className="shrink-0 size-10 sm:size-9 rounded-full border border-champagne/25 bg-espresso/80 flex items-center justify-center text-champagne hover:bg-champagne hover:text-obsidian transition-colors cursor-pointer"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            {/* Scrollable Body Container (Lenis-isolated) */}
            <div
              data-lenis-prevent
              className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-5"
            >
              <div className="aspect-video overflow-hidden rounded-xl border border-champagne/15 bg-obsidian">
                {project.previewImage ? (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: project.previewBg ?? '#33241C' }}
                  >
                    <img
                      src={project.previewImage}
                      alt={project.previewCaption}
                      decoding="async"
                      style={{
                        objectPosition: project.previewObjectPosition ?? 'center',
                      }}
                      className={`w-full h-full ${
                        project.previewImageFit === 'contain'
                          ? 'object-contain p-5 sm:p-8'
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
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] text-champagne">
                    {project.role}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-taupe">
                    {project.yearLabel}
                  </span>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl font-light tracking-tight text-ivory leading-tight">
                  {project.title}
                </h2>

                <p className="font-sans text-sm md:text-base text-ivory/80 leading-relaxed">
                  {project.summary}
                </p>
              </div>

              {project.verificationNotice && (
                <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-espresso/75 border border-champagne/20 text-xs sm:text-sm text-champagne/90 leading-relaxed">
                  <ShieldCheck className="size-4 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{project.verificationNotice}</span>
                </div>
              )}

              <div className="space-y-2.5 pt-1">
                <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] text-champagne">
                  VERIFIED OUTCOMES
                </p>
                <ul className="space-y-2">
                  {project.outcomes.slice(0, 3).map((outcome) => (
                    <li
                      key={outcome}
                      className="flex items-start gap-2.5 font-sans text-xs sm:text-sm text-ivory/80 leading-relaxed"
                    >
                      <CheckCircle2
                        className="size-4 shrink-0 text-champagne mt-0.5"
                        aria-hidden="true"
                      />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-full border border-champagne/20 bg-espresso/50 text-[10px] font-mono uppercase tracking-[0.14em] text-champagne/90"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Pinned Bottom Action Bar */}
            <div className="shrink-0 flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-4 border-t border-champagne/15 bg-obsidian/70">
              <Link
                to={`/projects/${project.slug}`}
                onClick={() => {
                  skipFocusRestoreRef.current = true;
                  onClose();
                }}
                className="group inline-flex items-center gap-2 min-h-[44px] sm:min-h-0 px-5 py-2.5 rounded-full bg-champagne text-obsidian font-mono text-[11px] tracking-[0.16em] uppercase font-medium hover:bg-ivory active:scale-[0.97] transition-all"
              >
                <KineticLabel>Buka Case Study Penuh</KineticLabel>
                <ArrowUpRight
                  className="size-3.5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none"
                  aria-hidden="true"
                />
              </Link>

              <div className="flex flex-wrap items-center gap-2.5">
                <CopyLinkButton
                  url={
                    typeof window !== 'undefined'
                      ? `${window.location.origin}/projects/${project.slug}`
                      : `https://aflandossier.vercel.app/projects/${project.slug}`
                  }
                  label="Copy Link"
                  surface="dark"
                  size="sm"
                />
                <BookmarkButton
                  slug={project.slug}
                  projectTitle={project.title}
                  variant="icon"
                  surface="dark"
                />
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 min-h-[44px] sm:min-h-[38px] px-4 py-2 rounded-full border border-champagne/25 text-champagne font-mono text-[10px] tracking-[0.16em] uppercase hover:border-champagne hover:text-ivory transition-colors"
                  >
                    <span>Live Site</span>
                    <ExternalLink className="size-3" aria-hidden="true" />
                  </a>
                )}
                {project.liveRoute && (
                  <Link
                    to={project.liveRoute}
                    onClick={() => {
                      skipFocusRestoreRef.current = true;
                      onClose();
                    }}
                    className="inline-flex items-center gap-1.5 min-h-[44px] sm:min-h-[38px] px-4 py-2 rounded-full border border-champagne/25 text-champagne font-mono text-[10px] tracking-[0.16em] uppercase hover:border-champagne hover:text-ivory transition-colors"
                  >
                    <span>Creative Lab</span>
                    <ArrowUpRight className="size-3" aria-hidden="true" />
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};
