import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, LayoutGrid, List, ShieldCheck } from 'lucide-react';
import {
  projectCategories,
  projectsData,
  type ProjectCategory,
} from '@/data/projects';
import { ProjectPreviewList } from '@/components/projects/ProjectPreviewList';
import { TypographicDossierPlate } from '@/components/projects/TypographicDossierPlate';
import { Reveal } from '@/components/motion/Reveal';
import { TextReveal } from '@/components/motion/TextReveal';

export const ProjectsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | ProjectCategory>('All');
  const [viewMode, setViewMode] = useState<'index' | 'spread'>('index');

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'All') return projectsData;
    return projectsData.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="w-full overflow-x-clip">
      <section className="relative bg-obsidian text-ivory pt-28 sm:pt-36 lg:pt-40 pb-16 sm:pb-24 px-6 sm:px-8 lg:px-12 border-b border-champagne/15">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 studio-vignette opacity-75"
        />
        <div className="relative z-10 max-w-[1440px] mx-auto">
          <Reveal variant="up" className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-champagne/15">
            <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.28em] uppercase text-champagne">
              BAB 05 — PROYEK &amp; ARSIP KERJA
            </span>
            <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-taupe">
              {filteredProjects.length} ENTRI DITAMPILKAN
            </span>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-12 lg:pt-14 items-end">
            <div className="lg:col-span-7">
              <TextReveal
                as="h1"
                immediate
                className="font-serif text-[2.25rem] sm:text-5xl md:text-6xl lg:text-[4.9rem] leading-[1.04] lg:leading-[0.98] font-light"
                lines={[
                  <>Karya Terpilih &amp;</>,
                  <>
                    <span className="italic text-champagne">Evaluasi Sistem</span>
                  </>,
                ]}
              />
            </div>

            <Reveal variant="up" delay={0.14} className="lg:col-span-5 space-y-4">
              <p className="font-sans text-[15px] sm:text-base text-ivory/75 leading-relaxed">
                Mencakup inisiatif studio mahasiswa Satu Ruang Creative, aplikasi mobile
                SOMASII, evaluasi QA pada ASIS Builder (NDA), serta identitas digital AFLAN—
                disajikan jujur dengan ruang lingkup yang terukur.
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

          <div className="mt-10 lg:mt-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div
              role="tablist"
              aria-label="Filter proyek berdasarkan kategori"
              className="flex flex-wrap gap-2"
            >
              {projectCategories.map((category) => {
                const active = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2.5 lg:py-2 rounded-full font-mono text-[11px] tracking-[0.18em] uppercase border transition-colors ${
                      active
                        ? 'bg-champagne text-obsidian border-champagne font-medium'
                        : 'bg-espresso/50 text-ivory/80 border-champagne/20 hover:border-champagne/60'
                    }`}
                  >
                    {category === 'All' ? 'Semua' : category}
                  </button>
                );
              })}
            </div>

            <div className="inline-flex items-center rounded-full border border-champagne/25 bg-espresso/55 p-1 self-start md:self-auto">
              <button
                type="button"
                onClick={() => setViewMode('index')}
                aria-pressed={viewMode === 'index'}
                className={`inline-flex items-center gap-2 px-3.5 py-2 lg:py-1.5 rounded-full font-mono text-[10px] tracking-[0.18em] uppercase transition-colors ${
                  viewMode === 'index'
                    ? 'bg-champagne text-obsidian font-medium'
                    : 'text-ivory/75 hover:text-champagne'
                }`}
              >
                <List className="size-3.5" aria-hidden="true" />
                Indeks Editorial
              </button>
              <button
                type="button"
                onClick={() => setViewMode('spread')}
                aria-pressed={viewMode === 'spread'}
                className={`inline-flex items-center gap-2 px-3.5 py-2 lg:py-1.5 rounded-full font-mono text-[10px] tracking-[0.18em] uppercase transition-colors ${
                  viewMode === 'spread'
                    ? 'bg-champagne text-obsidian font-medium'
                    : 'text-ivory/75 hover:text-champagne'
                }`}
              >
                <LayoutGrid className="size-3.5" aria-hidden="true" />
                Galeri Spread
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-espresso text-ivory py-16 sm:py-24 lg:py-28 px-6 sm:px-8 lg:px-12 min-h-[55vh]">
        <div className="max-w-[1440px] mx-auto">
          {viewMode === 'index' ? (
            <ProjectPreviewList projects={filteredProjects} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8">
              {filteredProjects.map((project, idx) => {
                const isWide = idx % 3 === 0;
                const isOrphanOnTablet =
                  filteredProjects.length % 2 === 1 && idx === filteredProjects.length - 1;
                return (
                  <Reveal
                    key={project.slug}
                    variant="up"
                    delay={idx * 0.07}
                    className={`${isOrphanOnTablet ? 'md:col-span-2 ' : ''}${
                      isWide ? 'lg:col-span-7' : 'lg:col-span-5'
                    }`}
                  >
                    <Link
                      to={`/projects/${project.slug}`}
                      data-cursor="BUKA"
                      className="group flex flex-col h-full bg-obsidian border border-champagne/20 hover:border-champagne/60 active:border-champagne active:scale-[0.985] transition-all overflow-hidden"
                    >
                      <div className="relative aspect-video overflow-hidden border-b border-champagne/15">
                        {project.previewImage ? (
                          <div
                            className="w-full h-full"
                            style={{ backgroundColor: project.previewBg ?? '#2B1D17' }}
                          >
                            <img
                              src={project.previewImage}
                              alt={project.previewCaption}
                              loading="lazy"
                              style={{ objectPosition: project.previewObjectPosition ?? 'center' }}
                              className={`w-full h-full transition-transform duration-700 group-hover:scale-[1.03] ${
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
                      </div>

                      <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between gap-5">
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] tracking-[0.2em] uppercase">
                            <span className="text-champagne">
                              {project.index} · {project.category}
                            </span>
                            <span className="text-taupe">{project.verificationState}</span>
                          </div>
                          <h2 className="font-serif text-2xl sm:text-3xl font-light text-ivory group-hover:text-champagne transition-colors">
                            {project.title}
                          </h2>
                          <p className="font-sans text-[15px] sm:text-base lg:text-sm text-ivory/75 leading-relaxed">
                            {project.summary}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-champagne/15 flex items-center justify-between gap-3">
                          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-taupe truncate">
                            {project.role}
                          </span>
                          <span className="inline-flex items-center gap-1 font-mono text-[11px] tracking-[0.18em] uppercase text-champagne shrink-0">
                            Detail
                            <ArrowUpRight className="size-3.5" aria-hidden="true" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
