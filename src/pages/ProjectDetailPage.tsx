import React, { useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import {
  getProjectBySlug,
  projectsData,
  type ProjectEntry,
} from '@/data/projects';
import { TypographicDossierPlate } from '@/components/projects/TypographicDossierPlate';
import { ApertureFrame } from '@/components/motion/ApertureFrame';
import { KineticLabel } from '@/components/motion/KineticLabel';
import { HairlineRule, Reveal } from '@/components/motion/Reveal';
import { TextReveal } from '@/components/motion/TextReveal';
import { ParallaxFrame } from '@/components/motion/ParallaxFrame';

interface ProjectCaseStudyContentProps {
  project: ProjectEntry;
}

const ProjectCaseStudyContent: React.FC<ProjectCaseStudyContentProps> = ({
  project,
}) => {
  const articleRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: articleRef,
    offset: ['start start', 'end end'],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 32,
    restDelta: 0.001,
  });

  const currentIdx = projectsData.findIndex((p) => p.slug === project.slug);
  const prevProject =
    projectsData[(currentIdx - 1 + projectsData.length) % projectsData.length];
  const nextProject = projectsData[(currentIdx + 1) % projectsData.length];

  return (
    <div ref={articleRef} className="w-full overflow-x-clip">
      {!prefersReducedMotion && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed top-0 inset-x-0 z-[58] h-[2px] bg-champagne/15"
        >
          <motion.div
            style={{ scaleX: smoothProgress }}
            className="h-full w-full origin-left bg-champagne will-change-transform"
          />
        </div>
      )}
      <section className="relative bg-obsidian text-ivory pt-24 sm:pt-28 lg:pt-32 pb-14 sm:pb-20 px-4 sm:px-6 lg:px-12 border-b border-champagne/15">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              to="/projects"
              className="group inline-flex items-center gap-2 text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] font-medium text-champagne hover:text-ivory transition-colors"
            >
              <ArrowLeft
                className="size-3.5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-x-1 motion-reduce:transform-none"
                aria-hidden="true"
              />
              <KineticLabel>Kembali ke Arsip Proyek</KineticLabel>
            </Link>
            <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] font-medium text-taupe">
              ENTRI {project.index} · {project.category}
            </span>
          </div>
          <HairlineRule tone="champagne" immediate className="mt-6" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 pt-10 lg:pt-12 items-end">
            <div className="lg:col-span-8 space-y-5">
              <span className="inline-block text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] font-medium px-3 py-1 border border-champagne/30 text-champagne">
                {project.verificationState}
              </span>
              <TextReveal
                as="h1"
                immediate
                className="font-serif text-3xl sm:text-4xl md:text-5xl leading-[1.08] font-light tracking-tight text-ivory/95"
                lines={[project.title]}
              />
              <p className="font-sans text-sm md:text-base text-ivory/80 max-w-2xl leading-relaxed">
                {project.subtitle}
              </p>
            </div>

            <Reveal variant="up" delay={0.1} className="lg:col-span-4 min-w-0 lg:text-right space-y-3">
              <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] font-medium text-taupe">
                LINIMASA / STATUS
              </p>
              <p className="font-serif text-xl text-champagne/90">{project.yearLabel}</p>

              {project.liveUrl && (
                <div className="pt-2 flex lg:justify-end">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center justify-center gap-2 max-w-full min-w-0 overflow-hidden px-4 xl:px-5 py-2.5 rounded-full bg-champagne text-obsidian font-mono text-[11px] xl:text-xs tracking-[0.12em] xl:tracking-[0.16em] uppercase font-medium hover:bg-ivory active:scale-[0.97] transition-all"
                  >
                    <KineticLabel className="truncate text-ellipsis">
                      {project.liveUrlLabel ?? 'Kunjungi Situs Live'}
                    </KineticLabel>
                    <ExternalLink
                      className="size-3.5 shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none"
                      aria-hidden="true"
                    />
                  </a>
                </div>
              )}

              {project.liveRoute && (
                <div className="pt-2">
                  <Link
                    to={project.liveRoute}
                    className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-champagne text-obsidian font-mono text-xs tracking-[0.18em] uppercase font-medium hover:bg-ivory active:scale-[0.97] transition-all"
                  >
                    <KineticLabel>Buka Creative Lab</KineticLabel>
                    <ArrowUpRight
                      className="size-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              )}
            </Reveal>
          </div>

          {project.verificationNotice && (
            <Reveal variant="up" delay={0.14} className="mt-10 lg:mt-12">
              <div className="flex items-start gap-3 p-5 bg-espresso/85 border border-champagne/30 text-[15px] sm:text-base lg:text-sm text-champagne/95">
                <AlertCircle className="size-5 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-champagne mb-1">
                    CATATAN VERIFIKASI &amp; ATRIBUSI
                  </p>
                  <p className="font-sans leading-relaxed text-ivory/85">
                    {project.verificationNotice}
                  </p>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      <section className="bg-ivory text-espresso py-16 md:py-24 px-4 sm:px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto space-y-12 sm:space-y-16">
          <figure className="border border-espresso/20 bg-obsidian overflow-hidden shadow-2xl">
            <ApertureFrame>
              {project.previewImage ? (
                <ParallaxFrame
                  className="aspect-video max-h-[600px] w-full flex items-center justify-center"
                  offset={10}
                >
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: project.previewBg ?? '#2B1D17' }}
                  >
                    <img
                      src={project.previewImage}
                      alt={project.previewCaption}
                      style={{ objectPosition: project.previewObjectPosition ?? 'center' }}
                      className={`w-full h-full ${project.previewImageFit === 'contain'
                        ? 'object-contain p-8 sm:p-16'
                        : 'object-cover'
                        }`}
                    />
                  </div>
                </ParallaxFrame>
              ) : (
                <TypographicDossierPlate
                  project={project}
                  className="min-h-[300px] sm:min-h-[440px] border-0"
                />
              )}
            </ApertureFrame>
            <figcaption className="px-5 sm:px-6 py-4 bg-obsidian text-champagne/85 font-mono text-[11px] tracking-[0.18em] uppercase border-t border-champagne/15 flex flex-wrap justify-between gap-2">
              <span>{project.previewCaption}</span>
              <span>ARSIP AMDZ</span>
            </figcaption>
          </figure>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 items-start">
            <Reveal variant="up" className="md:col-span-5 lg:col-span-4 space-y-6">
              <div className="bg-offwhite border border-espresso/15 p-6 sm:p-7 space-y-6">
                <div>
                  <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] font-medium text-mocha">
                    PLATFORM
                  </p>
                  <p className="font-sans text-sm font-medium text-espresso mt-1">
                    {project.platform}
                  </p>
                </div>

                <div className="pt-5 border-t border-espresso/15">
                  <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] font-medium text-mocha">
                    PERAN &amp; TANGGUNG JAWAB
                  </p>
                  <p className="font-serif text-lg sm:text-xl text-espresso mt-1.5 leading-snug">
                    {project.role}
                  </p>
                </div>

                <div className="pt-5 border-t border-espresso/15">
                  <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] font-medium text-mocha">
                    ATRIBUSI KONTRIBUSI
                  </p>
                  <p className="font-sans text-sm text-espresso/80 mt-2 leading-relaxed">
                    {project.contributionScope}
                  </p>
                </div>

                {project.notableWork && (
                  <div className="pt-5 border-t border-espresso/15">
                    <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] font-medium text-mocha">
                      NOTABLE WORK
                    </p>
                    <p className="font-sans text-sm text-espresso font-medium mt-2 leading-relaxed">
                      {project.notableWork}
                    </p>
                  </div>
                )}

                <div className="pt-5 border-t border-espresso/15">
                  <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-mocha mb-3">
                    STACK &amp; METODE
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-ivory border border-espresso/20 text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] font-medium text-espresso"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {project.liveUrl && (
                  <div className="pt-5 border-t border-espresso/15">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] uppercase text-espresso border-b border-espresso pb-1 hover:text-mocha hover:border-mocha transition-colors"
                    >
                      <KineticLabel>Buka Tautan Live</KineticLabel>
                      <ExternalLink
                        className="size-3.5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none"
                        aria-hidden="true"
                      />
                    </a>
                  </div>
                )}
              </div>
            </Reveal>

            <Reveal variant="up" delay={0.1} className="md:col-span-7 lg:col-span-8 space-y-12">
              <div className="space-y-5">
                <p className="font-mono text-[11px] tracking-[0.26em] uppercase text-mocha">
                  TINJAUAN PROYEK
                </p>
                <div className="space-y-4 font-sans text-sm md:text-base leading-relaxed text-espresso/80">
                  {project.overview.map((p, idx) => (
                    <p key={`${project.slug}-overview-${idx}`}>{p}</p>
                  ))}
                </div>
              </div>

              <div className="pt-8 border-t border-espresso/15 space-y-5">
                <p className="font-mono text-[11px] tracking-[0.26em] uppercase text-mocha">
                  HASIL &amp; CATATAN TERVERIFIKASI
                </p>
                <ul className="space-y-4">
                  {project.outcomes.map((outcome) => (
                    <li
                      key={outcome}
                      className="flex items-start gap-3 font-sans text-[15px] sm:text-base text-espresso"
                    >
                      <CheckCircle2
                        className="size-5 text-mocha shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <nav
        aria-label="Navigasi antar studi kasus proyek"
        className="bg-espresso text-ivory border-t border-champagne/15"
      >
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-champagne/15">
          <Link
            to={`/projects/${prevProject.slug}`}
            className="relative group p-6 sm:p-9 lg:p-14 hover:bg-obsidian/45 transition-colors duration-500 flex flex-col justify-between gap-4 min-w-0 overflow-hidden"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-0 inset-x-0 h-[1.5px] bg-champagne origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
            />
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.22em] uppercase text-champagne">
                <ArrowLeft
                  className="size-3.5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-x-1.5 motion-reduce:transform-none"
                  aria-hidden="true"
                />
                Proyek Sebelumnya
              </span>
              <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] text-taupe">
                ENTRI {prevProject.index} · {prevProject.category}
              </p>
            </div>
            <span className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-ivory group-hover:text-champagne transition-colors duration-300 wrap-break-word">
              {prevProject.title}
            </span>
          </Link>

          <Link
            to={`/projects/${nextProject.slug}`}
            className="relative group p-6 sm:p-9 lg:p-14 hover:bg-obsidian/45 transition-colors duration-500 flex flex-col justify-between gap-4 md:items-end md:text-right min-w-0 overflow-hidden"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-0 inset-x-0 h-[1.5px] bg-champagne origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
            />
            <div className="space-y-1.5 md:flex md:flex-col md:items-end">
              <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.22em] uppercase text-champagne">
                Proyek Berikutnya
                <ArrowRight
                  className="size-3.5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1.5 motion-reduce:transform-none"
                  aria-hidden="true"
                />
              </span>
              <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] text-taupe">
                ENTRI {nextProject.index} · {nextProject.category}
              </p>
            </div>
            <span className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-ivory group-hover:text-champagne transition-colors duration-300 wrap-break-word">
              {nextProject.title}
            </span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getProjectBySlug(slug) : undefined;

  useEffect(() => {
    if (project) {
      document.title =
        project.slug === 'aflan-digital-identity'
          ? 'Studi Kasus: Identitas Digital Personal · AFLAN (AMDZ)'
          : `${project.title} · AFLAN (AMDZ)`;
    }
  }, [project]);

  if (!project) {
    return (
      <section className="min-h-[80vh] bg-obsidian text-ivory flex flex-col items-center justify-center px-4 sm:px-6 pt-24 pb-16 text-center">
        <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] font-medium text-champagne mb-4">
          ENTRI TIDAK DITEMUKAN
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-tight mb-6 text-ivory/95">
          Dossier proyek yang dicari tidak tersedia.
        </h1>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-champagne text-obsidian font-mono text-xs tracking-[0.18em] uppercase font-medium hover:bg-ivory transition-colors"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Kembali ke Arsip Proyek
        </Link>
      </section>
    );
  }

  return <ProjectCaseStudyContent key={project.slug} project={project} />;
};
