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
import { EASE_LUXURY, MOTION_DURATION } from '@/utils/motion';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { AmdzBrandPhilosophy } from '@/components/home/AmdzBrandPhilosophy';
import { HeroPortrait } from '@/components/home/HeroPortrait';
import { KineticDisplayWord } from '@/components/home/KineticDisplayWord';
import { LenisSelectedWorks } from '@/components/home/LenisSelectedWorks';
import { EditorialMarquee } from '@/components/motion/EditorialMarquee';
import { KineticLabel } from '@/components/motion/KineticLabel';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { HairlineRule } from '@/components/motion/Reveal';
import { TextReveal } from '@/components/motion/TextReveal';
import { CopyLinkButton } from '@/components/ui/CopyLinkButton';
import { prefetchRoute } from '@/utils/routePrefetch';

interface HomePageProps {
  introReady?: boolean;
}

const FLAGSHIP_SLUGS = [
  'satu-ruang-creative',
  'somasii-lost-and-found',
  'asis-builder-page-generator',
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
          SECTION 1 — CENTER-STAGE 3-COLUMN EDITORIAL COVER
      ====================================================================== */}
      <section
        ref={heroRef}
        className="bg-warm-atelier relative min-h-[calc(100svh-1rem)] text-ivory flex flex-col justify-between pt-24 sm:pt-28 pb-8 sm:pb-10 px-5 md:px-8 lg:px-12 overflow-hidden"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 studio-vignette"
        />

        {/* Subtle Top Editorial Folio */}
        <div className="relative z-20 max-w-[1440px] w-full mx-auto flex items-center justify-between gap-4 border-b border-champagne/20 pb-3.5 font-mono text-[10px] sm:text-[11px] tracking-[0.22em] uppercase">
          <span className="text-champagne">PURWOKERTO · ID</span>
          <span className="text-taupe">AFLAN · DOSSIER</span>
        </div>

        {/* Cover Stage: Monumental Centered Masthead + 3-Column Flanking Layout */}
        <motion.div
          initial={disableMotion ? false : { scale: 1.03, opacity: 0.94 }}
          animate={
            introReady
              ? { scale: 1, opacity: 1 }
              : { scale: 1.03, opacity: 0.94 }
          }
          transition={{ duration: disableMotion ? 0 : 0.7, ease: EASE_LUXURY }}
          className="relative z-10 max-w-[1440px] w-full mx-auto my-auto py-7 sm:py-9 lg:py-10 will-change-transform"
        >
          {/* Monumental Centered Playfair Display Masthead */}
          <motion.div
            style={{ y: wordmarkY }}
            className="w-full text-center mb-7 sm:mb-9 lg:mb-10 will-change-transform"
          >
            <KineticDisplayWord
              word="AFLAN"
              ariaLabel="AFLAN · Aflan Mu'afa Dzulfiqar"
              introReady={introReady}
            />
          </motion.div>

          {/* 3-Column Center-Stage Grid: Left Action | Center Sculpted Portrait | Right Dossier */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-7 sm:gap-8 lg:gap-8 xl:gap-10 items-center">
            {/* CENTER ANCHOR: Sculpted Atelier Double-Contour Portrait (Center on lg, Top on Mobile/Tablet) */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-4 order-1 lg:order-2 flex justify-center">
              <HeroPortrait
                portraitY={portraitY}
                portraitScale={portraitScale}
                introReady={introReady}
              />
            </div>

            {/* LEFT COLUMN: Discipline Identity, Concise Statement & Primary Explore Works CTA */}
            <motion.div
              style={{ y: sideColumnY }}
              initial={disableMotion ? false : { opacity: 0, y: 14 }}
              animate={introReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              transition={{
                duration: disableMotion ? 0 : MOTION_DURATION,
                delay: disableMotion ? 0 : 0.14,
                ease: EASE_LUXURY,
              }}
              className="col-span-1 lg:col-span-4 order-2 lg:order-1 flex flex-col items-center sm:items-start text-center sm:text-left gap-4 sm:gap-5 will-change-transform"
            >
              <span className="inline-flex items-center gap-2 font-mono text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-brass">
                <span aria-hidden="true" className="w-4 h-px bg-brass/60 hidden sm:inline-block" />
                FRONTEND &amp; UI/UX ENGINEER
              </span>

              <p className="font-serif text-lg sm:text-xl lg:text-[1.35rem] italic text-champagne leading-snug max-w-sm">
                Merancang antarmuka web yang presisi, cepat, dan terstruktur—dari sistem visual hingga evaluasi QA.
              </p>

              <div className="pt-1">
                <MagneticButton maxPull={6}>
                  <Link
                    to="/projects"
                    onMouseEnter={() => prefetchRoute('/projects')}
                    onFocus={() => prefetchRoute('/projects')}
                    onTouchStart={() => prefetchRoute('/projects')}
                    className="group inline-flex items-center gap-2.5 min-h-[48px] px-7 py-3.5 rounded-full bg-linear-to-r from-[#DFC9A8] to-[#B0875E] text-[#191310] font-mono text-xs tracking-[0.16em] uppercase font-medium hover:brightness-110 active:scale-[0.97] transition-all duration-300 shadow-[0_12px_32px_rgba(25,19,16,0.35)]"
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

            {/* RIGHT COLUMN: Compact Print-Dossier Credentials & Read Dossier CTA */}
            <motion.div
              style={{ y: sideColumnY }}
              initial={disableMotion ? false : { opacity: 0, y: 14 }}
              animate={introReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              transition={{
                duration: disableMotion ? 0 : MOTION_DURATION,
                delay: disableMotion ? 0 : 0.2,
                ease: EASE_LUXURY,
              }}
              className="col-span-1 lg:col-span-4 order-3 lg:order-3 flex flex-col items-center sm:items-end text-center sm:text-right gap-5 will-change-transform"
            >
              <dl className="w-full max-w-xs space-y-2.5 border-y border-champagne/18 py-3.5 font-mono text-[10px] sm:text-[11px] tracking-[0.18em] uppercase">
                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <dt className="text-taupe">STUDIO</dt>
                  <dd className="text-ivory">SATURUANG CREATIVE · CO-FOUNDER</dd>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <dt className="text-taupe">ROLE</dt>
                  <dd className="text-champagne">SOFTWARE QA · PUSKOMEDIA</dd>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <dt className="text-taupe">BASIS</dt>
                  <dd className="text-ivory">PURWOKERTO · ID</dd>
                </div>
              </dl>

              <Link
                to="/about"
                onMouseEnter={() => prefetchRoute('/about')}
                onFocus={() => prefetchRoute('/about')}
                onTouchStart={() => prefetchRoute('/about')}
                className="group inline-flex items-center gap-2 min-h-[48px] px-6 py-3 rounded-full border border-champagne/35 bg-umber/80 text-ivory font-mono text-xs tracking-[0.16em] uppercase hover:border-champagne hover:bg-espresso active:scale-[0.97] transition-all duration-300"
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
            <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-champagne/85">
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
          SECTION 2 — VARIATIVE DUAL-TRACK KINETIC MARQUEE (PAUSED IN INTRO)
      ====================================================================== */}
      <EditorialMarquee active={introReady} />

      {/* =====================================================================
          SECTION 3 — INTERACTIVE AMDZ MONOGRAM ATELIER (WARM PAPER CONTRAST)
      ====================================================================== */}
      <AmdzBrandPhilosophy />

      {/* =====================================================================
          SECTION 4 — VARIATIVE EDITORIAL SELECTED WORKS (LENIS PARALLAX)
      ====================================================================== */}
      <section className="relative bg-umber text-ivory py-20 md:py-28 lg:py-32 px-5 md:px-8 lg:px-12 border-t border-champagne/18 overflow-x-clip">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              'radial-gradient(ellipse 75% 45% at 50% 0%, rgba(176,135,94,0.12) 0%, transparent 72%)',
          }}
        />
        <div className="relative z-10 max-w-[1440px] mx-auto space-y-12 sm:space-y-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-champagne/20">
            <div className="space-y-2.5">
              <p className="font-mono text-[10px] sm:text-xs tracking-[0.22em] uppercase text-champagne">
                SELECTED WORKS · 03 FEATURED
              </p>
              <TextReveal
                as="h2"
                className="font-serif text-3xl md:text-5xl font-light tracking-tight leading-[1.08] text-ivory"
                lines={[
                  <>
                    Selected <span className="italic text-champagne">Works</span>
                  </>,
                ]}
              />
            </div>

            <Link
              to="/projects"
              data-cursor-label="ARCHIVE"
              onMouseEnter={() => prefetchRoute('/projects')}
              onFocus={() => prefetchRoute('/projects')}
              onTouchStart={() => prefetchRoute('/projects')}
              className="group inline-flex items-center gap-2 min-h-[44px] font-mono text-xs tracking-[0.2em] uppercase text-champagne hover:text-ivory transition-colors self-start sm:self-auto"
            >
              <span className="border-b border-champagne/50 pb-0.5 group-hover:border-ivory transition-colors">
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
      </section>

      {/* =====================================================================
          SECTION 5 — SINGLE AUTHORITATIVE WARM EDITORIAL CLOSING SPREAD
      ====================================================================== */}
      <section className="bg-warm-paper relative text-obsidian py-20 sm:py-28 lg:py-32 px-5 md:px-8 lg:px-12 border-t border-bronze/25 overflow-x-clip">
        <div className="max-w-[1440px] mx-auto space-y-10 sm:space-y-12">
          <HairlineRule tone="espresso" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end pt-2">
            <div className="lg:col-span-8 space-y-4">
              <p className="font-mono text-[10px] sm:text-xs tracking-[0.22em] uppercase text-bronze font-medium">
                CORRESPONDENCE
              </p>
              <TextReveal
                as="h2"
                className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight leading-[1.1] text-obsidian"
                lines={[
                  <>Tersedia untuk pengembangan web frontend,</>,
                  <>
                    <span className="italic text-mocha">
                      sistem antarmuka, dan evaluasi Software QA.
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
                  className="group inline-flex items-center gap-2.5 min-h-[48px] px-6 py-3 rounded-full bg-obsidian text-ivory font-mono text-xs tracking-[0.16em] uppercase font-medium hover:bg-mocha active:scale-[0.97] transition-all duration-300"
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
