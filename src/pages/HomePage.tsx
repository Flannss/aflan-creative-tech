import React, { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  Compass,
  Github,
  Sparkles,
} from 'lucide-react';
import { personalData } from '@/data/personal';
import { contactData } from '@/data/contact';
import { projectsData } from '@/data/projects';
import { calculateExactAge } from '@/utils/age';
import { EASE_LUXURY, MOTION_DURATION } from '@/utils/motion';
import { useIsCoarsePointer, useMediaQuery } from '@/hooks/useMediaQuery';
import { EditorialMarquee } from '@/components/ui/EditorialMarquee';
import { Reveal, StaggerGroup, StaggerItem } from '@/components/motion/Reveal';
import { LineReveal } from '@/components/motion/LineReveal';
import { TextReveal } from '@/components/motion/TextReveal';
import { ProjectPreviewList } from '@/components/projects/ProjectPreviewList';
import { MonogramMark } from '@/components/brand/Monogram';

export const HomePage: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const isCoarsePointer = useIsCoarsePointer();
  const isDesktopLayout = useMediaQuery('(min-width: 1024px)');
  const disableMotion = Boolean(prefersReducedMotion);
  const [archHover, setArchHover] = useState<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  const handleArchPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disableMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
    const relY = ((e.clientY - rect.top) / rect.height - 0.5) * 14;
    setArchHover({ x: relX, y: relY, active: true });
  };

  const resetArchHover = () => {
    setArchHover({ x: 0, y: 0, active: false });
  };

  const heroRef = useRef<HTMLElement | null>(null);
  const philosophyRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const { scrollYProgress: philosophyProgress } = useScroll({
    target: philosophyRef,
    offset: ['start end', 'end start'],
  });

  // Layered subtle parallax across Hero background, typography, arch photo, and side columns
  const haloY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, disableMotion || !isDesktopLayout ? 0 : 24],
  );
  const portraitY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, disableMotion ? 0 : isCoarsePointer ? 16 : 44],
  );
  const portraitScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, disableMotion ? 1 : isCoarsePointer ? 1.03 : 1.06],
  );
  const wordmarkY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, disableMotion ? 0 : isCoarsePointer ? -14 : -42],
  );
  const wordmarkOpacity = useTransform(
    scrollYProgress,
    [0, 0.85],
    [1, disableMotion ? 1 : 0.72],
  );
  const dossierY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, disableMotion || !isDesktopLayout ? 0 : -18],
  );
  const copyY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, disableMotion || !isDesktopLayout ? 0 : 20],
  );
  const monogramCardY = useTransform(
    philosophyProgress,
    [0, 1],
    disableMotion || !isDesktopLayout ? [0, 0] : [16, -16],
  );

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
        className="relative min-h-svh bg-obsidian text-ivory flex flex-col justify-between pt-28 sm:pt-32 pb-12 px-6 sm:px-8 lg:px-12 overflow-hidden"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 studio-vignette" />
        <motion.div
          aria-hidden="true"
          style={{ y: haloY }}
          className="pointer-events-none absolute inset-x-0 top-12 h-[78vh] studio-warm-halo will-change-transform"
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

        {/* Center Layered Composition: Full Name Editorial Lockup + Parallax Portrait */}
        <div className="relative z-10 max-w-[1440px] w-full mx-auto my-auto py-6 sm:py-10 lg:py-12 flex flex-col items-center justify-center">
          <motion.div
            style={{ y: wordmarkY, opacity: wordmarkOpacity }}
            initial={disableMotion ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: MOTION_DURATION, ease: EASE_LUXURY }}
            className="relative z-20 w-full text-center select-none pointer-events-none mb-5 sm:mb-7 md:mb-8 lg:-mb-10 will-change-transform"
          >
            <h1
              aria-label="Aflan Mu'afa Dzulfiqar"
              className="font-serif font-light uppercase tracking-[0.14em] leading-[0.86] text-[clamp(3.35rem,15vw,5.4rem)] md:text-[clamp(5.8rem,15vw,8.8rem)] lg:text-[clamp(4.4rem,16.5vw,14.2rem)] text-ivory/95 drop-shadow-[0_12px_32px_rgba(23,22,21,0.85)]"
            >
              <span aria-hidden="true">AFLAN</span>
            </h1>
          </motion.div>

          <div className="relative w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 items-end gap-8 lg:gap-6 z-10">
            {/* Left Floating Identity Dossier */}
            <motion.aside
              style={{ y: dossierY }}
              initial={disableMotion ? false : { opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: MOTION_DURATION, delay: 0.22, ease: EASE_LUXURY }}
              className="order-2 md:col-span-1 lg:order-1 lg:col-span-4 lg:pb-8 will-change-transform"
            >
              <div className="border border-champagne/20 bg-espresso/70 backdrop-blur-md p-5 sm:p-6 max-w-md md:max-w-none lg:max-w-md">
                <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-champagne/15">
                  <span className="font-mono text-[10px] tracking-[0.26em] uppercase text-champagne">
                    DOSSIER · 01
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-taupe">
                    {personalData.coordinates}
                  </span>
                </div>

                <dl className="grid grid-cols-2 gap-x-4 gap-y-3.5 text-sm lg:text-xs">
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

            {/* Centerpiece Arch Window Portrait with Parallax Hover & Integrated Dossier Plate */}
            <div className="order-1 md:col-span-2 lg:order-2 lg:col-span-4 flex flex-col items-center relative">
              <motion.div
                style={{ y: portraitY }}
                initial={
                  disableMotion
                    ? false
                    : { opacity: 0, clipPath: 'inset(12% 0% 0% 0%)' }
                }
                animate={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
                transition={{ duration: MOTION_DURATION, delay: 0.1, ease: EASE_LUXURY }}
                onPointerMove={handleArchPointerMove}
                onPointerLeave={resetArchHover}
                onPointerUp={resetArchHover}
                whileTap={disableMotion ? undefined : { scale: 0.985 }}
                className="group relative z-10 w-full max-w-[295px] sm:max-w-[335px] lg:max-w-[345px] xl:max-w-[385px] aspect-[3/4] rounded-t-full rounded-b-lg p-2 border border-champagne/25 bg-espresso/30 shadow-[0_36px_100px_rgba(0,0,0,0.78)] transition-colors duration-500 hover:border-champagne/50"
              >
                <div className="relative w-full h-full rounded-t-full rounded-b-md overflow-hidden bg-obsidian">
                  <motion.div
                    style={{ scale: portraitScale }}
                    className="w-full h-full will-change-transform"
                  >
                    <motion.div
                      animate={
                        disableMotion
                          ? undefined
                          : {
                              x: archHover.x,
                              y: archHover.y,
                              scale: archHover.active ? 1.06 : 1.01,
                            }
                      }
                      transition={{ type: 'spring', stiffness: 150, damping: 20, mass: 0.8 }}
                      className="w-full h-full will-change-transform"
                    >
                      <img
                        src={personalData.portraitPath}
                        alt="Potret studio Aflan Mu'afa Dzulfiqar"
                        className="w-full h-full object-cover object-[50%_18%]"
                      />
                    </motion.div>
                  </motion.div>

                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-linear-to-t from-obsidian via-obsidian/20 to-transparent"
                  />

                  {/* Integrated Editorial Dossier Plate inside Arch Portrait Frame */}
                  <div className="absolute inset-x-0 bottom-0 z-20 px-5 sm:px-6 pb-5 pt-12 flex flex-col items-center text-center">
                    <div className="w-full flex items-center justify-between text-[10px] font-mono tracking-[0.22em] uppercase text-champagne/75 pb-2.5 mb-2.5 border-b border-champagne/15">
                      <span>POTRET · I</span>
                      <span>AMDZ</span>
                    </div>
                    <p
                      aria-hidden="true"
                      className="select-none flex flex-wrap items-baseline justify-center gap-x-2 sm:gap-x-2.5 font-serif italic font-light uppercase tracking-[0.09em] leading-none text-[clamp(1.2rem,4.5vw,1.8rem)] sm:text-[1.7rem] lg:text-[clamp(1.4rem,2vw,1.95rem)]"
                    >
                      <span className="text-champagne">MU&apos;AFA</span>{' '}
                      <span className="editorial-outline-strong">DZULFIQAR</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Asymmetric Editorial Intro & Primary CTAs */}
            <motion.div
              style={{ y: copyY }}
              initial={disableMotion ? false : { opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: MOTION_DURATION, delay: 0.28, ease: EASE_LUXURY }}
              className="order-3 md:col-span-1 lg:col-span-4 lg:pb-8 flex flex-col lg:items-end lg:text-right gap-5 lg:gap-6 will-change-transform"
            >
              <p
                aria-label="Membangun pengalaman web yang jernih dengan ketelitian kode dan kepekaan editorial."
                className="font-serif text-xl sm:text-2xl lg:text-[1.75rem] leading-[1.3] font-light text-ivory/95 max-w-md md:max-w-none lg:max-w-md"
              >
                <span aria-hidden="true">
                  {'Membangun '}
                  <span className="italic text-champagne">pengalaman web yang jernih</span>
                  {' dengan ketelitian kode dan kepekaan editorial.'}
                </span>
              </p>
              <p className="font-sans text-[15px] sm:text-base lg:text-sm leading-relaxed text-ivory/75 max-w-md md:max-w-none lg:max-w-md">
                {personalData.headlineDescriptor}
              </p>
              <div className="flex flex-wrap lg:justify-end gap-3 pt-1">
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-champagne text-obsidian font-mono text-xs tracking-[0.18em] uppercase font-medium hover:bg-ivory active:scale-[0.97] transition-all duration-300"
                >
                  Karya Terpilih
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full border border-champagne/40 bg-obsidian/50 text-ivory font-mono text-xs tracking-[0.18em] uppercase hover:border-champagne hover:bg-espresso active:scale-[0.97] active:bg-espresso transition-all duration-300"
                >
                  Tentang Aflan
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>

              <div className="flex flex-wrap items-center lg:justify-end gap-x-5 gap-y-2.5 pt-3 border-t border-champagne/15 w-full max-w-md md:max-w-none lg:max-w-md">
                <a
                  href={contactData.githubHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Profil GitHub Flannss"
                  className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.18em] uppercase text-ivory/80 hover:text-champagne transition-colors"
                >
                  <Github className="size-3.5" aria-hidden="true" />
                  <span>GitHub · Flannss</span>
                  <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </a>
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
          BAND 02B — THE IDENTITY & MONOGRAM PHILOSOPHY (SPATIAL BRIDGE)
      ====================================================================== */}
      <section
        ref={philosophyRef}
        aria-labelledby="monogram-philosophy-heading"
        className="relative bg-obsidian text-ivory py-20 sm:py-28 lg:py-32 px-6 sm:px-8 lg:px-12 border-b border-champagne/10 overflow-hidden"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 studio-warm-halo opacity-55"
        />

        <div className="relative z-10 max-w-[1440px] mx-auto">
          <Reveal
            variant="up"
            className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-12 lg:mb-16 border-b border-champagne/15"
          >
            <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.28em] uppercase text-champagne">
              THE IDENTITY — MONOGRAM PHILOSOPHY
            </span>
            <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-taupe">
              ANATOMI LAMBANG · AFLAN / AMDZ
            </span>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Split: Architectural Monogram Emblem Blueprint */}
            <motion.div
              style={{ y: monogramCardY }}
              className="lg:col-span-5 will-change-transform"
            >
              <Reveal variant="up">
                <div className="relative bg-espresso/65 border border-champagne/25 p-7 sm:p-10 shadow-[0_28px_80px_rgba(0,0,0,0.65)] overflow-hidden">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-15"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, rgba(216,195,165,0.28) 1px, transparent 1px), linear-gradient(to bottom, rgba(216,195,165,0.28) 1px, transparent 1px)',
                    backgroundSize: '36px 36px',
                  }}
                />

                <div className="relative z-10 flex items-center justify-between font-mono text-[10px] tracking-[0.22em] uppercase text-champagne/80 pb-5 border-b border-champagne/15">
                  <span>MONOGRAM · AMDZ</span>
                  <span>EST. 2005</span>
                </div>

                <div className="relative z-10 py-10 sm:py-12 flex flex-col items-center justify-center text-center">
                  <div className="relative flex items-center justify-center size-44 sm:size-52 rounded-full border border-dashed border-champagne/35 bg-obsidian/75 shadow-inner">
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-3 rounded-full border border-champagne/20"
                    />
                    <MonogramMark size={112} className="text-champagne" />
                  </div>

                  <div className="mt-7 space-y-1.5">
                    <p className="font-serif text-3xl sm:text-4xl tracking-[0.24em] uppercase font-light text-ivory">
                      AFLAN
                    </p>
                    <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-champagne">
                      A · M · D · Z
                    </p>
                  </div>
                </div>

                <div className="relative z-10 grid grid-cols-3 gap-2 pt-5 border-t border-champagne/15 font-mono text-[9px] tracking-[0.18em] uppercase text-taupe text-center">
                  <div className="p-2 bg-obsidian/60 border border-champagne/15">
                    <span className="block text-champagne">PUNCAK (A)</span>
                    <span>Struktur Kode</span>
                  </div>
                  <div className="p-2 bg-obsidian/60 border border-champagne/15">
                    <span className="block text-champagne">RUANG (M)</span>
                    <span>Estetika Editorial</span>
                  </div>
                  <div className="p-2 bg-obsidian/60 border border-champagne/15">
                    <span className="block text-champagne">TUMPUAN (DZ)</span>
                    <span>Pengujian QA</span>
                  </div>
                </div>
              </div>
              </Reveal>
            </motion.div>

            {/* Right Split: Deconstructed Brand Narrative & Pillars */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-4">
                <TextReveal
                  id="monogram-philosophy-heading"
                  as="h2"
                  className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.06] font-light text-ivory"
                  lines={[
                    <>Titik temu antara</>,
                    <>
                      <span className="italic text-champagne">logika pemrograman</span>{' '}
                      &amp;
                    </>,
                    <>estetika ruang editorial.</>,
                  ]}
                />
                <LineReveal
                  delay={0.08}
                  className="font-sans text-[15px] sm:text-base leading-[1.8] text-ivory/80 max-w-2xl"
                  lines={[
                    "Monogram AMDZ (Aflan Mu'afa Dzulfiqar) merangkum cara kerja saya:",
                    'memadukan struktur kode yang rapi dengan ketenangan komposisi tipografi editorial.',
                  ]}
                />
              </div>

              <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 pt-4 border-t border-champagne/15">
                {[
                  {
                    code: '01 · PUNCAK A',
                    title: 'Logika & Struktur',
                    desc: 'Garis segitiga luar mencerminkan arsitektur komponen web yang bersih, modular, dan mudah dirawat.',
                  },
                  {
                    code: '02 · RUANG DALAM',
                    title: 'Ruang Kreatif',
                    desc: 'Siluet ganda di bagian dalam terinspirasi dari semangat Satu Ruang Creative: proporsi yang lapang dan terarah.',
                  },
                  {
                    code: '03 · SUMBU DATAR',
                    title: 'Keseimbangan UI',
                    desc: 'Palang horizontal menjaga keselarasan antara karakter visual serif dan kemudahan navigasi di semua layar.',
                  },
                  {
                    code: '04 · TITIK TUMPU',
                    title: 'Ketelitian QA',
                    desc: 'Titik bulat di dasar lambang menjadi pengingat bahwa setiap fitur harus diuji dan diverifikasi di kondisi nyata.',
                  },
                ].map((item) => (
                  <StaggerItem
                    key={item.code}
                    className="pt-4 border-t border-champagne/15 sm:border-t-0 sm:pt-2 space-y-2"
                  >
                    <span className="block font-mono text-[10px] tracking-[0.22em] uppercase text-champagne/90">
                      {item.code}
                    </span>
                    <h3 className="font-serif text-2xl font-light text-ivory">
                      {item.title}
                    </h3>
                    <p className="font-sans text-sm leading-relaxed text-ivory/75">
                      {item.desc}
                    </p>
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          BAND 03 — LIGHT IVORY EDITORIAL MANIFESTO (LUAS & BREATHING ROOM)
      ====================================================================== */}
      <section className="relative bg-ivory text-espresso py-20 sm:py-28 lg:py-32 px-6 sm:px-8 lg:px-12 border-b border-espresso/10">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-start">
          <Reveal variant="up" className="lg:col-span-3 space-y-5">
            <p className="font-mono text-[10px] sm:text-[11px] tracking-[0.28em] uppercase text-mocha">
              BAB 01 — IDENTITAS
            </p>
            <div className="flex items-center gap-4">
              <span className="font-serif italic text-5xl sm:text-6xl lg:text-7xl leading-none text-espresso/20 select-none">
                01
              </span>
              <MonogramMark size={40} className="text-mocha" />
            </div>
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-espresso/65 pt-2">
              {personalData.status} · {personalData.studyProgram}
            </p>
          </Reveal>

          <div className="lg:col-span-9 space-y-10 lg:space-y-12">
            <TextReveal
              as="h2"
              className="font-serif text-[2rem] sm:text-4xl md:text-5xl lg:text-[4.1rem] leading-[1.1] lg:leading-[1.06] font-light text-espresso max-w-4xl"
              lines={[
                <>Sederhana, jernih, dan terarah—</>,
                <>
                  <span className="italic text-mocha">antarmuka interaktif</span> yang
                  fungsional,
                </>,
                <>teruji, dan nyaman digunakan.</>,
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
                  <dl className="divide-y divide-espresso/10 text-[15px] md:text-sm">
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
      <section className="relative bg-espresso text-ivory py-20 sm:py-28 lg:py-32 px-6 sm:px-8 lg:px-12">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 sm:mb-16 lg:mb-20">
            <div className="space-y-4">
              <p className="font-mono text-[10px] sm:text-[11px] tracking-[0.28em] uppercase text-champagne">
                BAB 02 — KARYA TERPILIH &amp; SOFTWARE QA
              </p>
              <TextReveal
                as="h2"
                className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[4rem] font-light leading-[1.06] lg:leading-[1.04]"
                lines={[
                  <>
                    Indeks <span className="italic text-champagne">Terkurasi</span>
                  </>,
                ]}
              />
            </div>

            <Reveal variant="up" delay={0.1} className="max-w-md space-y-4">
              <p className="font-sans text-[15px] sm:text-base lg:text-sm text-ivory/75 leading-relaxed">
                Kumpulan karya pengembangan web, aplikasi mobile kampus, serta evaluasi
                kualitas perangkat lunak—disajikan transparan sesuai peran dan kontribusi
                aktual.
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
      <section className="relative bg-offwhite text-espresso py-20 sm:py-28 lg:py-32 px-6 sm:px-8 lg:px-12">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 lg:mb-14">
            <div>
              <p className="font-mono text-[10px] sm:text-[11px] tracking-[0.28em] uppercase text-mocha mb-3">
                BAB 03 — EKSPLORASI LANJUTAN
              </p>
              <TextReveal
                as="h2"
                className="font-serif text-3xl sm:text-4xl md:text-5xl font-light leading-tight text-espresso"
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-7">
            <Reveal variant="up" className="md:col-span-2 lg:col-span-7">
              <Link
                to="/lab"
                data-cursor="BUKA LAB"
                className="group relative flex flex-col justify-between min-h-[340px] sm:min-h-[380px] lg:min-h-[450px] p-7 sm:p-9 lg:p-11 bg-obsidian text-ivory border border-espresso/20 active:scale-[0.99] transition-transform overflow-hidden"
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

                <div className="relative z-10 mt-auto pt-12 sm:pt-14 space-y-4">
                  <p
                    aria-label="Sistem Visual Interaktif"
                    className="font-serif italic text-[2.25rem] sm:text-5xl lg:text-6xl leading-[0.98] lg:leading-[0.96] font-light text-champagne"
                  >
                    <span aria-hidden="true">
                      {'Sistem Visual '}
                      <span className="block not-italic text-ivory">Interaktif</span>
                    </span>
                  </p>
                  <p className="font-sans text-[15px] sm:text-base text-ivory/75 max-w-lg leading-relaxed">
                    Jelajahi kompositor tipografi editorial, kanvas chiaroscuro interaktif,
                    koreografi kurva motion, serta matriks kontras warna WCAG secara langsung.
                  </p>
                </div>
              </Link>
            </Reveal>

            <div className="md:col-span-2 md:grid md:grid-cols-2 lg:col-span-5 lg:flex lg:flex-col gap-6 lg:gap-7">
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
                    <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-espresso group-hover:text-mocha transition-colors">
                      Linimasa &amp; <span className="italic">Pengalaman</span>
                    </h3>
                    <p className="mt-2.5 font-sans text-[15px] sm:text-base lg:text-sm text-charcoal/80 leading-relaxed">
                      Dari studi Teknologi Informasi di Universitas Amikom Purwokerto hingga
                      magang Programmer Intern di PT Puskomedia Indonesia Kreatif.
                    </p>
                  </div>
                </Link>
              </Reveal>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-7">
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
                      <p className="mt-1.5 text-sm lg:text-xs text-ivory/80">
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
                      <p className="mt-1.5 text-sm lg:text-xs text-charcoal/75">
                        Web, Mobile, UI/UX &amp; Software QA terkurasi.
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
