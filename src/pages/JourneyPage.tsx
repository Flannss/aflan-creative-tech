import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, MapPin } from 'lucide-react';
import {
  journeyCategories,
  journeyMilestones,
  type JourneyCategory,
} from '@/data/journey';
import { Reveal } from '@/components/motion/Reveal';
import { TextReveal } from '@/components/motion/TextReveal';
import { EASE_LUXURY } from '@/utils/motion';

export const JourneyPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'Semua' | JourneyCategory>('Semua');
  const [activeId, setActiveId] = useState<string>(journeyMilestones[0].id);
  const prefersReducedMotion = useReducedMotion();

  const filteredMilestones = useMemo(() => {
    if (selectedCategory === 'Semua') return journeyMilestones;
    return journeyMilestones.filter((m) => m.category === selectedCategory);
  }, [selectedCategory]);

  const activeIndex = useMemo(() => {
    const idx = filteredMilestones.findIndex((m) => m.id === activeId);
    return idx >= 0 ? idx : 0;
  }, [filteredMilestones, activeId]);

  const activeMilestone = filteredMilestones[activeIndex] ?? filteredMilestones[0];

  const handleSelectCategory = (cat: 'Semua' | JourneyCategory) => {
    setSelectedCategory(cat);
    const nextList =
      cat === 'Semua'
        ? journeyMilestones
        : journeyMilestones.filter((m) => m.category === cat);
    if (nextList.length > 0) {
      setActiveId(nextList[0].id);
    }
  };

  const stepMilestone = (delta: number) => {
    if (filteredMilestones.length === 0) return;
    const nextIdx =
      (activeIndex + delta + filteredMilestones.length) % filteredMilestones.length;
    setActiveId(filteredMilestones[nextIdx].id);
  };

  return (
    <div className="w-full overflow-x-clip">
      <section className="relative bg-obsidian text-ivory pt-32 sm:pt-40 pb-20 sm:pb-24 px-5 sm:px-8 lg:px-12 border-b border-champagne/15">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 studio-vignette opacity-80"
        />
        <div className="relative z-10 max-w-[1440px] mx-auto">
          <Reveal variant="up" className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-champagne/15">
            <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.28em] uppercase text-champagne">
              BAB 03 — PERJALANAN &amp; LINIMASA
            </span>
            <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-taupe">
              REKAM JEJAK TERVERIFIKASI · TANPA TANGGAL FIKTIF
            </span>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-14 items-end">
            <div className="lg:col-span-7">
              <TextReveal
                as="h1"
                immediate
                className="font-serif text-5xl sm:text-6xl lg:text-[4.9rem] leading-[0.98] font-light"
                lines={[
                  <>Rekam Jejak Belajar,</>,
                  <>
                    <span className="italic text-champagne">Magang &amp; Eksplorasi</span>
                  </>,
                ]}
              />
            </div>
            <Reveal variant="up" delay={0.14} className="lg:col-span-5">
              <p className="font-sans text-sm sm:text-base text-ivory/75 leading-relaxed">
                Linimasa interaktif yang mendokumentasikan pengalaman Programmer Intern di PT
                Puskomedia Indonesia Kreatif, studi Teknologi Informasi di Universitas Amikom
                Purwokerto, serta pengembangan prototipe nyata.
              </p>
            </Reveal>
          </div>

          <div
            role="tablist"
            aria-label="Filter linimasa berdasarkan kategori"
            className="flex flex-wrap gap-2.5 mt-12"
          >
            {journeyCategories.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => handleSelectCategory(category)}
                  className={`px-4 py-2 rounded-full font-mono text-[11px] tracking-[0.18em] uppercase transition-all duration-300 border ${
                    active
                      ? 'bg-champagne text-obsidian border-champagne font-medium'
                      : 'bg-espresso/50 text-ivory/80 border-champagne/20 hover:border-champagne/60 hover:text-ivory'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative bg-ivory text-espresso py-20 sm:py-28 px-5 sm:px-8 lg:px-12">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
          <div className="lg:col-span-5 relative">
            <div
              aria-hidden="true"
              className="absolute left-[19px] top-4 bottom-4 w-px bg-espresso/15"
            />
            <ol className="space-y-4">
              {filteredMilestones.map((item) => {
                const isSelected = activeMilestone?.id === item.id;
                return (
                  <li key={item.id} className="relative pl-12">
                    <span
                      aria-hidden="true"
                      className={`absolute left-3 top-6 size-3.5 rounded-full border-2 transition-all duration-300 ${
                        isSelected
                          ? 'bg-mocha border-espresso scale-125'
                          : 'bg-ivory border-espresso/35'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setActiveId(item.id)}
                      data-cursor="PILIH"
                      className={`w-full text-left p-5 sm:p-6 border transition-all duration-300 ${
                        isSelected
                          ? 'bg-espresso text-ivory border-espresso shadow-xl'
                          : 'bg-offwhite text-espresso border-espresso/15 hover:border-mocha hover:bg-ivory'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span
                          className={`font-mono text-[10px] tracking-[0.24em] uppercase ${
                            isSelected ? 'text-champagne' : 'text-mocha'
                          }`}
                        >
                          BAB {item.chapter} · {item.category}
                        </span>
                        <span
                          className={`font-mono text-[10px] tracking-[0.16em] uppercase ${
                            isSelected ? 'text-taupe' : 'text-espresso/60'
                          }`}
                        >
                          {item.periodLabel}
                        </span>
                      </div>
                      <h2
                        className={`font-serif text-2xl sm:text-[1.65rem] leading-snug font-light ${
                          isSelected ? 'text-ivory' : 'text-espresso'
                        }`}
                      >
                        {item.title}
                      </h2>
                      <p
                        className={`mt-1.5 font-mono text-[10px] tracking-[0.16em] uppercase ${
                          isSelected ? 'text-champagne/75' : 'text-espresso/60'
                        }`}
                      >
                        {item.location}
                      </p>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="lg:col-span-7 lg:sticky lg:top-28">
            {activeMilestone && (
              <AnimatePresence mode="wait">
                <motion.article
                  key={activeMilestone.id}
                  initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -14 }}
                  transition={{ duration: 0.56, ease: EASE_LUXURY }}
                  className="bg-obsidian text-ivory border border-champagne/25 p-7 sm:p-10 lg:p-12 shadow-2xl"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-champagne/15">
                    <div className="flex items-center gap-3">
                      <span className="font-serif italic text-4xl text-champagne leading-none">
                        {activeMilestone.chapter}
                      </span>
                      <div>
                        <span className="block font-mono text-[10px] tracking-[0.24em] uppercase text-champagne">
                          {activeMilestone.category}
                        </span>
                        <span className="block font-mono text-xs text-taupe mt-0.5">
                          {activeMilestone.periodLabel}
                        </span>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.18em] uppercase px-3 py-1 border border-champagne/25 text-champagne/90">
                      <MapPin className="size-3" aria-hidden="true" />
                      {activeMilestone.location}
                    </span>
                  </div>

                  <div className="py-8 space-y-6">
                    <h3 className="font-serif text-3xl sm:text-4xl lg:text-[2.85rem] leading-[1.08] font-light text-ivory">
                      {activeMilestone.title}
                    </h3>

                    <p className="font-sans text-base leading-[1.82] text-ivory/80">
                      {activeMilestone.summary}
                    </p>

                    <div className="pt-4 space-y-3">
                      <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-champagne">
                        POIN TERVERIFIKASI
                      </p>
                      <ul className="space-y-3">
                        {activeMilestone.highlights.map((hl) => (
                          <li key={hl} className="flex items-start gap-3 text-sm text-ivory/85">
                            <CheckCircle2
                              className="size-4 text-champagne shrink-0 mt-0.5"
                              aria-hidden="true"
                            />
                            <span>{hl}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-champagne/15 flex flex-wrap items-center justify-between gap-4">
                    <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-taupe">
                      MILESTONE {String(activeIndex + 1).padStart(2, '0')} /{' '}
                      {String(filteredMilestones.length).padStart(2, '0')}
                    </span>
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => stepMilestone(-1)}
                        aria-label="Milestone sebelumnya"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-champagne/30 text-ivory font-mono text-[11px] tracking-[0.16em] uppercase hover:bg-champagne hover:text-obsidian transition-colors"
                      >
                        <ArrowLeft className="size-3.5" aria-hidden="true" />
                        Sebelumnya
                      </button>
                      <button
                        type="button"
                        onClick={() => stepMilestone(1)}
                        aria-label="Milestone berikutnya"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-champagne text-obsidian font-mono text-[11px] tracking-[0.16em] uppercase font-medium hover:bg-ivory transition-colors"
                      >
                        Berikutnya
                        <ArrowRight className="size-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </motion.article>
              </AnimatePresence>
            )}

            <div className="mt-6 flex items-center justify-between px-1 text-xs font-mono tracking-[0.16em] uppercase text-espresso/70">
              <span>LANJUTKAN MEMBACA</span>
              <Link
                to="/skills"
                className="inline-flex items-center gap-2 text-espresso hover:text-mocha transition-colors"
              >
                04 · Keahlian Teknis
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
