import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { MonogramMark } from '@/components/brand/Monogram';
import { Reveal } from '@/components/motion/Reveal';
import { TextReveal } from '@/components/motion/TextReveal';
import { EASE_LUXURY } from '@/utils/motion';

interface BrandPillar {
  id: 'A' | 'M' | 'DZ';
  code: string;
  title: string;
  tag: string;
  description: string;
}

const BRAND_PILLARS: readonly BrandPillar[] = [
  {
    id: 'A',
    code: '01',
    title: 'A · Architecture',
    tag: 'SYSTEM STRUCTURE',
    description:
      'Struktur kode yang bersih, terukur, dan skalabel dari fondasi hingga antarmuka—menjaga modularitas React, TypeScript, dan skema komponen agar tetap ringan dirawat.',
  },
  {
    id: 'M',
    code: '02',
    title: 'M · Motion & Craft',
    tag: 'EDITORIAL KINEMATICS',
    description:
      'Kehalusan detail visual, ritme tipografi serif–mono, serta interaksi GPU 60fps yang terasa manusiawi tanpa mengorbankan kejelasan membaca.',
  },
  {
    id: 'DZ',
    code: '03',
    title: 'DZ · Discipline & Zero-Compromise',
    tag: 'DETERMINISTIC QA',
    description:
      'Ketelitian Software QA, verifikasi edge-case lintas viewport, kepatuhan aksesibilitas, dan konsistensi eksekusi di setiap produk yang dirilis.',
  },
] as const;

/**
 * Signature Brand Philosophy Spread (`AMDZ`):
 * - Warm Ivory contrast spread breaking dark sequences between Hero/Marquee and Selected Works.
 * - Left interactive Monogram construction plate responds dynamically to hover/tap pillar focus.
 * - Right 3 interactive pillars explain the real initials of Aflan Mu'afa Dzulfiqar (`AMDZ`).
 */
export const AmdzBrandPhilosophy: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<'A' | 'M' | 'DZ'>('A');
  const [plateFocused, setPlateFocused] = useState(false);

  const activePillar =
    BRAND_PILLARS.find((p) => p.id === activeId) ?? BRAND_PILLARS[0];

  return (
    <section
      aria-label="Filosofi Logo Brand AMDZ"
      className="relative bg-[#F4EFE6] text-[#1A1412] py-16 sm:py-24 lg:py-28 px-5 md:px-8 lg:px-12 border-y border-[#8A6D4B]/25 overflow-x-clip"
    >
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Interactive Architectural Monogram Plate */}
        <Reveal variant="clip" className="lg:col-span-5">
          <button
            type="button"
            onClick={() => {
              const order: Array<'A' | 'M' | 'DZ'> = ['A', 'M', 'DZ'];
              const next = order[(order.indexOf(activeId) + 1) % order.length];
              setActiveId(next);
            }}
            onMouseEnter={() => setPlateFocused(true)}
            onMouseLeave={() => setPlateFocused(false)}
            aria-label="Putar sorotan filosofi monogram AMDZ"
            className="group relative w-full text-left bg-[#1A1412] text-ivory border border-[#8A6D4B]/35 hover:border-champagne/60 p-6 sm:p-8 lg:p-10 transition-colors duration-500 overflow-hidden cursor-pointer focus-visible:outline-2 focus-visible:outline-bronze"
          >
            {/* Subtle Hover Light Sweep */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] bg-gradient-to-r from-transparent via-champagne/10 to-transparent motion-reduce:hidden"
            />

            {/* Top Plate Meta */}
            <div className="relative z-10 flex items-center justify-between gap-3 font-mono text-[10px] tracking-[0.22em] uppercase">
              <span className="text-champagne">MONOGRAM · AMDZ</span>
              <span className="text-taupe tabular-nums">
                {activePillar.code} · {activePillar.id}
              </span>
            </div>

            {/* Central Architectural Emblem with Construction Grid */}
            <div className="relative z-10 my-8 sm:my-10 aspect-4/3 flex items-center justify-center border border-champagne/15 bg-[#241B17]/85 overflow-hidden">
              <svg
                viewBox="0 0 240 180"
                className={`pointer-events-none absolute inset-0 w-full h-full transition-opacity duration-500 ${
                  plateFocused ? 'opacity-70' : 'opacity-40 group-hover:opacity-65'
                }`}
                aria-hidden="true"
              >
                <line x1="120" y1="0" x2="120" y2="180" stroke="#D8C3A5" strokeOpacity="0.22" strokeDasharray="3 4" />
                <line x1="0" y1="90" x2="240" y2="90" stroke="#D8C3A5" strokeOpacity="0.22" strokeDasharray="3 4" />
                <circle cx="120" cy="90" r="64" fill="none" stroke="#A9845E" strokeOpacity="0.28" />
                <circle cx="120" cy="90" r="46" fill="none" stroke="#D8C3A5" strokeOpacity="0.18" strokeDasharray="2 5" />
                <line x1="48" y1="162" x2="192" y2="18" stroke="#8A6D4B" strokeOpacity="0.22" />
              </svg>

              <motion.div
                animate={
                  prefersReducedMotion
                    ? undefined
                    : { scale: plateFocused ? 1.04 : 1 }
                }
                transition={{ duration: 0.45, ease: EASE_LUXURY }}
                className="relative z-10 flex items-center justify-center p-4"
              >
                <MonogramMark
                  size={104}
                  className="text-champagne transition-transform duration-500 group-hover:scale-105"
                />
              </motion.div>
            </div>

            {/* Bottom Readout Synced to Active Pillar */}
            <div className="relative z-10 flex items-center justify-between gap-4 pt-3 border-t border-champagne/15 font-mono text-[10px] tracking-[0.2em] uppercase">
              <span className="text-ivory/85 truncate">
                Aflan Mu&apos;afa Dzulfiqar
              </span>
              <span className="text-brass shrink-0">{activePillar.tag}</span>
            </div>
          </button>
        </Reveal>

        {/* Right Breakdown: Story & 3 Interactive Pillars */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-4">
            <p className="font-mono text-[10px] sm:text-xs tracking-[0.22em] uppercase font-medium text-[#8A6D4B]">
              BRAND PHILOSOPHY · IDENTITY MARK
            </p>
            <TextReveal
              as="h2"
              className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight leading-[1.08] text-[#1A1412]"
              lines={[
                <>
                  Makna Monogram <span className="italic text-[#6E4F3A]">AMDZ</span>
                </>,
              ]}
            />
            <p className="font-sans text-sm sm:text-base text-[#1A1412]/80 leading-relaxed max-w-2xl">
              Lahir dari inisial <strong className="font-medium text-[#1A1412]">Aflan Mu&apos;afa Dzulfiqar</strong>,
              monogram <span className="font-mono text-xs tracking-widest uppercase text-[#6E4F3A]">AMDZ</span>{' '}
              merangkum standar kerja rekayasa perangkat lunak, kehalusan visual, dan disiplin kualitas yang terukur.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Tiga pilar filosofi brand AMDZ"
            className="border-y border-[#8A6D4B]/25 divide-y divide-[#8A6D4B]/20"
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
                      active ? 'bg-[#EFE7DA]/75' : 'hover:bg-[#EFE7DA]/40'
                    }`}
                  >
                    <div className="flex items-baseline gap-3.5 sm:gap-5 min-w-0">
                      <span
                        className={`font-mono text-[11px] tracking-[0.22em] shrink-0 transition-colors ${
                          active ? 'text-[#6E4F3A] font-medium' : 'text-[#8A6D4B]'
                        }`}
                      >
                        {pillar.code}
                      </span>
                      <span
                        className={`font-serif text-xl sm:text-2xl lg:text-[1.75rem] font-light leading-snug transition-all duration-300 ${
                          active
                            ? 'text-[#1A1412] italic translate-x-1'
                            : 'text-[#1A1412]/80 group-hover/pillar:text-[#6E4F3A]'
                        }`}
                      >
                        {pillar.title}
                      </span>
                    </div>

                    <span
                      className={`font-mono text-[9px] sm:text-[10px] tracking-[0.2em] uppercase shrink-0 ${
                        active ? 'text-[#6E4F3A]' : 'text-[#8A6D4B]/70'
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
                        <p className="pb-5 pt-1 pl-9 sm:pl-12 pr-3 font-sans text-sm sm:text-base text-[#1A1412]/80 leading-relaxed max-w-2xl">
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
