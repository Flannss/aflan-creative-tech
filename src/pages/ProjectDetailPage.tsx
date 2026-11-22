import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { getProjectBySlug, projectsData } from '@/data/projects';
import { TypographicDossierPlate } from '@/components/projects/TypographicDossierPlate';
import { Reveal } from '@/components/motion/Reveal';
import { TextReveal } from '@/components/motion/TextReveal';
import { ParallaxFrame } from '@/components/motion/ParallaxFrame';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getProjectBySlug(slug) : undefined;

  useEffect(() => {
    if (project) {
      document.title =
        project.slug === 'aflan-digital-identity'
          ? 'Studi Kasus: Identitas Digital Personal — AFLAN (AMDZ)'
          : `${project.title} — AFLAN (AMDZ)`;
    }
  }, [project]);

  if (!project) {
    return (
      <section className="min-h-[80vh] bg-obsidian text-ivory flex flex-col items-center justify-center px-6 sm:px-8 pt-28 pb-20 text-center">
        <p className="font-mono text-xs tracking-[0.26em] uppercase text-champagne mb-4">
          ENTRI TIDAK DITEMUKAN
        </p>
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light mb-6">
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

  const currentIdx = projectsData.findIndex((p) => p.slug === project.slug);
  const prevProject =
    projectsData[(currentIdx - 1 + projectsData.length) % projectsData.length];
  const nextProject = projectsData[(currentIdx + 1) % projectsData.length];

  return (
    <div className="w-full overflow-x-clip">
      <section className="relative bg-obsidian text-ivory pt-28 sm:pt-36 lg:pt-40 pb-16 sm:pb-24 px-6 sm:px-8 lg:px-12 border-b border-champagne/15">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-champagne/15">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.22em] uppercase text-champagne hover:text-ivory transition-colors"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              Kembali ke Arsip Proyek
            </Link>
            <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-taupe">
              ENTRI {project.index} · {project.category}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 pt-12 lg:pt-14 items-end">
            <div className="lg:col-span-8 space-y-5">
              <span className="inline-block font-mono text-[10px] tracking-[0.22em] uppercase px-3 py-1 border border-champagne/30 text-champagne">
                {project.verificationState}
              </span>
              <TextReveal
                as="h1"
                immediate
                className="font-serif text-[2.1rem] sm:text-5xl md:text-6xl lg:text-[4.6rem] leading-[1.06] lg:leading-[1.02] font-light"
                lines={[project.title]}
              />
              <p className="font-sans text-base sm:text-lg text-ivory/75 max-w-2xl leading-relaxed">
                {project.subtitle}
              </p>
            </div>

            <Reveal variant="up" delay={0.1} className="lg:col-span-4 min-w-0 lg:text-right space-y-3">
              <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-taupe">
                LINIMASA / STATUS
              </p>
              <p className="font-serif text-2xl text-champagne">{project.yearLabel}</p>

              {project.liveUrl && (
                <div className="pt-2 flex lg:justify-end">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 max-w-full min-w-0 overflow-hidden px-4 xl:px-5 py-2.5 rounded-full bg-champagne text-obsidian font-mono text-[11px] xl:text-xs tracking-[0.12em] xl:tracking-[0.16em] uppercase font-medium hover:bg-ivory active:scale-[0.97] transition-all"
                  >
                    <span className="truncate text-ellipsis">
                      {project.liveUrlLabel ?? 'Kunjungi Situs Live'}
                    </span>
                    <ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
                  </a>
                </div>
              )}

              {project.liveRoute && (
                <div className="pt-2">
                  <Link
                    to={project.liveRoute}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-champagne text-obsidian font-mono text-xs tracking-[0.18em] uppercase font-medium hover:bg-ivory transition-colors"
                  >
                    Buka Creative Lab
                    <ArrowUpRight className="size-4" aria-hidden="true" />
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

      <section className="bg-ivory text-espresso py-16 sm:py-24 lg:py-28 px-6 sm:px-8 lg:px-12">
        <div className="max-w-[1440px] mx-auto space-y-12 sm:space-y-16">
          <Reveal variant="clip">
            <figure className="border border-espresso/20 bg-obsidian overflow-hidden shadow-2xl">
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
              <figcaption className="px-5 sm:px-6 py-4 bg-obsidian text-champagne/85 font-mono text-[11px] tracking-[0.18em] uppercase border-t border-champagne/15 flex flex-wrap justify-between gap-2">
                <span>{project.previewCaption}</span>
                <span>ARSIP AMDZ</span>
              </figcaption>
            </figure>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 items-start">
            <Reveal variant="up" className="md:col-span-5 lg:col-span-4 space-y-6">
              <div className="bg-offwhite border border-espresso/15 p-6 sm:p-7 space-y-6">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-mocha">
                    PLATFORM
                  </p>
                  <p className="font-sans text-[15px] lg:text-sm font-medium text-espresso mt-1">
                    {project.platform}
                  </p>
                </div>

                <div className="pt-5 border-t border-espresso/15">
                  <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-mocha">
                    PERAN &amp; TANGGUNG JAWAB
                  </p>
                  <p className="font-serif text-xl sm:text-2xl text-espresso mt-1.5 leading-snug">
                    {project.role}
                  </p>
                </div>

                <div className="pt-5 border-t border-espresso/15">
                  <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-mocha">
                    ATRIBUSI KONTRIBUSI
                  </p>
                  <p className="font-sans text-[15px] lg:text-sm text-charcoal/85 mt-2 leading-relaxed">
                    {project.contributionScope}
                  </p>
                </div>

                {project.notableWork && (
                  <div className="pt-5 border-t border-espresso/15">
                    <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-mocha">
                      NOTABLE WORK
                    </p>
                    <p className="font-sans text-[15px] lg:text-sm text-espresso font-medium mt-2 leading-relaxed">
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
                        className="px-3 py-1 bg-ivory border border-espresso/20 font-mono text-[10px] tracking-[0.14em] uppercase text-espresso"
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
                      className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] uppercase text-espresso border-b border-espresso pb-1 hover:text-mocha hover:border-mocha transition-colors"
                    >
                      Buka Tautan Live
                      <ExternalLink className="size-3.5" aria-hidden="true" />
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
                <div className="space-y-5 font-sans text-base sm:text-[1.06rem] leading-[1.85] text-charcoal">
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

      <section className="bg-espresso text-ivory border-t border-champagne/15">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-champagne/15">
          <Link
            to={`/projects/${prevProject.slug}`}
            className="group p-6 sm:p-9 lg:p-14 hover:bg-obsidian/40 transition-colors flex flex-col justify-between gap-4"
          >
            <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.22em] uppercase text-champagne">
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              Entri Sebelumnya · {prevProject.index}
            </span>
            <span className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-ivory group-hover:text-champagne transition-colors">
              {prevProject.title}
            </span>
          </Link>

          <Link
            to={`/projects/${nextProject.slug}`}
            className="group p-6 sm:p-9 lg:p-14 hover:bg-obsidian/40 transition-colors flex flex-col justify-between gap-4 md:items-end md:text-right"
          >
            <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.22em] uppercase text-champagne">
              Entri Berikutnya · {nextProject.index}
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </span>
            <span className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-ivory group-hover:text-champagne transition-colors">
              {nextProject.title}
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
};
