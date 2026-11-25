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

const PORTFOLIO_LETTERS = 'PORTFOLIO'.split('');

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
 * Warm Atelier Collector-Edition Intro Gate:
 * - Layered 10-step Lab tonal gradient canvas (`#211814` Warm Espresso blending Velvet Mocha
 *   `#2B1D17`, Warm Chestnut `#432F24`, Warm Cognac `#6E4F3A`, Caramel Bronze & Champagne glows).
 * - Curved architectural double hairline border (`rounded-[28px] sm:rounded-[38px] md:rounded-[48px]`).
 * - Bold sculptural `PORTFOLIO` typography (`font-bold`, interactive per-letter hover physics),
 *   engraved `BY AMDZ` subtitle, and Magnetic `ENTER` aperture release.
 */
export const SplashIntro: React.FC<SplashIntroProps> = ({ onEnter }) => {
  const prefersReducedMotion = useReducedMotion();
  const canHoverFine = useCanHoverFine();
  const enableCursorFx = canHoverFine && !prefersReducedMotion;
  const { pauseScroll, resumeScroll } = useSmoothScroll();
  const [isExiting, setIsExiting] = useState(false);
  const [wibTime, setWibTime] = useState<string>(() => getPurwokertoWibTime());
  const exitingRef = useRef(false);

  const pointerRotRaw = useMotionValue(0);
  const compassRawX = useMotionValue(0);
  const compassRawY = useMotionValue(0);
  const subtitleRawX = useMotionValue(0);
  const subtitleRawY = useMotionValue(0);

  const springCfg = { stiffness: 105, damping: 24, mass: 0.7 };
  const compassRotate = useSpring(pointerRotRaw, springCfg);
  const compassX = useSpring(compassRawX, springCfg);
  const compassY = useSpring(compassRawY, springCfg);
  const subtitleX = useSpring(subtitleRawX, springCfg);
  const subtitleY = useSpring(subtitleRawY, springCfg);

  const triggerEnter = useCallback(() => {
    if (exitingRef.current) return;
    exitingRef.current = true;
    setIsExiting(true);
    onEnter();
  }, [onEnter]);

  useEffect(() => {
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
      resumeScroll();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [pauseScroll, resumeScroll, triggerEnter]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableCursorFx) return;
    const rx = e.clientX / Math.max(1, window.innerWidth) - 0.5;
    const ry = e.clientY / Math.max(1, window.innerHeight) - 0.5;
    pointerRotRaw.set(rx * 10);
    compassRawX.set(rx * 16);
    compassRawY.set(ry * 12);
    subtitleRawX.set(rx * 14);
    subtitleRawY.set(ry * 8);
  };

  const handleMouseLeave = () => {
    if (!enableCursorFx) return;
    pointerRotRaw.set(0);
    compassRawX.set(0);
    compassRawY.set(0);
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
      {/* Layered Warm Lab Dual-Panel Silk Aperture Split Panels */}
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
                  transition: { duration: 0.68, ease: EASE_LUXURY },
                }
          }
          style={{
            background:
              'radial-gradient(ellipse 85% 95% at 50% 100%, rgba(110,79,58,0.28) 0%, rgba(43,29,23,0.92) 55%, #211814 100%)',
          }}
          className="absolute top-0 inset-x-0 h-1/2 bg-[#211814] will-change-transform"
        />
        <motion.div
          initial={{ y: '0%' }}
          exit={
            prefersReducedMotion
              ? { opacity: 0, transition: { duration: 0.2 } }
              : {
                  y: '102%',
                  transition: { duration: 0.68, ease: EASE_LUXURY },
                }
          }
          style={{
            background:
              'radial-gradient(ellipse 85% 95% at 50% 0%, rgba(67,47,36,0.45) 0%, rgba(43,29,23,0.94) 55%, #211814 100%)',
          }}
          className="absolute bottom-0 inset-x-0 h-1/2 bg-[#211814] will-change-transform"
        />
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          exit={
            prefersReducedMotion
              ? { opacity: 0 }
              : {
                  scaleX: [0, 1, 1],
                  opacity: [0, 0.9, 0],
                  transition: { duration: 0.52, ease: EASE_LUXURY },
                }
          }
          className="absolute top-1/2 inset-x-0 -translate-y-1/2 h-px bg-champagne/45 origin-center will-change-[transform,opacity]"
        />
      </div>

      {/* Foreground Warm Atelier Lighting, Curved Frame & Typography Seal */}
      <motion.div
        initial={{ opacity: 1, scale: 1, y: 0 }}
        exit={
          prefersReducedMotion
            ? { opacity: 0, transition: { duration: 0.16 } }
            : {
                opacity: 0,
                scale: 0.96,
                y: -10,
                transition: { duration: 0.24, ease: EASE_LUXURY },
              }
        }
        className="relative z-10 h-full w-full flex flex-col items-center justify-between px-7 sm:px-11 md:px-16 py-9 sm:py-12 md:py-14 will-change-[transform,opacity]"
      >
        {/* Corner Warm Chestnut/Cognac Washes + Center Caramel-Champagne Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div
            style={{
              background:
                'radial-gradient(circle 420px at 14% 16%, rgba(110,79,58,0.34) 0%, rgba(67,47,36,0.14) 48%, transparent 76%)',
            }}
            className="absolute inset-0"
          />
          <div
            style={{
              background:
                'radial-gradient(circle 440px at 86% 84%, rgba(67,47,36,0.42) 0%, rgba(110,79,58,0.18) 46%, transparent 76%)',
            }}
            className="absolute inset-0"
          />
          <div
            style={{
              background:
                'radial-gradient(circle 500px at 40% 42%, rgba(185,141,97,0.22) 0%, rgba(142,107,75,0.10) 46%, transparent 74%)',
            }}
            className="absolute -inset-12 aflan-aurora-a will-change-transform"
          />
          <div
            style={{
              background:
                'radial-gradient(circle 480px at 62% 54%, rgba(223,200,166,0.15) 0%, rgba(185,141,97,0.09) 44%, transparent 74%)',
            }}
            className="absolute -inset-12 aflan-aurora-b will-change-transform"
          />
        </div>

        {/* Curved Architectural Double Hairline Frame */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-3 sm:inset-5 md:inset-7 rounded-[28px] sm:rounded-[38px] md:rounded-[48px] border border-champagne/30 overflow-hidden"
        >
          <span className="absolute top-0 inset-x-10 h-px bg-linear-to-r from-[#8E6B4B]/20 via-[#DFC8A6]/70 to-[#B98D61]/40" />
          <span className="absolute bottom-0 inset-x-10 h-px bg-linear-to-r from-[#B98D61]/40 via-[#DFC8A6]/60 to-[#8E6B4B]/20" />
          <div className="absolute inset-[6px] rounded-[23px] sm:rounded-[33px] md:rounded-[43px] border border-champagne/12" />
        </div>

        {/* Fine Architectural Meridian Crosshairs */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute inset-y-6 left-1/2 -translate-x-1/2 w-px bg-champagne/8" />
          <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 h-px bg-champagne/8" />
        </div>

        {/* Top Micro-Header */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.44, ease: EASE_LUXURY }}
          className="relative z-10 w-full max-w-[1320px] flex items-center justify-between gap-4 font-mono text-[10px] sm:text-[11px] tracking-[0.26em] uppercase"
        >
          <span className="inline-flex items-center gap-2.5 text-champagne/90">
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

        {/* Centered Focal Seal + Counter-Rotating Compass Rings */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto px-1 max-w-full">
          <motion.div
            aria-hidden="true"
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: EASE_LUXURY }}
            style={
              enableCursorFx
                ? { rotate: compassRotate, x: compassX, y: compassY }
                : undefined
            }
            className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[280px] sm:size-[400px] md:size-[460px] flex items-center justify-center will-change-transform"
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
                  stroke="rgba(223,200,166,0.18)"
                  strokeWidth="1"
                  fill="none"
                />
                <line x1="230" y1="0" x2="230" y2="12" stroke="rgba(223,200,166,0.42)" strokeWidth="1" />
                <line x1="230" y1="448" x2="230" y2="460" stroke="rgba(223,200,166,0.42)" strokeWidth="1" />
                <line x1="0" y1="230" x2="12" y2="230" stroke="rgba(223,200,166,0.42)" strokeWidth="1" />
                <line x1="448" y1="230" x2="460" y2="230" stroke="rgba(223,200,166,0.42)" strokeWidth="1" />
                <circle cx="230" cy="6" r="2" fill="rgba(223,200,166,0.52)" />
                <circle cx="230" cy="454" r="2" fill="rgba(223,200,166,0.52)" />
                <circle cx="6" cy="230" r="2" fill="rgba(223,200,166,0.52)" />
                <circle cx="454" cy="230" r="2" fill="rgba(223,200,166,0.52)" />
              </g>
              <g className="aflan-ring-ccw origin-center">
                <circle
                  cx="230"
                  cy="230"
                  r="184"
                  stroke="rgba(185,141,97,0.18)"
                  strokeWidth="1"
                  strokeDasharray="4 7"
                  fill="none"
                />
                <circle cx="100" cy="100" r="1.6" fill="rgba(223,200,166,0.38)" />
                <circle cx="360" cy="100" r="1.6" fill="rgba(223,200,166,0.38)" />
                <circle cx="100" cy="360" r="1.6" fill="rgba(223,200,166,0.38)" />
                <circle cx="360" cy="360" r="1.6" fill="rgba(223,200,166,0.38)" />
              </g>
            </svg>
          </motion.div>

          <motion.span
            aria-hidden="true"
            initial={prefersReducedMotion ? false : { scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.44, delay: 0.05, ease: EASE_LUXURY }}
            className="block w-10 h-px bg-champagne/60 mb-6 origin-center"
          />

          <h1
            aria-label="Portfolio by AMDZ"
            className="relative z-10 flex flex-col items-center max-w-full"
          >
            <span
              aria-hidden="true"
              className="inline-flex items-baseline justify-center py-2 px-1 -my-2 max-w-full"
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
                    duration: 0.46,
                    delay: 0.06 + idx * 0.024,
                    ease: EASE_LUXURY,
                  }}
                  className={`inline-block font-serif font-bold uppercase text-[clamp(2.5rem,6.4vw,5.4rem)] tracking-[0.14em] sm:tracking-[0.18em] leading-[1.12] px-[0.02em] aflan-title-shimmer cursor-default will-change-transform ${
                    enableCursorFx
                      ? 'transition-[filter] duration-300 hover:brightness-125 hover:drop-shadow-[0_6px_16px_rgba(246,241,233,0.34)]'
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
              transition={{ duration: 0.48, delay: 0.16, ease: EASE_LUXURY }}
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
                    ? 'transition-[filter] duration-300 hover:drop-shadow-[0_0_16px_rgba(223,200,166,0.42)]'
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
                  className="pointer-events-none absolute -inset-1.5 rounded-full border border-champagne/32 aflan-breath-halo"
                />
                <button
                  type="button"
                  onClick={triggerEnter}
                  autoFocus
                  data-cursor-label="ENTER"
                  className="group relative overflow-hidden inline-flex items-center justify-center gap-3 min-h-[48px] px-9 py-3.5 rounded-full border border-champagne/55 bg-[#2A1E18]/85 text-ivory font-mono text-xs uppercase tracking-[0.24em] hover:bg-champagne hover:border-champagne hover:text-obsidian active:scale-[0.96] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 aflan-enter-shimmer bg-gradient-to-r from-transparent via-champagne/28 to-transparent"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] bg-gradient-to-r from-transparent via-ivory/25 to-transparent motion-reduce:hidden"
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

        {/* Minimalist Bottom Cue */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.44, delay: 0.26, ease: EASE_LUXURY }}
          className="relative z-10 font-mono text-[10px] tracking-[0.28em] uppercase text-taupe/85"
        >
          PRESS ENTER
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
