import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { EASE_LUXURY } from '@/utils/motion';

interface StatementToken {
  text: string;
  accent?: boolean;
}

interface DisciplinePillar {
  index: string;
  title: string;
  summary: string;
  detail: string;
  specs: readonly string[];
  linkLabel: string;
  to: string;
}

const STATEMENT_TOKENS: readonly StatementToken[] = [
  { text: 'Merancang' },
  { text: 'antarmuka' },
  { text: 'web' },
  { text: 'di' },
  { text: 'mana' },
  { text: 'tipografi', accent: true },
  { text: 'editorial', accent: true },
  { text: 'bertemu' },
  { text: 'disiplin' },
  { text: 'frontend', accent: true },
  { text: 'engineering', accent: true },
  { text: '&' },
  { text: 'pengujian', accent: true },
  { text: 'QA.', accent: true },
];

const DISCIPLINE_PILLARS: readonly DisciplinePillar[] = [
  {
    index: '01',
    title: 'Frontend Architecture',
    summary: 'React, TypeScript & Arsitektur Komponen Modular',
    detail:
      'Membangun UI terstruktur dengan pemisahan data yang bersih, bundle splitting optimal, dan responsivitas presisi pada AFLAN DOSSIER, platform web SatuRuangCreative, serta aplikasi Flutter & Firebase SOMASII.',
    specs: ['React 19 & TypeScript', 'Tailwind CSS v4', 'SatuRuangCreative'],
    linkLabel: 'Inspect Tech Matrix',
    to: '/skills',
  },
  {
    index: '02',
    title: 'Visual System Craft',
    summary: 'Kontras Editorial, Token & Gerak GPU 60fps',
    detail:
      'Menjaga keseimbangan visual antara keterbacaan tipografi serif–mono, palet terkurasi Espresso–Champagne–Ivory, dan kurva easing cubic-bezier(0.22, 1, 0.36, 1) yang teruji di Creative Lab 01–09.',
    specs: ['Design Tokens', 'Framer Kinematics', 'Creative Lab 01–09'],
    linkLabel: 'Open Creative Lab',
    to: '/lab',
  },
  {
    index: '03',
    title: 'Software QA',
    summary: 'Evaluasi Fungsional & Reproduktibilitas Produksi',
    detail:
      'Pengalaman magang Programmer Intern di PT Puskomedia Indonesia Kreatif dalam pengujian fungsional ASIS Builder (NDA), identifikasi edge-case lintas viewport, serta dokumentasi requirement yang dapat diaudit.',
    specs: ['PT Puskomedia QA', 'ASIS Builder (NDA)', 'Requirement Analysis'],
    linkLabel: 'Explore Career Journey',
    to: '/journey',
  },
] as const;

interface ScrubWordProps {
  token: StatementToken;
  progress: MotionValue<number>;
  range: [number, number];
}

const ScrubWord: React.FC<ScrubWordProps> = ({ token, progress, range }) => {
  const opacity = useTransform(progress, range, [0.22, 1]);
  return (
    <motion.span
      style={{ opacity }}
      className={
        token.accent
          ? 'italic text-[#8A6D4B] will-change-[opacity]'
          : 'text-[#1A1412] will-change-[opacity]'
      }
    >
      {token.text}
    </motion.span>
  );
};

/**
 * High-Contrast Full-Bleed Warm Ivory Centerpiece Spread:
 * - Breaks dark monotony between Hero Espresso and Selected Works.
 * - Combines scroll-scrubbed statement ink reveal with 3 clickable/tappable
 *   interactive editorial index pillars (`01..03`).
 */
export const ScrollRevealStatement: React.FC = () => {
  const containerRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const [activePillar, setActivePillar] = useState<string | null>('01');

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 86%', 'center 46%'],
  });

  const total = STATEMENT_TOKENS.length;

  const togglePillar = (index: string) => {
    setActivePillar((prev) => (prev === index ? null : index));
  };

  return (
    <section
      ref={containerRef}
      aria-label="Filosofi Rekayasa Visual"
      className="relative bg-[#F4EFE6] text-[#1A1412] py-16 sm:py-22 lg:py-28 px-4 sm:px-6 lg:px-12 border-y border-[#8A6D4B]/25 overflow-x-clip"
    >
      <div className="max-w-[1440px] mx-auto space-y-12 lg:space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          <div className="lg:col-span-3 pt-1 space-y-1.5">
            <p className="font-mono text-[10px] sm:text-[11px] tracking-[0.24em] uppercase text-[#8A6D4B] font-medium">
              EDITORIAL STATEMENT
            </p>
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#1A1412]/55">
              CRAFT PHILOSOPHY
            </p>
          </div>

          <div className="lg:col-span-9">
            <p className="font-serif text-[clamp(1.7rem,3.6vw,3.3rem)] font-light leading-[1.16] tracking-tight flex flex-wrap gap-x-[0.28em] gap-y-[0.06em]">
              {STATEMENT_TOKENS.map((token, idx) => {
                const start = (idx / total) * 0.72;
                const end = Math.min(1, start + 0.28);

                if (prefersReducedMotion) {
                  return (
                    <span
                      key={`${token.text}-${idx}`}
                      className={
                        token.accent ? 'italic text-[#8A6D4B]' : 'text-[#1A1412]'
                      }
                    >
                      {token.text}
                    </span>
                  );
                }

                return (
                  <ScrubWord
                    key={`${token.text}-${idx}`}
                    token={token}
                    progress={scrollYProgress}
                    range={[start, end]}
                  />
                );
              })}
            </p>
          </div>
        </div>

        {/* 3 Interactive Editorial Index Pillars */}
        <div className="border-y border-[#8A6D4B]/25 divide-y divide-[#8A6D4B]/20">
          {DISCIPLINE_PILLARS.map((pillar) => {
            const isOpen = activePillar === pillar.index;
            return (
              <div key={pillar.index} className="group">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`pillar-panel-${pillar.index}`}
                  onClick={() => togglePillar(pillar.index)}
                  className="w-full py-5 sm:py-6 flex items-center justify-between gap-4 text-left cursor-pointer min-h-[60px] focus-visible:outline-2 focus-visible:outline-[#8A6D4B]"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 items-baseline flex-1 min-w-0">
                    <div className="md:col-span-5 flex items-baseline gap-3.5 sm:gap-5 min-w-0">
                      <span className="font-mono text-xs tracking-[0.2em] text-[#8A6D4B] shrink-0">
                        {pillar.index}
                      </span>
                      <h3
                        className={`font-serif text-xl sm:text-2xl lg:text-[1.85rem] font-light leading-tight transition-colors ${
                          isOpen
                            ? 'text-[#1A1412] italic'
                            : 'text-[#1A1412]/85 group-hover:text-[#8A6D4B]'
                        }`}
                      >
                        {pillar.title}
                      </h3>
                    </div>

                    <p className="md:col-span-7 font-sans text-xs sm:text-sm text-[#1A1412]/70 truncate pl-7 md:pl-0">
                      {pillar.summary}
                    </p>
                  </div>

                  <span
                    aria-hidden="true"
                    className={`relative size-9 rounded-full border flex items-center justify-center shrink-0 transition-colors duration-300 ${
                      isOpen
                        ? 'border-[#1A1412] bg-[#1A1412] text-[#F4EFE6]'
                        : 'border-[#8A6D4B]/40 text-[#8A6D4B] group-hover:border-[#1A1412] group-hover:text-[#1A1412]'
                    }`}
                  >
                    <span className="block w-3 h-[1.5px] bg-current" />
                    <span
                      className={`absolute block w-[1.5px] h-3 bg-current transition-transform duration-300 ${
                        isOpen ? 'scale-y-0' : 'scale-y-100'
                      }`}
                    />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`pillar-panel-${pillar.index}`}
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
                        duration: prefersReducedMotion ? 0.1 : 0.36,
                        ease: EASE_LUXURY,
                      }}
                      className="overflow-hidden"
                    >
                      <div className="pb-6 pt-1 pl-7 md:pl-0 md:grid md:grid-cols-12 md:gap-6 items-end">
                        <div className="md:col-start-6 md:col-span-7 space-y-4">
                          <p className="font-sans text-sm sm:text-base text-[#1A1412]/80 leading-relaxed max-w-2xl">
                            {pillar.detail}
                          </p>

                          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                            <div className="flex flex-wrap gap-2">
                              {pillar.specs.map((spec) => (
                                <span
                                  key={spec}
                                  className="px-2.5 py-1 border border-[#8A6D4B]/30 bg-white/40 font-mono text-[10px] tracking-[0.16em] uppercase text-[#1A1412]"
                                >
                                  {spec}
                                </span>
                              ))}
                            </div>

                            <Link
                              to={pillar.to}
                              className="group/link inline-flex items-center gap-2 min-h-[44px] font-mono text-[11px] tracking-[0.18em] uppercase text-[#1A1412] hover:text-[#8A6D4B] border-b border-[#1A1412] hover:border-[#8A6D4B] pb-0.5 transition-colors"
                            >
                              <span>{pillar.linkLabel}</span>
                              <ArrowUpRight
                                className="size-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                                aria-hidden="true"
                              />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
