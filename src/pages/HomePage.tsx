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
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { EditorialMarquee } from '@/components/ui/EditorialMarquee';
import { KineticLabel } from '@/components/motion/KineticLabel';
import { HairlineRule, Reveal, StaggerGroup, StaggerItem } from '@/components/motion/Reveal';
import { TextReveal } from '@/components/motion/TextReveal';
import { ProjectPreviewList } from '@/components/projects/ProjectPreviewList';
import { MonogramMark } from '@/components/brand/Monogram';

export const HomePage: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const isTabletOrDesktop = useMediaQuery('(min-width: 768px)');
  const isDesktopLayout = useMediaQuery('(min-width: 1024px)');
  const disableMotion = Boolean(prefersReducedMotion);
  const enableHeroParallax = isTabletOrDesktop && !disableMotion;
  const [archHover, setArchHover] = useState<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  const handleArchPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!enableHeroParallax || e.pointerType === 'touch') return;
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

  const haloY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, !isDesktopLayout || disableMotion ? 0 : 22],
  );
  const portraitY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, enableHeroParallax ? (isDesktopLayout ? 38 : 18) : 0],
  );
  const portraitScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, enableHeroParallax ? (isDesktopLayout ? 1.05 : 1.03) : 1],
  );
  const wordmarkY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, enableHeroParallax ? (isDesktopLayout ? -36 : -16) : 0],
  );
  const wordmarkOpacity = useTransform(
    scrollYProgress,
    [0, 0.85],
    [1, enableHeroParallax ? 0.76 : 1],
  );
  const dossierY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, !isDesktopLayout || disableMotion ? 0 : -16],
  );
  const copyY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, !isDesktopLayout || disableMotion ? 0 : 18],
  );
  const monogramCardY = useTransform(
    philosophyProgress,
    [0, 1],
    !isDesktopLayout || disableMotion ? [0, 0] : [14, -14],
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
        className="relative bg-obsidian text-ivory flex flex-col justify-between pt-24 sm:pt-28 pb-10 sm:pb-12 px-4 sm:px-6 lg:px-12 overflow-hidden"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 studio-vignette" />
        <motion.div
          aria-hidden="true"
          style={{ y: haloY }}
          className="pointer-events-none absolute inset-x-0 top-12 h-[72vh] studio-warm-halo will-change-transform"
        />

        {/* Top Editorial Meta Strip */}
        <div className="relative z-20 max-w-[1440px] w-full mx-auto flex flex-wrap items-center justify-between gap-4 border-b border-champagne/15 pb-3.5">
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

        {/* Center Layered Composition: Restrained Editorial Lockup + Separated Arch Portrait */}
        <div className="relative z-10 max-w-[1440px] w-full mx-auto py-6 sm:py-8 lg:py-9 flex flex-col items-center justify-center">
          <motion.div
            style={{ y: wordmarkY, opacity: wordmarkOpacity }}
            initial={disableMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: MOTION_DURATION, ease: EASE_LUXURY }}
            className="relative z-20 w-full text-center select-none mb-5 md:mb-7 will-change-transform"
          >
            <h1
              aria-label="AFLAN · Aflan Mu'afa Dzulfiqar"
              className="font-display font-['Bodoni_Moda',Georgia,serif] font-normal uppercase text-ivory leading-[0.88] text-center select-none text-[3.25rem] sm:text-7xl md:text-[5.25rem] lg:text-[6.25rem] xl:text-[7rem] tracking-[0.22em] pl-[0.22em] sm:tracking-[0.28em] sm:pl-[0.28em] lg:tracking-[0.36em] lg:pl-[0.36em] drop-shadow-[0_10px_30px_rgba(23,22,21,0.75)]"
            >
              AFLAN
            </h1>
          </motion.div>

          <div className="relative w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 items-end gap-7 lg:gap-6 z-10">
            {/* Left Floating Identity Dossier */}
            <motion.aside
              style={{ y: dossierY }}
              initial={disableMotion ? false : { opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: MOTION_DURATION, delay: 0.22, ease: EASE_LUXURY }}
              className="order-2 md:col-span-1 lg:order-1 lg:col-span-4 lg:pb-4 will-change-transform"
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

                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3.5 text-sm lg:text-xs">
                  <div>
                    <dt
                      id="hero-dossier-fullname"
                      className="font-mono text-[10px] uppercase tracking-[0.18em] text-taupe"
                    >
                      Nama Lengkap
                    </dt>
                    <dd
                      aria-labelledby="hero-dossier-fullname"
                      className="text-ivory mt-0.5 font-medium"
                    >
                      {personalData.fullName}
                    </dd>
                  </div>
                  <div>
                    <dt
                      id="hero-dossier-age"
                      className="font-mono text-[10px] uppercase tracking-[0.18em] text-taupe"
                    >
                      Usia Aktual
                    </dt>
                    <dd
                      aria-labelledby="hero-dossier-age"
                      className="text-champagne mt-0.5 font-medium"
                    >
                      {ageInfo.age}{' '}Tahun
                    </dd>
                  </div>
                  <div>
                    <dt
                      id="hero-dossier-university"
                      className="font-mono text-[10px] uppercase tracking-[0.18em] text-taupe"
                    >
                      Universitas
                    </dt>
                    <dd
                      aria-labelledby="hero-dossier-university"
                      className="text-ivory/90 mt-0.5"
                    >
                      {personalData.university}
                    </dd>
                  </div>
                  <div>
                    <dt
                      id="hero-dossier-internship"
                      className="font-mono text-[10px] uppercase tracking-[0.18em] text-taupe"
                    >
                      Pengalaman Magang
                    </dt>
                    <dd
                      aria-labelledby="hero-dossier-internship"
                      className="text-ivory/90 mt-0.5"
                    >
                      <span className="block">{personalData.internship.company}</span>
                      <span className="mt-1 block font-mono text-[10px] tracking-[0.15em] uppercase text-champagne/80 leading-relaxed">                        Aktif · {personalData.internship.period}
                      </span>
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
                className="group relative z-10 w-full max-w-[265px] sm:max-w-[300px] lg:max-w-[310px] xl:max-w-[340px] aspect-[3/4] rounded-t-full rounded-b-lg p-2 border border-champagne/25 bg-espresso/30 shadow-[0_32px_90px_rgba(0,0,0,0.75)] transition-colors duration-500 hover:border-champagne/50"
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
                        loading="eager"
                        fetchPriority="high"
                        decoding="async"
                        className="w-full h-full object-cover object-[50%_18%]"
                      />
                    </motion.div>
                  </motion.div>

                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-linear-to-t from-obsidian via-obsidian/20 to-transparent"
                  />

                  {/* Integrated Editorial Dossier Plate inside Arch Portrait Frame */}
                  <div className="absolute inset-x-0 bottom-0 z-20 px-4 sm:px-5 pb-4 sm:pb-5 pt-10 sm:pt-12 flex flex-col items-center text-center bg-linear-to-t from-obsidian/95 via-obsidian/75 to-transparent">
                    <div className="w-full flex items-center justify-between text-[10px] font-mono tracking-[0.22em] uppercase text-champagne/75 pb-2.5 mb-2.5 border-b border-champagne/15">
                      <span>POTRET · I</span>
                      <span>AMDZ</span>
                    </div>
                    <p
                      aria-hidden="true"
                      className="select-none flex items-baseline justify-center gap-x-2 whitespace-nowrap text-lg sm:text-xl md:text-[1.45rem] tracking-[0.06em] leading-none font-serif italic font-medium"
                    >
                      <span className="text-engraved-brown">MU&apos;AFA</span>{' '}
                      <span className="text-engraved-ivory">DZULFIQAR</span>
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
              className="order-3 md:col-span-1 lg:col-span-4 lg:pb-4 flex flex-col lg:items-end lg:text-right gap-4 lg:gap-5 will-change-transform"
            >
              <p
                aria-label="Membangun pengalaman web yang jernih dengan ketelitian kode dan kepekaan editorial."
                className="font-serif text-base md:text-lg leading-snug font-light text-champagne/90 max-w-md md:max-w-none lg:max-w-md"
              >
                <span aria-hidden="true">
                  {'Membangun '}
                  <span className="italic text-ivory">pengalaman web yang jernih</span>
                  {' dengan ketelitian kode dan kepekaan editorial.'}
                </span>
              </p>
              <p className="font-sans text-sm md:text-base leading-relaxed text-ivory/80 max-w-md md:max-w-none lg:max-w-md">
                {personalData.headlineDescriptor}
              </p>
              <div className="flex flex-wrap lg:justify-end gap-3 pt-1">
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-champagne text-obsidian font-mono text-xs tracking-[0.18em] uppercase font-medium hover:bg-ivory active:scale-[0.97] transition-all duration-300"
                >
                  Karya Terpilih
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full border border-champagne/40 bg-obsidian/50 text-ivory font-mono text-xs tracking-[0.18em] uppercase hover:border-champagne hover:bg-espresso active:scale-[0.97] active:bg-espresso transition-all duration-300"
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
                  aria-label={`Profil GitHub ${contactData.githubHandle}`}
                  className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.18em] uppercase text-ivory/80 hover:text-champagne transition-colors"
                >
                  <Github className="size-3.5" aria-hidden="true" />
                  <span>GitHub · {contactData.githubHandle}</span>
                  <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Scroll Indicator */}
        <div className="relative z-20 max-w-[1440px] w-full mx-auto pt-4 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 sm:gap-4">
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
        className="relative bg-obsidian text-ivory py-16 md:py-24 px-4 sm:px-6 lg:px-12 border-b border-champagne/10 overflow-hidden"
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
            <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] text-champagne">
              IDENTITY PHILOSOPHY · MONOGRAM AMDZ
            </span>
            <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] text-taupe">
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

                  <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-2 pt-5 border-t border-champagne/15 font-mono text-[9px] tracking-[0.18em] uppercase text-taupe text-center">
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
                  className="font-serif text-3xl md:text-5xl font-light tracking-tight leading-[1.08] text-ivory"
                  lines={[
                    <>Titik temu antara</>,
                    <>
                      <span className="italic text-champagne/90">logika pemrograman</span>{' '}
                      &amp;
                    </>,
                    <>estetika ruang editorial.</>,
                  ]}
                />
                <Reveal variant="up" delay={0.08}>
                  <p className="font-sans text-sm md:text-base leading-relaxed text-ivory/80 max-w-2xl">
                    Monogram <span className="text-champagne font-medium">AMDZ</span> (Aflan
                    Mu&apos;afa Dzulfiqar) merangkum cara kerja saya: memadukan struktur kode
                    yang rapi dengan ketenangan komposisi tipografi editorial.
                  </p>
                </Reveal>
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
                    desc: 'Siluet ganda di bagian dalam terinspirasi dari semangat SatuRuangCreative: proporsi yang lapang dan terarah.',
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
          BAND 03 — LIGHT IVORY EDITORIAL DOSSIER (BAB 01 / IDENTITAS)
      ====================================================================== */}
      <section className="relative bg-ivory text-espresso py-16 md:py-24 px-4 sm:px-6 lg:px-12 border-b border-espresso/10">
        <div className="max-w-[1440px] mx-auto space-y-8">
          {/* Compact Dossier Chapter Header */}
          <Reveal
            variant="up"
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-espresso/15"
          >
            <div className="space-y-2">
              <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] text-bronze font-medium">
                BAB 01 · PERSONAL DOSSIER
              </p>
              <div className="flex items-center gap-3.5">
                <h2 className="font-serif text-3xl md:text-5xl font-light tracking-tight text-espresso/90">
                  Profil &amp; <span className="italic text-mocha">Identity Summary</span>
                </h2>
                <MonogramMark size={30} className="text-mocha/85 shrink-0" />
              </div>
            </div>
            <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] font-medium text-bronze">
              {personalData.status} · {personalData.university}
            </p>
          </Reveal>

          {/* Balanced 12-Column Dossier Grid: 7 Cols Bio & Traits | 5 Cols Verified Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <Reveal variant="up" delay={0.08} className="lg:col-span-7 space-y-6">
              <p className="font-sans text-sm md:text-base leading-relaxed text-espresso/80">
                {personalData.shortBio}
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                {personalData.traits.map((trait) => (
                  <span
                    key={trait}
                    className="px-3.5 py-1.5 border border-espresso/20 bg-offwhite text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] font-medium text-espresso"
                  >
                    {trait}
                  </span>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  to="/about"
                  data-cursor="PROFIL"
                  className="group inline-flex items-center gap-2.5 text-[10px] md:text-xs font-mono uppercase tracking-[0.18em] font-medium text-espresso border-b border-espresso pb-1.5 hover:text-mocha hover:border-mocha transition-colors"
                >
                  Baca Dossier Lengkap
                  <ArrowRight
                    className="size-4 group-hover:translate-x-1 transition-transform"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </Reveal>

            <Reveal variant="up" delay={0.14} className="lg:col-span-5">
              <div className="bg-offwhite border border-espresso/15 p-5 sm:p-7 space-y-4">
                <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.18em] font-medium text-bronze">
                  RINGKASAN TERVERIFIKASI
                </p>
                <dl className="divide-y divide-espresso/10">
                  <div className="py-3 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4">
                    <dt id="summary-birthplace" className="text-xs text-bronze">
                      Tempat Lahir
                    </dt>
                    <dd
                      aria-labelledby="summary-birthplace"
                      className="text-sm font-medium text-espresso sm:text-right"
                    >
                      {personalData.birthplace}
                    </dd>
                  </div>
                  <div className="py-3 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4">
                    <dt id="summary-domicile" className="text-xs text-bronze">
                      Domisili
                    </dt>
                    <dd
                      aria-labelledby="summary-domicile"
                      className="text-sm font-medium text-espresso sm:text-right"
                    >
                      {personalData.currentLocation}
                    </dd>
                  </div>
                  <div className="py-3 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4">
                    <dt id="summary-age" className="text-xs text-bronze">
                      Usia (Real-Time)
                    </dt>
                    <dd
                      aria-labelledby="summary-age"
                      className="text-sm font-medium text-mocha sm:text-right"
                    >
                      {ageInfo.age}{' '}Tahun · 2 Des 2005
                    </dd>
                  </div>
                  <div className="py-3 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4">
                    <dt id="summary-university" className="text-xs text-bronze">
                      Universitas
                    </dt>
                    <dd
                      aria-labelledby="summary-university"
                      className="text-sm font-medium text-espresso sm:text-right"
                    >
                      {personalData.university}
                    </dd>
                  </div>
                  <div className="py-3 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4">
                    <dt id="summary-internship" className="text-xs text-bronze">
                      Magang Aktif
                    </dt>
                    <dd
                      aria-labelledby="summary-internship"
                      className="text-sm font-medium text-espresso sm:text-right space-y-1"
                    >
                      <span className="block">{personalData.internship.company}</span>
                      <span className="inline-flex max-w-full px-2.5 py-0.5 rounded-full border border-bronze/30 font-mono text-[10px] tracking-[0.14em] uppercase text-bronze">
                        Aktif · {personalData.internship.period}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* =====================================================================
          BAND 04 — DARK ESPRESSO SELECTED WORK & EVALUATION ARCHIVE
      ====================================================================== */}
      <section className="relative bg-espresso text-ivory py-16 md:py-24 px-4 sm:px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto">
          <HairlineRule tone="champagne" className="mb-10 sm:mb-12" />
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 sm:mb-16 lg:mb-20">
            <div className="space-y-4">
              <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] font-medium text-champagne">
                BAB 02 · SELECTED WORKS &amp; SOFTWARE QA
              </p>
              <TextReveal
                as="h2"
                className="font-serif text-3xl md:text-5xl font-light tracking-tight leading-[1.08] text-ivory"
                lines={[
                  <>
                    Selected <span className="italic text-champagne/90">Works</span>
                  </>,
                ]}
              />
            </div>

            <Reveal variant="up" delay={0.1} className="max-w-md space-y-4">
              <p className="font-sans text-sm md:text-base text-ivory/80 leading-relaxed">
                Eksplorasi case study pilihan dari pengembangan web, aplikasi mobile kampus,
                hingga evaluasi software quality — disajikan transparan sesuai peran aktual.
              </p>
              <Link
                to="/projects"
                data-cursor="ARSIP"
                className="group relative inline-flex items-center gap-2 pb-1 font-mono text-xs tracking-[0.2em] uppercase text-champagne hover:text-ivory transition-colors"
              >
                <KineticLabel>Explore All Projects</KineticLabel>
                <ArrowUpRight
                  className="size-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none"
                  aria-hidden="true"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-champagne origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:hidden"
                />
              </Link>
            </Reveal>
          </div>

          <ProjectPreviewList projects={featuredProjects} />
        </div>
      </section>

      {/* =====================================================================
          BAND 05 — OFF-WHITE ASYMMETRIC EXPLORATION DOORS
      ====================================================================== */}
      <section className="relative bg-offwhite text-espresso py-16 md:py-24 px-4 sm:px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto">
          <HairlineRule tone="espresso" className="mb-10 sm:mb-12" />
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 lg:mb-14">
            <div>
              <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] font-medium text-bronze mb-3">
                BAB 03 · ARCHIVE EXPLORATION
              </p>
              <TextReveal
                as="h2"
                className="font-serif text-3xl md:text-5xl font-light tracking-tight leading-tight text-espresso/90"
                lines={[
                  <>
                    Masuk ke <span className="italic text-mocha">Digital Archive</span>
                  </>,
                ]}
              />
            </div>
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-bronze">
              NINE INTERCONNECTED CHAPTERS
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
                  <h3
                    aria-label="Interactive Visual Systems"
                    className="font-serif italic text-3xl md:text-5xl leading-[1.04] font-light tracking-tight text-champagne/90"
                  >
                    <span aria-hidden="true">
                      {'Interactive '}
                      <span className="block not-italic text-ivory">Visual Systems</span>
                    </span>
                  </h3>
                  <p className="font-sans text-sm md:text-base text-ivory/80 max-w-lg leading-relaxed">
                    Eksplorasi langsung kompositor tipografi editorial, chiaroscuro canvas,
                    koreografi kurva motion, matriks kontras WCAG, serta Motion Workbench.
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
                      Timeline &amp; <span className="italic">Experience</span>
                    </h3>
                    <p className="mt-2.5 font-sans text-sm md:text-base text-espresso/80 leading-relaxed">
                      Dari PKL hardware di GT Computer Purwokerto dan studi S1 Teknologi
                      Informasi Amikom Purwokerto hingga magang aktif di PT Puskomedia
                      Indonesia Kreatif.
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
                        Visual Archive
                      </h3>
                      <p className="mt-1.5 text-sm lg:text-xs text-ivory/80">
                        Studio portraits, tonal studies &amp; monograph lightbox.
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
                        Core Capabilities
                      </h3>
                      <p className="mt-1.5 text-sm lg:text-xs text-charcoal/75">
                        Web, Mobile, UI/UX, Software QA &amp; AI Orchestration.
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
