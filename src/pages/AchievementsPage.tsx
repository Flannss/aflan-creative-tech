import React, { useMemo, useState } from 'react';
import { Award, CheckCircle2 } from 'lucide-react';
import {
  achievementCategories,
  achievementsData,
  type AchievementCategory,
  type AchievementEntry,
} from '@/data/achievements';
import { Reveal } from '@/components/motion/Reveal';
import { TextReveal } from '@/components/motion/TextReveal';

export const AchievementsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'Semua' | AchievementCategory>(
    'Semua',
  );
  const [activeId, setActiveId] = useState<string>(achievementsData[0]?.id ?? '');

  const filteredEntries = useMemo(() => {
    if (selectedCategory === 'Semua') return achievementsData;
    return achievementsData.filter((a) => a.category === selectedCategory);
  }, [selectedCategory]);

  const activeEntry: AchievementEntry | null =
    filteredEntries.find((entry) => entry.id === activeId) ?? filteredEntries[0] ?? null;

  const handleCategoryChange = (cat: 'Semua' | AchievementCategory) => {
    setSelectedCategory(cat);
    const next =
      cat === 'Semua'
        ? achievementsData
        : achievementsData.filter((a) => a.category === cat);
    if (next.length > 0) {
      setActiveId(next[0].id);
    }
  };

  return (
    <div className="w-full overflow-x-clip">
      <section className="bg-espresso text-ivory pt-32 sm:pt-40 pb-20 sm:pb-24 px-5 sm:px-8 lg:px-12 border-b border-champagne/15">
        <div className="max-w-[1440px] mx-auto">
          <Reveal variant="up" className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-champagne/15">
            <span className="inline-flex items-center gap-2 font-mono text-[10px] sm:text-[11px] tracking-[0.28em] uppercase text-champagne">
              <Award className="size-4" aria-hidden="true" />
              BAB 08 — PENCAPAIAN &amp; SERTIFIKASI
            </span>
            <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-taupe">
              100% CATATAN TERVERIFIKASI
            </span>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-14 items-end">
            <div className="lg:col-span-7">
              <TextReveal
                as="h1"
                immediate
                className="font-serif text-5xl sm:text-6xl lg:text-[4.85rem] leading-[0.98] font-light"
                lines={[
                  <>Sertifikasi, Publikasi &amp;</>,
                  <>
                    <span className="italic text-champagne">Rekam Jejak Resmi</span>
                  </>,
                ]}
              />
            </div>

            <Reveal variant="up" delay={0.14} className="lg:col-span-5">
              <p className="font-sans text-sm sm:text-base text-ivory/75 leading-relaxed">
                Kumpulan pencapaian resmi yang mencakup sertifikasi Cisco Networking Academy,
                publikasi ilmiah terindeks Garuda, pengalaman magang industri, serta perjalanan
                akademik di Universitas Amikom Purwokerto.
              </p>
            </Reveal>
          </div>

          <div
            role="tablist"
            aria-label="Filter catatan pencapaian"
            className="flex flex-wrap gap-2.5 mt-12"
          >
            {achievementCategories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-2 rounded-full font-mono text-[11px] tracking-[0.18em] uppercase border transition-colors ${
                    active
                      ? 'bg-champagne text-obsidian border-champagne font-medium'
                      : 'bg-obsidian/45 text-ivory/80 border-champagne/20 hover:border-champagne/60'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-ivory text-espresso py-20 sm:py-28 px-5 sm:px-8 lg:px-12">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
          <div className="lg:col-span-7 divide-y divide-espresso/15 border-y border-espresso/15">
            {filteredEntries.map((entry) => {
              const isSelected = activeEntry?.id === entry.id;
              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => setActiveId(entry.id)}
                  data-cursor="LIHAT"
                  className={`w-full text-left py-6 px-4 sm:px-6 transition-colors duration-300 ${
                    isSelected
                      ? 'bg-espresso text-ivory'
                      : 'hover:bg-offwhite text-espresso'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span
                      className={`font-mono text-[10px] tracking-[0.24em] uppercase ${
                        isSelected ? 'text-champagne' : 'text-mocha'
                      }`}
                    >
                      {entry.code} · {entry.category}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.16em] uppercase px-2.5 py-0.5 border ${
                        isSelected
                          ? 'border-champagne/40 text-champagne'
                          : 'border-mocha/35 text-mocha bg-offwhite'
                      }`}
                    >
                      <CheckCircle2 className="size-3" aria-hidden="true" />
                      {entry.status}
                    </span>
                  </div>

                  <h2 className="font-serif text-2xl sm:text-3xl font-light leading-snug">
                    {entry.title}
                  </h2>

                  <div
                    className={`mt-2 flex flex-wrap items-center justify-between gap-2 text-xs ${
                      isSelected ? 'text-ivory/75' : 'text-charcoal/70'
                    }`}
                  >
                    <span>{entry.issuer}</span>
                    <span className="font-mono text-[10px] tracking-[0.16em] uppercase">
                      {entry.dateLabel}
                    </span>
                  </div>

                  {isSelected && (
                    <div className="lg:hidden mt-4 pt-4 border-t border-champagne/20 space-y-2 text-xs text-ivory/85 leading-relaxed">
                      <p>{entry.summary}</p>
                      <p className="text-champagne/90">{entry.details}</p>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {activeEntry && (
            <aside className="lg:col-span-5 lg:sticky lg:top-28 bg-obsidian text-ivory border border-champagne/25 p-7 sm:p-9 shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-5 border-b border-champagne/15">
                <span className="font-mono text-[11px] tracking-[0.24em] uppercase text-champagne">
                  DOSSIER CATATAN · {activeEntry.code}
                </span>
                <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-taupe">
                  {activeEntry.dateLabel}
                </span>
              </div>

              <div className="space-y-3">
                <span className="inline-block font-mono text-[10px] tracking-[0.2em] uppercase px-3 py-1 border border-champagne/30 text-champagne">
                  {activeEntry.status}
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl font-light leading-tight text-ivory">
                  {activeEntry.title}
                </h3>
                <p className="font-mono text-xs tracking-[0.16em] uppercase text-taupe">
                  {activeEntry.issuer}
                </p>
              </div>

              <div className="space-y-4 pt-3 border-t border-champagne/15 text-sm leading-relaxed text-ivory/80">
                <p>{activeEntry.summary}</p>
                <p>{activeEntry.details}</p>
              </div>
            </aside>
          )}
        </div>
      </section>
    </div>
  );
};
