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
import { HeroPortrait } from '@/components/home/HeroPortrait';
import { KineticDisplayWord } from '@/components/home/KineticDisplayWord';
import { LenisSelectedWorks } from '@/components/home/LenisSelectedWorks';
import { KineticLabel } from '@/components/motion/KineticLabel';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { HairlineRule } from '@/components/motion/Reveal';
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
    [0, enableHeroParallax ? (isDesktopLayout ? 26 : 12) : 0],
  );
  const portraitScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, enableHeroParallax ? 1.025 : 1],
  );
  const wordmarkY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, enableHeroParallax ? (isDesktopLayout ? -24 : -10) : 0],
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
          ACT 1 — THE EDITORIAL COVER
      ====================================================================== */}
      <section
        ref={heroRef}
        className="relative min-h-[calc(100svh-1rem)] bg-obsidian text-ivory flex flex-col justify-between pt-24 sm:pt-28 pb-8 sm:pb-10 px-5 md:px-8 lg:px-12 overflow-hidden"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 studio-vignette"
        />

        {/* Minimal Folio Strip */}
        <div className="relative z-20 max-w-[1440px] w-full mx-auto flex items-center justify-between gap-4 border-b border-brass/20 pb-3.5 font-mono text-[10px] sm:text-[11px] tracking-[0.22em] uppercase">
          <span className="text-brass">PURWOKERTO · ID</span>
          <span className="text-taupe">AMDZ · DOSSIER</span>
        </div>

        {/* Coordinated Cover Lockup: Masthead & Action (7) + Editorial Portrait Plate (5) */}
        <motion.div
          initial={disableMotion ? false : { scale: 1.03, opacity: 0.94 }}
          animate={
            introReady
              ? { scale: 1, opacity: 1 }
              : { scale: 1.03, opacity: 0.94 }
          }
          transition={{ duration: disableMotion ? 0 : 0.72, ease: EASE_LUXURY }}
          className="relative z-10 max-w-[1440px] w-full mx-auto my-auto py-8 sm:py-10 lg:py-12 will-change-transform"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-8 lg:gap-14 items-center">
            <motion.div
              style={{ y: wordmarkY }}
              initial={disableMotion ? false : { opacity: 0, y: 14 }}
              animate={introReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              transition={{
                duration: disableMotion ? 0 : MOTION_DURATION,
                delay: disableMotion ? 0 : 0.06,
                ease: EASE_LUXURY,
              }}
              className="md:col-span-7 flex flex-col items-center md:items-start text-center md:text-left gap-5 sm:gap-6 will-change-transform"
            >
              <KineticDisplayWord
                word="AFLAN"
                ariaLabel="AFLAN · Aflan Mu'afa Dzulfiqar"
                align="left"
                introReady={introReady}
              />

              <p className="font-serif text-lg sm:text-xl lg:text-2xl italic text-champagne leading-snug max-w-xl">
                Frontend &amp; UI/UX Engineer yang memadukan arsitektur kode presisi dengan disiplin QA.
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-1">
                <MagneticButton maxPull={6}>
                  <Link
                    to="/projects"
                    onMouseEnter={() => prefetchRoute('/projects')}
                    onFocus={() => prefetchRoute('/projects')}
                    onTouchStart={() => prefetchRoute('/projects')}
                    className="group inline-flex items-center gap-2.5 min-h-[48px] px-6 py-3 rounded-full bg-champagne text-obsidian font-mono text-xs tracking-[0.16em] uppercase font-medium hover:bg-ivory active:scale-[0.97] transition-all duration-300"
                  >
                    <KineticLabel>Explore Works</KineticLabel>
                    <ArrowUpRight
                      className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                </MagneticButton>

                <Link
                  to="/about"
                  onMouseEnter={() => prefetchRoute('/about')}
                  onFocus={() => prefetchRoute('/about')}
                  onTouchStart={() => prefetchRoute('/about')}
                  className="group inline-flex items-center gap-2 min-h-[48px] px-5 py-3 rounded-full border border-brass/35 bg-umber/60 text-ivory font-mono text-xs tracking-[0.16em] uppercase hover:border-brass hover:bg-espresso active:scale-[0.97] transition-all duration-300"
                >
                  <span>Read Dossier</span>
                  <ArrowRight
                    className="size-4 text-brass transition-transform duration-300 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </motion.div>

            <div className="md:col-span-5 flex justify-center md:justify-end">
              <HeroPortrait
                portraitY={portraitY}
                portraitScale={portraitScale}
                introReady={introReady}
              />
            </div>
          </div>
        </motion.div>

        {/* Bottom Coordinates & Scroll Cue */}
        <div className="relative z-20 max-w-[1440px] w-full mx-auto pt-4 flex items-center justify-between gap-4">
          <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-taupe">
            {personalData.coordinates}
          </span>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-brass">
              Gulir
            </span>
            <span
              className="relative block w-px h-7 bg-brass/25 overflow-hidden"
              aria-hidden="true"
            >
              <span className="aflan-scroll-line absolute inset-0 bg-brass" />
            </span>
          </div>
        </div>
      </section>

      {/* =====================================================================
          ACT 2 — LENIS SCROLL-DRIVEN SELECTED WORKS (3 FLAGSHIP WORKS)
      ====================================================================== */}
      <section className="relative bg-umber text-ivory py-20 md:py-28 lg:py-36 px-5 md:px-8 lg:px-12 border-t border-brass/15 overflow-x-clip">
        <div className="max-w-[1440px] mx-auto space-y-14 sm:space-y-18">
          <div className="flex items-center justify-between gap-4 pb-5 border-b border-brass/20">
            <h2 className="font-mono text-[10px] sm:text-xs tracking-[0.22em] uppercase text-brass">
              SELECTED WORKS
            </h2>
            <span className="font-mono text-[10px] sm:text-xs tracking-[0.2em] uppercase text-taupe">
              03 FEATURED
            </span>
          </div>

          <LenisSelectedWorks projects={flagshipProjects} />

          <div className="pt-8 border-t border-brass/15 flex justify-start md:justify-end">
            <Link
              to="/projects"
              data-cursor-label="ARCHIVE"
              onMouseEnter={() => prefetchRoute('/projects')}
              onFocus={() => prefetchRoute('/projects')}
              onTouchStart={() => prefetchRoute('/projects')}
              className="group inline-flex items-center gap-2.5 min-h-[44px] font-mono text-xs tracking-[0.2em] uppercase text-champagne hover:text-ivory transition-colors"
            >
              <span className="border-b border-brass/50 pb-0.5 group-hover:border-ivory transition-colors">
                View Full Archive
              </span>
              <ArrowRight
                className="size-4 text-brass transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================================
          ACT 3 — QUIET CLOSING SPREAD
      ====================================================================== */}
      <section className="relative bg-linen text-obsidian py-20 sm:py-28 lg:py-36 px-5 md:px-8 lg:px-12 border-t border-brass/30 overflow-x-clip">
        <div className="max-w-[1440px] mx-auto space-y-10 sm:space-y-12">
          <HairlineRule tone="espresso" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end pt-2">
            <div className="lg:col-span-8 space-y-4">
              <p className="font-mono text-[10px] sm:text-xs tracking-[0.22em] uppercase text-cognac font-medium">
                CORRESPONDENCE
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight leading-[1.1] text-obsidian">
                Tersedia untuk pengembangan web frontend,{' '}
                <span className="italic text-cognac">sistem antarmuka, dan evaluasi Software QA.</span>
              </h2>
            </div>

            <div className="lg:col-span-4 flex flex-wrap lg:justify-end items-center gap-3">
              <MagneticButton maxPull={6}>
                <Link
                  to="/contact"
                  onMouseEnter={() => prefetchRoute('/contact')}
                  onFocus={() => prefetchRoute('/contact')}
                  onTouchStart={() => prefetchRoute('/contact')}
                  className="group inline-flex items-center gap-2.5 min-h-[48px] px-6 py-3 rounded-full bg-obsidian text-ivory font-mono text-xs tracking-[0.16em] uppercase font-medium hover:bg-cognac active:scale-[0.97] transition-all duration-300"
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
