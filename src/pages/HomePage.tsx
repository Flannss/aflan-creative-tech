import React, { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { ArrowRight, ArrowUpRight, Github } from 'lucide-react';
import { personalData } from '@/data/personal';
import { contactData } from '@/data/contact';
import { projectsData } from '@/data/projects';
import { calculateExactAge } from '@/utils/age';
import { EASE_LUXURY, MOTION_DURATION } from '@/utils/motion';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { HeroPortrait } from '@/components/home/HeroPortrait';
import { SplitLookbookWorks } from '@/components/home/SplitLookbookWorks';
import { KineticCursorField } from '@/components/motion/KineticCursorField';
import { KineticLabel } from '@/components/motion/KineticLabel';
import { HairlineRule, Reveal } from '@/components/motion/Reveal';
import { TextReveal } from '@/components/motion/TextReveal';
import { CopyLinkButton } from '@/components/ui/CopyLinkButton';
import { EditorialMarquee } from '@/components/ui/EditorialMarquee';

interface HomePageProps {
  introReady?: boolean;
}

type PersonaMode = 'engineering' | 'system' | 'studio';

interface PersonaLensSpec {
  id: PersonaMode;
  tabLabel: string;
  headline: string;
  description: string;
  specs: readonly string[];
  primaryCta: { label: string; to: string };
  secondaryCta: { label: string; to: string };
}

const PERSONA_LENSES: readonly PersonaLensSpec[] = [
  {
    id: 'engineering',
    tabLabel: '01 · ENGINEERING',
    headline: 'Frontend Engineering & Software QA yang terukur.',
    description:
      'Mahasiswa S1 Teknologi Informasi (TI24A) Universitas Amikom Purwokerto & Programmer Intern di PT Puskomedia Indonesia Kreatif—mengerjakan React/TypeScript, Flutter SOMASII, dan pengujian fungsional ASIS Builder (NDA).',
    specs: ['React & TypeScript', 'Flutter & Firebase', 'Functional QA · ASIS NDA'],
    primaryCta: { label: 'Selected Works', to: '/projects' },
    secondaryCta: { label: 'Career Journey', to: '/journey' },
  },
  {
    id: 'system',
    tabLabel: '02 · VISUAL SYSTEM',
    headline: 'Tipografi editorial dengan performa 60fps.',
    description:
      'Membangun antarmuka dalam palet Espresso–Champagne–Ivory, transisi presisi berbasis cubic-bezier(0.22, 1, 0.36, 1), serta modul eksperimental di Creative Lab.',
    specs: ['Design Tokens', 'Framer Kinematics', 'Creative Lab 01–09'],
    primaryCta: { label: 'Open Creative Lab', to: '/lab' },
    secondaryCta: { label: 'Visual Gallery', to: '/gallery' },
  },
  {
    id: 'studio',
    tabLabel: '03 · STUDIO & ROLE',
    headline: 'Kolaborasi terarah dan atribusi yang transparan.',
    description:
      'Co-Founder & Web Developer di SatuRuangCreative, alumni SMK Wiworotomo (PKL GT Computer), pemegang sertifikasi Cisco CCNA (Jul 2026), dan penulis publikasi JPMBA Garuda (Okt 2026).',
    specs: ['SatuRuangCreative', 'CCNA · Jul 2026', 'JPMBA · Okt 2026'],
    primaryCta: { label: 'Personal Dossier', to: '/about' },
    secondaryCta: { label: 'Honors & Record', to: '/achievements' },
  },
] as const;

export const HomePage: React.FC<HomePageProps> = ({ introReady = true }) => {
  const prefersReducedMotion = useReducedMotion();
  const isTabletOrDesktop = useMediaQuery('(min-width: 768px)');
  const isDesktopLayout = useMediaQuery('(min-width: 1024px)');
  const disableMotion = Boolean(prefersReducedMotion);
  const enableHeroParallax = isTabletOrDesktop && !disableMotion;

  const [personaMode, setPersonaMode] = useState<PersonaMode>('engineering');
  const activeLens =
    PERSONA_LENSES.find((p) => p.id === personaMode) ?? PERSONA_LENSES[0];

  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const portraitY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, enableHeroParallax ? (isDesktopLayout ? 30 : 14) : 0],
  );
  const portraitScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, enableHeroParallax ? (isDesktopLayout ? 1.03 : 1.02) : 1],
  );
  const wordmarkY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, enableHeroParallax ? (isDesktopLayout ? -28 : -12) : 0],
  );
  const wordmarkOpacity = useTransform(
    scrollYProgress,
    [0, 0.85],
    [1, enableHeroParallax ? 0.78 : 1],
  );

  const ageInfo = useMemo(() => calculateExactAge(personalData.birthDateISO), []);
  const featuredProjects = useMemo(
    () => projectsData.filter((p) => p.featuredOnHome),
    [],
  );

  return (
    <div className="w-full overflow-x-clip">
      {/* =====================================================================
          SPREAD 01 — MONUMENTAL EDITORIAL COVER + INTERACTIVE PERSONA LENS
      ====================================================================== */}
      <section
        ref={heroRef}
        className="relative bg-obsidian text-ivory flex flex-col justify-between pt-24 sm:pt-28 pb-10 sm:pb-12 px-4 sm:px-6 lg:px-12 overflow-hidden"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 studio-vignette"
        />
        <KineticCursorField variant="hero" className="z-[2]" />

        {/* Single Minimalist Folio Strip */}
        <div className="relative z-20 max-w-[1440px] w-full mx-auto flex flex-wrap items-center justify-between gap-4 border-b border-champagne/15 pb-3.5 font-mono text-[10px] sm:text-[11px] tracking-[0.22em] uppercase">
          <span className="text-champagne">PURWOKERTO · ID</span>
          <span className="text-taupe">
            EST. {ageInfo.birthYear} · USIA {ageInfo.age}
          </span>
        </div>

        {/* Coordinated Cover Lockup + Asymmetric Portrait & Persona Lens */}
        <motion.div
          initial={disableMotion ? false : { scale: 1.04, opacity: 0.92 }}
          animate={
            introReady
              ? { scale: 1, opacity: 1 }
              : { scale: 1.04, opacity: 0.92 }
          }
          transition={{ duration: disableMotion ? 0 : 0.86, ease: EASE_LUXURY }}
          className="relative z-10 max-w-[1440px] w-full mx-auto py-7 sm:py-10 lg:py-12 will-change-transform"
        >
          {/* Monumental Display Masthead */}
          <motion.div
            style={{ y: wordmarkY, opacity: wordmarkOpacity }}
            initial={disableMotion ? false : { opacity: 0, y: 18 }}
            animate={introReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={{
              duration: disableMotion ? 0 : MOTION_DURATION,
              delay: disableMotion ? 0 : 0.08,
              ease: EASE_LUXURY,
            }}
            className="w-full text-center select-none mb-8 sm:mb-10 lg:mb-12 will-change-transform"
          >
            <h1
              aria-label="AFLAN · Aflan Mu'afa Dzulfiqar"
              className="font-display font-['Bodoni_Moda',Georgia,serif] font-medium uppercase text-ivory text-center select-none text-[clamp(3.25rem,9.5vw,7.25rem)] leading-[0.95] tracking-[0.1em] sm:tracking-[0.14em] md:tracking-[0.16em] pl-[0.1em] sm:pl-[0.14em] md:pl-[0.16em] drop-shadow-[0_10px_28px_rgba(23,22,21,0.65)]"
            >
              AFLAN
            </h1>
          </motion.div>

          {/* Asymmetric 12-Column Cover: Portrait Plate (5) + Interactive Persona Lens (7) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-5 flex justify-center">
              <HeroPortrait
                portraitY={portraitY}
                portraitScale={portraitScale}
                introReady={introReady}
              />
            </div>

            <motion.div
              initial={disableMotion ? false : { opacity: 0, y: 18 }}
              animate={introReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              transition={{
                duration: disableMotion ? 0 : MOTION_DURATION,
                delay: disableMotion ? 0 : 0.24,
                ease: EASE_LUXURY,
              }}
              className="lg:col-span-7 flex flex-col gap-6 sm:gap-7 max-w-2xl mx-auto lg:mx-0 w-full"
            >
              <p className="font-serif text-lg sm:text-xl italic text-champagne/90 leading-snug">
                Membangun antarmuka web yang presisi, cepat, dan terstruktur—dari design
                system hingga implementasi frontend.
              </p>

              {/* Interactive Persona Lens Switcher */}
              <div
                role="tablist"
                aria-label="Fokus Persona Portofolio"
                className="flex flex-wrap items-center gap-2 sm:gap-5 border-b border-champagne/20 pb-1"
              >
                {PERSONA_LENSES.map((lens) => {
                  const active = lens.id === activeLens.id;
                  return (
                    <button
                      key={lens.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setPersonaMode(lens.id)}
                      className={`relative min-h-[44px] px-1 py-2 font-mono text-[10px] sm:text-[11px] tracking-[0.2em] uppercase transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-champagne ${
                        active ? 'text-champagne' : 'text-taupe hover:text-ivory'
                      }`}
                    >
                      <span>{lens.tabLabel}</span>
                      {active && (
                        <motion.span
                          layoutId="hero-persona-underline"
                          aria-hidden="true"
                          transition={{
                            duration: disableMotion ? 0 : 0.34,
                            ease: EASE_LUXURY,
                          }}
                          className="absolute inset-x-0 -bottom-[1px] h-[2px] bg-champagne"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Silk Crossfade Lens Panel */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeLens.id}
                  role="tabpanel"
                  initial={
                    disableMotion ? { opacity: 0 } : { opacity: 0, y: 10 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  exit={disableMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                  transition={{
                    duration: disableMotion ? 0.12 : 0.26,
                    ease: EASE_LUXURY,
                  }}
                  className="space-y-5 min-h-[210px] sm:min-h-[185px]"
                >
                  <h2 className="font-serif text-2xl sm:text-3xl md:text-[2.15rem] font-light leading-[1.14] text-ivory">
                    {activeLens.headline}
                  </h2>

                  <p className="font-sans text-sm md:text-base text-ivory/80 leading-relaxed">
                    {activeLens.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {activeLens.specs.map((spec) => (
                      <span
                        key={spec}
                        className="px-3 py-1 border border-champagne/25 bg-espresso/55 font-mono text-[10px] tracking-[0.16em] uppercase text-champagne"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Link
                      to={activeLens.primaryCta.to}
                      className="group inline-flex items-center gap-2.5 min-h-[44px] px-6 py-3 rounded-full bg-champagne text-obsidian font-mono text-xs tracking-[0.16em] uppercase font-medium hover:bg-ivory active:scale-[0.97] transition-all duration-300"
                    >
                      <KineticLabel>{activeLens.primaryCta.label}</KineticLabel>
                      <ArrowUpRight
                        className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden="true"
                      />
                    </Link>

                    <Link
                      to={activeLens.secondaryCta.to}
                      className="inline-flex items-center gap-2 min-h-[44px] px-6 py-3 rounded-full border border-champagne/35 bg-obsidian/50 text-ivory font-mono text-xs tracking-[0.16em] uppercase hover:border-champagne hover:bg-espresso active:scale-[0.97] transition-all duration-300"
                    >
                      <span>{activeLens.secondaryCta.label}</span>
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>

        {/* Minimalist Bottom Scroll Indicator */}
        <div className="relative z-20 max-w-[1440px] w-full mx-auto pt-4 flex items-center justify-between gap-4">
          <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-taupe">
            {personalData.coordinates}
          </span>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] tracking-[0.26em] uppercase text-champagne/80">
              Gulir
            </span>
            <span
              className="relative block w-px h-8 bg-champagne/20 overflow-hidden"
              aria-hidden="true"
            >
              <span className="aflan-scroll-line absolute inset-0 bg-champagne" />
            </span>
          </div>
        </div>
      </section>

      <EditorialMarquee variant="espresso" />

      {/* =====================================================================
          SPREAD 02 — SIGNATURE SPLIT LOOKBOOK STAGE: SELECTED WORKS
      ====================================================================== */}
      <section className="relative bg-espresso text-ivory py-16 md:py-24 px-4 sm:px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto space-y-10 sm:space-y-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-champagne/15">
            <div className="space-y-3">
              <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] text-champagne">
                FEATURED CASE STUDIES
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

            <Link
              to="/projects"
              data-cursor-label="PROJECTS"
              className="group relative inline-flex items-center gap-2 pb-1 font-mono text-xs tracking-[0.2em] uppercase text-champagne hover:text-ivory transition-colors self-start sm:self-auto"
            >
              <KineticLabel>Explore All Projects</KineticLabel>
              <ArrowUpRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>

          <SplitLookbookWorks projects={featuredProjects} />
        </div>
      </section>

      {/* =====================================================================
          SPREAD 03 — ASYMMETRIC EDITORIAL MONOGRAPH GRID
      ====================================================================== */}
      <section className="relative bg-ivory text-espresso py-16 md:py-24 px-4 sm:px-6 lg:px-12 border-t border-espresso/10">
        <div className="max-w-[1440px] mx-auto space-y-12">
          <Reveal
            variant="up"
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-espresso/15"
          >
            <div className="space-y-3">
              <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] font-medium text-bronze">
                EDITORIAL MONOGRAPH
              </p>
              <h2 className="font-serif text-3xl md:text-5xl font-light tracking-tight leading-[1.08] text-espresso">
                Crafted with Discipline,{' '}
                <span className="italic text-mocha">Verified in Production.</span>
              </h2>
            </div>

            <Link
              to="/about"
              className="group inline-flex items-center gap-2 font-mono text-xs tracking-[0.18em] uppercase text-espresso border-b border-espresso pb-1 hover:text-mocha hover:border-mocha transition-colors self-start sm:self-auto"
            >
              <span>Personal Dossier</span>
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </Reveal>

          {/* Asymmetric 7+5 / 5+7 Monograph Spread */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7">
            <Reveal variant="up" className="lg:col-span-7">
              <Link
                to="/skills"
                className="group relative flex flex-col justify-between min-h-[290px] sm:min-h-[320px] p-7 sm:p-10 bg-obsidian text-ivory border border-espresso/20 overflow-hidden"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-0 inset-x-0 h-[2px] bg-champagne origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                />
                <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.22em] uppercase text-champagne">
                  <span>01 · FRONTEND &amp; UI/UX ARCHITECTURE</span>
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </div>
                <div className="pt-10 space-y-3">
                  <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-ivory group-hover:text-champagne transition-colors">
                    Modular React Systems &amp; Creative Lab
                  </h3>
                  <p className="font-sans text-sm md:text-base text-ivory/75 max-w-xl leading-relaxed">
                    Implementasi React.js, TypeScript, Tailwind CSS, dan Framer Motion yang
                    mengutamakan keterbacaan tipografi, aksesibilitas 3 breakpoint, serta
                    interaksi 60fps.
                  </p>
                </div>
              </Link>
            </Reveal>

            <Reveal variant="up" delay={0.06} className="lg:col-span-5">
              <Link
                to="/projects/satu-ruang-creative"
                className="group relative flex flex-col justify-between min-h-[290px] sm:min-h-[320px] p-7 sm:p-10 bg-offwhite text-espresso border border-espresso/15 hover:border-mocha transition-colors overflow-hidden"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-0 inset-x-0 h-[2px] bg-mocha origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                />
                <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.22em] uppercase text-bronze">
                  <span>02 · SATURUANGCREATIVE STUDIO</span>
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </div>
                <div className="pt-10 space-y-3">
                  <h3 className="font-serif text-2xl sm:text-3xl font-light text-espresso group-hover:text-mocha transition-colors italic">
                    &ldquo;Satu Ruang, Banyak Ide, Satu Cerita.&rdquo;
                  </h3>
                  <p className="font-sans text-sm md:text-base text-espresso/80 leading-relaxed">
                    Co-Founder &amp; Web Developer — merancang arsitektur UI/UX dan platform
                    RuangHijau Nusantara bersama tim kreatif mahasiswa.
                  </p>
                </div>
              </Link>
            </Reveal>

            <Reveal variant="up" delay={0.1} className="lg:col-span-5">
              <Link
                to="/journey"
                className="group relative flex flex-col justify-between min-h-[280px] p-7 sm:p-10 bg-offwhite text-espresso border border-espresso/15 hover:border-mocha transition-colors overflow-hidden"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-0 inset-x-0 h-[2px] bg-mocha origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                />
                <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.22em] uppercase text-bronze">
                  <span>03 · SOFTWARE QA &amp; CCNA DISCIPLINE</span>
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </div>
                <div className="pt-10 space-y-3">
                  <h3 className="font-serif text-2xl sm:text-3xl font-light text-espresso group-hover:text-mocha transition-colors">
                    PT Puskomedia · ASIS Builder (NDA) &amp; GT Computer
                  </h3>
                  <p className="font-sans text-sm md:text-base text-espresso/80 leading-relaxed">
                    Berawal dari PKL hardware SMK Wiworotomo di GT Computer hingga Programmer
                    Intern QA &amp; Cisco CCNA (Jul 2026).
                  </p>
                </div>
              </Link>
            </Reveal>

            <Reveal variant="up" delay={0.14} className="lg:col-span-7">
              <Link
                to="/achievements"
                className="group relative flex flex-col justify-between min-h-[280px] p-7 sm:p-10 bg-espresso text-ivory border border-espresso/20 overflow-hidden"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-0 inset-x-0 h-[2px] bg-champagne origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                />
                <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.22em] uppercase text-champagne">
                  <span>04 · JPMBA PUBLICATION &amp; VISUAL ARCHIVE</span>
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </div>
                <div className="pt-10 space-y-3">
                  <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-ivory group-hover:text-champagne transition-colors">
                    JPMBA Garuda (Okt 2026) &amp; S1 TI24A Amikom
                  </h3>
                  <p className="font-sans text-sm md:text-base text-ivory/75 max-w-xl leading-relaxed">
                    Publikasi Jurnal Pengabdian Masyarakat Bangsa terindeks Garuda,
                    aplikasi kampus SOMASII, serta arsip visual monograf di Galeri.
                  </p>
                </div>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SPREAD 04 — ARCHITECTURAL CLOSING SPREAD
      ====================================================================== */}
      <section className="relative bg-obsidian text-ivory py-20 md:py-28 px-4 sm:px-6 lg:px-12 border-t border-champagne/15">
        <div className="max-w-[1440px] mx-auto space-y-10">
          <HairlineRule tone="champagne" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pt-2">
            <div className="lg:col-span-8 space-y-4">
              <p className="font-mono text-[10px] md:text-xs tracking-[0.22em] uppercase text-champagne">
                CORRESPONDENCE
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-tight leading-[1.08] text-ivory">
                Terbuka untuk kolaborasi produk web,{' '}
                <span className="italic text-champagne">UI engineering, dan Software QA.</span>
              </h2>
            </div>

            <div className="lg:col-span-4 flex flex-wrap lg:justify-end items-center gap-3">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2.5 min-h-[44px] px-6 py-3 rounded-full bg-champagne text-obsidian font-mono text-xs tracking-[0.16em] uppercase font-medium hover:bg-ivory active:scale-[0.97] transition-all duration-300"
              >
                <KineticLabel>Get in Touch</KineticLabel>
                <ArrowUpRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </Link>

              <CopyLinkButton
                url={contactData.email}
                label="Copy Email"
                copiedLabel="Email Copied"
                toastTitle="Email Tersalin"
                surface="dark"
                size="md"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-champagne/15 flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] tracking-[0.18em] uppercase text-taupe">
            <span>{contactData.email}</span>
            <a
              href={contactData.githubHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-champagne hover:text-ivory transition-colors"
            >
              <Github className="size-3.5" aria-hidden="true" />
              <span>GitHub · {contactData.githubHandle}</span>
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
