import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion';
import { MonogramMark } from '@/components/brand/Monogram';
import { personalData } from '@/data/personal';
import { useCanHoverFine } from '@/hooks/useMediaQuery';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { EASE_LUXURY, EASE_PAGE_ENTER } from '@/utils/motion';

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
 * Auto-Enter Cinematic Warm Atelier Intro Gate:
 * - Zero manual `ENTER` button or `PRESS ENTER` prompt.
 * - Preserves Warm Lab tonal depth, curved double hairline border (`28px / 38px / 48px`),
 *   top `AMDZ` + `PURWOKERTO · WIB` bar, bold `PORTFOLIO`, and engraved `BY AMDZ`.
 * - Executes a calibrated 3-phase auto-entry sequence (~2.2s total; ~0.5s reduced-motion):
 *   1. Arrival (0.0s - 0.75s): curved frame reveal, masked PORTFOLIO letter rise with subtle
 *      tracking settle, and engraved BY AMDZ rise.
 *   2. Breathing Beat & Progress (0.75s - 1.65s): ~140px x 1.5px Champagne-to-Caramel progress
 *      hairline (with silent click/tap/Esc/Enter quick-skip).
 *   3. Fluid Split-Arch Aperture Reveal (1.65s - 2.25s): immediate pointer-events-none + single-shot
 *      Lenis resume, gentle centerpiece upward dissolve, expanding curved frame, and asymmetric warm
 *      dual curtains parting with a Champagne seam sheen.
 */
export const SplashIntro: React.FC<SplashIntroProps> = ({ onEnter }) => {
  const prefersReducedMotion = useReducedMotion();
  const canHoverFine = useCanHoverFine();
  const enableCursorFx = canHoverFine && !prefersReducedMotion;
  const { pauseScroll, resumeScroll } = useSmoothScroll();
  const [isExiting, setIsExiting] = useState(false);
  const [wibTime, setWibTime] = useState<string>(() => getPurwokertoWibTime());
  const exitingRef = useRef(false);
  const scrollReleasedRef = useRef(false);

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

  const releaseScrollOnce = useCallback(() => {
    if (scrollReleasedRef.current) return;
    scrollReleasedRef.current = true;
    resumeScroll();
  }, [resumeScroll]);

  const triggerEnter = useCallback(() => {
    if (exitingRef.current) return;
    exitingRef.current = true;
    setIsExiting(true);
    releaseScrollOnce();
    onEnter();
  }, [onEnter, releaseScrollOnce]);

  useEffect(() => {
    pauseScroll();

    const clockId = window.setInterval(() => {
      setWibTime(getPurwokertoWibTime());
    }, 15000);

    const autoEnterDelayMs = prefersReducedMotion ? 300 : 1620;
    const autoTimerId = window.setTimeout(triggerEnter, autoEnterDelayMs);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
        e.preventDefault();
        triggerEnter();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(autoTimerId);
      window.clearInterval(clockId);
      releaseScrollOnce();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [pauseScroll, prefersReducedMotion, releaseScrollOnce, triggerEnter]);

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
      onClick={triggerEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 1 }}
      exit={
        prefersReducedMotion
          ? { opacity: 0, transition: { duration: 0.18 } }
          : { transition: { duration: 0.6 } }
      }
      className={`fixed inset-0 h-dvh z-[9990] bg-transparent text-ivory overflow-hidden select-none cursor-pointer ${
        isExiting ? 'pointer-events-none' : ''
      }`}
    >
      {/* Asymmetric Warm Lab Dual-Curtain Aperture Split Panels */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <motion.div
          initial={{ y: '0%' }}
          exit={
            prefersReducedMotion
              ? { opacity: 0, transition: { duration: 0.18 } }
              : {
                  y: '-104%',
                  transition: { duration: 0.56, ease: EASE_PAGE_ENTER },
                }
          }
          style={{
            background:
              'radial-gradient(ellipse 85% 95% at 50% 100%, rgba(110,79,58,0.3) 0%, rgba(43,29,23,0.92) 55%, #211814 100%)',
          }}
          className="absolute top-0 inset-x-0 h-[52%] bg-[#211814] will-change-transform"
        />
        <motion.div
          initial={{ y: '0%' }}
          exit={
            prefersReducedMotion
              ? { opacity: 0, transition: { duration: 0.18 } }
              : {
                  y: '104%',
                  transition: { duration: 0.56, ease: EASE_PAGE_ENTER },
                }
          }
          style={{
            background:
              'radial-gradient(ellipse 85% 95% at 50% 0%, rgba(67,47,36,0.46) 0%, rgba(43,29,23,0.94) 55%, #211814 100%)',
          }}
          className="absolute bottom-0 inset-x-0 h-[50%] bg-[#211814] will-change-transform"
        />
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          exit={
            prefersReducedMotion
              ? { opacity: 0 }
              : {
                  scaleX: [0, 1, 1],
                  opacity: [0, 0.95, 0],
                  transition: { duration: 0.46, ease: EASE_LUXURY },
                }
          }
          className="absolute top-[51%] inset-x-0 -translate-y-1/2 h-px bg-linear-to-r from-transparent via-champagne/80 to-transparent origin-center will-change-[transform,opacity]"
        />
      </div>

      {/* Foreground Warm Atelier Lighting, Curved Frame & Frosted Liquid Glass Lens */}
      <motion.div
        initial={{ opacity: 1 }}
        exit={
          prefersReducedMotion
            ? { opacity: 0, transition: { duration: 0.16 } }
            : { opacity: 0, transition: { duration: 0.26, ease: EASE_PAGE_ENTER } }
        }
        className="relative z-10 h-full w-full flex flex-col items-center justify-between px-5 sm:px-10 md:px-16 py-8 sm:py-12 md:py-14 will-change-[opacity]"
      >
        {/* Corner Warm Washes + Orbital Caramel Bronze / Champagne Refraction Light Layers */}
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
          {/* Orbital Glow Arc 1 — Caramel Bronze (#B98D61) behind center-left of glass plaque */}
          <div
            style={{
              background:
                'radial-gradient(ellipse 68% 42% at 38% 44%, rgba(185,141,97,0.38) 0%, rgba(185,141,97,0.16) 44%, transparent 74%)',
            }}
            className="absolute -inset-12 aflan-aurora-a will-change-transform"
          />
          {/* Orbital Glow Arc 2 — Warm Champagne (#DFC8A6) behind center-right of glass plaque */}
          <div
            style={{
              background:
                'radial-gradient(ellipse 62% 40% at 62% 54%, rgba(223,200,166,0.3) 0%, rgba(185,141,97,0.14) 45%, transparent 74%)',
            }}
            className="absolute -inset-12 aflan-aurora-b will-change-transform"
          />
        </div>

        {/* Curved Architectural Double Hairline Frame */}
        <motion.div
          aria-hidden="true"
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={
            prefersReducedMotion
              ? { opacity: 0 }
              : {
                  opacity: 0,
                  scale: 1.05,
                  transition: { duration: 0.36, ease: EASE_PAGE_ENTER },
                }
          }
          transition={{ duration: 0.55, ease: EASE_LUXURY }}
          className="pointer-events-none absolute inset-3 sm:inset-5 md:inset-7 rounded-[28px] sm:rounded-[38px] md:rounded-[48px] border border-champagne/30 overflow-hidden will-change-[transform,opacity]"
        >
          <span className="absolute top-0 inset-x-10 h-px bg-linear-to-r from-[#8E6B4B]/20 via-[#DFC8A6]/70 to-[#B98D61]/40" />
          <span className="absolute bottom-0 inset-x-10 h-px bg-linear-to-r from-[#B98D61]/40 via-[#DFC8A6]/60 to-[#8E6B4B]/20" />
          <div className="absolute inset-[6px] rounded-[23px] sm:rounded-[33px] md:rounded-[43px] border border-champagne/12" />
        </motion.div>

        {/* Fine Architectural Meridian Crosshairs */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute inset-y-6 left-1/2 -translate-x-1/2 w-px bg-champagne/8" />
          <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 h-px bg-champagne/8" />
        </div>

        {/* Top Micro-Header Liquid Glass Pills */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.44, ease: EASE_LUXURY }}
          className="relative z-10 w-full max-w-[1320px] flex items-center justify-between gap-2 sm:gap-4 font-mono text-[10px] sm:text-[11px] tracking-[0.22em] uppercase"
        >
          <span className="glass-liquid-badge inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-champagne">
            <MonogramMark size={20} className="relative z-10 text-champagne shrink-0" />
            <span className="relative z-10">AMDZ</span>
          </span>
          <span className="glass-liquid-badge inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-ivory/85 tabular-nums whitespace-nowrap">
            <span
              aria-hidden="true"
              className="relative z-10 size-1.5 rounded-full bg-champagne animate-pulse motion-reduce:animate-none"
            />
            <span className="relative z-10">PURWOKERTO · {wibTime} WIB</span>
          </span>
        </motion.div>

        {/* Centered Focal Seal: Compass Rings (Behind) + Sculpted Frosted Liquid Glass Plaque (Foreground) */}
        <div className="relative z-10 w-full flex flex-col items-center justify-center text-center my-auto max-w-full">
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
            className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[280px] sm:size-[420px] md:size-[480px] flex items-center justify-center will-change-transform"
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
                  stroke="rgba(223,200,166,0.22)"
                  strokeWidth="1"
                  fill="none"
                />
                <line x1="230" y1="0" x2="230" y2="12" stroke="rgba(223,200,166,0.48)" strokeWidth="1" />
                <line x1="230" y1="448" x2="230" y2="460" stroke="rgba(223,200,166,0.48)" strokeWidth="1" />
                <line x1="0" y1="230" x2="12" y2="230" stroke="rgba(223,200,166,0.48)" strokeWidth="1" />
                <line x1="448" y1="230" x2="460" y2="230" stroke="rgba(223,200,166,0.48)" strokeWidth="1" />
                <circle cx="230" cy="6" r="2" fill="rgba(223,200,166,0.58)" />
                <circle cx="230" cy="454" r="2" fill="rgba(223,200,166,0.58)" />
                <circle cx="6" cy="230" r="2" fill="rgba(223,200,166,0.58)" />
                <circle cx="454" cy="230" r="2" fill="rgba(223,200,166,0.58)" />
              </g>
              <g className="aflan-ring-ccw origin-center">
                <circle
                  cx="230"
                  cy="230"
                  r="184"
                  stroke="rgba(185,141,97,0.24)"
                  strokeWidth="1"
                  strokeDasharray="4 7"
                  fill="none"
                />
                <circle cx="100" cy="100" r="1.6" fill="rgba(223,200,166,0.44)" />
                <circle cx="360" cy="100" r="1.6" fill="rgba(223,200,166,0.44)" />
                <circle cx="100" cy="360" r="1.6" fill="rgba(223,200,166,0.44)" />
                <circle cx="360" cy="360" r="1.6" fill="rgba(223,200,166,0.44)" />
              </g>
            </svg>
          </motion.div>

          {/* Sculpted Frosted Liquid Glass Lens Centerpiece (Zero Nested Blur Inside) */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.97, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={
              prefersReducedMotion
                ? { opacity: 0, transition: { duration: 0.16 } }
                : {
                    opacity: 0,
                    scale: 1.04,
                    y: -14,
                    transition: { duration: 0.3, ease: EASE_PAGE_ENTER },
                  }
            }
            transition={{ duration: 0.56, ease: EASE_LUXURY }}
            className="glass-liquid-lens relative isolate overflow-hidden w-full max-w-[340px] sm:max-w-[540px] md:max-w-[640px] rounded-[28px] sm:rounded-[36px] px-6 py-9 sm:px-14 sm:py-12 md:px-16 md:py-14 flex flex-col items-center justify-center will-change-[transform,opacity]"
          >
            {!prefersReducedMotion && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 z-0 w-32 rounded-[28px] bg-linear-to-r from-transparent via-ivory/22 to-transparent aflan-lens-glint"
              />
            )}

            <motion.span
              aria-hidden="true"
              initial={prefersReducedMotion ? false : { scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.44, delay: 0.05, ease: EASE_LUXURY }}
              className="relative z-10 block w-10 h-px bg-champagne/65 mb-5 sm:mb-6 origin-center"
            />

            <h1
              aria-label="Portfolio by AMDZ"
              className="relative z-10 flex flex-col items-center max-w-full"
            >
              <motion.span
                aria-hidden="true"
                initial={
                  prefersReducedMotion
                    ? false
                    : { letterSpacing: '0.2em' }
                }
                animate={{ letterSpacing: '0.13em' }}
                transition={{ duration: 0.65, ease: EASE_LUXURY }}
                className="inline-flex items-baseline justify-center py-2 px-1 -my-2 max-w-full"
              >
                {PORTFOLIO_LETTERS.map((char, idx) => (
                  <span
                    key={`${char}-${idx}`}
                    className="inline-block overflow-hidden py-1 -my-1"
                  >
                    <motion.span
                      initial={
                        prefersReducedMotion ? false : { opacity: 0, y: '115%' }
                      }
                      animate={{ opacity: 1, y: '0%' }}
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
                        duration: 0.52,
                        delay: 0.06 + idx * 0.028,
                        ease: EASE_LUXURY,
                      }}
                      className={`inline-block font-serif font-bold uppercase text-[clamp(1.85rem,5.6vw,4.75rem)] leading-[1.12] px-[0.02em] aflan-title-shimmer cursor-default will-change-transform ${
                        enableCursorFx
                          ? 'transition-[filter] duration-300 hover:brightness-125 hover:drop-shadow-[0_6px_16px_rgba(246,241,233,0.34)]'
                          : ''
                      }`}
                    >
                      {char}
                    </motion.span>
                  </span>
                ))}
              </motion.span>

              <motion.span
                aria-hidden="true"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.44, delay: 0.34, ease: EASE_LUXURY }}
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

            {/* Phase 2 Precision Progress Hairline */}
            <div
              aria-hidden="true"
              className="relative z-10 mt-7 sm:mt-8 w-[140px] h-[1.5px] rounded-full bg-champagne/20 overflow-hidden"
            >
              <motion.span
                initial={prefersReducedMotion ? { scaleX: 1 } : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: prefersReducedMotion ? 0.24 : 1.42,
                  delay: prefersReducedMotion ? 0 : 0.18,
                  ease: EASE_LUXURY,
                }}
                className="block h-full w-full origin-left bg-linear-to-r from-brass via-champagne to-ivory will-change-transform"
              />
            </div>
          </motion.div>
        </div>

        {/* Calm Atelier Micro-Signature */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.44, delay: 0.28, ease: EASE_LUXURY }}
          className="relative z-10 font-mono text-[10px] tracking-[0.28em] uppercase text-taupe/85"
        >
          AFLAN · DOSSIER
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
