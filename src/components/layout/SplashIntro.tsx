import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { MonogramMark } from '@/components/brand/Monogram';
import { KineticLabel } from '@/components/motion/KineticLabel';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { personalData } from '@/data/personal';
import { useCanHoverFine } from '@/hooks/useMediaQuery';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { EASE_LUXURY } from '@/utils/motion';

interface SplashIntroProps {
  onEnter: (targetPath?: string) => void;
}

function getPurwokertoWibTime(): string {
  try {
    return new Intl.DateTimeFormat('id-ID', {
      timeZone: personalData.timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
      .format(new Date())
      .replace('.', ':');
  } catch {
    return '--:--';
  }
}

/**
 * Minimalist Architectural Seal Intro Gate with Staggered 5-Column Editorial Shutter Reveal.
 * - Ultra-clean editorial breathing room: top AMDZ crest & Purwokerto live WIB,
 *   centered compass orbital hairline (reacts softly to pointer on desktop),
 *   PORTFOLIO + engraved BY AMDZ, Magnetic `ENTER` seal CTA, and subtle `PRESS ENTER` cue.
 * - Exit: 5 GPU-animated Espresso columns rise in a center-outward wave (`0.62s`),
 *   unveiling the Homepage cleanly without blocking pointer/keyboard input.
 */
export const SplashIntro: React.FC<SplashIntroProps> = ({ onEnter }) => {
  const prefersReducedMotion = useReducedMotion();
  const canHoverFine = useCanHoverFine();
  const { pauseScroll, resumeScroll } = useSmoothScroll();
  const [isExiting, setIsExiting] = useState(false);
  const [wibTime, setWibTime] = useState<string>(() => getPurwokertoWibTime());
  const exitingRef = useRef(false);

  const compassRotRaw = useMotionValue(0);
  const compassRotate = useSpring(compassRotRaw, {
    stiffness: 90,
    damping: 24,
    mass: 0.7,
  });

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

    const clockId = window.setInterval(() => {
      setWibTime(getPurwokertoWibTime());
    }, 15000);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerEnter();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearInterval(clockId);
      document.body.style.overflow = prevOverflow;
      resumeScroll();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [pauseScroll, resumeScroll, triggerEnter]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canHoverFine || prefersReducedMotion) return;
    const relX = e.clientX / Math.max(1, window.innerWidth) - 0.5;
    compassRotRaw.set(relX * 10);
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
          ? { opacity: 0, transition: { duration: 0.2 } }
          : { transition: { duration: 0.72 } }
      }
      className={`fixed inset-0 h-dvh z-[9990] bg-transparent text-ivory overflow-hidden select-none ${
        isExiting ? 'pointer-events-none' : ''
      }`}
    >
      {/* Seamless Dual-Panel Silk Aperture Split Layer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <motion.div
          initial={{ y: '0%' }}
          exit={
            prefersReducedMotion
              ? { opacity: 0, transition: { duration: 0.2 } }
              : {
                  y: '-102%',
                  transition: {
                    duration: 0.68,
                    ease: EASE_LUXURY,
                  },
                }
          }
          className="absolute top-0 inset-x-0 h-1/2 bg-[#1A1412] will-change-transform"
        />
        <motion.div
          initial={{ y: '0%' }}
          exit={
            prefersReducedMotion
              ? { opacity: 0, transition: { duration: 0.2 } }
              : {
                  y: '102%',
                  transition: {
                    duration: 0.68,
                    ease: EASE_LUXURY,
                  },
                }
          }
          className="absolute bottom-0 inset-x-0 h-1/2 bg-[#1A1412] will-change-transform"
        />
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          exit={
            prefersReducedMotion
              ? { opacity: 0 }
              : {
                  scaleX: [0, 1, 1],
                  opacity: [0, 0.9, 0],
                  transition: {
                    duration: 0.52,
                    ease: EASE_LUXURY,
                  },
                }
          }
          className="absolute top-1/2 inset-x-0 -translate-y-1/2 h-px bg-champagne/40 origin-center will-change-[transform,opacity]"
        />
      </div>

      {/* Foreground Minimalist Seal & Corner Micro-Labels */}
      <motion.div
        initial={{ opacity: 1, scale: 1, y: 0 }}
        exit={
          prefersReducedMotion
            ? { opacity: 0, transition: { duration: 0.18 } }
            : {
                opacity: 0,
                scale: 0.94,
                y: -14,
                transition: { duration: 0.26, ease: EASE_LUXURY },
              }
        }
        className="relative z-10 h-full w-full flex flex-col items-center justify-between px-6 py-7 sm:px-10 sm:py-10 md:px-14 md:py-12 will-change-[transform,opacity]"
      >
        {/* Warm Studio Ambient Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle 540px at 50% 48%, rgba(216,195,165,0.09) 0%, rgba(138,109,75,0.04) 44%, transparent 74%)',
          }}
        />

        {/* Top Minimalist Micro-Labels */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.48, ease: EASE_LUXURY }}
          className="relative z-10 w-full max-w-[1360px] flex items-center justify-between gap-4 font-mono text-[10px] sm:text-[11px] tracking-[0.26em] uppercase"
        >
          <span className="inline-flex items-center gap-2.5 text-champagne/85">
            <MonogramMark size={22} className="text-champagne shrink-0" />
            <span>AMDZ</span>
          </span>
          <span className="inline-flex items-center gap-2 text-taupe tabular-nums whitespace-nowrap">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-champagne animate-pulse motion-reduce:animate-none"
            />
            <span>PURWOKERTO · {wibTime} WIB</span>
          </span>
        </motion.div>

        {/* Center Orbital Compass Hairline + Typography + Magnetic ENTER Seal */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto px-2">
          {/* Dual Counter-Rotating Architectural Compass SVG */}
          <motion.div
            aria-hidden="true"
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={
              prefersReducedMotion
                ? undefined
                : {
                    scale: 1.18,
                    opacity: 0,
                    transition: { duration: 0.38, ease: EASE_LUXURY },
                  }
            }
            transition={{ duration: 0.65, ease: EASE_LUXURY }}
            style={
              canHoverFine && !prefersReducedMotion
                ? { rotate: compassRotate }
                : undefined
            }
            className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[290px] sm:size-[400px] md:size-[460px] flex items-center justify-center will-change-transform"
          >
            <svg
              viewBox="0 0 460 460"
              className="w-full h-full overflow-visible"
              aria-hidden="true"
            >
              <g className="aflan-ring-cw origin-center">
                <circle
                  cx="230"
                  cy="230"
                  r="224"
                  stroke="rgba(216,195,165,0.16)"
                  strokeWidth="1"
                  fill="none"
                />
                <line x1="230" y1="0" x2="230" y2="12" stroke="rgba(216,195,165,0.38)" strokeWidth="1" />
                <line x1="230" y1="448" x2="230" y2="460" stroke="rgba(216,195,165,0.38)" strokeWidth="1" />
                <line x1="0" y1="230" x2="12" y2="230" stroke="rgba(216,195,165,0.38)" strokeWidth="1" />
                <line x1="448" y1="230" x2="460" y2="230" stroke="rgba(216,195,165,0.38)" strokeWidth="1" />
                <circle cx="230" cy="6" r="2" fill="rgba(216,195,165,0.45)" />
                <circle cx="230" cy="454" r="2" fill="rgba(216,195,165,0.45)" />
                <circle cx="6" cy="230" r="2" fill="rgba(216,195,165,0.45)" />
                <circle cx="454" cy="230" r="2" fill="rgba(216,195,165,0.45)" />
              </g>
              <g className="aflan-ring-ccw origin-center">
                <circle
                  cx="230"
                  cy="230"
                  r="184"
                  stroke="rgba(216,195,165,0.11)"
                  strokeWidth="1"
                  strokeDasharray="4 7"
                  fill="none"
                />
                <circle cx="100" cy="100" r="1.5" fill="rgba(216,195,165,0.35)" />
                <circle cx="360" cy="100" r="1.5" fill="rgba(216,195,165,0.35)" />
                <circle cx="100" cy="360" r="1.5" fill="rgba(216,195,165,0.35)" />
                <circle cx="360" cy="360" r="1.5" fill="rgba(216,195,165,0.35)" />
              </g>
            </svg>
          </motion.div>

          <motion.span
            aria-hidden="true"
            initial={prefersReducedMotion ? false : { scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.46, delay: 0.06, ease: EASE_LUXURY }}
            className="block w-10 h-px bg-champagne/45 mb-6 origin-center"
          />

          <h1
            aria-label="Portfolio by AMDZ"
            className="relative z-10 flex flex-col items-center"
          >
            <span className="block overflow-hidden">
              <motion.span
                aria-hidden="true"
                initial={prefersReducedMotion ? false : { y: '100%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.56, delay: 0.1, ease: EASE_LUXURY }}
                className="block font-serif font-light uppercase text-[2.75rem] sm:text-6xl md:text-7xl tracking-[0.08em] leading-none aflan-title-shimmer will-change-transform"
              >
                PORTFOLIO
              </motion.span>
            </span>
            <span className="block overflow-hidden mt-2.5 md:mt-3">
              <motion.span
                aria-hidden="true"
                initial={prefersReducedMotion ? false : { y: '100%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.54, delay: 0.18, ease: EASE_LUXURY }}
                className="block font-serif italic font-medium uppercase tracking-[0.14em] text-engraved-champagne text-xl sm:text-3xl md:text-4xl leading-none select-none will-change-transform"
              >
                BY AMDZ
              </motion.span>
            </span>
          </h1>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.46, delay: 0.24, ease: EASE_LUXURY }}
            className="relative z-10 mt-9 sm:mt-11"
          >
            <MagneticButton maxPull={8}>
              <div className="relative inline-flex items-center justify-center">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-1.5 rounded-full border border-champagne/30 aflan-breath-halo"
                />
                <button
                  type="button"
                  onClick={triggerEnter}
                  autoFocus
                  data-cursor-label="ENTER"
                  className="group relative overflow-hidden inline-flex items-center justify-center gap-3 min-h-[48px] px-9 py-3.5 rounded-full border border-champagne/45 bg-[#211A17]/80 text-ivory font-mono text-xs uppercase tracking-[0.24em] hover:bg-champagne hover:border-champagne hover:text-obsidian active:scale-[0.96] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] bg-gradient-to-r from-transparent via-ivory/20 to-transparent motion-reduce:hidden"
                  />
                  <KineticLabel className="relative z-10">ENTER</KineticLabel>
                  <ArrowUpRight
                    className="relative z-10 size-4 text-champagne transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-obsidian group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </MagneticButton>
          </motion.div>
        </div>

        {/* Single Minimalist Bottom Cue */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.48, delay: 0.28, ease: EASE_LUXURY }}
          className="relative z-10 font-mono text-[10px] tracking-[0.28em] uppercase text-taupe/75"
        >
          PRESS ENTER
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
