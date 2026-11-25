import React, { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import {
  projectCategories,
  projectsData,
  type ProjectCategory,
} from '@/data/projects';
import { ProjectPreviewList } from '@/components/projects/ProjectPreviewList';
import { TypographicDossierPlate } from '@/components/projects/TypographicDossierPlate';
import { ProjectTransitionPortal } from '@/components/projects/ProjectClickTransition';
import { useProjectTransition } from '@/hooks/useProjectTransition';
import { ApertureFrame } from '@/components/motion/ApertureFrame';
import { KineticLabel } from '@/components/motion/KineticLabel';
import { Reveal, HairlineRule } from '@/components/motion/Reveal';
import { StackingCard } from '@/components/motion/StackingCard';
import { TextReveal } from '@/components/motion/TextReveal';
import { SegmentedControl } from '@/components/ui/SegmentedControl';

export const ProjectsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | ProjectCategory>('All');
  const [viewMode, setViewMode] = useState<'index' | 'spread'>('index');
  const stackRef = useRef<HTMLDivElement | null>(null);
  const { transitionState, transitioningSlug, triggerProjectTransition } =
    useProjectTransition();

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'All') return projectsData;
    return projectsData.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  const categoryOptions = useMemo(
    () =>
      projectCategories.map((cat) => ({
        value: cat,
        label: cat === 'All' ? 'Semua' : cat,
      })),
    [],
  );

  const viewOptions = useMemo(
    () =>
      [
        { value: 'index', label: 'Indeks Editorial' },
        { value: 'spread', label: 'Kartu Bertumpuk' },
      ] as const,
    [],
  );

  return (
    <div className="w-full overflow-x-clip">
      <section className="relative bg-obsidian text-ivory pt-24 sm:pt-28 lg:pt-32 pb-14 sm:pb-20 px-4 sm:px-6 lg:px-12 border-b border-champagne/15">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 studio-vignette opacity-75"
        />
        <div className="relative z-10 max-w-[1440px] mx-auto">
          <Reveal
            variant="up"
            className="flex flex-wrap items-center justify-between gap-4"
          >
            <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] whitespace-nowrap font-medium text-champagne">
              BAB 05 · PROYEK
            </span>
            <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] whitespace-nowrap font-medium text-taupe">
              {filteredProjects.length} ENTRI DITAMPILKAN
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
                  <>Karya Terpilih &amp;</>,
                  <>
                    <span className="italic text-champagne/90">Evaluasi Sistem</span>
                  </>,
                ]}
              />
            </div>

            <Reveal variant="up" delay={0.14} className="lg:col-span-5 space-y-4">
              <p className="font-sans text-sm md:text-base text-ivory/80 leading-relaxed">
                Mencakup inisiatif studio mahasiswa SatuRuangCreative, aplikasi mobile
                SOMASII, evaluasi QA pada ASIS Builder (NDA), serta identitas digital AFLAN,
                disajikan transparan dengan ruang lingkup yang terukur.
              </p>
              <div className="flex items-start gap-2.5 p-4 bg-espresso/75 border border-champagne/20 text-sm lg:text-xs text-champagne/90 leading-relaxed">
                <ShieldCheck className="size-4 shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  Atribusi transparan: ASIS Builder disajikan dalam format dossier tipografis
                  sesuai NDA perusahaan; SOMASII merupakan aplikasi mobile kampus (Academic
                  Final Project).
                </span>
              </div>
            </Reveal>
          </div>

          <div className="mt-8 lg:mt-12 flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 min-w-0">
            <SegmentedControl
              options={categoryOptions}
              value={selectedCategory}
              onChange={setSelectedCategory}
              layoutId="projects-category-pill"
              ariaLabel="Filter proyek berdasarkan kategori"
              surface="dark"
              className="lg:w-auto"
            />

            <SegmentedControl
              options={viewOptions}
              value={viewMode}
              onChange={setViewMode}
              layoutId="projects-view-pill"
              ariaLabel="Mode tampilan arsip proyek"
              surface="dark"
              roleMode="group"
              size="sm"
              className="lg:w-auto"
            />
          </div>
        </div>
      </section>

      <section className="bg-espresso text-ivory py-16 md:py-24 px-4 sm:px-6 lg:px-12 min-h-[55vh]">
        <div className="max-w-[1440px] mx-auto">
          {viewMode === 'index' ? (
            <ProjectPreviewList projects={filteredProjects} />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
              {/* Pinned Category Heading Rail */}
              <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
                <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.25em] whitespace-nowrap text-champagne">
                  DOSSIER BERTUMPUK · {String(filteredProjects.length).padStart(2, '0')} KARYA
                </p>
                <h2 className="font-serif text-3xl md:text-4xl font-light tracking-tight leading-[1.08] text-ivory">
                  {selectedCategory === 'All' ? (
                    <>
                      Seluruh <span className="italic text-champagne/90">Karya Terkurasi</span>
                    </>
                  ) : (
                    <span className="italic text-champagne/90">{selectedCategory}</span>
                  )}
                </h2>
                <p className="font-sans text-sm md:text-base text-ivory/80 leading-relaxed max-w-prose">
                  Gulir untuk menelusuri kartu proyek yang bertumpuk lembut, lalu klik kartu
                  mana saja untuk membuka studi kasus penuh.
                </p>
                <div className="pt-4 border-t border-champagne/15 text-[10px] font-mono uppercase tracking-[0.15em] whitespace-nowrap text-taupe">
                  KLIK KARTU UNTUK TRANSISI DOSSIER →
                </div>
              </aside>

              {/* Pure Stacking Project Cards */}
              <div
                ref={stackRef}
                className="relative isolate lg:col-span-8 space-y-6 md:space-y-10 pb-6"
              >
                {filteredProjects.map((project, idx) => (
                  <StackingCard
                    key={`${selectedCategory}-${project.slug}`}
                    containerRef={stackRef}
                    index={idx}
                    total={filteredProjects.length}
                    baseTopPx={96}
                    offsetStepPx={14}
                  >
                    <Link
                      to={`/projects/${project.slug}`}
                      onClick={(e) => {
                        const previewEl = e.currentTarget.querySelector<HTMLElement>(
                          '[data-project-preview]',
                        );
                        triggerProjectTransition(e, project, previewEl);
                      }}
                      className={`group flex flex-col bg-obsidian border border-champagne/25 hover:border-champagne/65 active:border-champagne transition-all duration-300 overflow-hidden shadow-[0_28px_80px_rgba(0,0,0,0.55)] ${
                        transitioningSlug !== null && transitioningSlug !== project.slug
                          ? 'opacity-30'
                          : ''
                      }`}
                    >
                      <div
                        data-project-preview
                        className="relative aspect-video overflow-hidden border-b border-champagne/15"
                      >
                        <ApertureFrame className="w-full h-full">
                          {project.previewImage ? (
                            <div
                              className="w-full h-full"
                              style={{ backgroundColor: project.previewBg ?? '#2B1D17' }}
                            >
                              <img
                                src={project.previewImage}
                                alt={project.previewCaption}
                                loading="lazy"
                                style={{
                                  objectPosition: project.previewObjectPosition ?? 'center',
                                }}
                                className={`w-full h-full transition-transform duration-700 ease-out motion-reduce:transform-none ${
                                  transitioningSlug === project.slug
                                    ? 'scale-[1.05]'
                                    : 'group-hover:scale-[1.03]'
                                } ${
                                  project.previewImageFit === 'contain'
                                    ? 'object-contain p-8'
                                    : 'object-cover'
                                }`}
                              />
                            </div>
                          ) : (
                            <TypographicDossierPlate
                              project={project}
                              compact
                              className="w-full h-full border-0"
                            />
                          )}
                        </ApertureFrame>
                      </div>

                      <div className="p-6 sm:p-8 flex flex-col justify-between gap-5">
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] tracking-[0.2em] uppercase">
                            <span className="text-champagne">
                              {project.index} · {project.category}
                            </span>
                            <span className="text-taupe">{project.verificationState}</span>
                          </div>
                          <h3 className="font-serif text-2xl sm:text-3xl font-light text-ivory group-hover:text-champagne transition-colors">
                            {project.title}
                          </h3>
                          <p className="font-sans text-sm md:text-base text-ivory/80 leading-relaxed">
                            {project.summary}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-champagne/15 flex items-center justify-between gap-3">
                          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-taupe truncate">
                            {project.role}
                          </span>
                          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.18em] uppercase text-champagne shrink-0">
                            <KineticLabel>Buka Dossier</KineticLabel>
                            <ArrowUpRight
                              className="size-3.5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none"
                              aria-hidden="true"
                            />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </StackingCard>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      <ProjectTransitionPortal state={transitionState} />
    </div>
  );
};
