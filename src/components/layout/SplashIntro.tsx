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
import { EASE_LUXURY, EASE_PAGE_ENTER, EASE_PAGE_EXIT } from '@/utils/motion';

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
 * Auto-Enter Full-Stage Frosted Liquid Glass Intro Gate:
 * - Zero manual confirmation button, zero keyboard prompt banner, and zero mini center card.
 * - Restores the open architectural stage where compass rings, meridian hairlines, clean
 *   top/bottom editorial chrome (`AMDZ`, `PURWOKERTO · WIB`, `AFLAN · DOSSIER`), bold
 *   `PORTFOLIO`, `BY AMDZ`, and the 140px progress hairline float freely together.
 * - Strictly 1 blurred surface (`.glass-intro-stage` on the large outer curved frame at `z-10`,
 *   with 0 nested `backdrop-filter` children inside):
 *   - `z-0` (behind glass): semi-translucent Warm Espresso aperture panels letting subtle Hero
 *     depth bleed through + corner chestnut washes + 2 moving Caramel Bronze (`#B98D61`) &
 *     Champagne (`#DFC8A6`) radial refraction glows so `backdrop-filter: blur(24px)` produces
 *     a living frosted diffusion across the entire stage.
 *   - `z-10`: Full-stage `.glass-intro-stage` curved frame (`inset-3 sm:inset-5 md:inset-6`,
 *     `rounded-[28px] sm:rounded-[38px] md:rounded-[48px]`) housing all open typography and
 *     compass geometry cleanly inside.
 * - Snap-free exit: immediately unlocks pointer events & Lenis scroll, dissolves the frosted glass
 *   stage (`opacity: 1 -> 0`, `scale: 1 -> 1.02`, `0.36s`, `EASE_PAGE_EXIT`) with zero outer
 *   opacity stacking while warm curtains smoothly part into the Hero.
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
          : { transition: { duration: 0.56 } }
      }
      className={`fixed inset-0 h-dvh z-[9990] bg-transparent text-ivory overflow-hidden select-none cursor-pointer ${
        isExiting ? 'pointer-events-none' : ''
      }`}
    >
      {/* LAYER z-0 (Outside Glass Stage) — Semi-Translucent Warm Curtains + Living Refraction Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        {/* Top Semi-Translucent Curtain Panel (Lets muted Hero tones subtly inform backdrop blur) */}
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
              'radial-gradient(ellipse 85% 95% at 50% 100%, rgba(92,65,48,0.68) 0%, rgba(39,27,21,0.78) 54%, rgba(28,20,16,0.84) 100%)',
          }}
          className="absolute top-0 inset-x-0 h-[52%] will-change-transform"
        />
        {/* Bottom Semi-Translucent Curtain Panel */}
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
              'radial-gradient(ellipse 85% 95% at 50% 0%, rgba(67,47,36,0.72) 0%, rgba(39,27,21,0.8) 54%, rgba(28,20,16,0.86) 100%)',
          }}
          className="absolute bottom-0 inset-x-0 h-[50%] will-change-transform"
        />
        {/* Champagne Seam Sheen on Split */}
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

        {/* Ambient Refraction Lights Strictly Behind `.glass-intro-stage` (GPU radial gradients only) */}
        <motion.div
          exit={
            prefersReducedMotion
              ? { opacity: 0, transition: { duration: 0.16 } }
              : { opacity: 0, transition: { duration: 0.34, ease: EASE_PAGE_EXIT } }
          }
          className="absolute inset-0 overflow-hidden will-change-[opacity]"
        >
          <div
            style={{
              background:
                'radial-gradient(circle 460px at 14% 16%, rgba(110,79,58,0.44) 0%, rgba(67,47,36,0.18) 50%, transparent 78%)',
            }}
            className="absolute inset-0"
          />
          <div
            style={{
              background:
                'radial-gradient(circle 480px at 86% 84%, rgba(92,65,48,0.48) 0%, rgba(67,47,36,0.2) 48%, transparent 78%)',
            }}
            className="absolute inset-0"
          />
          {/* Moving Light A — Caramel Bronze (#B98D61) */}
          <div
            style={{
              background:
                'radial-gradient(ellipse 66% 48% at 32% 40%, rgba(185,141,97,0.52) 0%, rgba(185,141,97,0.22) 44%, transparent 72%)',
            }}
            className="absolute -inset-12 aflan-aurora-a will-change-transform"
          />
          {/* Moving Light B — Warm Champagne (#DFC8A6) */}
          <div
            style={{
              background:
                'radial-gradient(ellipse 62% 46% at 68% 58%, rgba(223,200,166,0.4) 0%, rgba(185,141,97,0.18) 45%, transparent 72%)',
            }}
            className="absolute -inset-12 aflan-aurora-b will-change-transform"
          />
          {/* Warm Horizon Ribbon behind center to accentuate optical glass refraction */}
          <div
            style={{
              background:
                'linear-gradient(118deg, transparent 18%, rgba(223,200,166,0.14) 46%, rgba(185,141,97,0.18) 54%, transparent 82%)',
            }}
            className="absolute inset-0"
          />
        </motion.div>
      </div>

      {/* LAYER z-10 — Single Full-Stage Frosted Liquid Glass Outer Curved Box (0 Nested Blurs Inside) */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.985 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={
          prefersReducedMotion
            ? { opacity: 0, transition: { duration: 0.18 } }
            : {
                opacity: 0,
                scale: 1.02,
                transition: { duration: 0.36, ease: EASE_PAGE_EXIT },
              }
        }
        transition={{ duration: 0.52, ease: EASE_LUXURY }}
        className="glass-intro-stage absolute inset-3 sm:inset-5 md:inset-6 z-10 isolate rounded-[28px] sm:rounded-[38px] md:rounded-[48px] flex flex-col items-center justify-between px-4 sm:px-8 md:px-12 py-6 sm:py-8 md:py-9 overflow-hidden will-change-[transform,opacity]"
      >
        {/* Subtle Inner Architectural Frame Hairlines & Meridians */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        >
          <span className="absolute top-0 inset-x-10 h-px bg-linear-to-r from-[#8E6B4B]/20 via-[#DFC8A6]/65 to-[#B98D61]/35" />
          <span className="absolute bottom-0 inset-x-10 h-px bg-linear-to-r from-[#B98D61]/35 via-[#DFC8A6]/55 to-[#8E6B4B]/20" />
          <div className="absolute inset-[6px] sm:inset-[8px] rounded-[22px] sm:rounded-[31px] md:rounded-[40px] border border-[#DFC8A6]/14" />
          <div className="absolute inset-y-6 left-1/2 -translate-x-1/2 w-px bg-champagne/8" />
          <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 h-px bg-champagne/8" />
        </div>

        {/* Clean Editorial Corner Header (0 blur / 0 nested backdrop-filter) */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.44, ease: EASE_LUXURY }}
          className="relative z-10 w-full max-w-[1320px] flex items-center justify-between gap-4 font-mono text-[10px] sm:text-[11px] tracking-[0.24em] uppercase"
        >
          <span className="inline-flex items-center gap-2.5 text-champagne">
            <MonogramMark size={22} className="text-champagne shrink-0" />
            <span>AMDZ</span>
          </span>
          <span className="inline-flex items-center gap-2 text-ivory/85 tabular-nums whitespace-nowrap">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-champagne animate-pulse motion-reduce:animate-none"
            />
            <span>PURWOKERTO · {wibTime} WIB</span>
          </span>
        </motion.div>

        {/* Open Centerpiece — Uncluttered Typography Floating Over Counter-Rotating Compass Rings */}
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
                  stroke="rgba(185,141,97,0.26)"
                  strokeWidth="1"
                  strokeDasharray="4 7"
                  fill="none"
                />
                <circle cx="100" cy="100" r="1.6" fill="rgba(223,200,166,0.46)" />
                <circle cx="360" cy="100" r="1.6" fill="rgba(223,200,166,0.46)" />
                <circle cx="100" cy="360" r="1.6" fill="rgba(223,200,166,0.46)" />
                <circle cx="360" cy="360" r="1.6" fill="rgba(223,200,166,0.46)" />
              </g>
            </svg>
          </motion.div>

          <h1
            aria-label="Portfolio by AMDZ"
            className="relative z-10 flex flex-col items-center max-w-full"
          >
            <motion.span
              aria-hidden="true"
              initial={
                prefersReducedMotion
                  ? false
                  : { letterSpacing: '0.24em' }
              }
              animate={{ letterSpacing: '0.16em' }}
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
                    className={`inline-block font-serif font-bold uppercase text-[clamp(2.1rem,6.4vw,5.4rem)] leading-[1.12] px-[0.02em] aflan-title-shimmer cursor-default will-change-transform ${
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
            className="relative z-10 mt-8 sm:mt-9 w-[140px] h-[1.5px] rounded-full bg-champagne/20 overflow-hidden"
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
        </div>

        {/* Calm Atelier Micro-Signature */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.44, delay: 0.28, ease: EASE_LUXURY }}
          className="relative z-10 font-mono text-[10px] tracking-[0.28em] uppercase text-taupe/90"
        >
          AFLAN · DOSSIER
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
