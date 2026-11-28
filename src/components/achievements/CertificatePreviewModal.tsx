import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ExternalLink, FileText, X } from 'lucide-react';
import type { AchievementEntry } from '@/data/achievements';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { EASE_LUXURY } from '@/utils/motion';

interface CertificatePreviewModalProps {
  entry: AchievementEntry | null;
  onClose: () => void;
}

/**
 * Responsive Warm-Glass PDF Certificate Preview Modal.
 * Features Figma Glass container, Liquid Glass header chrome, atomic Lenis scroll pause,
 * Escape/backdrop dismissal, and a clean mobile fallback bar for direct PDF open/download.
 */
export const CertificatePreviewModal: React.FC<CertificatePreviewModalProps> = ({
  entry,
  onClose,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const { pauseScroll, resumeScroll } = useSmoothScroll();
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!entry?.certificateUrl) return;

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
      if (previousFocusRef.current && previousFocusRef.current.isConnected) {
        previousFocusRef.current.focus();
      }
    };
  }, [entry, onClose, pauseScroll, resumeScroll]);

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {entry?.certificateUrl && (
        <motion.div
          key="aflan-certificate-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.14 : 0.25, ease: EASE_LUXURY }}
          onClick={onClose}
          className="fixed inset-0 z-[98] flex items-center justify-center p-3 sm:p-6 md:p-8 bg-[#1B1310]/[0.88] overflow-hidden overscroll-none"
        >
          <motion.div
            key={entry.id}
            role="dialog"
            aria-modal="true"
            aria-label={`Pratinjau Sertifikat: ${entry.title}`}
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
              duration: prefersReducedMotion ? 0.14 : 0.36,
              ease: EASE_LUXURY,
            }}
            onClick={(e) => e.stopPropagation()}
            className="glass-atelier-sheet relative w-full max-w-4xl max-h-[90dvh] flex flex-col overflow-hidden rounded-2xl text-ivory will-change-[transform,opacity]"
          >
            {/* Pinned Zero-Blur Specular Header */}
            <div className="glass-inner-rim border-x-0 border-t-0 shrink-0 flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-b border-champagne/20">
              <div className="relative z-10 min-w-0 flex-1 space-y-0.5">
                <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.16em] text-champagne truncate tabular-nums">
                  {entry.code} · {entry.issuer}
                </p>
                <h2 className="font-serif text-lg sm:text-xl font-light text-ivory truncate">
                  {entry.title}
                </h2>
              </div>

              <div className="relative z-10 flex items-center gap-2 shrink-0">
                <a
                  href={entry.certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 min-h-[44px] px-3.5 sm:px-4 py-2 rounded-full bg-champagne text-obsidian font-mono text-[10px] sm:text-[11px] tracking-[0.16em] uppercase font-medium hover:bg-ivory transition-colors"
                >
                  <span>Unduh / Buka PDF</span>
                  <ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
                </a>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={onClose}
                  aria-label="Tutup pratinjau sertifikat"
                  className="size-11 rounded-full border border-champagne/28 bg-espresso/75 flex items-center justify-center text-champagne hover:bg-champagne hover:text-obsidian transition-colors cursor-pointer"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Responsive Inline PDF Viewer */}
            <div data-lenis-prevent className="flex-1 min-h-0 bg-[#1B1310]">
              <iframe
                src={`${entry.certificateUrl}#view=FitH`}
                title={`Dokumen PDF ${entry.title}`}
                className="w-full h-[56dvh] sm:h-[66dvh] border-0 bg-[#1B1310]"
              />
            </div>

            {/* Mobile & Fallback Direct Action Footer */}
            <div className="shrink-0 flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-t border-champagne/18 bg-obsidian/70">
              <div className="inline-flex items-center gap-2 min-w-0">
                <FileText className="size-4 text-champagne shrink-0" aria-hidden="true" />
                <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.12em] text-ivory/80 truncate">
                  {entry.certificateFileName ?? 'cisco-ccna-aflan.pdf'}
                </span>
              </div>

              <a
                href={entry.certificateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-full border border-champagne/30 text-champagne hover:border-champagne hover:text-ivory font-mono text-[10px] tracking-[0.16em] uppercase transition-colors shrink-0"
              >
                <span>Buka PDF di Tab Baru</span>
                <ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};
