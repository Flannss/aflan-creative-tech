import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, MapPin } from 'lucide-react';
import {
  journeyCategories,
  journeyMilestones,
  type JourneyCategory,
} from '@/data/journey';
import { Reveal } from '@/components/motion/Reveal';
import { StackingCard } from '@/components/motion/StackingCard';
import { TextReveal } from '@/components/motion/TextReveal';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

export const JourneyPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'Semua' | JourneyCategory>('Semua');
  const [activeId, setActiveId] = useState<string>(journeyMilestones[0].id);
  const stackRef = useRef<HTMLDivElement | null>(null);
  const anchorRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const isNavigatingRef = useRef<boolean>(false);
  const navTimeoutRef = useRef<number | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const isTabletOrDesktop = useMediaQuery('(min-width: 768px)');
  const { scrollTo } = useSmoothScroll();

  const filteredMilestones = useMemo(() => {
    if (selectedCategory === 'Semua') return journeyMilestones;
    return journeyMilestones.filter((m) => m.category === selectedCategory);
  }, [selectedCategory]);

  const activeIndex = useMemo(() => {
    const idx = filteredMilestones.findIndex((m) => m.id === activeId);
    return idx >= 0 ? idx : 0;
  }, [filteredMilestones, activeId]);

  const activeMilestone = filteredMilestones[activeIndex] ?? filteredMilestones[0];

  const categoryOptions = useMemo(
    () =>
      journeyCategories.map((cat) => ({
        value: cat,
        label: cat,
        badge:
          cat === 'Semua'
            ? journeyMilestones.length
            : journeyMilestones.filter((m) => m.category === cat).length,
      })),
    [],
  );

  const scrollToMilestone = (id: string) => {
    const idx = filteredMilestones.findIndex((m) => m.id === id);
    if (idx < 0) return;

    setActiveId(id);
    isNavigatingRef.current = true;
    if (navTimeoutRef.current !== null) {
      window.clearTimeout(navTimeoutRef.current);
    }

    const anchorEl =
      anchorRefs.current[id] || document.getElementById(`journey-anchor-${id}`);
    if (anchorEl) {
      const elementDocTop = anchorEl.getBoundingClientRect().top + window.scrollY;
      const stickyTop = 96 + Math.min(idx, 5) * 14;
      const topOffset = isTabletOrDesktop ? stickyTop : 80;
      const targetTop = Math.max(0, elementDocTop - topOffset);

      scrollTo(targetTop, {
        duration: 0.85,
        immediate: Boolean(prefersReducedMotion),
      });
    }

    const unlock = () => {
      isNavigatingRef.current = false;
      if (navTimeoutRef.current !== null) {
        window.clearTimeout(navTimeoutRef.current);
        navTimeoutRef.current = null;
      }
    };

    if ('onscrollend' in window) {
      window.addEventListener('scrollend', unlock, { once: true });
    }
    navTimeoutRef.current = window.setTimeout(unlock, 850);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isNavigatingRef.current) return;
      if (filteredMilestones.length === 0) return;

      const threshold = isTabletOrDesktop ? 160 : 120;
      let currentActiveId = filteredMilestones[0].id;

      for (let i = 0; i < filteredMilestones.length; i++) {
        const item = filteredMilestones[i];
        const el =
          anchorRefs.current[item.id] ||
          document.getElementById(`journey-anchor-${item.id}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= threshold) {
            currentActiveId = item.id;
          } else {
            break;
          }
        }
      }

      setActiveId((prev) => (prev === currentActiveId ? prev : currentActiveId));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (navTimeoutRef.current !== null) {
        window.clearTimeout(navTimeoutRef.current);
      }
    };
  }, [filteredMilestones, isTabletOrDesktop]);

  const handleSelectCategory = (cat: 'Semua' | JourneyCategory) => {
    setSelectedCategory(cat);
    const nextList =
      cat === 'Semua'
        ? journeyMilestones
        : journeyMilestones.filter((m) => m.category === cat);
    if (nextList.length > 0) {
      setActiveId(nextList[0].id);
      const firstAnchor =
        anchorRefs.current[nextList[0].id] ||
        document.getElementById(`journey-anchor-${nextList[0].id}`);
      if (firstAnchor) {
        const elementDocTop = firstAnchor.getBoundingClientRect().top + window.scrollY;
        const topOffset = isTabletOrDesktop ? 96 : 80;
        scrollTo(Math.max(0, elementDocTop - topOffset), {
          duration: 0.8,
          immediate: Boolean(prefersReducedMotion),
        });
      }
    }
  };

  const isFirst = activeIndex <= 0;
  const isLast = activeIndex >= filteredMilestones.length - 1;

  const stepMilestone = (delta: number) => {
    const nextIdx = activeIndex + delta;
    if (nextIdx < 0 || nextIdx >= filteredMilestones.length) return;
    scrollToMilestone(filteredMilestones[nextIdx].id);
  };

  return (
    <div className="w-full overflow-x-clip">
      <section className="relative bg-obsidian text-ivory pt-24 sm:pt-28 lg:pt-32 pb-14 sm:pb-20 px-4 sm:px-6 lg:px-12 border-b border-champagne/15">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 studio-vignette opacity-80"
        />
        <div className="relative z-10 max-w-[1440px] mx-auto">
          <Reveal
            variant="up"
            className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-champagne/15"
          >
            <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] whitespace-nowrap font-medium text-champagne">
              CAREER TIMELINE
            </span>
            <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] whitespace-nowrap font-medium text-taupe">
              ACADEMIC &amp; PROFESSIONAL RECORD
            </span>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-10 lg:pt-12 items-end">
            <div className="lg:col-span-7">
              <TextReveal
                as="h1"
                immediate
                className="font-serif text-3xl sm:text-4xl md:text-5xl leading-[1.08] font-light tracking-tight text-ivory/95"
                lines={[
                  <>Rekam Jejak Belajar,</>,
                  <>
                    <span className="italic text-champagne/90">Magang &amp; Karya</span>
                  </>,
                ]}
              />
            </div>
            <Reveal variant="up" delay={0.14} className="lg:col-span-5">
              <p className="font-sans text-sm md:text-base text-ivory/80 leading-relaxed">
                Linimasa interaktif yang mendokumentasikan pengalaman Programmer Intern di PT
                Puskomedia Indonesia Kreatif, studi Teknologi Informasi di Universitas Amikom
                Purwokerto, serta pengembangan karya web dan aplikasi mobile.
              </p>
            </Reveal>
          </div>

          <div className="mt-10 lg:mt-12">
            <SegmentedControl
              options={categoryOptions}
              value={selectedCategory}
              onChange={handleSelectCategory}
              layoutId="journey-category-pill"
              ariaLabel="Filter linimasa berdasarkan kategori"
              surface="dark"
            />
          </div>
        </div>
      </section>

      <section className="relative bg-ivory text-espresso py-16 md:py-24 px-4 sm:px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Pinned Editorial Category Heading & Chapter Controls */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            <div className="space-y-3 pb-6 border-b border-espresso/15">
              <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.25em] whitespace-nowrap font-medium text-[#8A6D4B]">
                TIMELINE · {String(filteredMilestones.length).padStart(2, '0')} ENTRIES
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-light tracking-tight leading-[1.08] text-espresso/90">
                {selectedCategory === 'Semua' ? (
                  <>
                    Kronologi <span className="italic text-[#8A6D4B]">Lengkap</span>
                  </>
                ) : (
                  <span className="italic text-[#8A6D4B]">{selectedCategory}</span>
                )}
              </h2>
              {activeMilestone && (
                <p className="font-sans text-sm text-espresso/80 leading-relaxed">
                  Fase aktif:{' '}
                  <span className="font-medium text-espresso">
                    {activeMilestone.chapter} · {activeMilestone.periodLabel}
                  </span>
                </p>
              )}
            </div>

            <nav aria-label="Indeks kronologi perjalanan" className="space-y-2">
              {filteredMilestones.map((item) => {
                const isSelected = activeMilestone?.id === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToMilestone(item.id)}
                    className={`w-full text-left px-4 py-3 border transition-colors duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-espresso text-ivory border-espresso'
                        : 'bg-offwhite text-espresso border-espresso/15 hover:border-mocha'
                    }`}
                  >
                    <div className="min-w-0">
                      <span
                        className={`block font-mono text-[10px] tracking-[0.2em] uppercase ${
                          isSelected ? 'text-champagne' : 'text-mocha'
                        }`}
                      >
                        {item.chapter} · {item.category}
                      </span>
                      <span className="block font-serif text-lg leading-snug sm:truncate mt-0.5">
                        {item.title}
                      </span>
                    </div>
                    <span
                      className={`shrink-0 font-mono text-[10px] tracking-[0.14em] uppercase ${
                        isSelected ? 'text-taupe' : 'text-espresso/55'
                      }`}
                    >
                      {item.periodLabel}
                    </span>
                  </button>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-espresso/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-espresso/65">
                {String(activeIndex + 1).padStart(2, '0')} /{' '}
                {String(filteredMilestones.length).padStart(2, '0')}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => stepMilestone(-1)}
                  disabled={isFirst}
                  aria-disabled={isFirst}
                  aria-label="Milestone sebelumnya"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-espresso/30 text-espresso font-mono text-[10px] tracking-[0.16em] uppercase hover:bg-espresso hover:text-ivory transition-colors disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-espresso"
                >
                  <ArrowLeft className="size-3.5" aria-hidden="true" />
                  Sebelumnya
                </button>
                <button
                  type="button"
                  onClick={() => stepMilestone(1)}
                  disabled={isLast}
                  aria-disabled={isLast}
                  aria-label="Milestone berikutnya"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-espresso text-ivory font-mono text-[10px] tracking-[0.16em] uppercase font-medium hover:bg-mocha transition-colors disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-espresso"
                >
                  Berikutnya
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] font-mono tracking-[0.16em] uppercase text-espresso/70">
              <span>LANJUTKAN</span>
              <Link
                to="/skills"
                className="inline-flex items-center gap-1.5 text-espresso hover:text-mocha transition-colors"
              >
                Explore Skills
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
          </aside>

          {/* Stacking Dossier Cards Deck */}
          <div
            ref={stackRef}
            className="relative isolate lg:col-span-8 pb-6"
          >
            {filteredMilestones.map((item, idx) => (
              <React.Fragment key={`${selectedCategory}-${item.id}`}>
                {/* Non-sticky document flow anchor */}
                <div
                  id={`journey-anchor-${item.id}`}
                  ref={(el) => {
                    anchorRefs.current[item.id] = el;
                  }}
                  className="h-0 w-full pointer-events-none -scroll-mt-24"
                  aria-hidden="true"
                />
                <StackingCard
                  id={`journey-card-${item.id}`}
                  containerRef={stackRef}
                  index={idx}
                  total={filteredMilestones.length}
                  baseTopPx={96}
                  offsetStepPx={14}
                  className="mb-6 md:mb-10 last:mb-0"
                >
                  <article className="bg-obsidian text-ivory border border-champagne/25 p-6 sm:p-9 lg:p-10 shadow-[0_24px_70px_rgba(23,22,21,0.35)]">
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-champagne/15">
                    <div className="flex items-center gap-3.5">
                      <span className="font-serif italic text-3xl sm:text-4xl text-champagne leading-none">
                        {item.chapter}
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="block text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] whitespace-nowrap text-champagne">
                            {item.category}
                          </span>
                          {item.isActive && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-champagne/40 text-[10px] font-mono uppercase tracking-[0.14em] whitespace-nowrap text-champagne">
                              Aktif
                            </span>
                          )}
                        </div>
                        <span className="block font-mono text-xs text-taupe mt-0.5">
                          {item.periodLabel}
                        </span>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.18em] uppercase px-3 py-1 border border-champagne/25 text-champagne/90">
                      <MapPin className="size-3" aria-hidden="true" />
                      {item.location}
                    </span>
                  </div>

                  <div className="py-7 sm:py-8 space-y-6">
                    <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[2.65rem] leading-[1.12] lg:leading-[1.08] font-light text-ivory">
                      {item.title}
                    </h3>

                    <p className="font-sans text-sm md:text-base leading-relaxed text-ivory/80">
                      {item.summary}
                    </p>

                    <div className="pt-3 space-y-3">
                      <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-champagne">
                        POIN TERVERIFIKASI
                      </p>
                      <ul className="space-y-3">
                        {item.highlights.map((hl) => (
                          <li
                            key={hl}
                            className="flex items-start gap-3 text-[15px] sm:text-base lg:text-sm text-ivory/85"
                          >
                            <CheckCircle2
                              className="size-4 text-champagne shrink-0 mt-1 lg:mt-0.5"
                              aria-hidden="true"
                            />
                            <span>{hl}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-5 border-t border-champagne/15 flex items-center justify-between gap-4 font-mono text-[10px] tracking-[0.22em] uppercase text-taupe">
                    <span>
                      {item.periodLabel} · {String(idx + 1).padStart(2, '0')} /{' '}
                      {String(filteredMilestones.length).padStart(2, '0')}
                    </span>
                    <span className="text-champagne/80">VERIFIED RECORD · AMDZ</span>
                  </div>
                </article>
              </StackingCard>
            </React.Fragment>
          ))}
        </div>
        </div>
      </section>
    </div>
  );
};
