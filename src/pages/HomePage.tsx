import React, { useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { personalData } from '@/data/personal';
import { contactData } from '@/data/contact';
import { projectsData } from '@/data/projects';
import { EASE_LUXURY, MOTION_DURATION } from '@/utils/motion';
import { useCanHoverFine, useMediaQuery } from '@/hooks/useMediaQuery';
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
  const canHoverFine = useCanHoverFine();
  const isTabletOrDesktop = useMediaQuery('(min-width: 768px)');
  const isDesktopLayout = useMediaQuery('(min-width: 1024px)');
  const disableMotion = Boolean(prefersReducedMotion);
  const enableHeroParallax = isTabletOrDesktop && !disableMotion;
  const enableDesktopCursorDepth = canHoverFine && isDesktopLayout && !disableMotion;

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const smoothCursorX = useSpring(cursorX, { stiffness: 105, damping: 24, mass: 0.7 });
  const smoothCursorY = useSpring(cursorY, { stiffness: 105, damping: 24, mass: 0.7 });

  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const portraitY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, enableHeroParallax ? (isDesktopLayout ? 26 : 14) : 0],
  );
  const portraitScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, enableHeroParallax ? 1.028 : 1],
  );
  const wordmarkY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, enableHeroParallax ? (isDesktopLayout ? -24 : -10) : 0],
  );

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!enableDesktopCursorDepth) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / Math.max(1, rect.width) - 0.5;
    const ny = (e.clientY - rect.top) / Math.max(1, rect.height) - 0.5;
    cursorX.set(-nx * 8);
    cursorY.set(-ny * 6);
  };

  const resetHeroCursor = () => {
    if (!enableDesktopCursorDepth) return;
    cursorX.set(0);
    cursorY.set(0);
  };

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
          SECTION 1 — SIGNATURE EDITORIAL HERO (WARM LUXURY ESPRESSO)
      ====================================================================== */}
      <section
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={resetHeroCursor}
        className="relative min-h-[calc(100svh-1rem)] bg-obsidian text-ivory flex flex-col justify-between pt-24 sm:pt-28 pb-8 sm:pb-10 px-5 md:px-8 lg:px-12 overflow-hidden"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 studio-vignette"
        />

        {/* Subtle Folio Strip */}
        <div className="relative z-20 max-w-[1440px] w-full mx-auto flex items-center justify-between gap-4 border-b border-champagne/18 pb-3.5 font-mono text-[10px] sm:text-[11px] tracking-[0.22em] uppercase">
          <span className="text-champagne">PURWOKERTO · ID</span>
          <span className="text-taupe">AMDZ · DOSSIER</span>
        </div>

        {/* Coordinated Cover: Centered on Mobile/Tablet, Split 7+5 on Desktop */}
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
          {/* Tablet & Mobile Centered Editorial Cover (< 1024px) */}
          <div className="lg:hidden flex flex-col items-center text-center gap-7 sm:gap-8">
            <motion.div
              style={{ y: wordmarkY }}
              className="w-full will-change-transform"
            >
              <KineticDisplayWord
                word="AFLAN"
                ariaLabel="AFLAN · Aflan Mu'afa Dzulfiqar"
                align="center"
                introReady={introReady}
              />
            </motion.div>

            <HeroPortrait
              portraitY={portraitY}
              portraitScale={portraitScale}
              introReady={introReady}
            />

            <div className="max-w-lg space-y-5 px-2">
              <p className="font-serif text-lg sm:text-xl italic text-champagne leading-snug">
                Frontend &amp; UI/UX Engineer yang memadukan arsitektur kode presisi dengan disiplin Software QA.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/projects"
                  onTouchStart={() => prefetchRoute('/projects')}
                  className="group inline-flex items-center gap-2.5 min-h-[48px] px-6 py-3 rounded-full bg-champagne text-obsidian font-mono text-xs tracking-[0.16em] uppercase font-medium hover:bg-ivory active:scale-[0.97] transition-all duration-300"
                >
                  <KineticLabel>Explore Works</KineticLabel>
                  <ArrowUpRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </Link>

                <Link
                  to="/about"
                  onTouchStart={() => prefetchRoute('/about')}
                  className="group inline-flex items-center gap-2 min-h-[48px] px-5 py-3 rounded-full border border-champagne/35 bg-umber/75 text-ivory font-mono text-xs tracking-[0.16em] uppercase hover:border-champagne hover:bg-espresso active:scale-[0.97] transition-all duration-300"
                >
                  <span>Read Dossier</span>
                  <ArrowRight
                    className="size-4 text-champagne transition-transform duration-300 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* Desktop Editorial 12-Col Spread (>= 1024px) */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-14 items-center">
            <motion.div
              style={{
                y: wordmarkY,
                x: enableDesktopCursorDepth ? smoothCursorX : 0,
              }}
              initial={disableMotion ? false : { opacity: 0, y: 14 }}
              animate={introReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              transition={{
                duration: disableMotion ? 0 : MOTION_DURATION,
                delay: disableMotion ? 0 : 0.06,
                ease: EASE_LUXURY,
              }}
              className="lg:col-span-7 flex flex-col items-start text-left gap-6 will-change-transform"
            >
              <KineticDisplayWord
                word="AFLAN"
                ariaLabel="AFLAN · Aflan Mu'afa Dzulfiqar"
                align="left"
                introReady={introReady}
              />

              <motion.p
                style={
                  enableDesktopCursorDepth
                    ? { y: smoothCursorY }
                    : undefined
                }
                className="font-serif text-xl xl:text-2xl italic text-champagne leading-snug max-w-xl"
              >
                Frontend &amp; UI/UX Engineer yang memadukan arsitektur kode presisi dengan disiplin Software QA.
              </motion.p>

              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <MagneticButton maxPull={6}>
                  <Link
                    to="/projects"
                    onMouseEnter={() => prefetchRoute('/projects')}
                    onFocus={() => prefetchRoute('/projects')}
                    className="group inline-flex items-center gap-2.5 min-h-[48px] px-7 py-3.5 rounded-full bg-champagne text-obsidian font-mono text-xs tracking-[0.16em] uppercase font-medium hover:bg-ivory active:scale-[0.97] transition-all duration-300"
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
                  className="group inline-flex items-center gap-2 min-h-[48px] px-6 py-3.5 rounded-full border border-champagne/35 bg-umber/75 text-ivory font-mono text-xs tracking-[0.16em] uppercase hover:border-champagne hover:bg-espresso active:scale-[0.97] transition-all duration-300"
                >
                  <span>Read Dossier</span>
                  <ArrowRight
                    className="size-4 text-champagne transition-transform duration-300 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </motion.div>

            <div className="lg:col-span-5 flex justify-end">
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
          SECTION 2 — VARIATIVE DUAL-TRACK KINETIC RUNNING TEXT
      ====================================================================== */}
      <EditorialMarquee />

      {/* =====================================================================
          SECTION 3 — FILOSOFI LOGO BRAND AMDZ (WARM IVORY CONTRAST)
      ====================================================================== */}
      <AmdzBrandPhilosophy />

      {/* =====================================================================
          SECTION 4 — DYNAMIC SELECTED WORKS (LENIS SCROLL-DRIVEN)
      ====================================================================== */}
      <section className="relative bg-umber text-ivory py-20 md:py-28 lg:py-32 px-5 md:px-8 lg:px-12 border-t border-champagne/15 overflow-x-clip">
        <div className="max-w-[1440px] mx-auto space-y-12 sm:space-y-16">
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
          SECTION 5 — WARM EDITORIAL CLOSING SPREAD
      ====================================================================== */}
      <section
        style={{
          background:
            'linear-gradient(180deg, #F4EFE6 0%, #EFE7DA 100%)',
        }}
        className="relative text-[#1A1412] py-20 sm:py-28 lg:py-32 px-5 md:px-8 lg:px-12 border-t border-[#8A6D4B]/25 overflow-x-clip"
      >
        <div className="max-w-[1440px] mx-auto space-y-10 sm:space-y-12">
          <HairlineRule tone="espresso" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end pt-2">
            <div className="lg:col-span-8 space-y-4">
              <p className="font-mono text-[10px] sm:text-xs tracking-[0.22em] uppercase text-[#8A6D4B] font-medium">
                CORRESPONDENCE
              </p>
              <TextReveal
                as="h2"
                className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight leading-[1.1] text-[#1A1412]"
                lines={[
                  <>Tersedia untuk pengembangan web frontend,</>,
                  <>
                    <span className="italic text-[#6E4F3A]">
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
                  className="group inline-flex items-center gap-2.5 min-h-[48px] px-6 py-3 rounded-full bg-[#1A1412] text-ivory font-mono text-xs tracking-[0.16em] uppercase font-medium hover:bg-[#6E4F3A] active:scale-[0.97] transition-all duration-300"
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
