import React, { useMemo, useState } from 'react';
import { Bookmark, ShieldCheck } from 'lucide-react';
import {
  projectCategories,
  projectsData,
  type ProjectCategory,
  type ProjectEntry,
} from '@/data/projects';
import { ProjectPreviewList } from '@/components/projects/ProjectPreviewList';
import { ProjectPreviewModal } from '@/components/projects/ProjectPreviewModal';
import { ProjectVisualGridCard } from '@/components/projects/ProjectVisualGridCard';
import { Reveal, HairlineRule } from '@/components/motion/Reveal';
import { TextReveal } from '@/components/motion/TextReveal';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { useBookmarkedProjects } from '@/hooks/useBookmarkedProjects';
import { useMediaQuery } from '@/hooks/useMediaQuery';

type FilterValue = 'All' | ProjectCategory | 'Saved';
type ViewMode = 'index' | 'grid';

export const ProjectsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<FilterValue>('All');
  const [userViewMode, setUserViewMode] = useState<ViewMode | null>(null);
  const [previewProject, setPreviewProject] = useState<ProjectEntry | null>(null);

  const isMobileViewport = useMediaQuery('(max-width: 767px)');
  const viewMode: ViewMode = userViewMode ?? (isMobileViewport ? 'grid' : 'index');

  const { bookmarkedSlugs, count: bookmarkedCount } = useBookmarkedProjects();

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'All') return projectsData;
    if (selectedCategory === 'Saved') {
      return projectsData.filter((p) => bookmarkedSlugs.includes(p.slug));
    }
    return projectsData.filter((p) => p.category === selectedCategory);
  }, [bookmarkedSlugs, selectedCategory]);

  const categoryOptions = useMemo(
    () => [
      ...projectCategories.map((cat) => ({
        value: cat as FilterValue,
        label: cat === 'All' ? 'Semua' : cat,
      })),
      {
        value: 'Saved' as FilterValue,
        label: 'Saved',
        badge: bookmarkedCount > 0 ? bookmarkedCount : undefined,
      },
    ],
    [bookmarkedCount],
  );

  const viewOptions = useMemo(
    () =>
      [
        { value: 'index', label: 'Editorial Index' },
        { value: 'grid', label: 'Visual Grid' },
      ] as const,
    [],
  );

  return (
    <div className="w-full overflow-x-clip">
      <section className="relative bg-obsidian text-ivory pt-24 sm:pt-28 lg:pt-32 pb-14 sm:pb-20 px-5 md:px-8 lg:px-12 border-b border-brass/20">
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
              SELECTED WORKS
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
                  <>Selected Works &amp;</>,
                  <>
                    <span className="italic text-champagne/90">System Evaluation</span>
                  </>,
                ]}
              />
            </div>

            <Reveal variant="up" delay={0.14} className="lg:col-span-5 space-y-4">
              <p className="font-sans text-sm md:text-base text-ivory/80 leading-relaxed">
                Studi kasus pilihan dari SatuRuangCreative, SOMASII, ASIS Builder (NDA), hingga AFLAN DOSSIER dengan atribusi peran transparan.
              </p>
              <div className="flex items-start gap-2.5 p-4 bg-umber/90 border border-brass/30 text-sm lg:text-xs text-champagne leading-relaxed">
                <ShieldCheck className="size-4 text-brass shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  ASIS Builder disajikan secara tipografis sesuai NDA; SOMASII merupakan Academic Final Project kampus.
                </span>
              </div>
            </Reveal>
          </div>

          <div className="mt-8 lg:mt-12 p-3 sm:p-4 border border-brass/25 bg-umber/65 flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 min-w-0">
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
              onChange={setUserViewMode}
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

      <section className="bg-umber text-ivory py-16 md:py-24 px-5 md:px-8 lg:px-12 min-h-[55vh]">
        <div className="max-w-[1440px] mx-auto">
          {filteredProjects.length === 0 ? (
            <div className="max-w-xl mx-auto my-8 p-8 sm:p-10 bg-obsidian/70 border border-champagne/20 text-center space-y-5">
              <span className="mx-auto size-12 rounded-full border border-champagne/30 bg-espresso/80 flex items-center justify-center text-champagne">
                <Bookmark className="size-5" aria-hidden="true" />
              </span>
              <div className="space-y-2">
                <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-champagne">
                  SHORTLIST KOSONG
                </p>
                <h2 className="font-serif text-2xl sm:text-3xl font-light text-ivory">
                  Belum ada proyek yang ditandai.
                </h2>
                <p className="font-sans text-sm text-ivory/75 leading-relaxed">
                  Klik ikon bookmark pada proyek mana saja untuk menyimpan daftar pendek
                  pribadi Anda selama meninjau portofolio ini.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCategory('All')}
                className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 rounded-full bg-champagne text-obsidian font-mono text-[11px] uppercase tracking-[0.16em] font-medium hover:bg-ivory active:scale-[0.97] transition-all cursor-pointer"
              >
                Tampilkan Semua Proyek
              </button>
            </div>
          ) : viewMode === 'index' ? (
            <ProjectPreviewList projects={filteredProjects} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7 items-stretch">
              {filteredProjects.map((project) => (
                <ProjectVisualGridCard
                  key={`${selectedCategory}-${project.slug}`}
                  project={project}
                  isSelected={previewProject?.slug === project.slug}
                  onOpenPreview={setPreviewProject}
                />
              ))}
            </div>
          )}
        </div>
      </section>
      <ProjectPreviewModal
        project={previewProject}
        onClose={() => setPreviewProject(null)}
      />
    </div>
  );
};
