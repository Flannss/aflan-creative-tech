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
import { KineticLabel } from '@/components/motion/KineticLabel';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { personalData } from '@/data/personal';
import { useCanHoverFine } from '@/hooks/useMediaQuery';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { EASE_LUXURY } from '@/utils/motion';

interface SplashIntroProps {
  onEnter: (targetPath?: string) => void;
}

const PORTFOLIO_LETTERS = 'PORTFOLIO'.split('');
const LAPEL_EXIT_EASE = [0.76, 0, 0.24, 1] as const;

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
 * The Tailored Lapel Intro Gate:
 * - Two asymmetric architectural surfaces (Obsidian Espresso #0F0C0A + Smoked Umber #1B1512)
 *   meeting along a razor-thin diagonal Aged Brass seam, illuminated by Burnished Cognac warmth.
 * - Clean focal lockup: top AMDZ monogram & live Purwokerto WIB clock, cursor-reactive
 *   `PORTFOLIO` (per-letter lift/tilt) & `BY AMDZ` (parallax depth + hover glide),
 *   and a precision Magnetic `ENTER` seal.
 * - Exit: Asymmetric opposing diagonal lapel parting (`0.68s`, `[0.76, 0, 0.24, 1]`).
 */
export const SplashIntro: React.FC<SplashIntroProps> = ({ onEnter }) => {
  const prefersReducedMotion = useReducedMotion();
  const canHoverFine = useCanHoverFine();
  const enableCursorFx = canHoverFine && !prefersReducedMotion;
  const { pauseScroll, resumeScroll } = useSmoothScroll();
  const [isExiting, setIsExiting] = useState(false);
  const [wibTime, setWibTime] = useState<string>(() => getPurwokertoWibTime());
  const exitingRef = useRef(false);

  const pointerPctX = useMotionValue(52);
  const pointerPctY = useMotionValue(46);
  const subtitleRawX = useMotionValue(0);
  const subtitleRawY = useMotionValue(0);

  const springCfg = { stiffness: 110, damping: 24, mass: 0.7 };
  const lightX = useSpring(pointerPctX, springCfg);
  const lightY = useSpring(pointerPctY, springCfg);
  const subtitleX = useSpring(subtitleRawX, springCfg);
  const subtitleY = useSpring(subtitleRawY, springCfg);

  const cognacSpotlight = useMotionTemplate`radial-gradient(520px circle at ${lightX}% ${lightY}%, rgba(140, 86, 56, 0.22) 0%, rgba(201, 169, 124, 0.08) 38%, transparent 72%)`;

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
    if (!enableCursorFx) return;
    const rx = e.clientX / Math.max(1, window.innerWidth);
    const ry = e.clientY / Math.max(1, window.innerHeight);
    pointerPctX.set(rx * 100);
    pointerPctY.set(ry * 100);
    subtitleRawX.set((rx - 0.5) * 14);
    subtitleRawY.set((ry - 0.5) * 8);
  };

  const handleMouseLeave = () => {
    if (!enableCursorFx) return;
    pointerPctX.set(52);
    pointerPctY.set(46);
    subtitleRawX.set(0);
    subtitleRawY.set(0);
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Pembuka Portofolio AFLAN"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
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
      {/* Tailored Lapel Asymmetric Dual-Panel Architecture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Left/Upper Fold — Obsidian Espresso (#0F0C0A) */}
        <motion.div
          initial={{ x: '0%', y: '0%' }}
          exit={
            prefersReducedMotion
              ? { opacity: 0, transition: { duration: 0.18 } }
              : {
                  x: '-64%',
                  y: '-102%',
                  transition: { duration: 0.68, ease: LAPEL_EXIT_EASE },
                }
          }
          style={{ clipPath: 'polygon(0 0, 62.2% 0, 38.2% 100%, 0 100%)' }}
          className="absolute inset-0 bg-[#0F0C0A] will-change-transform"
        />

        {/* Right/Lower Fold — Smoked Umber (#1B1512) */}
        <motion.div
          initial={{ x: '0%', y: '0%' }}
          exit={
            prefersReducedMotion
              ? { opacity: 0, transition: { duration: 0.18 } }
              : {
                  x: '64%',
                  y: '102%',
                  transition: { duration: 0.68, ease: LAPEL_EXIT_EASE },
                }
          }
          style={{ clipPath: 'polygon(61.8% 0, 100% 0, 100% 100%, 37.8% 100%)' }}
          className="absolute inset-0 bg-[#1B1512] will-change-transform"
        />

        {/* Razor-Thin Aged Brass Diagonal Lapel Seam + Exit Flare */}
        <motion.svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          initial={{ opacity: 0.45 }}
          exit={
            prefersReducedMotion
              ? { opacity: 0 }
              : {
                  opacity: [0.45, 1, 0],
                  transition: { duration: 0.5, ease: EASE_LUXURY },
                }
          }
          className="absolute inset-0 w-full h-full will-change-[opacity]"
        >
          <line
            x1="62"
            y1="0"
            x2="38"
            y2="100"
            stroke="rgba(201, 169, 124, 0.36)"
            strokeWidth="0.16"
          />
        </motion.svg>

        {/* Cursor-Reactive Burnished Cognac Lighting (Desktop) / Drift Glow (Touch) */}
        {enableCursorFx ? (
          <motion.div
            style={{ background: cognacSpotlight }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            className="absolute inset-0"
          />
        ) : (
          <motion.div
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            style={{
              background:
                'radial-gradient(circle 420px at 50% 48%, rgba(140,86,56,0.20) 0%, rgba(201,169,124,0.06) 44%, transparent 74%)',
            }}
            className="absolute inset-0 aflan-lapel-glow"
          />
        )}
      </div>

      {/* Foreground Crisp Typography & Magnetic Seal */}
      <motion.div
        initial={{ opacity: 1, scale: 1 }}
        exit={
          prefersReducedMotion
            ? { opacity: 0, transition: { duration: 0.16 } }
            : {
                opacity: 0,
                scale: 0.96,
                transition: { duration: 0.24, ease: EASE_LUXURY },
              }
        }
        className="relative z-10 h-full w-full flex flex-col items-center justify-between px-5 sm:px-8 md:px-12 py-7 sm:py-10 will-change-[transform,opacity]"
      >
        {/* Top Micro-Header */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.44, ease: EASE_LUXURY }}
          className="w-full max-w-[1360px] flex items-center justify-between gap-4 font-mono text-[10px] sm:text-[11px] tracking-[0.26em] uppercase"
        >
          <span className="inline-flex items-center gap-2.5 text-brass">
            <MonogramMark size={22} className="text-brass shrink-0" />
            <span>AMDZ</span>
          </span>
          <span className="inline-flex items-center gap-2 text-taupe tabular-nums whitespace-nowrap">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-brass animate-pulse motion-reduce:animate-none"
            />
            <span>PURWOKERTO · {wibTime} WIB</span>
          </span>
        </motion.div>

        {/* Centered Focal Seal */}
        <div className="relative flex flex-col items-center justify-center text-center my-auto px-2">
          <motion.span
            aria-hidden="true"
            initial={prefersReducedMotion ? false : { scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.42, delay: 0.05, ease: EASE_LUXURY }}
            className="block w-10 h-px bg-brass/55 mb-6 origin-center"
          />

          <h1
            aria-label="Portfolio by AMDZ"
            className="relative z-10 flex flex-col items-center"
          >
            <span
              aria-hidden="true"
              className="inline-flex items-baseline justify-center py-2 px-1 -my-2"
            >
              {PORTFOLIO_LETTERS.map((char, idx) => (
                <motion.span
                  key={`${char}-${idx}`}
                  initial={
                    prefersReducedMotion ? false : { opacity: 0, y: 14 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={
                    enableCursorFx
                      ? {
                          y: -6,
                          rotate: idx % 2 === 0 ? -2.5 : 2.5,
                          scale: 1.04,
                          transition: {
                            type: 'spring',
                            stiffness: 280,
                            damping: 20,
                            mass: 0.48,
                          },
                        }
                      : undefined
                  }
                  transition={{
                    duration: 0.44,
                    delay: 0.06 + idx * 0.022,
                    ease: EASE_LUXURY,
                  }}
                  className={`inline-block font-serif font-light uppercase text-[2.7rem] sm:text-6xl md:text-7xl tracking-[0.08em] leading-[1.15] px-[0.02em] aflan-title-shimmer cursor-default will-change-transform ${
                    enableCursorFx
                      ? 'transition-[filter] duration-300 hover:brightness-125 hover:drop-shadow-[0_6px_16px_rgba(246,241,233,0.28)]'
                      : ''
                  }`}
                >
                  {char}
                </motion.span>
              ))}
            </span>

            <motion.span
              aria-hidden="true"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.46, delay: 0.16, ease: EASE_LUXURY }}
              style={
                enableCursorFx ? { x: subtitleX, y: subtitleY } : undefined
              }
              className="mt-2.5 md:mt-3 inline-block will-change-transform"
            >
              <motion.span
                whileHover={
                  enableCursorFx
                    ? {
                        scale: 1.03,
                        y: -2,
                        transition: {
                          type: 'spring',
                          stiffness: 280,
                          damping: 20,
                        },
                      }
                    : undefined
                }
                className={`inline-block py-1.5 px-3 -my-1.5 font-serif italic font-medium uppercase tracking-[0.14em] text-engraved-champagne text-xl sm:text-3xl md:text-4xl leading-[1.2] select-none cursor-default will-change-transform ${
                  enableCursorFx
                    ? 'transition-[filter] duration-300 hover:drop-shadow-[0_0_16px_rgba(201,169,124,0.38)]'
                    : ''
                }`}
              >
                BY AMDZ
              </motion.span>
            </motion.span>
          </h1>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.44, delay: 0.22, ease: EASE_LUXURY }}
            className="relative z-10 mt-9 sm:mt-11"
          >
            <MagneticButton maxPull={6}>
              <div className="relative inline-flex items-center justify-center">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-1.5 rounded-full border border-brass/30 aflan-breath-halo"
                />
                <button
                  type="button"
                  onClick={triggerEnter}
                  autoFocus
                  data-cursor-label="ENTER"
                  className="group relative overflow-hidden inline-flex items-center justify-center gap-3 min-h-[48px] px-9 py-3.5 rounded-full border border-brass/50 bg-[#1B1512]/85 text-ivory font-mono text-xs uppercase tracking-[0.24em] hover:bg-brass hover:border-brass hover:text-obsidian active:scale-[0.96] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] bg-gradient-to-r from-transparent via-ivory/25 to-transparent motion-reduce:hidden"
                  />
                  <KineticLabel className="relative z-10">ENTER</KineticLabel>
                  <ArrowUpRight
                    className="relative z-10 size-4 text-brass transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-obsidian group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </MagneticButton>
          </motion.div>
        </div>

        {/* Minimalist Bottom Prompt */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.44, delay: 0.26, ease: EASE_LUXURY }}
          className="font-mono text-[10px] tracking-[0.28em] uppercase text-taupe/75"
        >
          PRESS ENTER
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
