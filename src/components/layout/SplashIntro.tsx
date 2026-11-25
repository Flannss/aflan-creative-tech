import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { MonogramMark } from '@/components/brand/Monogram';
import { KineticLabel } from '@/components/motion/KineticLabel';
import { personalData } from '@/data/personal';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { EASE_LUXURY } from '@/utils/motion';
import { prefetchRoute } from '@/utils/routePrefetch';

interface SplashIntroProps {
  onEnter: (targetPath?: string) => void;
}

const SPATIAL_EXIT_EASE = [0.76, 0, 0.24, 1] as const;

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
 * Interactive Architectural Matrix Intro Gate (`brand.dropbox.com` modular tiles ×
 * `eszterbial.com` open spatial choreography) crafted strictly in Espresso–Champagne–Ivory.
 * - Zero `<canvas>` loops and zero SVG `<feTurbulence>` filters.
 * - Desktop: 3×3 asymmetric hairline matrix with live WIB readout and direct chapter tiles.
 * - Tablet / Mobile: crisp full-viewport `100dvh` cover + compact 2×2 shortcut matrix without scroll.
 * - Exit: surrounding tiles glide radially outward while center cell expands smoothly (`~0.58s`).
 */
export const SplashIntro: React.FC<SplashIntroProps> = ({ onEnter }) => {
  const prefersReducedMotion = useReducedMotion();
  const { pauseScroll, resumeScroll } = useSmoothScroll();
  const [isExiting, setIsExiting] = useState(false);
  const [wibTime, setWibTime] = useState<string>(() => getPurwokertoWibTime());
  const exitingRef = useRef(false);

  const triggerEnter = useCallback(
    (targetPath?: string) => {
      if (exitingRef.current) return;
      exitingRef.current = true;
      setIsExiting(true);
      onEnter(targetPath);
    },
    [onEnter],
  );

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

  const tileExit = (x: string, y: string) =>
    prefersReducedMotion
      ? { opacity: 0, transition: { duration: 0.2 } }
      : {
          x,
          y,
          scale: 0.94,
          opacity: 0,
          transition: { duration: 0.56, ease: SPATIAL_EXIT_EASE },
        };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Pembuka Portofolio AFLAN"
      initial={{ opacity: 1 }}
      exit={
        prefersReducedMotion
          ? { opacity: 0, transition: { duration: 0.2 } }
          : { opacity: 0, transition: { duration: 0.6 } }
      }
      className={`fixed inset-0 h-dvh z-[9990] bg-[#1A1412] text-ivory overflow-hidden select-none ${
        isExiting ? 'pointer-events-none' : ''
      }`}
    >
      {/* Lightweight Static Warm Studio Gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 62% at 50% 48%, rgba(216,195,165,0.10) 0%, rgba(138,109,75,0.04) 44%, rgba(10,8,7,0.45) 100%)',
        }}
      />

      {/* DESKTOP MODULAR ARCHITECTURAL MATRIX (>= 1024px) */}
      <div className="relative z-10 hidden lg:grid lg:grid-cols-[1fr_minmax(420px,1.55fr)_1fr] lg:grid-rows-[1fr_minmax(320px,1.55fr)_1fr] h-full w-full">
        {/* Cell [1,1] — Top-Left Shortcut: Selected Works */}
        <motion.button
          type="button"
          onMouseEnter={() => prefetchRoute('/projects')}
          onFocus={() => prefetchRoute('/projects')}
          onTouchStart={() => prefetchRoute('/projects')}
          onClick={() => triggerEnter('/projects')}
          exit={tileExit('-6%', '-8%')}
          initial={prefersReducedMotion ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05, ease: EASE_LUXURY }}
          data-cursor-label="PROJECTS"
          className="group relative border-b border-r border-champagne/12 p-6 xl:p-8 flex flex-col justify-between text-left bg-transparent hover:bg-[#211A17] transition-colors duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-champagne"
        >
          <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.22em] uppercase text-champagne/80">
            <span>01 · SELECTED WORKS</span>
            <ArrowUpRight
              className="size-3.5 text-taupe group-hover:text-champagne group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
              aria-hidden="true"
            />
          </div>

          <div className="my-auto py-3">
            <svg
              aria-hidden="true"
              viewBox="0 0 88 28"
              className="w-20 h-7 text-champagne/45 group-hover:text-champagne transition-colors duration-300"
            >
              <rect
                x="1"
                y="4"
                width="22"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
              <rect
                x="31"
                y="4"
                width="22"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
              <rect
                x="61"
                y="4"
                width="22"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
            </svg>
          </div>

          <div className="space-y-1">
            <p className="font-serif text-xl font-light text-ivory group-hover:text-champagne transition-colors">
              Arsip Studi Kasus
            </p>
            <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-taupe">
              SATURUANG · SOMASII · ASIS NDA
            </p>
          </div>
        </motion.button>

        {/* Cell [1,2] — Top-Center Identity Crest */}
        <motion.div
          exit={tileExit('0%', '-10%')}
          initial={prefersReducedMotion ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08, ease: EASE_LUXURY }}
          className="border-b border-r border-champagne/12 px-8 py-6 flex flex-col items-center justify-center text-center gap-2.5"
        >
          <span className="inline-flex items-center gap-2.5 font-mono text-[11px] tracking-[0.26em] uppercase text-champagne">
            <MonogramMark size={24} className="text-champagne" />
            <span>AFLAN</span>
          </span>
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-taupe">
            WEB DEVELOPER · UI ENGINEER · SOFTWARE QA
          </p>
        </motion.div>

        {/* Cell [1,3] — Top-Right Live Purwokerto Clock & Coordinates */}
        <motion.div
          exit={tileExit('6%', '-8%')}
          initial={prefersReducedMotion ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: EASE_LUXURY }}
          className="border-b border-champagne/12 p-6 xl:p-8 flex flex-col justify-between text-right"
        >
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-taupe">
            PURWOKERTO · ID
          </span>
          <div className="my-auto">
            <p className="font-serif text-3xl xl:text-4xl font-light text-champagne tabular-nums">
              {wibTime} <span className="text-sm font-mono tracking-[0.2em]">WIB</span>
            </p>
          </div>
          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-taupe">
            {personalData.coordinates}
          </span>
        </motion.div>

        {/* Cell [2,1] — Middle-Left Shortcut: Creative Lab */}
        <motion.button
          type="button"
          onMouseEnter={() => prefetchRoute('/lab')}
          onFocus={() => prefetchRoute('/lab')}
          onTouchStart={() => prefetchRoute('/lab')}
          onClick={() => triggerEnter('/lab')}
          exit={tileExit('-8%', '0%')}
          initial={prefersReducedMotion ? false : { opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.12, ease: EASE_LUXURY }}
          data-cursor-label="OPEN LAB"
          className="group relative border-b border-r border-champagne/12 p-6 xl:p-8 flex flex-col justify-between text-left bg-transparent hover:bg-[#211A17] transition-colors duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-champagne"
        >
          <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.22em] uppercase text-champagne/80">
            <span>02 · CREATIVE LAB</span>
            <ArrowUpRight
              className="size-3.5 text-taupe group-hover:text-champagne group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
              aria-hidden="true"
            />
          </div>

          <div className="my-auto py-3">
            <svg
              aria-hidden="true"
              viewBox="0 0 88 36"
              className="w-22 h-9 text-champagne/50 group-hover:text-champagne transition-colors duration-300"
            >
              <path
                d="M 4 30 C 22 30, 32 6, 84 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
              />
              <circle cx="4" cy="30" r="2.2" fill="currentColor" />
              <circle cx="84" cy="6" r="2.2" fill="currentColor" />
            </svg>
          </div>

          <div className="space-y-1">
            <p className="font-serif text-xl font-light text-ivory group-hover:text-champagne transition-colors">
              Interactive Visual Systems
            </p>
            <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-taupe">
              09 MODULES · MOTION WORKBENCH
            </p>
          </div>
        </motion.button>

        {/* Cell [2,2] — CENTER PRIMARY HERO ENTRY */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={
            prefersReducedMotion
              ? { opacity: 0, transition: { duration: 0.2 } }
              : {
                  scale: 1.08,
                  opacity: 0,
                  transition: { duration: 0.56, ease: SPATIAL_EXIT_EASE },
                }
          }
          transition={{ duration: 0.5, delay: 0.04, ease: EASE_LUXURY }}
          className="relative border-b border-r border-champagne/18 p-8 xl:p-12 flex flex-col items-center justify-center text-center bg-[#211A17]/40 will-change-[transform,opacity]"
        >
          <span
            aria-hidden="true"
            className="block w-12 h-px bg-champagne/45 mb-6"
          />

          <h1 aria-label="Portfolio by AMDZ" className="flex flex-col items-center">
            <span
              aria-hidden="true"
              className="block font-serif font-light uppercase text-6xl xl:text-7xl tracking-[0.06em] leading-none text-ivory"
            >
              PORTFOLIO
            </span>
            <span
              aria-hidden="true"
              className="block font-serif italic font-medium uppercase tracking-[0.14em] text-engraved-champagne text-3xl xl:text-4xl mt-3 leading-none select-none"
            >
              BY AMDZ
            </span>
          </h1>

          <span
            aria-hidden="true"
            className="block w-12 h-px bg-champagne/45 my-6"
          />

          <button
            type="button"
            onClick={() => triggerEnter()}
            autoFocus
            data-cursor-label="ENTER"
            className="group inline-flex items-center justify-center gap-3 min-h-[44px] px-8 py-3.5 rounded-full border border-champagne/45 bg-[#1A1412]/80 text-ivory font-mono text-xs uppercase tracking-[0.22em] hover:bg-champagne hover:border-champagne hover:text-obsidian active:scale-[0.97] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne"
          >
            <KineticLabel>MASUK / ENTER</KineticLabel>
            <ArrowUpRight
              className="size-4 text-champagne transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-obsidian group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none"
              aria-hidden="true"
            />
          </button>
        </motion.div>

        {/* Cell [2,3] — Middle-Right Shortcut: Journey Timeline */}
        <motion.button
          type="button"
          onMouseEnter={() => prefetchRoute('/journey')}
          onFocus={() => prefetchRoute('/journey')}
          onTouchStart={() => prefetchRoute('/journey')}
          onClick={() => triggerEnter('/journey')}
          exit={tileExit('8%', '0%')}
          initial={prefersReducedMotion ? false : { opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.14, ease: EASE_LUXURY }}
          data-cursor-label="JOURNEY"
          className="group relative border-b border-champagne/12 p-6 xl:p-8 flex flex-col justify-between text-right bg-transparent hover:bg-[#211A17] transition-colors duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-champagne"
        >
          <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.22em] uppercase text-champagne/80">
            <ArrowUpRight
              className="size-3.5 text-taupe group-hover:text-champagne group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
              aria-hidden="true"
            />
            <span>03 · JOURNEY</span>
          </div>

          <div className="my-auto py-3 flex justify-end">
            <svg
              aria-hidden="true"
              viewBox="0 0 88 28"
              className="w-20 h-7 text-champagne/45 group-hover:text-champagne transition-colors duration-300"
            >
              <line
                x1="4"
                y1="14"
                x2="84"
                y2="14"
                stroke="currentColor"
                strokeWidth="1"
              />
              <circle cx="16" cy="14" r="2.5" fill="currentColor" />
              <circle cx="48" cy="14" r="2.5" fill="currentColor" />
              <circle cx="76" cy="14" r="3" fill="currentColor" />
            </svg>
          </div>

          <div className="space-y-1">
            <p className="font-serif text-xl font-light text-ivory group-hover:text-champagne transition-colors">
              Linimasa &amp; Magang
            </p>
            <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-taupe">
              PUSKOMEDIA · AMIKOM · GT
            </p>
          </div>
        </motion.button>

        {/* Cell [3,1] — Bottom-Left Factual Studio & Intern Roles */}
        <motion.div
          exit={tileExit('-6%', '8%')}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.16, ease: EASE_LUXURY }}
          className="border-r border-champagne/12 p-6 xl:p-8 flex flex-col justify-between"
        >
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-champagne/80">
            SATURUANG · ROLE
          </span>
          <div className="space-y-1">
            <p className="font-serif text-lg text-ivory">
              Co-Founder · SatuRuangCreative
            </p>
            <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-taupe">
              PROGRAMMER INTERN QA · {personalData.studyProgram}
            </p>
          </div>
        </motion.div>

        {/* Cell [3,2] — Bottom-Center Colophon */}
        <motion.div
          exit={tileExit('0%', '10%')}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.18, ease: EASE_LUXURY }}
          className="border-r border-champagne/12 px-8 py-6 flex flex-col items-center justify-center text-center gap-1.5 font-mono text-[10px] tracking-[0.22em] uppercase"
        >
          <span className="text-taupe">DOSSIER DIGITAL PERSONAL</span>
          <span className="text-champagne/75">TEKAN ENTER UNTUK MASUK</span>
        </motion.div>

        {/* Cell [3,3] — Bottom-Right Shortcut: Honors & Credentials */}
        <motion.button
          type="button"
          onMouseEnter={() => prefetchRoute('/achievements')}
          onFocus={() => prefetchRoute('/achievements')}
          onTouchStart={() => prefetchRoute('/achievements')}
          onClick={() => triggerEnter('/achievements')}
          exit={tileExit('6%', '8%')}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2, ease: EASE_LUXURY }}
          data-cursor-label="HONORS"
          className="group relative p-6 xl:p-8 flex flex-col justify-between text-right bg-transparent hover:bg-[#211A17] transition-colors duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-champagne"
        >
          <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.22em] uppercase text-champagne/80">
            <ArrowUpRight
              className="size-3.5 text-taupe group-hover:text-champagne group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
              aria-hidden="true"
            />
            <span>04 · HONORS</span>
          </div>
          <div className="space-y-1">
            <p className="font-serif text-lg text-ivory group-hover:text-champagne transition-colors">
              CCNA Cisco &amp; Jurnal JPMBA
            </p>
            <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-taupe">
              JUL 2026 · GARUDA OKT 2026
            </p>
          </div>
        </motion.button>
      </div>

      {/* MOBILE & TABLET MATRIX LAYOUT (< 1024px) — Guaranteed 100dvh, Zero Scroll */}
      <div className="relative z-10 lg:hidden flex flex-col justify-between h-full w-full">
        {/* Top Crest Bar */}
        <motion.div
          exit={tileExit('0%', '-10%')}
          className="flex items-center justify-between gap-3 px-5 py-4 border-b border-champagne/15 font-mono text-[10px] tracking-[0.22em] uppercase"
        >
          <span className="inline-flex items-center gap-2 text-champagne">
            <MonogramMark size={22} className="text-champagne" />
            <span>AFLAN</span>
          </span>
          <span className="text-taupe tabular-nums">
            PURWOKERTO · {wibTime} WIB
          </span>
        </motion.div>

        {/* Center Primary Cell */}
        <motion.div
          exit={
            prefersReducedMotion
              ? { opacity: 0, transition: { duration: 0.2 } }
              : {
                  scale: 1.06,
                  opacity: 0,
                  transition: { duration: 0.52, ease: SPATIAL_EXIT_EASE },
                }
          }
          className="flex-1 flex flex-col items-center justify-center text-center px-6 py-4"
        >
          <span aria-hidden="true" className="block w-10 h-px bg-champagne/40 mb-5" />
          <h1 aria-label="Portfolio by AMDZ" className="flex flex-col items-center">
            <span
              aria-hidden="true"
              className="block font-serif font-light uppercase text-[2.65rem] sm:text-6xl tracking-[0.06em] leading-none text-ivory"
            >
              PORTFOLIO
            </span>
            <span
              aria-hidden="true"
              className="block font-serif italic font-medium uppercase tracking-[0.14em] text-engraved-champagne text-xl sm:text-3xl mt-2.5 leading-none select-none"
            >
              BY AMDZ
            </span>
          </h1>
          <span aria-hidden="true" className="block w-10 h-px bg-champagne/40 my-5" />
          <p className="font-mono text-[10px] sm:text-xs tracking-[0.18em] uppercase text-taupe max-w-xs sm:max-w-md leading-relaxed">
            WEB DEVELOPER · UI ENGINEER · SOFTWARE QA
          </p>
          <button
            type="button"
            onClick={() => triggerEnter()}
            className="mt-7 inline-flex items-center justify-center gap-2.5 min-h-[44px] px-7 py-3 rounded-full border border-champagne/45 bg-[#211A17]/80 text-ivory font-mono text-xs uppercase tracking-[0.2em] hover:bg-champagne hover:text-obsidian active:scale-[0.97] transition-all cursor-pointer"
          >
            <span>MASUK / ENTER</span>
            <ArrowUpRight className="size-4 text-champagne" aria-hidden="true" />
          </button>
        </motion.div>

        {/* Bottom 2x2 Quick Matrix Shortcuts */}
        <motion.div
          exit={tileExit('0%', '12%')}
          className="grid grid-cols-2 border-t border-champagne/15 divide-x divide-champagne/12"
        >
          {[
            { path: '/projects', index: '01', label: 'Projects' },
            { path: '/lab', index: '02', label: 'Creative Lab' },
            { path: '/journey', index: '03', label: 'Journey' },
            { path: '/achievements', index: '04', label: 'Honors' },
          ].map((tile, idx) => (
            <button
              key={tile.path}
              type="button"
              onTouchStart={() => prefetchRoute(tile.path)}
              onClick={() => triggerEnter(tile.path)}
              className={`min-h-[48px] px-4 py-3 flex items-center justify-between gap-2 text-left bg-[#1A1412] active:bg-[#211A17] transition-colors ${
                idx < 2 ? 'border-b border-champagne/12' : ''
              }`}
            >
              <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-champagne truncate">
                {tile.index} · {tile.label}
              </span>
              <ArrowUpRight className="size-3.5 shrink-0 text-taupe" aria-hidden="true" />
            </button>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};
