import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check, Link2 } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { EASE_LUXURY } from '@/utils/motion';

interface CopyLinkButtonProps {
  url: string;
  label?: string;
  copiedLabel?: string;
  toastTitle?: string;
  surface?: 'dark' | 'light';
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * Editorial link-copy action button with smooth icon morph (Link2 -> Check)
 * and synchronized global Toast notification.
 */
export const CopyLinkButton: React.FC<CopyLinkButtonProps> = ({
  url,
  label = 'Copy Link',
  copiedLabel = 'Tautan Tersalin',
  toastTitle = 'Tautan Tersalin',
  surface = 'dark',
  size = 'md',
  className = '',
}) => {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const { showToast } = useToast();

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      showToast(toastTitle, url);
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
      timerRef.current = window.setTimeout(() => {
        setCopied(false);
        timerRef.current = null;
      }, 2600);
    } catch {
      showToast('Salin Manual', url);
    }
  };

  const sizeClass =
    size === 'sm'
      ? 'min-h-[44px] sm:min-h-[38px] px-4 py-2 text-[10px] tracking-[0.16em]'
      : 'min-h-[44px] px-4 sm:px-5 py-2.5 text-[10px] sm:text-[11px] tracking-[0.16em]';

  const surfaceClass =
    surface === 'dark'
      ? copied
        ? 'border-champagne bg-champagne text-obsidian font-medium'
        : 'border-champagne/30 bg-espresso/60 text-champagne hover:border-champagne hover:text-ivory'
      : copied
        ? 'border-espresso bg-espresso text-ivory font-medium'
        : 'border-espresso/25 bg-offwhite text-espresso hover:border-[#8A6D4B] hover:text-[#8A6D4B]';

  return (
    <motion.button
      type="button"
      onClick={handleCopy}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
      aria-label={copied ? copiedLabel : `${label}: ${url}`}
      className={`inline-flex items-center justify-center gap-2 rounded-full border font-mono uppercase whitespace-nowrap transition-colors duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-champagne ${sizeClass} ${surfaceClass} ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="copied-icon"
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.65 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.65 }}
            transition={{ duration: 0.2, ease: EASE_LUXURY }}
            className="inline-flex items-center"
          >
            <Check className="size-3.5 stroke-[2.3]" aria-hidden="true" />
          </motion.span>
        ) : (
          <motion.span
            key="link-icon"
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2, ease: EASE_LUXURY }}
            className="inline-flex items-center"
          >
            <Link2 className="size-3.5" aria-hidden="true" />
          </motion.span>
        )}
      </AnimatePresence>
      <span>{copied ? copiedLabel : label}</span>
    </motion.button>
  );
};
