import React, { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { MonogramMark } from '@/components/brand/Monogram';
import { EASE_LUXURY, MOTION_DURATION } from '@/utils/motion';

interface SplashIntroProps {
  onEnter: () => void;
}

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
    transition: { duration: MOTION_DURATION, ease: EASE_LUXURY },
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
              transition: { duration: MOTION_DURATION, ease: EASE_LUXURY },
            }
      }
      className="fixed inset-0 h-dvh z-[9999] bg-[radial-gradient(circle_at_center,_#2C211B_0%,_#1A1412_50%,_#0A0807_100%)] text-ivory flex flex-col items-center justify-between px-6 py-10 sm:px-10 sm:py-12 overflow-hidden select-none"
    >
      {/* Layered luxury atmospheric depth & subtle animated warm mesh glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0.65, scale: 0.96 }}
          animate={
            prefersReducedMotion
              ? { opacity: 0.72, scale: 1 }
              : { opacity: [0.65, 0.92, 0.65], scale: [0.96, 1.08, 0.96] }
          }
          transition={
            prefersReducedMotion
              ? undefined
              : { duration: 10, repeat: Infinity, ease: 'easeInOut' }
          }
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(125vw,900px)] h-[min(125vw,900px)] rounded-full will-change-transform"
          style={{
            background:
              'radial-gradient(circle at center, rgba(165,126,95,0.28) 0%, rgba(118,86,65,0.16) 34%, rgba(43,29,23,0.06) 62%, transparent 76%)',
          }}
        />

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0.45, x: '-6%', y: '-4%' }}
          animate={
            prefersReducedMotion
              ? { opacity: 0.45 }
              : {
                  opacity: [0.4, 0.65, 0.4],
                  x: ['-6%', '6%', '-6%'],
                  y: ['-4%', '5%', '-4%'],
                }
          }
          transition={
            prefersReducedMotion
              ? undefined
              : { duration: 14, repeat: Infinity, ease: 'easeInOut' }
          }
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(95vw,660px)] h-[min(95vw,660px)] rounded-full will-change-transform"
          style={{
            background:
              'radial-gradient(circle at center, rgba(216,195,165,0.14) 0%, rgba(118,86,65,0.08) 42%, transparent 72%)',
          }}
        />

        {/* Deep espresso perimeter vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 48%, transparent 34%, rgba(10,8,7,0.45) 72%, rgba(6,5,4,0.82) 100%)',
          }}
        />

        {/* Fine film grain to keep gradient transitions silky without color banding */}
        <div
          className="absolute inset-0 opacity-[0.045] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='s'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23s)'/%3E%3C/svg%3E\")",
            backgroundSize: '200px 200px',
          }}
        />
      </div>

      {/* Top minimal crest */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: MOTION_DURATION, ease: EASE_LUXURY }}
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
        transition={{ duration: MOTION_DURATION, delay: 0.3, ease: EASE_LUXURY }}
        className="relative z-10 w-full max-w-[1360px] flex items-center justify-between font-mono text-[10px] tracking-[0.22em] uppercase text-taupe"
      >
        <span>WEB DEVELOPER · UI ENGINEER</span>
        <span className="hidden sm:inline text-champagne/70">TEKAN ENTER UNTUK MASUK</span>
      </motion.div>
    </motion.div>
  );
};
