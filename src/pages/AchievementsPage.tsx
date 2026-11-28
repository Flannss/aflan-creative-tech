import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Award, CheckCircle2, ExternalLink, FileText } from 'lucide-react';
import {
  achievementCategories,
  achievementsData,
  type AchievementCategory,
  type AchievementEntry,
} from '@/data/achievements';
import { CertificatePreviewModal } from '@/components/achievements/CertificatePreviewModal';
import { HairlineRule, Reveal } from '@/components/motion/Reveal';
import { TextReveal } from '@/components/motion/TextReveal';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { EASE_LUXURY } from '@/utils/motion';

export const AchievementsPage: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const [selectedCategory, setSelectedCategory] = useState<'Semua' | AchievementCategory>(
    'Semua',
  );
  const [activeId, setActiveId] = useState<string>(achievementsData[0]?.id ?? '');
  const [previewCertEntry, setPreviewCertEntry] = useState<AchievementEntry | null>(null);

  const categoryOptions = useMemo(
    () =>
      achievementCategories.map((cat) => ({
        value: cat,
        label: cat,
        badge:
          cat === 'Semua'
            ? achievementsData.length
            : achievementsData.filter((a) => a.category === cat).length,
      })),
    [],
  );

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
      <section className="bg-umber text-ivory pt-24 sm:pt-28 lg:pt-32 pb-14 sm:pb-20 px-5 md:px-8 lg:px-12 border-b border-brass/20">
        <div className="max-w-[1440px] mx-auto">
          <Reveal variant="up" className="flex flex-wrap items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] whitespace-nowrap font-medium text-champagne">
              <Award className="size-4" aria-hidden="true" />
              HONORS &amp; PUBLICATIONS
            </span>
            <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] whitespace-nowrap font-medium text-taupe">
              100% VERIFIED CREDENTIALS
            </span>
          </Reveal>
          <HairlineRule tone="champagne" immediate className="mt-6" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-10 lg:pt-12 items-end">
            <div className="lg:col-span-7">
              <TextReveal
                as="h1"
                immediate
                className="font-serif text-3xl sm:text-4xl md:text-5xl leading-[1.08] font-light tracking-tight text-ivory/95"
                lines={[
                  <>Sertifikasi, Publikasi &amp;</>,
                  <>
                    <span className="italic text-champagne/90">Official Track Record</span>
                  </>,
                ]}
              />
            </div>

            <Reveal variant="up" delay={0.14} className="lg:col-span-5">
              <p className="font-sans text-sm md:text-base text-ivory/80 leading-relaxed">
                Catatan sertifikasi Cisco CCNA, publikasi jurnal Garuda JPMBA, serta pengalaman magang dan pendidikan.
              </p>
            </Reveal>
          </div>

          <div className="mt-10 lg:mt-12">
            <SegmentedControl
              options={categoryOptions}
              value={selectedCategory}
              onChange={handleCategoryChange}
              layoutId="achievements-category-pill"
              ariaLabel="Filter catatan pencapaian"
              surface="dark"
            />
          </div>
        </div>
      </section>

      <section
        aria-labelledby="achievements-list-heading"
        className="bg-ivory text-espresso py-16 md:py-24 px-5 md:px-8 lg:px-12"
      >
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 lg:block gap-0 md:gap-4 lg:gap-0 divide-y md:divide-y-0 lg:divide-y divide-espresso/15 border-y md:border-y-0 lg:border-y border-espresso/15">
            <h2 id="achievements-list-heading" className="sr-only">
              Daftar Kredensial, Publikasi &amp; Pengalaman Terverifikasi
            </h2>
            {filteredEntries.map((entry, idx) => {
              const isSelected = activeEntry?.id === entry.id;
              const isOrphanOnTablet =
                filteredEntries.length % 2 === 1 && idx === filteredEntries.length - 1;
              return (
                <div
                  key={entry.id}
                  className={`md:border md:border-espresso/15 lg:border-0 transition-colors duration-300 ${
                    isOrphanOnTablet ? 'md:col-span-2' : ''
                  } ${
                    isSelected
                      ? 'bg-obsidian text-ivory md:border-brass/35'
                      : 'hover:bg-offwhite text-espresso md:bg-offwhite/70 lg:bg-transparent'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setActiveId(entry.id)}
                    aria-expanded={isSelected}
                    className="w-full min-h-[44px] text-left py-6 px-4 sm:px-6 active:scale-[0.99] transition-transform duration-300 cursor-pointer"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span
                        className={`text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] whitespace-nowrap font-medium ${
                          isSelected ? 'text-champagne' : 'text-cognac'
                        }`}
                      >
                        {entry.code} · {entry.category}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.15em] whitespace-nowrap px-2.5 py-0.5 border ${
                          isSelected
                            ? 'border-champagne/40 text-champagne'
                            : 'border-bronze/40 text-cognac bg-offwhite'
                        }`}
                      >
                        <CheckCircle2 className="size-3" aria-hidden="true" />
                        {entry.status}
                      </span>
                    </div>

                    <span className="block font-serif text-xl sm:text-2xl font-light leading-snug">
                      {entry.title}
                    </span>

                    <div
                      className={`mt-2 flex flex-wrap items-center justify-between gap-2 text-xs ${
                        isSelected ? 'text-ivory/75' : 'text-espresso/70'
                      }`}
                    >
                      <span>{entry.issuer}</span>
                      <span className="font-mono text-[10px] tracking-[0.15em] uppercase whitespace-nowrap">
                        {entry.dateLabel}
                      </span>
                    </div>
                  </button>

                  {isSelected && (
                    <div className="md:hidden px-4 sm:px-6 pb-6 pt-4 border-t border-champagne/20 space-y-3 text-sm text-ivory/85 leading-relaxed">
                      <p>{entry.summary}</p>
                      <p className="text-champagne/90">{entry.details}</p>
                      {entry.certificateUrl && (
                        <div className="pt-2 flex flex-wrap items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => setPreviewCertEntry(entry)}
                            className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2.5 rounded-full bg-champagne text-obsidian font-mono text-[11px] tracking-[0.16em] uppercase font-medium hover:bg-ivory active:scale-[0.97] transition-all cursor-pointer"
                          >
                            <FileText className="size-3.5 shrink-0" aria-hidden="true" />
                            <span>Lihat Sertifikat</span>
                          </button>
                          <a
                            href={entry.certificateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2.5 rounded-full border border-champagne/35 text-champagne hover:border-champagne hover:text-ivory font-mono text-[11px] tracking-[0.16em] uppercase transition-colors"
                          >
                            <span>Unduh / Buka PDF</span>
                            <ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {activeEntry && (
            <aside className="hidden md:block lg:col-span-5 lg:sticky lg:top-24 bg-obsidian text-ivory border border-brass/25 p-7 sm:p-9 shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeEntry.id}
                  initial={
                    prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  exit={
                    prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }
                  }
                  transition={{
                    duration: prefersReducedMotion ? 0.12 : 0.22,
                    ease: EASE_LUXURY,
                  }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between pb-5 border-b border-champagne/15">
                    <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] whitespace-nowrap text-champagne">
                      DOSSIER CATATAN · {activeEntry.code}
                    </span>
                    <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] whitespace-nowrap text-taupe">
                      {activeEntry.dateLabel}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <span className="inline-block text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] whitespace-nowrap px-3 py-1 border border-champagne/30 text-champagne">
                      {activeEntry.status}
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl font-light tracking-tight leading-tight text-ivory/95">
                      {activeEntry.title}
                    </h3>
                    <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] text-taupe">
                      {activeEntry.issuer}
                    </p>
                  </div>

                  <div className="space-y-4 pt-3 border-t border-champagne/15 text-sm md:text-base leading-relaxed text-ivory/80 max-w-prose">
                    <p>{activeEntry.summary}</p>
                    <p>{activeEntry.details}</p>
                  </div>

                  {activeEntry.certificateUrl && (
                    <div className="pt-4 border-t border-champagne/15 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setPreviewCertEntry(activeEntry)}
                        className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-full bg-champagne text-obsidian font-mono text-[11px] tracking-[0.16em] uppercase font-medium hover:bg-ivory active:scale-[0.97] transition-all cursor-pointer"
                      >
                        <FileText className="size-3.5 shrink-0" aria-hidden="true" />
                        <span>Lihat Sertifikat</span>
                      </button>
                      <a
                        href={activeEntry.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-full border border-champagne/35 text-champagne hover:border-champagne hover:text-ivory font-mono text-[11px] tracking-[0.16em] uppercase transition-colors"
                      >
                        <span>Unduh / Buka PDF</span>
                        <ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
                      </a>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </aside>
          )}
        </div>
      </section>

      <CertificatePreviewModal
        entry={previewCertEntry}
        onClose={() => setPreviewCertEntry(null)}
      />
    </div>
  );
};
