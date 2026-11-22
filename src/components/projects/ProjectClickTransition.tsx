import React from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { TypographicDossierPlate } from '@/components/projects/TypographicDossierPlate';
import type { ProjectTransitionState } from '@/hooks/useProjectTransition';
import { EASE_LUXURY } from '@/utils/motion';

interface ProjectTransitionPortalProps {
  state: ProjectTransitionState | null;
}

/**
 * Viewport-locked cinematic expansion portal rendered on document.body.
 * Immune to ancestor overflow clipping, prevents horizontal overflow, and sits safely above navbar/cursor.
 */
export const ProjectTransitionPortal: React.FC<ProjectTransitionPortalProps> = ({
  state,
}) => {
  if (!state || typeof document === 'undefined') {
    return null;
  }

  const { project, originRect } = state;

  return createPortal(
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[90] pointer-events-none overflow-hidden select-none"
    >
      {/* Atmospheric obsidian backdrop veil */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.44, ease: EASE_LUXURY }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#291E18_0%,_#171615_55%,_#0A0807_100%)]"
      />

      {/* Expanding preview image box with cinematic masking reveal */}
      <motion.div
        initial={{
          top: originRect.top,
          left: originRect.left,
          width: originRect.width,
          height: originRect.height,
          borderColor: 'rgba(216, 195, 165, 0.45)',
        }}
        animate={{
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          borderColor: 'rgba(216, 195, 165, 0)',
        }}
        transition={{ duration: 0.52, ease: EASE_LUXURY }}
        className="absolute overflow-hidden bg-obsidian border shadow-[0_32px_100px_rgba(0,0,0,0.85)] will-change-[top,left,width,height]"
      >
        <motion.div
          initial={{ scale: 1, clipPath: 'inset(3% 3% 3% 3%)' }}
          animate={{ scale: 1.08, clipPath: 'inset(0% 0% 0% 0%)' }}
          transition={{ duration: 0.54, ease: EASE_LUXURY }}
          className="w-full h-full will-change-transform"
        >
          {project.previewImage ? (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ backgroundColor: project.previewBg ?? '#2B1D17' }}
            >
              <img
                src={project.previewImage}
                alt=""
                style={{ objectPosition: project.previewObjectPosition ?? 'center' }}
                className={`w-full h-full ${
                  project.previewImageFit === 'contain'
                    ? 'object-contain p-8 sm:p-16'
                    : 'object-cover'
                }`}
              />
            </div>
          ) : (
            <TypographicDossierPlate
              project={project}
              className="w-full h-full border-0"
            />
          )}
        </motion.div>

        {/* Cinematic dark gradient wash into ProjectDetailPage obsidian hero */}
        <motion.div
          initial={{ opacity: 0.12 }}
          animate={{ opacity: 0.78 }}
          transition={{ duration: 0.48, ease: EASE_LUXURY }}
          className="absolute inset-0 bg-linear-to-t from-obsidian via-obsidian/65 to-obsidian/40"
        />

        {/* Subtle editorial caption emerging during expansion */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, delay: 0.08, ease: EASE_LUXURY }}
          className="absolute inset-x-0 bottom-0 p-6 sm:p-10 lg:p-14 max-w-[1440px] mx-auto"
        >
          <p className="font-mono text-[10px] sm:text-[11px] tracking-[0.26em] uppercase text-champagne mb-2">
            MEMBUKA DOSSIER · {project.index} · {project.category}
          </p>
          <p className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-ivory leading-[1.04]">
            {project.title}
          </p>
        </motion.div>
      </motion.div>
    </div>,
    document.body,
  );
};
