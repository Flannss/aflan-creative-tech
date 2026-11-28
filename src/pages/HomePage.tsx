import React, { useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { personalData } from '@/data/personal';
import { contactData } from '@/data/contact';
import { projectsData } from '@/data/projects';
import { EASE_PAGE_ENTER, MOTION_DURATION } from '@/utils/motion';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { AmdzBrandPhilosophy } from '@/components/home/AmdzBrandPhilosophy';
import { HeroPortrait } from '@/components/home/HeroPortrait';
import { KineticDisplayWord } from '@/components/home/KineticDisplayWord';
import { LenisSelectedWorks } from '@/components/home/LenisSelectedWorks';
import { EditorialMarquee } from '@/components/motion/EditorialMarquee';
import { KineticLabel } from '@/components/motion/KineticLabel';
import { KineticWaveField } from '@/components/motion/KineticWaveField';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { HairlineRule } from '@/components/motion/Reveal';
import { TextReveal } from '@/components/motion/TextReveal';
import { CopyLinkButton } from '@/components/ui/CopyLinkButton';
import { prefetchRoute } from '@/utils/routePrefetch';

interface HomePageProps {
  introReady?: boolean;
}

const FLAGSHIP_SLUGS = [
  'kompresor-media',
  'satu-ruang-creative',
  'somasii-lost-and-found',
  'asis-builder-page-generator',
] as const;

const DOSSIER_PILLARS = [
  {
    code: '01',
    label: 'Tujuan',
    text: 'Profil kerja dan arsip studi kasus agar mudah ditinjau oleh tim developer maupun mitra proyek.',
  },
  {
    code: '02',
    label: 'Fokus',
    text: 'Arsitektur frontend, desain sistem UI, performa layar 60fps, dan pengujian Software QA.',
  },
  {
    code: '03',
    label: 'Cakupan',
    text: 'Proyek nyata terverifikasi, 9 modul Creative Lab, galeri visual, serta catatan kuliah dan magang.',
  },
] as const;

const EDITORIAL_FOCUS_ITEMS = [
  {
    code: '01',
    title: 'Interactive Lab',
    summary: 'Sembilan modul eksperimen animasi, spotlight, dan token warna.',
    to: '/lab',
    tag: 'WORKBENCH',
  },
  {
    code: '02',
    title: 'Visual Archive',
    summary: 'Koleksi potret studio dan pelat tipografi dalam penampil lightbox.',
    to: '/gallery',
    tag: 'GALLERY',
  },
  {
    code: '03',
    title: 'Career Journey',
    summary: 'Catatan studi Amikom, PKL GT Computer, dan magang PT Puskomedia.',
    to: '/journey',
    tag: 'TIMELINE',
  },
] as const;

export const HomePage: React.FC<HomePageProps> = ({ introReady = true }) => {
  const prefersReducedMotion = useReducedMotion();
  const isTabletOrDesktop = useMediaQuery('(min-width: 768px)');
  const isDesktopLayout = useMediaQuery('(min-width: 1024px)');
  const disableMotion = Boolean(prefersReducedMotion);
  const enableHeroParallax = isTabletOrDesktop && !disableMotion;

  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const portraitY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, enableHeroParallax ? (isDesktopLayout ? 24 : 12) : 0],
  );
  const portraitScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, enableHeroParallax ? 1.028 : 1],
  );
  const wordmarkY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, enableHeroParallax ? (isDesktopLayout ? -20 : -8) : 0],
  );
  const sideColumnY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, enableHeroParallax && isDesktopLayout ? -12 : 0],
  );

  const flagshipProjects = useMemo(
    () =>
      FLAGSHIP_SLUGS.map((slug) =>
        projectsData.find((p) => p.slug === slug),
      ).filter((p): p is (typeof projectsData)[number] => Boolean(p)),
    [],
  );

  return (
    <div className="w-full overflow-x-clip">
      {/* =====================================================================
          SECTION 1 — CENTER-STAGE 3-COLUMN COVER + FLOWING SILK WAVE CURRENT
      ====================================================================== */}
      <section
        ref={heroRef}
        className="bg-warm-atelier relative min-h-[calc(100svh-1rem)] text-ivory flex flex-col justify-between pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-10 px-5 sm:px-7 md:px-10 lg:px-12 overflow-hidden"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 studio-vignette"
        />
        <KineticWaveField active={introReady} className="z-[2]" />

        {/* Subtle Top Editorial Folio */}
        <div className="relative z-20 max-w-[1440px] w-full mx-auto flex items-center justify-between gap-4 border-b border-champagne/25 pb-3.5 font-mono text-[10px] sm:text-[11px] tracking-[0.22em] uppercase">
          <span className="text-champagne">PURWOKERTO · ID</span>
          <span className="text-taupe">AFLAN · DOSSIER</span>
        </div>

        {/* Cover Stage: Monumental Centered Masthead + Academic Identity + 3-Column Flanking */}
        <motion.div
          initial={disableMotion ? false : { scale: 1.02 }}
          animate={introReady ? { scale: 1 } : { scale: 1.02 }}
          transition={{ duration: disableMotion ? 0 : 0.65, ease: EASE_PAGE_ENTER }}
          className="relative z-10 max-w-[1440px] w-full mx-auto my-auto py-7 sm:py-9 lg:py-10 will-change-transform"
        >
          {/* Monumental Centered Playfair Display Masthead + Clean Academic Subtitle */}
          <motion.div
            style={{ y: wordmarkY }}
            className="w-full text-center mb-8 sm:mb-10 will-change-transform"
          >
            <KineticDisplayWord
              word="AFLAN"
              ariaLabel="AFLAN"
              introReady={introReady}
            />
            <p className="mt-3.5 sm:mt-4 font-mono text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-linen/90 px-2">
              {personalData.university} · Teknologi Informasi
            </p>
          </motion.div>

          {/* 3-Column Center-Stage Grid: Left Action | Center Sculpted Portrait | Right Dossier */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(360px,420px)_minmax(0,1fr)] xl:grid-cols-[minmax(0,1fr)_minmax(385px,440px)_minmax(0,1fr)] gap-8 sm:gap-10 lg:gap-8 xl:gap-10 items-center">
            {/* CENTER ANCHOR: Sculpted Atelier Double-Contour Portrait */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-1 order-1 lg:order-2 flex justify-center">
              <HeroPortrait
                portraitY={portraitY}
                portraitScale={portraitScale}
                introReady={introReady}
              />
            </div>

            {/* LEFT COLUMN: Discipline Identity, Crisp Copy & Primary Explore Works CTA */}
            <motion.div
              style={{ y: sideColumnY }}
              initial={disableMotion ? false : { opacity: 0, y: 14 }}
              animate={introReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              transition={{
                duration: disableMotion ? 0 : MOTION_DURATION,
                delay: disableMotion ? 0 : 0.14,
                ease: EASE_PAGE_ENTER,
              }}
              className="col-span-1 lg:col-span-1 order-2 lg:order-1 flex flex-col items-center sm:items-start text-center sm:text-left gap-4 sm:gap-5 will-change-transform"
            >
              <span className="inline-flex items-center gap-2 font-mono text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-champagne">
                <span aria-hidden="true" className="w-4 h-px bg-brass/70 hidden sm:inline-block" />
                FRONTEND &amp; UI/UX ENGINEER
              </span>

              <p className="font-serif text-lg sm:text-xl lg:text-[1.35rem] italic text-linen leading-snug max-w-sm">
                Merancang antarmuka web yang rapi dan cepat, dari sistem visual sampai pengujian QA.
              </p>

              <div className="pt-1">
                <MagneticButton maxPull={6}>
                  <Link
                    to="/projects"
                    onMouseEnter={() => prefetchRoute('/projects')}
                    onFocus={() => prefetchRoute('/projects')}
                    onTouchStart={() => prefetchRoute('/projects')}
                    className="group inline-flex items-center gap-2.5 min-h-[48px] px-7 py-3.5 rounded-full bg-linear-to-r from-[#DFC8A6] to-[#B98D61] text-[#211814] font-mono text-xs tracking-[0.16em] uppercase font-medium hover:brightness-110 active:scale-[0.97] transition-all duration-300 shadow-[0_12px_32px_rgba(33,24,20,0.38)]"
                  >
                    <KineticLabel>Explore Works</KineticLabel>
                    <ArrowUpRight
                      className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                </MagneticButton>
              </div>
            </motion.div>

            {/* RIGHT COLUMN: Compact Dossier Credentials & Read Dossier CTA */}
            <motion.div
              style={{ y: sideColumnY }}
              initial={disableMotion ? false : { opacity: 0, y: 14 }}
              animate={introReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              transition={{
                duration: disableMotion ? 0 : MOTION_DURATION,
                delay: disableMotion ? 0 : 0.2,
                ease: EASE_PAGE_ENTER,
              }}
              className="col-span-1 lg:col-span-1 order-3 lg:order-3 flex flex-col items-center sm:items-end text-center sm:text-right gap-5 will-change-transform"
            >
              <dl className="w-full max-w-xs space-y-2.5 border-y border-champagne/25 py-3.5 font-mono text-[10px] sm:text-[11px] tracking-[0.18em] uppercase">
                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <dt className="text-taupe">PRODI</dt>
                  <dd className="text-ivory">TI24A · AMIKOM PURWOKERTO</dd>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <dt className="text-taupe">STUDIO</dt>
                  <dd className="text-champagne">SATURUANG CREATIVE</dd>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <dt className="text-taupe">ROLE</dt>
                  <dd className="text-ivory">SOFTWARE QA · PUSKOMEDIA</dd>
                </div>
              </dl>

              <Link
                to="/about"
                onMouseEnter={() => prefetchRoute('/about')}
                onFocus={() => prefetchRoute('/about')}
                onTouchStart={() => prefetchRoute('/about')}
                className="group inline-flex items-center gap-2 min-h-[48px] px-6 py-3 rounded-full border border-champagne/45 bg-umber/80 text-ivory font-mono text-xs tracking-[0.16em] uppercase hover:border-champagne hover:bg-espresso active:scale-[0.97] transition-all duration-300"
              >
                <span>Read Dossier</span>
                <ArrowRight
                  className="size-4 text-champagne transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom Coordinates & Scroll Cue */}
        <div className="relative z-20 max-w-[1440px] w-full mx-auto pt-4 flex items-center justify-between gap-4">
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-taupe">
            {personalData.coordinates}
          </span>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-champagne/90">
              Gulir
            </span>
            <span
              className="relative block w-px h-7 bg-champagne/25 overflow-hidden"
              aria-hidden="true"
            >
              <span className="aflan-scroll-line absolute inset-0 bg-champagne" />
            </span>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 2 — VARIATIVE DUAL-TRACK KINETIC MARQUEE
      ====================================================================== */}
      <EditorialMarquee active={introReady} />

      {/* =====================================================================
          SECTION 3 — INTERACTIVE AMDZ MONOGRAM ATELIER (CALM WARM WALNUT)
      ====================================================================== */}
      <AmdzBrandPhilosophy />

      {/* =====================================================================
          SECTION 4 — LUMINOUS ALMOND CREAM: ABOUT THIS DOSSIER + COMPACT WORKS
      ====================================================================== */}
      <section className="bg-warm-almond relative text-obsidian py-14 sm:py-16 md:py-20 lg:py-24 px-5 sm:px-7 md:px-10 lg:px-12 border-t border-bronze/20 overflow-x-clip">
        <div className="relative z-10 max-w-[1440px] mx-auto">
          {/* Part A: About This Dossier (Informative Editorial Introduction) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 sm:pb-14 border-b border-bronze/22 items-start">
            <div className="lg:col-span-6 space-y-4">
              <p className="font-mono text-[10px] sm:text-xs tracking-[0.22em] uppercase font-medium text-cognac">
                ABOUT THIS DOSSIER
              </p>
              <TextReveal
                as="h2"
                className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-light tracking-tight leading-[1.08] text-obsidian"
                lines={[
                  <>
                    Digital Dossier &amp;{' '}
                    <span className="italic text-bronze">Engineering Archive</span>
                  </>,
                ]}
              />
              <p className="font-sans text-sm sm:text-base text-obsidian/80 leading-relaxed max-w-xl">
                Situs ini memuat catatan kerja saya di bidang web frontend, desain antarmuka, dan pengujian perangkat lunak. Isinya mencakup proyek kuliah di Universitas Amikom Purwokerto, kolaborasi studio, serta pengalaman magang di industri.
              </p>
            </div>

            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {DOSSIER_PILLARS.map((pillar, idx) => (
                <div
                  key={pillar.code}
                  className={`rounded-2xl border border-bronze/22 bg-ivory/85 p-5 flex flex-col justify-between gap-2.5 shadow-[0_8px_24px_rgba(33,24,20,0.05)] ${
                    idx === 2 ? 'sm:col-span-2 lg:col-span-1' : ''
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 font-mono text-[10px] tracking-[0.2em] uppercase">
                    <span className="text-cognac font-medium">{pillar.label}</span>
                    <span className="text-bronze tabular-nums">{pillar.code}</span>
                  </div>
                  <p className="font-sans text-xs sm:text-[13px] text-obsidian/80 leading-relaxed">
                    {pillar.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Part B: Compact Curated Works Grid */}
          <div className="pt-10 sm:pt-12 space-y-7 sm:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1.5">
                <p className="font-mono text-[10px] sm:text-xs tracking-[0.22em] uppercase font-medium text-cognac">
                  CURATED WORKS · 04 FEATURED
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-tight leading-[1.08] text-obsidian">
                  Selected <span className="italic text-bronze">Works</span>
                </h2>
              </div>

              <Link
                to="/projects"
                data-cursor-label="ARCHIVE"
                onMouseEnter={() => prefetchRoute('/projects')}
                onFocus={() => prefetchRoute('/projects')}
                onTouchStart={() => prefetchRoute('/projects')}
                className="group inline-flex items-center gap-2 min-h-[44px] font-mono text-xs tracking-[0.2em] uppercase font-medium text-obsidian hover:text-cognac transition-colors self-start sm:self-auto"
              >
                <span className="border-b border-bronze/55 pb-0.5 group-hover:border-cognac transition-colors">
                  View Full Archive
                </span>
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </div>

            <LenisSelectedWorks projects={flagshipProjects} />
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 5 — COMPACT EDITORIAL FOCUS STRIP (WARM WALNUT WASH)
      ====================================================================== */}
      <section className="bg-warm-walnut-wash relative text-ivory py-14 sm:py-16 md:py-20 px-5 sm:px-7 md:px-10 lg:px-12 border-t border-champagne/20 overflow-x-clip">
        <div className="max-w-[1440px] mx-auto space-y-6">
          <div className="flex items-center justify-between gap-4 font-mono text-[10px] tracking-[0.22em] uppercase">
            <span className="text-champagne">EXPLORE FURTHER</span>
            <span className="text-taupe">CURATED ROUTES</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {EDITORIAL_FOCUS_ITEMS.map((item, idx) => (
              <Link
                key={item.to}
                to={item.to}
                onMouseEnter={() => prefetchRoute(item.to)}
                onFocus={() => prefetchRoute(item.to)}
                onTouchStart={() => prefetchRoute(item.to)}
                className={`group rounded-2xl border border-champagne/25 hover:border-champagne/60 bg-umber/85 hover:bg-espresso p-6 flex flex-col justify-between gap-4 min-h-[132px] hover:-translate-y-1 transition-all duration-300 ${
                  idx === 2 ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-3 font-mono text-[10px] tracking-[0.2em] uppercase">
                  <span className="text-champagne tabular-nums">{item.code} · {item.tag}</span>
                  <ArrowUpRight
                    className="size-4 text-brass transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-champagne"
                    aria-hidden="true"
                  />
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif text-2xl font-light text-ivory group-hover:text-champagne transition-colors">
                    {item.title}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-ivory/80 leading-relaxed">
                    {item.summary}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 6 — LUMINOUS WARM CLOSING SPREAD (ZERO CTA DUPLICATION)
      ====================================================================== */}
      <section className="bg-warm-closing relative text-obsidian py-14 sm:py-16 md:py-20 lg:py-24 px-5 sm:px-7 md:px-10 lg:px-12 border-t border-bronze/20 overflow-x-clip">
        <div className="max-w-[1440px] mx-auto space-y-10 sm:space-y-12">
          <HairlineRule tone="espresso" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end pt-2">
            <div className="lg:col-span-8 space-y-4">
              <p className="font-mono text-[10px] sm:text-xs tracking-[0.22em] uppercase font-medium text-cognac">
                CORRESPONDENCE
              </p>
              <TextReveal
                as="h2"
                className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight leading-[1.1] text-obsidian"
                lines={[
                  <>Terbuka untuk proyek web frontend,</>,
                  <>
                    <span className="italic text-bronze">
                      perancangan UI, dan pengujian Software QA.
                    </span>
                  </>,
                ]}
              />
            </div>

            <div className="lg:col-span-4 flex flex-wrap lg:justify-end items-center gap-3">
              <MagneticButton maxPull={6}>
                <Link
                  to="/contact"
                  onMouseEnter={() => prefetchRoute('/contact')}
                  onFocus={() => prefetchRoute('/contact')}
                  onTouchStart={() => prefetchRoute('/contact')}
                  className="group inline-flex items-center gap-2.5 min-h-[48px] px-6 py-3 rounded-full bg-obsidian text-ivory font-mono text-xs tracking-[0.16em] uppercase font-medium hover:bg-cognac active:scale-[0.97] transition-all duration-300 shadow-[0_10px_28px_rgba(33,24,20,0.16)]"
                >
                  <KineticLabel>Start a Conversation</KineticLabel>
                  <ArrowUpRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </MagneticButton>

              <CopyLinkButton
                url={contactData.email}
                label="Copy Email"
                copiedLabel="Email Copied"
                toastTitle="Email Tersalin"
                surface="light"
                size="md"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
