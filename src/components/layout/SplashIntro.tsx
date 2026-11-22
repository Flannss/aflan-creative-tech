import React, { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { MonogramMark } from '@/components/brand/Monogram';

interface SplashIntroProps {
  onEnter: () => void;
}

const EASE_SPLASH: [number, number, number, number] = [0.22, 1, 0.36, 1];

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: EASE_SPLASH },
  },
};

/**
 * Luxury editorial entry screen revealed before the portfolio homepage.
 * Exits with a smooth upward curtain glide on user interaction.
 */
export const SplashIntro: React.FC<SplashIntroProps> = ({ onEnter }) => {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onEnter();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onEnter]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Pembuka Portofolio AFLAN"
      initial={{ y: '0%', opacity: 1 }}
      exit={
        prefersReducedMotion
          ? { opacity: 0, transition: { duration: 0.3 } }
          : {
              y: '-100%',
              opacity: 0.92,
              transition: { duration: 0.95, ease: EASE_SPLASH },
            }
      }
      className="fixed inset-0 z-[9999] bg-[#1A1412] text-ivory flex flex-col items-center justify-between px-6 py-10 sm:px-10 sm:py-12 overflow-hidden select-none"
    >
      {/* Subtle warm radial depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 52% at 50% 48%, rgba(118,86,65,0.22) 0%, rgba(43,29,23,0.34) 48%, rgba(26,20,18,0.98) 100%)',
        }}
      />

      {/* Top minimal crest */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: EASE_SPLASH }}
        className="relative z-10 w-full max-w-[1360px] flex items-center justify-between font-mono text-[10px] sm:text-[11px] tracking-[0.26em] uppercase text-champagne/80"
      >
        <span className="inline-flex items-center gap-2.5">
          <MonogramMark size={24} className="text-champagne" />
          <span>AFLAN</span>
        </span>
        <span className="text-taupe">PURWOKERTO · ID</span>
      </motion.div>

      {/* Center monumental editorial display */}
      <motion.div
        variants={prefersReducedMotion ? undefined : containerVariants}
        initial={prefersReducedMotion ? false : 'hidden'}
        animate="visible"
        className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto my-auto"
      >
        <motion.p
          variants={prefersReducedMotion ? undefined : itemVariants}
          className="font-mono text-[10px] sm:text-xs tracking-[0.34em] uppercase text-champagne/85 mb-6 sm:mb-8"
        >
          AFLAN MU&apos;AFA DZULFIQAR
        </motion.p>

        <motion.div
          variants={prefersReducedMotion ? undefined : itemVariants}
          className="space-y-1 sm:space-y-2"
        >
          <p className="font-serif font-light uppercase tracking-[0.14em] leading-[0.88] text-[clamp(2.85rem,11.5vw,8.25rem)] text-ivory">
            PORTFOLIO
          </p>
          <p className="font-serif italic font-light uppercase tracking-[0.12em] leading-[0.92] text-[clamp(2.25rem,8.5vw,6.2rem)] text-champagne">
            <span className="editorial-outline-strong mr-3 sm:mr-5">BY</span>
            <span>AMDZ</span>
          </p>
        </motion.div>

        <motion.div
          variants={prefersReducedMotion ? undefined : itemVariants}
          className="mt-12 sm:mt-16"
        >
          <button
            type="button"
            onClick={onEnter}
            autoFocus
            className="group inline-flex items-center gap-3 pb-2 border-b border-champagne/55 hover:border-champagne text-ivory hover:text-champagne font-mono text-xs sm:text-[13px] tracking-[0.28em] uppercase active:scale-[0.97] transition-all duration-300 cursor-pointer"
          >
            <span>MASUK / ENTER</span>
            <ArrowUpRight
              className="size-4 text-champagne transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </button>
        </motion.div>
      </motion.div>

      {/* Bottom minimalist colophon */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.35, ease: EASE_SPLASH }}
        className="relative z-10 w-full max-w-[1360px] flex items-center justify-between font-mono text-[10px] tracking-[0.22em] uppercase text-taupe"
      >
        <span>WEB DEVELOPER · UI ENGINEER</span>
        <span className="hidden sm:inline text-champagne/70">TEKAN ENTER UNTUK MASUK</span>
      </motion.div>
    </motion.div>
  );
};
