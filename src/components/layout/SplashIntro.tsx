import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { MonogramMark } from '@/components/brand/Monogram';
import { KineticCursorField } from '@/components/motion/KineticCursorField';
import { KineticLabel } from '@/components/motion/KineticLabel';
import { useCanHoverFine } from '@/hooks/useMediaQuery';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { EASE_LUXURY } from '@/utils/motion';

interface SplashIntroProps {
  onEnter: () => void;
}

const APERTURE_EASE = [0.76, 0, 0.24, 1] as const;

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, ease: EASE_LUXURY },
  },
};

const ruleVariants = {
  hidden: { opacity: 0, scaleX: 0 },
  visible: {
    opacity: 1,
    scaleX: 1,
    transition: { duration: 0.52, ease: EASE_LUXURY },
  },
};

const FILM_GRAIN_DATA_URI =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='s'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23s)'/%3E%3C/svg%3E\")";

/**
 * Luxury editorial entry gate revealed once per session before the Hero.
 * Features a pointer-reactive kinetic canvas field, warm spotlight glow,
 * curved hairline frame with architectural corner accents, and a cinematic
 * dual-panel horizontal aperture curtain exit into the homepage.
 */
export const SplashIntro: React.FC<SplashIntroProps> = ({ onEnter }) => {
  const prefersReducedMotion = useReducedMotion();
  const canHoverFine = useCanHoverFine();
  const { pauseScroll, resumeScroll } = useSmoothScroll();
  const [isExiting, setIsExiting] = useState(false);
  const exitingRef = useRef(false);

  const pointerX = useMotionValue(
    typeof window !== 'undefined' ? window.innerWidth / 2 : 640,
  );
  const pointerY = useMotionValue(
    typeof window !== 'undefined' ? window.innerHeight / 2 : 360,
  );
  const smoothX = useSpring(pointerX, { stiffness: 120, damping: 24, mass: 0.6 });
  const smoothY = useSpring(pointerY, { stiffness: 120, damping: 24, mass: 0.6 });
  const spotlightBackground = useMotionTemplate`radial-gradient(620px circle at ${smoothX}px ${smoothY}px, rgba(216,195,165,0.08) 0%, rgba(138,109,75,0.035) 38%, transparent 72%)`;

  const triggerEnter = useCallback(() => {
    if (exitingRef.current) return;
    exitingRef.current = true;
    setIsExiting(true);
    onEnter();
  }, [onEnter]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    pauseScroll();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerEnter();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      resumeScroll();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [pauseScroll, resumeScroll, triggerEnter]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canHoverFine || prefersReducedMotion) return;
    pointerX.set(e.clientX);
    pointerY.set(e.clientY);
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Pembuka Portofolio AFLAN"
      onMouseMove={handleMouseMove}
      initial={{ opacity: 1 }}
      exit={
        prefersReducedMotion
          ? { opacity: 0, transition: { duration: 0.25 } }
          : { transition: { duration: 0.78 } }
      }
      className={`fixed inset-0 h-dvh z-[9990] bg-transparent text-ivory overflow-hidden select-none ${
        isExiting ? 'pointer-events-none' : ''
      }`}
    >
      {/* Top Aperture Curtain Panel */}
      <motion.div
        aria-hidden="true"
        initial={{ y: '0%' }}
        exit={
          prefersReducedMotion
            ? { opacity: 0, transition: { duration: 0.25 } }
            : { y: '-102%', transition: { duration: 0.76, ease: APERTURE_EASE } }
        }
        className="pointer-events-none absolute top-0 inset-x-0 h-1/2 overflow-hidden will-change-transform border-b border-ivory/15"
      >
        <div className="absolute top-0 inset-x-0 h-[200%] bg-[radial-gradient(circle_at_center,_#2C211B_0%,_#1A1412_50%,_#0A0807_100%)]" />
      </motion.div>

      {/* Bottom Aperture Curtain Panel */}
      <motion.div
        aria-hidden="true"
        initial={{ y: '0%' }}
        exit={
          prefersReducedMotion
            ? { opacity: 0, transition: { duration: 0.25 } }
            : { y: '102%', transition: { duration: 0.76, ease: APERTURE_EASE } }
        }
        className="pointer-events-none absolute bottom-0 inset-x-0 h-1/2 overflow-hidden will-change-transform border-t border-ivory/15"
      >
        <div className="absolute bottom-0 inset-x-0 h-[200%] bg-[radial-gradient(circle_at_center,_#2C211B_0%,_#1A1412_50%,_#0A0807_100%)]" />
      </motion.div>

      {/* Center Ivory / Champagne Aperture Seam Flash */}
      {!prefersReducedMotion && (
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0, scaleX: 0 }}
          exit={{
            opacity: [0, 0.9, 0],
            scaleX: [0, 1, 1],
            transition: { duration: 0.56, ease: APERTURE_EASE },
          }}
          className="pointer-events-none absolute top-1/2 inset-x-0 -translate-y-1/2 z-[15] h-px origin-center bg-gradient-to-r from-transparent via-ivory/85 to-transparent will-change-transform"
        />
      )}

      {/* Atmospheric Layers + Cursor-Reactive Kinetic Field + Cover Composition */}
      <motion.div
        initial={{ opacity: 1, y: 0, scale: 1 }}
        exit={
          prefersReducedMotion
            ? { opacity: 0, transition: { duration: 0.2 } }
            : {
                opacity: 0,
                y: -16,
                scale: 0.97,
                transition: { duration: 0.34, ease: EASE_LUXURY },
              }
        }
        className="relative z-10 w-full h-full flex flex-col items-center justify-between px-6 py-7 sm:px-12 sm:py-12 md:px-16 md:py-14 will-change-[transform,opacity]"
      >
        {/* Layered atmospheric depth & Kinetic Cursor Field */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
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

          <KineticCursorField variant="gate" className="z-[3]" />

          {canHoverFine && !prefersReducedMotion && (
            <motion.div
              className="absolute inset-0 will-change-[background]"
              style={{ background: spotlightBackground }}
            />
          )}

          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 50% 48%, transparent 34%, rgba(10,8,7,0.45) 72%, rgba(6,5,4,0.82) 100%)',
            }}
          />

          <div
            className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
            style={{ backgroundImage: FILM_GRAIN_DATA_URI, backgroundSize: '200px 200px' }}
          />
        </div>

        {/* Hairline dossier frame with delicate architectural corner accents */}
        <motion.div
          aria-hidden="true"
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.68, ease: EASE_LUXURY }}
          className="pointer-events-none absolute inset-3 sm:inset-5 md:inset-8 z-[5] border border-champagne/18 rounded-2xl md:rounded-3xl"
        >
          <span className="absolute top-3 left-3 w-3.5 h-3.5 border-t border-l border-champagne/55 rounded-tl-md" />
          <span className="absolute top-3 right-3 w-3.5 h-3.5 border-t border-r border-champagne/55 rounded-tr-md" />
          <span className="absolute bottom-3 left-3 w-3.5 h-3.5 border-b border-l border-champagne/55 rounded-bl-md" />
          <span className="absolute bottom-3 right-3 w-3.5 h-3.5 border-b border-r border-champagne/55 rounded-br-md" />
        </motion.div>

        {/* Top minimal crest */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.16, ease: EASE_LUXURY }}
          className="relative z-10 w-full max-w-[1360px] flex items-center justify-between gap-4 px-2 sm:px-4 font-mono text-[10px] sm:text-[11px] tracking-[0.24em] sm:tracking-[0.26em] uppercase text-champagne/80"
        >
          <span className="inline-flex items-center gap-2.5">
            <MonogramMark size={24} className="text-champagne shrink-0" />
            <span>AFLAN</span>
          </span>
          <span className="text-taupe whitespace-nowrap">PURWOKERTO · ID</span>
        </motion.div>

        {/* Center editorial cover composition */}
        <motion.div
          variants={prefersReducedMotion ? undefined : containerVariants}
          initial={prefersReducedMotion ? false : 'hidden'}
          animate="visible"
          className="relative z-10 w-full flex flex-col items-center text-center max-w-4xl mx-auto my-auto px-2"
        >
          <motion.span
            aria-hidden="true"
            variants={prefersReducedMotion ? undefined : ruleVariants}
            className="block w-12 h-px bg-champagne/45 mb-6 sm:mb-8 origin-center"
          />

          <motion.h1
            variants={prefersReducedMotion ? undefined : itemVariants}
            aria-label="Portfolio by AMDZ"
            className="flex flex-col items-center"
          >
            <span
              aria-hidden="true"
              className="block font-serif font-light uppercase text-[2.65rem] sm:text-6xl md:text-7xl tracking-[0.06em] leading-none text-ivory"
            >
              PORTFOLIO
            </span>
            <span
              aria-hidden="true"
              className="block font-serif italic font-medium uppercase tracking-[0.14em] text-engraved-champagne text-xl sm:text-3xl md:text-4xl mt-2 md:mt-3 leading-none select-none"
            >
              BY AMDZ
            </span>
          </motion.h1>

          <motion.span
            aria-hidden="true"
            variants={prefersReducedMotion ? undefined : ruleVariants}
            className="block w-12 h-px bg-champagne/45 my-6 sm:my-8 origin-center"
          />

          <motion.p
            variants={prefersReducedMotion ? undefined : itemVariants}
            className="font-mono text-[10px] md:text-xs tracking-[0.2em] sm:tracking-[0.22em] uppercase text-taupe leading-relaxed max-w-md sm:max-w-none"
          >
            WEB DEVELOPER · UI ENGINEER · SOFTWARE QA
          </motion.p>

          <motion.div
            variants={prefersReducedMotion ? undefined : itemVariants}
            className="mt-8 sm:mt-10 md:mt-12"
          >
            <button
              type="button"
              onClick={triggerEnter}
              autoFocus
              data-cursor-label="ENTER"
              className="group inline-flex items-center justify-center gap-3 min-h-[44px] px-7 py-3.5 rounded-full border border-champagne/40 bg-obsidian/35 backdrop-blur-sm text-ivory font-mono text-xs uppercase tracking-[0.22em] hover:bg-champagne hover:border-champagne hover:text-obsidian active:scale-[0.97] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne"
            >
              <KineticLabel>MASUK / ENTER</KineticLabel>
              <ArrowUpRight
                className="size-4 text-champagne transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-obsidian group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none"
                aria-hidden="true"
              />
            </button>
          </motion.div>
        </motion.div>

        {/* Bottom minimalist colophon */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.16, ease: EASE_LUXURY }}
          className="relative z-10 w-full max-w-[1360px] flex items-center justify-between gap-4 px-2 sm:px-4 font-mono text-[10px] tracking-[0.2em] sm:tracking-[0.22em] uppercase text-taupe"
        >
          <span>DOSSIER DIGITAL PERSONAL</span>
          <span className="hidden sm:inline text-champagne/70">TEKAN ENTER UNTUK MASUK</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
