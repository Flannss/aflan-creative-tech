import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Layers } from 'lucide-react';
import {
  skillDomains,
  skillTiers,
  type SkillTier,
} from '@/data/skills';
import { HairlineRule, Reveal, StaggerGroup, StaggerItem } from '@/components/motion/Reveal';
import { TextReveal } from '@/components/motion/TextReveal';
import { SegmentedControl } from '@/components/ui/SegmentedControl';

function getTierTypographyClasses(tier: SkillTier, isLight: boolean): {
  titleClass: string;
  badgeClass: string;
  dotClass: string;
  rowOpacity: string;
} {
  if (tier === 'Hands-on Experience') {
    return {
      titleClass: isLight
        ? 'font-serif font-semibold text-espresso tracking-[0.01em]'
        : 'font-serif font-semibold text-ivory tracking-[0.01em]',
      badgeClass: isLight
        ? 'bg-espresso text-ivory border-espresso font-medium'
        : 'bg-champagne text-obsidian border-champagne font-medium',
      dotClass: isLight ? 'bg-espresso' : 'bg-champagne',
      rowOpacity: 'opacity-100',
    };
  }

  if (tier === 'Working Knowledge') {
    return {
      titleClass: isLight
        ? 'font-serif font-normal text-espresso/80'
        : 'font-serif font-normal text-ivory/80',
      badgeClass: isLight
        ? 'bg-offwhite text-espresso/85 border-espresso/30'
        : 'bg-espresso/75 text-champagne/90 border-champagne/30',
      dotClass: isLight ? 'bg-mocha/70' : 'bg-taupe',
      rowOpacity: 'opacity-90',
    };
  }

  return {
    titleClass: isLight
      ? 'font-serif italic font-light text-mocha/85 underline decoration-mocha/35 underline-offset-4'
      : 'font-serif italic font-light editorial-outline-strong opacity-80',
    badgeClass: isLight
      ? 'bg-transparent text-mocha border-dashed border-mocha/50 italic'
      : 'bg-transparent text-taupe border-dashed border-champagne/35 italic',
    dotClass: isLight
      ? 'border border-mocha bg-transparent'
      : 'border border-champagne/60 bg-transparent',
    rowOpacity: 'opacity-80',
  };
}

export const SkillsPage: React.FC = () => {
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<'All' | SkillTier>('All');

  const totalDomainsLabel = String(skillDomains.length).padStart(2, '0');

  const domainOptions = useMemo(
    () => [
      { value: 'all', label: `Semua ${totalDomainsLabel} Domain` },
      ...skillDomains.map((domain) => ({
        value: domain.id,
        label: `${domain.index} · ${domain.title}`,
      })),
    ],
    [totalDomainsLabel],
  );

  const tierOptions = useMemo(
    () =>
      skillTiers.map((tier) => ({
        value: tier,
        label: tier === 'All' ? 'Semua Level' : tier,
      })),
    [],
  );

  const visibleDomains = useMemo(() => {
    const base =
      selectedDomain === 'all'
        ? skillDomains
        : skillDomains.filter((d) => d.id === selectedDomain);

    if (selectedTier === 'All') return base;

    return base
      .map((domain) => ({
        ...domain,
        items: domain.items.filter((item) => item.tier === selectedTier),
      }))
      .filter((domain) => domain.items.length > 0);
  }, [selectedDomain, selectedTier]);

  return (
    <div className="w-full overflow-x-clip">
      <section className="relative bg-espresso text-ivory pt-24 sm:pt-28 lg:pt-32 pb-16 md:pb-24 px-4 sm:px-6 lg:px-12 border-b border-champagne/15">
        <div className="max-w-[1440px] mx-auto">
          <Reveal variant="up" className="flex flex-wrap items-center justify-between gap-4">
            <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] whitespace-nowrap font-medium text-champagne">
              BAB 04 · CORE CAPABILITIES
            </span>
            <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] whitespace-nowrap font-medium text-taupe">
              TECHNICAL STACK · {totalDomainsLabel} CORE DOMAINS
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
                  <>Kompetensi Teknis,</>,
                  <>
                    <span className="italic text-champagne/90">Diukur Secara Jujur</span>
                  </>,
                ]}
              />
            </div>

            <Reveal variant="up" delay={0.14} className="lg:col-span-5">
              <p className="font-sans text-sm md:text-base text-ivory/80 leading-relaxed">
                Setiap teknologi dipetakan melalui hierarki tipografi editorial yang
                jernih, membedakan pengalaman praktik langsung, penerapan dalam proyek,
                hingga fokus pendalaman saat ini.
              </p>
            </Reveal>
          </div>

          <Reveal
            variant="up"
            delay={0.18}
            className="mt-10 lg:mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 border-y border-champagne/15 py-6"
          >
            <div className="flex items-baseline justify-between gap-4 px-5 py-4 bg-[#1A1412]/90 border border-champagne/20">
              <div>
                <p className="font-serif text-lg sm:text-xl font-semibold text-ivory leading-none">
                  Hands-on Experience
                </p>
                <p className="font-sans text-xs md:text-sm text-ivory/75 mt-2">
                  Tebal solid · Dipakai langsung dalam build &amp; pengujian QA
                </p>
              </div>
              <span className="shrink-0 size-2.5 rounded-full bg-champagne" aria-hidden="true" />
            </div>

            <div className="flex items-baseline justify-between gap-4 px-5 py-4 bg-[#211A17]/75 border border-champagne/15">
              <div>
                <p className="font-serif text-lg sm:text-xl font-normal text-ivory/85 leading-none">
                  Working Knowledge
                </p>
                <p className="font-sans text-xs md:text-sm text-ivory/70 mt-2">
                  Reguler sedang · Diterapkan aktif pada pengembangan proyek
                </p>
              </div>
              <span className="shrink-0 size-2.5 rounded-full bg-taupe" aria-hidden="true" />
            </div>

            <div className="flex items-baseline justify-between gap-4 px-5 py-4 bg-[#1A1412]/50 border border-dashed border-champagne/25">
              <div>
                <p className="font-serif italic text-lg sm:text-xl font-light editorial-outline-strong leading-none">
                  Currently Learning
                </p>
                <p className="font-sans text-xs md:text-sm text-ivory/70 mt-2">
                  Italic outline · Sedang didalami secara aktif dan terarah
                </p>
              </div>
              <span
                className="shrink-0 size-2.5 rounded-full border border-champagne/60"
                aria-hidden="true"
              />
            </div>
          </Reveal>

          <div className="mt-8 flex flex-col gap-3 min-w-0">
            <SegmentedControl
              options={domainOptions}
              value={selectedDomain}
              onChange={setSelectedDomain}
              layoutId="skills-domain-pill"
              ariaLabel="Filter domain teknis"
              surface="dark"
            />

            <SegmentedControl
              options={tierOptions}
              value={selectedTier}
              onChange={setSelectedTier}
              layoutId="skills-tier-pill"
              ariaLabel="Filter berdasarkan tingkat pengalaman"
              surface="dark"
              roleMode="group"
              size="sm"
            />
          </div>
        </div>
      </section>

      <div>
        {visibleDomains.length === 0 ? (
          <section className="bg-ivory text-espresso py-20 px-4 sm:px-8 text-center">
            <p className="font-serif text-xl md:text-2xl font-light mb-4">
              Tidak ada item keahlian yang cocok dengan kombinasi filter ini.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedDomain('all');
                setSelectedTier('All');
              }}
              className="px-5 py-2.5 rounded-full bg-espresso text-ivory font-mono text-xs tracking-[0.18em] uppercase hover:bg-mocha transition-colors"
            >
              Atur Ulang Filter
            </button>
          </section>
        ) : (
          visibleDomains.map((domain, idx) => {
            const isLight = idx % 2 === 0;
            return (
              <section
                key={domain.id}
                className={`py-16 md:py-24 px-4 sm:px-6 lg:px-12 border-b ${isLight
                  ? 'bg-ivory text-espresso border-espresso/15'
                  : 'bg-obsidian text-ivory border-champagne/15'
                  }`}
              >
                <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
                  <Reveal variant="up" className="lg:col-span-4 lg:sticky lg:top-24 space-y-5">
                    <div className="flex items-baseline gap-4">
                      <span
                        className={`font-serif italic text-5xl sm:text-6xl leading-none ${isLight ? 'text-bronze/40' : 'text-champagne/30'
                          }`}
                      >
                        {domain.index}
                      </span>
                      <span
                        className={`font-mono text-[10px] tracking-[0.26em] uppercase ${isLight ? 'text-bronze' : 'text-champagne'
                          }`}
                      >
                        DOMAIN {domain.index} · {totalDomainsLabel}
                      </span>
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[2.7rem] leading-[1.08] lg:leading-[1.06] font-light">
                      {domain.title}
                    </h2>
                    <p
                      className={`font-mono text-[11px] tracking-[0.18em] uppercase ${isLight ? 'text-bronze' : 'text-taupe'
                        }`}
                    >
                      {domain.subtitle}
                    </p>
                    <p
                      className={`font-sans text-[15px] sm:text-base lg:text-sm leading-relaxed pt-1 ${isLight ? 'text-charcoal/85' : 'text-ivory/75'
                        }`}
                    >
                      {domain.description}
                    </p>

                    <div
                      className={`pt-4 border-t flex flex-wrap gap-x-4 gap-y-2 items-baseline ${isLight ? 'border-espresso/15' : 'border-champagne/15'
                        }`}
                    >
                      {domain.items.map((item) => {
                        const style = getTierTypographyClasses(item.tier, isLight);
                        return (
                          <span
                            key={`specimen-${item.name}`}
                            className={`text-lg sm:text-xl leading-snug ${style.titleClass}`}
                          >
                            {item.name}
                          </span>
                        );
                      })}
                    </div>
                  </Reveal>

                  <div
                    className={`lg:col-span-8 divide-y border-y ${isLight
                      ? 'divide-espresso/15 border-espresso/15'
                      : 'divide-champagne/15 border-champagne/15'
                      }`}
                  >
                    {domain.items.map((item, itemIdx) => {
                      const style = getTierTypographyClasses(item.tier, isLight);
                      return (
                        <Reveal
                          key={item.name}
                          variant="up"
                          delay={itemIdx * 0.04}
                          className={`py-6 sm:py-7 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6 items-baseline ${style.rowOpacity}`}
                        >
                          <div className="md:col-span-5 flex items-center gap-3">
                            <span
                              aria-hidden="true"
                              className={`shrink-0 size-2 rounded-full ${style.dotClass}`}
                            />
                            <h3
                              className={`text-xl sm:text-2xl md:text-[1.9rem] leading-tight ${style.titleClass}`}
                            >
                              {item.name}
                            </h3>
                          </div>

                          <div className="md:col-span-3">
                            <span
                              className={`inline-block font-mono text-[10px] tracking-[0.16em] uppercase px-2.5 py-1 border ${style.badgeClass}`}
                            >
                              {item.tier}
                            </span>
                          </div>

                          <div className="md:col-span-4">
                            <p
                              className={`font-sans text-[15px] sm:text-base lg:text-sm leading-relaxed ${isLight ? 'text-charcoal/80' : 'text-ivory/75'
                                }`}
                            >
                              {item.context}
                            </p>
                          </div>
                        </Reveal>
                      );
                    })}
                  </div>
                </div>
              </section>
            );
          })
        )}
      </div>

      <section className="bg-chocolate text-ivory py-16 md:py-24 px-4 sm:px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <Reveal variant="up" className="lg:col-span-6 space-y-5">
            <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.26em] uppercase text-champagne">
              <Layers className="size-4" aria-hidden="true" />
              ENGINEERING, QA &amp; AI ORCHESTRATION
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-light tracking-tight leading-[1.08] text-ivory">
              Membangun antarmuka dengan{' '}
              <span className="italic text-champagne/90">ketelitian QA engineer</span>.
            </h2>
            <p className="font-sans text-sm md:text-base text-ivory/80 leading-relaxed max-w-xl">
              Praktik langsung Software Testing dan Requirement Analysis di PT Puskomedia
              Indonesia Kreatif berpadu dengan orkestrasi agen AI (Antigravity, Lunyzz,
              Gemini) untuk mempercepat implementasi React, Flutter, dan audit produksi
              secara deterministik.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/projects"
                data-cursor="PROYEK"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-champagne text-obsidian font-mono text-xs tracking-[0.18em] uppercase font-medium hover:bg-ivory transition-colors"
              >
                Lihat Proyek &amp; Evaluasi QA
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                to="/lab"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-champagne/35 text-ivory font-mono text-xs tracking-[0.18em] uppercase hover:border-champagne transition-colors"
              >
                Buka Creative Lab
              </Link>
            </div>
          </Reveal>

          <div className="lg:col-span-6">
            <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  num: 'I',
                  title: 'Web & UI Craft',
                  body: 'HTML, CSS, JavaScript, React.js, Tailwind CSS, serta Component-Based Responsive Design.',
                },
                {
                  num: 'II',
                  title: 'Lintas Ekosistem',
                  body: 'Working Knowledge pada TypeScript, PHP, Laravel, Flutter, Dart, dan Firebase.',
                },
                {
                  num: 'III',
                  title: 'QA & AI Orchestration',
                  body: 'Functional Testing, Requirement Analysis, Lunyzz QA audit, Antigravity & Gemini workflow.',
                },
              ].map((node, nodeIdx) => (
                <StaggerItem
                  key={node.num}
                  className={`group relative overflow-hidden p-6 bg-[#1A1412] hover:bg-[#211A17] border border-champagne/15 hover:border-champagne/40 flex flex-col justify-between min-h-[195px] lg:min-h-[215px] transition-colors duration-300 ${nodeIdx === 2 ? 'md:col-span-2 lg:col-span-1' : ''
                    }`}
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute top-0 inset-x-0 h-[2px] bg-champagne origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:hidden"
                  />
                  <span className="font-serif italic text-3xl text-champagne">
                    {node.num}
                  </span>
                  <div className="pt-6">
                    <h3 className="font-serif text-2xl text-ivory mb-2 group-hover:text-champagne transition-colors">
                      {node.title}
                    </h3>
                    <p className="font-sans text-sm lg:text-xs leading-relaxed text-ivory/75">
                      {node.body}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </div>
      </section>
    </div>
  );
};
