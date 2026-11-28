import React from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion, type MotionValue } from 'framer-motion';
import type { ProjectEntry } from '@/data/projects';
import { TypographicDossierPlate } from '@/components/projects/TypographicDossierPlate';
import { EASE_LUXURY } from '@/utils/motion';

interface FloatingProjectPreviewProps {
  project: ProjectEntry | null;
  x: MotionValue<number>;
  y: MotionValue<number>;
}

/**
 * Viewport-anchored floating preview portal for desktop project rows.
 * Rendered directly into document.body so ancestor CSS transforms (e.g., PageTransition)
 * never hijack `position: fixed` coordinates during scroll.
 */
export const FloatingProjectPreview: React.FC<FloatingProjectPreviewProps> = ({
  project,
  x,
  y,
}) => {
  const prefersReducedMotion = useReducedMotion();

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {project && (
        <motion.div
          key="floating-project-preview"
          aria-hidden="true"
          style={{ x, y }}
          className="hidden lg:block fixed top-0 left-0 z-[60] w-[310px] pointer-events-none select-none will-change-transform"
        >
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
            transition={
              prefersReducedMotion
                ? { duration: 0.14 }
                : { duration: 0.24, ease: EASE_LUXURY }
            }
            className="glass-atelier-sheet overflow-hidden rounded-xl"
          >
            {project.previewImage ? (
              <div
                className="relative aspect-video overflow-hidden"
                style={{ backgroundColor: project.previewBg ?? '#33241C' }}
              >
                <img
                  src={project.previewImage}
                  alt=""
                  decoding="async"
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
                className="aspect-video border-0"
              />
            )}
            <div className="px-4 py-3 bg-obsidian border-t border-champagne/15 flex items-center justify-between gap-3">
              <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-champagne truncate">
                {project.platform}
              </span>
              <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-taupe shrink-0">
                Preview Dossier →
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};
