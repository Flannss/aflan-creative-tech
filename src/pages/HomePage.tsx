import React, { useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Compass, Sparkles } from 'lucide-react';
import { personalData } from '@/data/personal';
import { projectsData } from '@/data/projects';
import { calculateExactAge } from '@/utils/age';
import { EASE_LUXURY } from '@/utils/motion';
import { useIsCoarsePointer } from '@/hooks/useMediaQuery';
import { EditorialMarquee } from '@/components/ui/EditorialMarquee';
import { Reveal } from '@/components/motion/Reveal';
import { TextReveal } from '@/components/motion/TextReveal';
import { ProjectPreviewList } from '@/components/projects/ProjectPreviewList';
import { MonogramMark } from '@/components/brand/Monogram';

export const HomePage: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const isCoarsePointer = useIsCoarsePointer();
  const disableParallax = Boolean(prefersReducedMotion || isCoarsePointer);

  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const portraitY = useTransform(scrollYProgress, [0, 1], [0, disableParallax ? 0 : 54]);
  const portraitScale = useTransform(scrollYProgress, [0, 1], [1, disableParallax ? 1 : 1.07]);
  const wordmarkY = useTransform(scrollYProgress, [0, 1], [0, disableParallax ? 0 : -44]);

  const ageInfo = useMemo(() => calculateExactAge(personalData.birthDateISO), []);
  const featuredProjects = useMemo(
    () => projectsData.filter((p) => p.featuredOnHome),
    [],
  );

  return (
    <div className="w-full overflow-x-clip">
      {/* =====================================================================
          BAND 01 — CINEMATIC EDITORIAL HERO (OBSIDIAN & WARM STUDIO LIGHTING)
      ====================================================================== */}
      <section
        ref={heroRef}
        className="relative min-h-svh bg-obsidian text-ivory flex flex-col justify-between pt-28 sm:pt-32 pb-12 px-5 sm:px-8 lg:px-12 overflow-hidden"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 studio-vignette" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-12 h-[78vh] studio-warm-halo"
        />

        {/* Top Editorial Meta Strip */}
        <div className="relative z-20 max-w-[1440px] w-full mx-auto flex flex-wrap items-center justify-between gap-4 border-b border-champagne/15 pb-4">
          <div className="flex items-center gap-3">
            <span className="inline-block size-2 rounded-full bg-champagne" aria-hidden="true" />
            <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-champagne">
              {personalData.positioning}
            </span>
          </div>
          <div className="flex items-center gap-6 font-mono text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-taupe">
            <span>{personalData.currentLocation}</span>
            <span className="hidden sm:inline text-champagne/80">
              USIA {ageInfo.age} · EST. {ageInfo.birthYear}
            </span>
          </div>
        </div>

        {/* Center Layered Composition: Back Wordmark + Parallax Portrait + Front Outline Wordmark */}
        <div className="relative z-10 max-w-[1440px] w-full mx-auto my-auto py-8 sm:py-12 flex flex-col items-center justify-center">
          <motion.div
            style={{ y: wordmarkY }}
            initial={disableParallax ? false : { opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.05, ease: EASE_LUXURY }}
            className="w-full text-center select-none pointer-events-none -mb-10 sm:-mb-16 md:-mb-20 lg:-mb-24 z-0"
          >
            <h1 className="font-serif font-light uppercase tracking-[0.14em] leading-[0.82] text-[clamp(4.4rem,18vw,15.5rem)] text-ivory/95">
              AFLAN
            </h1>
          </motion.div>

          <div className="relative w-full grid grid-cols-1 lg:grid-cols-12 items-end gap-8 lg:gap-6 z-10">
            {/* Left Floating Identity Dossier */}
            <motion.aside
              initial={disableParallax ? false : { opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.95, delay: 0.34, ease: EASE_LUXURY }}
              className="order-2 lg:order-1 lg:col-span-4 lg:pb-8"
            >
              <div className="border border-champagne/20 bg-espresso/70 backdrop-blur-md p-5 sm:p-6 max-w-md">
                <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-champagne/15">
                  <span className="font-mono text-[10px] tracking-[0.26em] uppercase text-champagne">
                    DOSSIER · 01
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-taupe">
                    {personalData.coordinates}
                  </span>
                </div>

                <dl className="grid grid-cols-2 gap-x-4 gap-y-3.5 text-xs">
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-taupe">
                      Nama Lengkap
                    </dt>
                    <dd className="text-ivory mt-0.5 font-medium">
                      {personalData.fullName}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-taupe">
                      Usia Aktual
                    </dt>
                    <dd className="text-champagne mt-0.5 font-medium">
                      {ageInfo.age} Tahun
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-taupe">
                      Universitas
                    </dt>
                    <dd className="text-ivory/90 mt-0.5">{personalData.university}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-taupe">
                      Pengalaman Magang
                    </dt>
                    <dd className="text-ivory/90 mt-0.5">
                      {personalData.internship.company}
                    </dd>
                  </div>
                </dl>
              </div>
            </motion.aside>

            {/* Centerpiece Studio Portrait with Smooth Parallax & Front Outlined Surname */}
            <div className="order-1 lg:order-2 lg:col-span-4 flex flex-col items-center relative">
              <motion.div
                style={{ y: portraitY }}
                initial={
                  disableParallax
                    ? false
                    : { opacity: 0, clipPath: 'inset(14% 0% 0% 0%)' }
                }
                animate={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
                transition={{ duration: 1.15, delay: 0.14, ease: EASE_LUXURY }}
                className="relative w-full max-w-[300px] sm:max-w-[340px] lg:max-w-[345px] xl:max-w-[385px] aspect-4/5 overflow-hidden border border-champagne/30 bg-obsidian shadow-[0_32px_90px_rgba(0,0,0,0.75)]"
              >
                <motion.img
                  style={{ scale: portraitScale }}
                  src={personalData.portraitPath}
                  alt="Potret studio Aflan Mu'afa Dzulfiqar"
                  className="w-full h-full object-cover object-[50%_18%] will-change-transform"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-linear-to-t from-obsidian/85 via-transparent to-obsidian/15"
                />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[10px] font-mono tracking-[0.22em] uppercase text-champagne/85">
                  <span>POTRET · I</span>
                  <span>AMDZ</span>
                </div>
              </motion.div>

              <motion.p
                initial={disableParallax ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, delay: 0.32, ease: EASE_LUXURY }}
                aria-hidden="true"
                className="pointer-events-none select-none -mt-7 sm:-mt-9 md:-mt-10 z-20 font-serif italic font-light uppercase tracking-[0.11em] leading-none text-[clamp(1.85rem,4.3vw,3.95rem)] editorial-outline-strong whitespace-nowrap"
              >
                DZULFIQAR
              </motion.p>
            </div>

            {/* Right Asymmetric Editorial Intro & Primary CTAs */}
            <motion.div
              initial={disableParallax ? false : { opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.95, delay: 0.4, ease: EASE_LUXURY }}
              className="order-3 lg:col-span-4 lg:pb-8 flex flex-col lg:items-end lg:text-right gap-6"
            >
              <p className="font-serif text-2xl sm:text-[1.75rem] leading-[1.3] font-light text-ivory/95 max-w-md">
                Membangun{' '}
                <span className="italic text-champagne">Seamless Digital Experience</span>{' '}
                dengan presisi teknis dan rasa editorial.
              </p>
              <p className="font-sans text-sm leading-relaxed text-ivory/75 max-w-md">
                {personalData.headlineDescriptor}
              </p>
              <div className="flex flex-wrap lg:justify-end gap-3 pt-1">
                <Link
                  to="/projects"
                  data-cursor="PROYEK"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-champagne text-obsidian font-mono text-xs tracking-[0.18em] uppercase font-medium hover:bg-ivory transition-colors duration-300"
                >
                  Karya Terpilih
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/about"
                  data-cursor="TENTANG"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full border border-champagne/40 bg-obsidian/50 text-ivory font-mono text-xs tracking-[0.18em] uppercase hover:border-champagne hover:bg-espresso transition-colors duration-300"
                >
                  Tentang Aflan
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Scroll Indicator */}
        <div className="relative z-20 max-w-[1440px] w-full mx-auto pt-4 flex items-end justify-between gap-4">
          <div className="font-mono text-[10px] tracking-[0.24em] uppercase text-taupe">
            <span>2 DESEMBER 2005</span>
            <span className="mx-2 text-champagne/40">/</span>
            <span>TANGERANG → PURWOKERTO</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] tracking-[0.26em] uppercase text-champagne/80">
              Gulir untuk Menjelajah
            </span>
            <span className="relative block w-px h-10 bg-champagne/20 overflow-hidden" aria-hidden="true">
              <span className="aflan-scroll-line absolute inset-0 bg-champagne" />
            </span>
          </div>
        </div>
      </section>

      {/* =====================================================================
          BAND 02 — SEAMLESS BRAND MARQUEE
      ====================================================================== */}
      <EditorialMarquee variant="espresso" />

      {/* =====================================================================
          BAND 03 — LIGHT IVORY EDITORIAL MANIFESTO (LUAS & BREATHING ROOM)
      ====================================================================== */}
      <section className="relative bg-ivory text-espresso py-24 sm:py-32 lg:py-40 px-5 sm:px-8 lg:px-12 border-b border-espresso/10">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-12 items-start">
          <Reveal variant="up" className="lg:col-span-3 space-y-5">
            <p className="font-mono text-[10px] sm:text-[11px] tracking-[0.28em] uppercase text-mocha">
              BAB 01 — IDENTITAS
            </p>
            <div className="flex items-center gap-4">
              <span className="font-serif italic text-6xl sm:text-7xl leading-none text-espresso/20 select-none">
                01
              </span>
              <MonogramMark size={40} className="text-mocha" />
            </div>
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-espresso/65 pt-2">
              {personalData.status} · {personalData.studyProgram}
            </p>
          </Reveal>

          <div className="lg:col-span-9 space-y-12">
            <TextReveal
              as="h2"
              className="font-serif text-4xl sm:text-5xl lg:text-[4.1rem] leading-[1.06] font-light text-espresso max-w-4xl"
              lines={[
                <>Elegan bukan berarti kosong—melainkan</>,
                <>
                  <span className="italic text-mocha">Interactive UI Implementation</span>{' '}
                  yang terukur,
                </>,
                <>teruji, dan punya karakter kuat.</>,
              ]}
            />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pt-8 border-t border-espresso/15">
              <Reveal variant="up" delay={0.12} className="md:col-span-7 space-y-6">
                <p className="font-sans text-base sm:text-lg leading-[1.8] text-charcoal/90">
                  {personalData.shortBio}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {personalData.traits.map((trait) => (
                    <span
                      key={trait}
                      className="px-3.5 py-1.5 border border-espresso/20 bg-offwhite font-mono text-[10px] tracking-[0.16em] uppercase text-espresso"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
                <div className="pt-3">
                  <Link
                    to="/about"
                    data-cursor="PROFIL"
                    className="group inline-flex items-center gap-2.5 font-mono text-xs tracking-[0.2em] uppercase text-espresso border-b border-espresso pb-1.5 hover:text-mocha hover:border-mocha transition-colors"
                  >
                    Baca Dossier Lengkap
                    <ArrowRight
                      className="size-4 group-hover:translate-x-1 transition-transform"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </Reveal>

              <Reveal variant="up" delay={0.18} className="md:col-span-5">
                <div className="bg-offwhite border border-espresso/15 p-6 sm:p-7 space-y-4">
                  <p className="font-mono text-[10px] tracking-[0.26em] uppercase text-mocha">
                    RINGKASAN TERVERIFIKASI
                  </p>
                  <dl className="divide-y divide-espresso/10 text-sm">
                    <div className="py-3 flex justify-between gap-4">
                      <dt className="text-espresso/65">Tempat Lahir</dt>
                      <dd className="font-medium text-espresso text-right">
                        {personalData.birthplace}
                      </dd>
                    </div>
                    <div className="py-3 flex justify-between gap-4">
                      <dt className="text-espresso/65">Domisili</dt>
                      <dd className="font-medium text-espresso text-right">
                        {personalData.currentLocation}
                      </dd>
                    </div>
                    <div className="py-3 flex justify-between gap-4">
                      <dt className="text-espresso/65">Usia (Real-Time)</dt>
                      <dd className="font-medium text-mocha text-right">
                        {ageInfo.age} Tahun · 2 Des 2005
                      </dd>
                    </div>
                    <div className="py-3 flex justify-between gap-4">
                      <dt className="text-espresso/65">Universitas</dt>
                      <dd className="font-medium text-espresso text-right">
                        {personalData.university}
                      </dd>
                    </div>
                    <div className="py-3 flex justify-between gap-4">
                      <dt className="text-espresso/65">Magang</dt>
                      <dd className="font-medium text-espresso text-right">
                        PT Puskomedia Indonesia Kreatif (Sep 2026 – Jan 2027)
                      </dd>
                    </div>
                  </dl>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          BAND 04 — DARK ESPRESSO SELECTED WORK & EVALUATION ARCHIVE
      ====================================================================== */}
      <section className="relative bg-espresso text-ivory py-24 sm:py-32 lg:py-40 px-5 sm:px-8 lg:px-12">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14 sm:mb-20">
            <div className="space-y-4">
              <p className="font-mono text-[10px] sm:text-[11px] tracking-[0.28em] uppercase text-champagne">
                BAB 02 — KARYA TERPILIH &amp; SOFTWARE QA
              </p>
              <TextReveal
                as="h2"
                className="font-serif text-4xl sm:text-5xl lg:text-[4rem] font-light leading-[1.04]"
                lines={[
                  <>
                    Indeks <span className="italic text-champagne">Terkurasi</span>
                  </>,
                ]}
              />
            </div>

            <Reveal variant="up" delay={0.1} className="max-w-md space-y-4">
              <p className="font-sans text-sm text-ivory/75 leading-relaxed">
                Arahkan kursor pada tiap baris di desktop untuk melihat pratinjau visual.
                Setiap proyek disusun jujur—membedakan peran QA, prototipe, dan pengembangan
                mandiri secara transparan.
              </p>
              <Link
                to="/projects"
                data-cursor="ARSIP"
                className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.2em] uppercase text-champagne hover:text-ivory transition-colors"
              >
                Jelajahi Seluruh Proyek
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </Reveal>
          </div>

          <ProjectPreviewList projects={featuredProjects} />
        </div>
      </section>

      {/* =====================================================================
          BAND 05 — OFF-WHITE ASYMMETRIC EXPLORATION DOORS
      ====================================================================== */}
      <section className="relative bg-offwhite text-espresso py-24 sm:py-32 lg:py-40 px-5 sm:px-8 lg:px-12">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
            <div>
              <p className="font-mono text-[10px] sm:text-[11px] tracking-[0.28em] uppercase text-mocha mb-3">
                BAB 03 — EKSPLORASI LANJUTAN
              </p>
              <TextReveal
                as="h2"
                className="font-serif text-4xl sm:text-5xl font-light leading-tight text-espresso"
                lines={[
                  <>
                    Masuk ke Dalam <span className="italic text-mocha">Arsip</span>
                  </>,
                ]}
              />
            </div>
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-espresso/60">
              SEMBILAN BAB TERHUBUNG
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
            <Reveal variant="up" className="lg:col-span-7">
              <Link
                to="/lab"
                data-cursor="BUKA LAB"
                className="group relative flex flex-col justify-between min-h-[380px] sm:min-h-[450px] p-8 sm:p-11 bg-obsidian text-ivory border border-espresso/20 overflow-hidden"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 studio-warm-halo opacity-80 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="relative z-10 flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.24em] uppercase text-champagne">
                    <Sparkles className="size-3.5" aria-hidden="true" />
                    06 · CREATIVE LAB
                  </span>
                  <span className="size-10 rounded-full border border-champagne/35 flex items-center justify-center text-champagne group-hover:bg-champagne group-hover:text-obsidian transition-colors">
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </span>
                </div>

                <div className="relative z-10 mt-auto pt-14 space-y-4">
                  <p className="font-serif italic text-5xl sm:text-6xl leading-[0.96] font-light text-champagne">
                    Ruang Eksperimen
                    <span className="block not-italic text-ivory">Interaktif</span>
                  </p>
                  <p className="font-sans text-sm sm:text-base text-ivory/75 max-w-lg leading-relaxed">
                    Uji langsung kompositor tipografi editorial, kanvas chiaroscuro interaktif,
                    kurva easing motion, serta kalkulator kontras warna WCAG.
                  </p>
                </div>
              </Link>
            </Reveal>

            <div className="lg:col-span-5 flex flex-col gap-7">
              <Reveal variant="up" delay={0.08} className="flex-1">
                <Link
                  to="/journey"
                  data-cursor="LINIMASA"
                  className="group h-full flex flex-col justify-between p-7 sm:p-9 bg-ivory border border-espresso/15 hover:border-mocha transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.24em] uppercase text-mocha">
                      <Compass className="size-3.5" aria-hidden="true" />
                      03 · PERJALANAN
                    </span>
                    <ArrowUpRight
                      className="size-4 text-espresso/60 group-hover:text-mocha group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="pt-8">
                    <h3 className="font-serif text-3xl sm:text-4xl font-light text-espresso group-hover:text-mocha transition-colors">
                      Linimasa &amp; <span className="italic">Pengalaman</span>
                    </h3>
                    <p className="mt-2.5 font-sans text-sm text-charcoal/80 leading-relaxed">
                      Dari studi Teknologi Informasi di Universitas Amikom Purwokerto hingga
                      magang Programmer Intern di PT Puskomedia Indonesia Kreatif.
                    </p>
                  </div>
                </Link>
              </Reveal>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                <Reveal variant="up" delay={0.14}>
                  <Link
                    to="/gallery"
                    data-cursor="GALERI"
                    className="group h-full flex flex-col justify-between p-6 sm:p-7 bg-chocolate text-ivory border border-champagne/15 hover:bg-espresso transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-champagne">
                        07 · GALERI
                      </span>
                      <ArrowUpRight className="size-4 text-champagne" aria-hidden="true" />
                    </div>
                    <div className="pt-7">
                      <h3 className="font-serif text-2xl font-light text-ivory">
                        Edisi Monograf
                      </h3>
                      <p className="mt-1.5 text-xs text-ivory/70">
                        Potret studio, studi tonal &amp; lightbox.
                      </p>
                    </div>
                  </Link>
                </Reveal>

                <Reveal variant="up" delay={0.18}>
                  <Link
                    to="/skills"
                    data-cursor="KEAHLIAN"
                    className="group h-full flex flex-col justify-between p-6 sm:p-7 bg-ivory text-espresso border border-espresso/15 hover:border-mocha transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-mocha">
                        04 · KEAHLIAN
                      </span>
                      <ArrowUpRight className="size-4 text-mocha" aria-hidden="true" />
                    </div>
                    <div className="pt-7">
                      <h3 className="font-serif text-2xl font-light text-espresso">
                        Hierarki Stack
                      </h3>
                      <p className="mt-1.5 text-xs text-charcoal/75">
                        Web, Mobile, UI/UX &amp; QA tanpa progress bar.
                      </p>
                    </div>
                  </Link>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
