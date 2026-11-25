import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Bookmark } from 'lucide-react';
import { useBookmarkedProjects } from '@/hooks/useBookmarkedProjects';
import { useToast } from '@/hooks/useToast';
import { EASE_LUXURY } from '@/utils/motion';

interface BookmarkButtonProps {
  slug: string;
  projectTitle: string;
  variant?: 'icon' | 'pill';
  surface?: 'dark' | 'light';
  className?: string;
}

/**
 * Tactile dossier bookmark button persisted to localStorage.
 * Enables recruiters and visitors to curate a personal project shortlist.
 */
export const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  slug,
  projectTitle,
  variant = 'icon',
  surface = 'dark',
  className = '',
}) => {
  const { isBookmarked, toggleBookmark } = useBookmarkedProjects();
  const { showToast } = useToast();
  const prefersReducedMotion = useReducedMotion();
  const saved = isBookmarked(slug);

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const nextSaved = toggleBookmark(slug);
    showToast(
      nextSaved ? 'Disimpan ke Shortlist' : 'Dihapus dari Shortlist',
      projectTitle,
    );
  };

  const stateClass =
    surface === 'dark'
      ? saved
        ? 'border-champagne bg-champagne text-obsidian shadow-[0_8px_24px_rgba(216,195,165,0.22)]'
        : 'border-champagne/30 bg-obsidian/80 text-champagne/85 hover:border-champagne hover:text-ivory hover:bg-espresso/85'
      : saved
        ? 'border-espresso bg-espresso text-champagne shadow-xs'
        : 'border-espresso/25 bg-offwhite text-espresso hover:border-bronze hover:text-cognac';

  if (variant === 'pill') {
    return (
      <motion.button
        type="button"
        onClick={handleToggle}
        aria-pressed={saved}
        aria-label={
          saved
            ? `Hapus ${projectTitle} dari shortlist tersimpan`
            : `Simpan ${projectTitle} ke shortlist`
        }
        whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
        className={`inline-flex items-center justify-center gap-2 min-h-[44px] px-4 sm:px-5 py-2.5 rounded-full border font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em] font-medium whitespace-nowrap transition-colors duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-champagne ${stateClass} ${className}`}
      >
        <motion.span
          key={saved ? 'saved' : 'unsaved'}
          initial={prefersReducedMotion ? false : { scale: 0.78 }}
          animate={{ scale: saved && !prefersReducedMotion ? [1, 1.24, 1] : 1 }}
          transition={{ duration: 0.35, ease: EASE_LUXURY }}
          className="inline-flex items-center"
        >
          <Bookmark
            className={`size-3.5 ${saved ? 'fill-current' : ''}`}
            aria-hidden="true"
          />
        </motion.span>
        <span>{saved ? 'Tersimpan' : 'Simpan Proyek'}</span>
      </motion.button>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={handleToggle}
      aria-pressed={saved}
      aria-label={
        saved
          ? `Hapus ${projectTitle} dari shortlist tersimpan`
          : `Simpan ${projectTitle} ke shortlist`
      }
      whileTap={prefersReducedMotion ? undefined : { scale: 0.9 }}
      className={`size-11 rounded-full border backdrop-blur-sm flex items-center justify-center transition-colors duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-champagne ${stateClass} ${className}`}
    >
      <motion.span
        key={saved ? 'saved-icon' : 'unsaved-icon'}
        initial={prefersReducedMotion ? false : { scale: 0.78 }}
        animate={{ scale: saved && !prefersReducedMotion ? [1, 1.24, 1] : 1 }}
        transition={{ duration: 0.35, ease: EASE_LUXURY }}
        className="inline-flex items-center"
      >
        <Bookmark
          className={`size-4 ${saved ? 'fill-current' : ''}`}
          aria-hidden="true"
        />
      </motion.span>
    </motion.button>
  );
};
