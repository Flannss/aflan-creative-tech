import React, { useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion';
import { MonogramMark } from '@/components/brand/Monogram';
import { Reveal } from '@/components/motion/Reveal';
import { TextReveal } from '@/components/motion/TextReveal';
import { useCanHoverFine } from '@/hooks/useMediaQuery';
import { EASE_LUXURY } from '@/utils/motion';

interface BrandPillar {
  id: 'A' | 'M' | 'DZ';
  code: string;
  title: string;
  tag: string;
  diagramLabel: string;
  description: string;
}

const BRAND_PILLARS: readonly BrandPillar[] = [
  {
    id: 'A',
    code: '01',
    title: 'A · Architecture',
    tag: 'SYSTEM STRUCTURE',
    diagramLabel: 'ORTHOGONAL STRUCTURAL GRID',
    description:
      'Struktur kode yang bersih, terukur, dan skalabel dari fondasi hingga antarmuka—menjaga modularitas React, TypeScript, dan skema komponen agar tetap ringan dirawat.',
  },
  {
    id: 'M',
    code: '02',
    title: 'M · Motion & Craft',
    tag: 'EDITORIAL KINEMATICS',
    diagramLabel: 'HARMONIC ORBITAL CURVES',
    description:
      'Kehalusan detail visual, ritme tipografi serif–mono, serta interaksi GPU 60fps yang terasa manusiawi tanpa mengorbankan kejelasan membaca.',
  },
  {
    id: 'DZ',
    code: '03',
    title: 'DZ · Discipline & Zero-Compromise',
    tag: 'DETERMINISTIC QA',
    diagramLabel: 'CALIBRATION & ZERO-DEFECT FRAME',
    description:
      'Ketelitian Software QA, verifikasi edge-case lintas viewport, kepatuhan aksesibilitas, dan konsistensi eksekusi di setiap produk yang dirilis.',
  },
] as const;

/**
 * Interactive `AMDZ` Monogram Atelier & Philosophy Spread:
 * - Warm paper linear blend (`#F4EEE4 -> #EAE0D0`) for gentle editorial light contrast.
 * - Left living architectural diagram transforms dynamically depending on active pillar:
 *   - `A`: structural grid lines illuminate,
 *   - `M`: kinetic orbital curves & dots illuminate,
 *   - `DZ`: calibration corner brackets & precision crosshair illuminate.
 * - Desktop cursor spotlight illuminates the Velvet Mocha–Chestnut stage without heavy blur.
 */
export const AmdzBrandPhilosophy: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const canHoverFine = useCanHoverFine();
  const enableSpotlight = canHoverFine && !prefersReducedMotion;

  const [activeId, setActiveId] = useState<'A' | 'M' | 'DZ'>('A');
  const [plateHovered, setPlateHovered] = useState(false);

  const pctX = useMotionValue(50);
  const pctY = useMotionValue(50);
  const smoothX = useSpring(pctX, { stiffness: 150, damping: 24 });
  const smoothY = useSpring(pctY, { stiffness: 150, damping: 24 });
  const stageSpotlight = useMotionTemplate`radial-gradient(280px circle at ${smoothX}% ${smoothY}%, rgba(223,201,168,0.18) 0%, rgba(176,135,94,0.08) 46%, transparent 74%)`;

  const activePillar =
    BRAND_PILLARS.find((p) => p.id === activeId) ?? BRAND_PILLARS[0];

  const handleStageMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!enableSpotlight) return;
    const rect = e.currentTarget.getBoundingClientRect();
    pctX.set(((e.clientX - rect.left) / Math.max(1, rect.width)) * 100);
    pctY.set(((e.clientY - rect.top) / Math.max(1, rect.height)) * 100);
  };

  return (
    <section
      aria-label="Filosofi Logo Brand AMDZ"
      className="bg-warm-paper relative text-obsidian py-16 sm:py-24 lg:py-28 px-5 md:px-8 lg:px-12 border-y border-bronze/25 overflow-x-clip"
    >
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Interactive `AMDZ` Monogram Atelier Stage */}
        <Reveal variant="clip" className="lg:col-span-5">
          <button
            type="button"
            onClick={() => {
              const order: Array<'A' | 'M' | 'DZ'> = ['A', 'M', 'DZ'];
              setActiveId(order[(order.indexOf(activeId) + 1) % order.length]);
            }}
            onMouseMove={handleStageMouseMove}
            onMouseEnter={() => setPlateHovered(true)}
            onMouseLeave={() => setPlateHovered(false)}
            aria-label="Ganti diagram filosofi monogram AMDZ"
            style={{
              background:
                'linear-gradient(145deg, #2A1E18 0%, #3A271D 52%, #1D1511 100%)',
            }}
            className="group relative w-full text-left text-ivory border border-brass/40 hover:border-champagne/75 p-6 sm:p-8 lg:p-9 transition-colors duration-500 overflow-hidden cursor-pointer shadow-[0_24px_60px_rgba(25,19,16,0.22)] focus-visible:outline-2 focus-visible:outline-bronze"
          >
            {enableSpotlight && (
              <motion.div
                aria-hidden="true"
                style={{ background: stageSpotlight }}
                animate={{ opacity: plateHovered ? 1 : 0 }}
                transition={{ duration: 0.3, ease: EASE_LUXURY }}
                className="pointer-events-none absolute inset-0 z-10"
              />
            )}

            {/* Header Metadata */}
            <div className="relative z-20 flex items-center justify-between gap-3 font-mono text-[10px] tracking-[0.22em] uppercase">
              <span className="text-champagne">ATELIER DIAGRAM · AMDZ</span>
              <span className="text-brass tabular-nums">
                {activePillar.code} · {activePillar.id}
              </span>
            </div>

            {/* Reactive Blueprint & Geometric Stage */}
            <div className="relative z-20 my-7 sm:my-9 aspect-4/3 flex items-center justify-center border border-champagne/20 bg-obsidian/55 overflow-hidden">
              {/* Giant Subtle Engraved Watermark behind Monogram */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute font-masthead text-[5.5rem] sm:text-[6.5rem] tracking-[0.1em] leading-none text-champagne/[0.045] select-none"
              >
                AMDZ
              </span>

              {/* Dynamic SVG Construction Geometry */}
              <svg
                viewBox="0 0 280 210"
                className="pointer-events-none absolute inset-0 w-full h-full"
                aria-hidden="true"
              >
                {/* Mode A: Orthogonal Blueprint Grid */}
                <g
                  className="transition-opacity duration-500"
                  style={{ opacity: activeId === 'A' ? 0.92 : 0.22 }}
                >
                  <line x1="140" y1="8" x2="140" y2="202" stroke="#DFC9A8" strokeWidth="1" strokeDasharray="3 4" />
                  <line x1="16" y1="105" x2="264" y2="105" stroke="#DFC9A8" strokeWidth="1" strokeDasharray="3 4" />
                  <rect x="64" y="34" width="152" height="142" fill="none" stroke="#B0875E" strokeWidth="1" strokeOpacity="0.65" />
                  <line x1="64" y1="70" x2="216" y2="70" stroke="#DFC9A8" strokeWidth="0.6" strokeOpacity="0.5" />
                  <line x1="64" y1="140" x2="216" y2="140" stroke="#DFC9A8" strokeWidth="0.6" strokeOpacity="0.5" />
                </g>

                {/* Mode M: Kinetic Orbital Curves */}
                <g
                  className="transition-opacity duration-500"
                  style={{ opacity: activeId === 'M' ? 0.95 : 0.2 }}
                >
                  <circle cx="140" cy="105" r="76" fill="none" stroke="#DFC9A8" strokeWidth="1" strokeDasharray="4 6" />
                  <circle cx="140" cy="105" r="54" fill="none" stroke="#B0875E" strokeWidth="1.2" />
                  <path d="M 32 145 Q 140 22 248 68" fill="none" stroke="#DFC9A8" strokeWidth="0.9" strokeOpacity="0.7" />
                  <circle cx="140" cy="29" r="3" fill="#DFC9A8" />
                  <circle cx="194" cy="105" r="2.5" fill="#B0875E" />
                </g>

                {/* Mode DZ: Precision Calibration Corner Brackets */}
                <g
                  className="transition-opacity duration-500"
                  style={{ opacity: activeId === 'DZ' ? 0.95 : 0.22 }}
                >
                  <path d="M 44 48 L 44 26 L 68 26" fill="none" stroke="#DFC9A8" strokeWidth="1.4" />
                  <path d="M 236 48 L 236 26 L 212 26" fill="none" stroke="#DFC9A8" strokeWidth="1.4" />
                  <path d="M 44 162 L 44 184 L 68 184" fill="none" stroke="#DFC9A8" strokeWidth="1.4" />
                  <path d="M 236 162 L 236 184 L 212 184" fill="none" stroke="#DFC9A8" strokeWidth="1.4" />
                  <circle cx="44" cy="26" r="2" fill="#B0875E" />
                  <circle cx="236" cy="26" r="2" fill="#B0875E" />
                  <circle cx="44" cy="184" r="2" fill="#B0875E" />
                  <circle cx="236" cy="184" r="2" fill="#B0875E" />
                </g>
              </svg>

              <motion.div
                animate={
                  prefersReducedMotion
                    ? undefined
                    : { scale: activeId === 'M' ? 1.04 : 1 }
                }
                transition={{ duration: 0.45, ease: EASE_LUXURY }}
                className="relative z-10 flex items-center justify-center p-4"
              >
                <MonogramMark
                  size={112}
                  className="text-champagne drop-shadow-[0_10px_28px_rgba(25,19,16,0.65)] transition-transform duration-500 group-hover:scale-105"
                />
              </motion.div>
            </div>

            {/* Active Diagram Caption Footer */}
            <div className="relative z-20 flex items-center justify-between gap-4 pt-3 border-t border-champagne/20 font-mono text-[10px] tracking-[0.18em] uppercase">
              <span className="text-ivory/90 truncate">
                {activePillar.diagramLabel}
              </span>
              <span className="text-champagne shrink-0">{activePillar.tag}</span>
            </div>
          </button>
        </Reveal>

        {/* Right Interactive Philosophy Breakdown */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-4">
            <p className="font-mono text-[10px] sm:text-xs tracking-[0.22em] uppercase font-medium text-bronze">
              BRAND PHILOSOPHY · IDENTITY MARK
            </p>
            <TextReveal
              as="h2"
              className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight leading-[1.08] text-obsidian"
              lines={[
                <>
                  Makna Monogram <span className="italic text-mocha">AMDZ</span>
                </>,
              ]}
            />
            <p className="font-sans text-sm sm:text-base text-obsidian/80 leading-relaxed max-w-2xl">
              Lahir dari inisial <strong className="font-medium text-obsidian">Aflan Mu&apos;afa Dzulfiqar</strong>,
              monogram <span className="font-mono text-xs tracking-widest uppercase text-mocha">AMDZ</span>{' '}
              merangkum standar kerja rekayasa perangkat lunak, kehalusan visual, dan disiplin kualitas yang terukur.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Tiga pilar filosofi brand AMDZ"
            className="border-y border-bronze/25 divide-y divide-bronze/20"
          >
            {BRAND_PILLARS.map((pillar) => {
              const active = pillar.id === activeId;
              return (
                <div key={pillar.id} className="group/pillar">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveId(pillar.id)}
                    onMouseEnter={() => setActiveId(pillar.id)}
                    className={`w-full min-h-[56px] py-4 sm:py-5 px-2 sm:px-3 flex items-center justify-between gap-4 text-left transition-colors cursor-pointer ${
                      active ? 'bg-ivory/75' : 'hover:bg-ivory/40'
                    }`}
                  >
                    <div className="flex items-baseline gap-3.5 sm:gap-5 min-w-0">
                      <span
                        className={`font-mono text-[11px] tracking-[0.22em] shrink-0 transition-colors ${
                          active ? 'text-mocha font-medium' : 'text-bronze'
                        }`}
                      >
                        {pillar.code}
                      </span>
                      <span
                        className={`font-serif text-xl sm:text-2xl lg:text-[1.75rem] font-light leading-snug transition-all duration-300 ${
                          active
                            ? 'text-obsidian italic translate-x-1'
                            : 'text-obsidian/80 group-hover/pillar:text-mocha'
                        }`}
                      >
                        {pillar.title}
                      </span>
                    </div>

                    <span
                      className={`font-mono text-[9px] sm:text-[10px] tracking-[0.2em] uppercase shrink-0 ${
                        active ? 'text-mocha' : 'text-bronze/75'
                      }`}
                    >
                      {pillar.tag}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {active && (
                      <motion.div
                        initial={
                          prefersReducedMotion
                            ? { opacity: 1 }
                            : { height: 0, opacity: 0 }
                        }
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={
                          prefersReducedMotion
                            ? { opacity: 0 }
                            : { height: 0, opacity: 0 }
                        }
                        transition={{
                          duration: prefersReducedMotion ? 0.1 : 0.32,
                          ease: EASE_LUXURY,
                        }}
                        className="overflow-hidden"
                      >
                        <p className="pb-5 pt-1 pl-9 sm:pl-12 pr-3 font-sans text-sm sm:text-base text-obsidian/80 leading-relaxed max-w-2xl">
                          {pillar.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
