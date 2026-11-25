import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Github, Search, X } from 'lucide-react';
import { BrandSignature, MonogramMark } from '@/components/brand/Monogram';
import { CopyLinkButton } from '@/components/ui/CopyLinkButton';
import { navigationRoutes, personalData } from '@/data/personal';
import { contactData } from '@/data/contact';
import { calculateExactAge } from '@/utils/age';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { EASE_LUXURY, SPRING_SILK } from '@/utils/motion';
import { prefetchRoute } from '@/utils/routePrefetch';

interface NavbarProps {
  onOpenCommandPalette?: () => void;
}

interface RouteContextSpec {
  tag: string;
  summary: string;
  highlights: readonly string[];
  motif: 'compass' | 'grid' | 'axis' | 'layers';
}

const ROUTE_CONTEXT_MAP: Record<string, RouteContextSpec> = {
  '/': {
    tag: 'EDITORIAL COVER',
    summary:
      'Halaman pembuka 3-babak: masthead Cinzel, Editorial Portrait Plate, Selected Works berbasis Lenis, dan Quiet Closing Spread.',
    highlights: ['Cinzel Masthead', 'Lenis Selected Works', 'Quiet Closing'],
    motif: 'compass',
  },
  '/about': {
    tag: 'PERSONAL DOSSIER',
    summary:
      'Profil lengkap Aflan Mu\'afa Dzulfiqar — S1 Teknologi Informasi (TI24A) Amikom, alumni SMK Wiworotomo, dan Programmer Intern PT Puskomedia.',
    highlights: ['S1 TI24A Amikom', 'PT Puskomedia QA', 'Purwokerto · ID'],
    motif: 'layers',
  },
  '/journey': {
    tag: 'CHRONICLE & TIMELINE',
    summary:
      'Perjalanan karir dan akademik dari PKL GT Computer Purwokerto hingga peran Programmer Intern QA pada ASIS Builder.',
    highlights: ['GT Computer PKL', 'PT Puskomedia', 'Sticky Chronicle'],
    motif: 'axis',
  },
  '/skills': {
    tag: 'ENGINEERING MATRIX',
    summary:
      'Kapabilitas React/TypeScript, Flutter & Firebase, Software Evaluation & Functional QA, serta orkestrasi workflow berbasis AI.',
    highlights: ['React & TypeScript', 'Flutter & Firebase', 'Deterministic QA'],
    motif: 'grid',
  },
  '/projects': {
    tag: 'SELECTED ARCHIVE',
    summary:
      'Arsip karya pilihan termasuk SatuRuangCreative, aplikasi kampus SOMASII, dan evaluasi fungsional ASIS Builder (NDA).',
    highlights: ['SatuRuangCreative', 'SOMASII App', 'ASIS Builder NDA'],
    motif: 'layers',
  },
  '/lab': {
    tag: 'MOTION WORKBENCH',
    summary:
      'Laboratorium 9 modul interaktif untuk menguji kurva easing luxury, token tipografi, dan micro-interactions taktil 60fps.',
    highlights: ['Modules 01–09', 'Spring Kinematics', 'Token Specimen'],
    motif: 'compass',
  },
  '/gallery': {
    tag: 'VISUAL MONOGRAPH',
    summary:
      'Kurasi studi potret studio dan komposisi visual bernuansa Espresso–Champagne–Ivory lengkap dengan Lightbox presisi.',
    highlights: ['Studio Plates', 'Locked Lightbox', 'Tonal Studies'],
    motif: 'grid',
  },
  '/achievements': {
    tag: 'CREDENTIALS & PRESS',
    summary:
      'Catatan sertifikasi industri dan publikasi terverifikasi, termasuk Cisco CCNA (Jul 2026) dan jurnal JPMBA Garuda (Okt 2026).',
    highlights: ['Cisco CCNA', 'JPMBA Garuda', 'Verified Record'],
    motif: 'axis',
  },
  '/contact': {
    tag: 'CORRESPONDENCE',
    summary:
      'Kanal langsung untuk diskusi pengembangan produk web, kolaborasi UI engineering, maupun kebutuhan Software QA.',
    highlights: ['Direct Inbox', 'GitHub · Flannss', 'Quick Copy Email'],
    motif: 'compass',
  },
};

function getPurwokertoWibTime(): string {
  try {
    return new Intl.DateTimeFormat('id-ID', {
      timeZone: personalData.timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date());
  } catch {
    return '--:--';
  }
}

const ContextMotifSvg: React.FC<{ motif: RouteContextSpec['motif'] }> = ({
  motif,
}) => {
  if (motif === 'grid') {
    return (
      <svg viewBox="0 0 120 72" className="w-24 h-14 text-champagne/35" aria-hidden="true">
        <rect x="2" y="2" width="116" height="68" fill="none" stroke="currentColor" strokeWidth="1" />
        <line x1="40" y1="2" x2="40" y2="70" stroke="currentColor" strokeWidth="0.75" />
        <line x1="80" y1="2" x2="80" y2="70" stroke="currentColor" strokeWidth="0.75" />
        <line x1="2" y1="36" x2="118" y2="36" stroke="currentColor" strokeWidth="0.75" />
        <circle cx="40" cy="36" r="2.5" fill="currentColor" />
      </svg>
    );
  }
  if (motif === 'axis') {
    return (
      <svg viewBox="0 0 120 72" className="w-24 h-14 text-champagne/35" aria-hidden="true">
        <line x1="8" y1="58" x2="112" y2="14" stroke="currentColor" strokeWidth="1" />
        <circle cx="24" cy="51" r="3" fill="currentColor" />
        <circle cx="60" cy="36" r="3" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="96" cy="21" r="3" fill="currentColor" />
        <line x1="8" y1="64" x2="112" y2="64" stroke="currentColor" strokeDasharray="3 4" strokeWidth="0.75" />
      </svg>
    );
  }
  if (motif === 'layers') {
    return (
      <svg viewBox="0 0 120 72" className="w-24 h-14 text-champagne/35" aria-hidden="true">
        <rect x="10" y="10" width="76" height="44" fill="none" stroke="currentColor" strokeWidth="1" />
        <rect x="22" y="18" width="76" height="44" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
        <rect x="34" y="26" width="76" height="38" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 120 72" className="w-24 h-14 text-champagne/35" aria-hidden="true">
      <circle cx="60" cy="36" r="28" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="60" cy="36" r="16" fill="none" stroke="currentColor" strokeDasharray="3 4" strokeWidth="0.9" />
      <line x1="20" y1="36" x2="100" y2="36" stroke="currentColor" strokeWidth="0.75" />
      <line x1="60" y1="4" x2="60" y2="68" stroke="currentColor" strokeWidth="0.75" />
    </svg>
  );
};

const NavbarComponent: React.FC<NavbarProps> = ({ onOpenCommandPalette }) => {
  const location = useLocation();
  const [menuOpenPath, setMenuOpenPath] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [overDarkSurface, setOverDarkSurface] = useState(false);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const [navHoverPath, setNavHoverPath] = useState<string | null>(null);
  const [wibTime, setWibTime] = useState<string>(getPurwokertoWibTime);
  const prefersReducedMotion = useReducedMotion();
  const { pauseScroll, resumeScroll } = useSmoothScroll();
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const menuOpen = menuOpenPath === location.pathname;
  const openMenu = () => {
    setHoveredPath(null);
    setWibTime(getPurwokertoWibTime());
    setMenuOpenPath(location.pathname);
  };
  const closeMenu = () => {
    setHoveredPath(null);
    setMenuOpenPath(null);
  };

  const ageDetails = useMemo(
    () => calculateExactAge(personalData.birthDateISO),
    [],
  );

  useEffect(() => {
    const syncHeaderSurface = () => {
      setScrolled(window.scrollY > 24);

      const forcedTheme = document.documentElement.dataset.headerTheme;
      if (forcedTheme === 'dark') {
        setOverDarkSurface(true);
        return;
      }
      if (forcedTheme === 'light') {
        setOverDarkSurface(false);
        return;
      }

      const darkSections = document.querySelectorAll<HTMLElement>(
        '[data-nav-surface="dark"]',
      );
      const probeY = 56;
      let intersectsDark = false;
      darkSections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= probeY && rect.bottom > probeY) {
          intersectsDark = true;
        }
      });
      setOverDarkSurface(intersectsDark);
    };

    syncHeaderSurface();
    const rafId = window.requestAnimationFrame(syncHeaderSurface);
    window.addEventListener('scroll', syncHeaderSurface, { passive: true });
    window.addEventListener('resize', syncHeaderSurface, { passive: true });
    window.addEventListener('aflan-nav-theme-sync', syncHeaderSurface);
    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', syncHeaderSurface);
      window.removeEventListener('resize', syncHeaderSurface);
      window.removeEventListener('aflan-nav-theme-sync', syncHeaderSurface);
    };
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    pauseScroll();

    const timeInterval = window.setInterval(() => {
      setWibTime(getPurwokertoWibTime());
    }, 30_000);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setHoveredPath(null);
        setMenuOpenPath(null);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      resumeScroll();
      window.clearInterval(timeInterval);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen, pauseScroll, resumeScroll]);

  const activePreviewRoute =
    navigationRoutes.find((r) => r.path === hoveredPath) ??
    navigationRoutes.find(
      (r) =>
        r.path === location.pathname ||
        (r.path === '/projects' && location.pathname.startsWith('/projects/')),
    ) ??
    navigationRoutes[0];

  const activeRouteContext =
    ROUTE_CONTEXT_MAP[activePreviewRoute.path] ?? ROUTE_CONTEXT_MAP['/'];

  const isLightHeaderRoute =
    (location.pathname === '/about' ||
      location.pathname === '/gallery' ||
      location.pathname === '/contact') &&
    !overDarkSurface;

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          isLightHeaderRoute
            ? scrolled
              ? 'bg-ivory/95 backdrop-blur-md border-b border-espresso/15 py-3 shadow-[0_10px_34px_rgba(43,29,23,0.10)]'
              : 'bg-ivory/90 backdrop-blur-md border-b border-espresso/10 py-4 sm:py-5'
            : scrolled
              ? 'bg-obsidian/92 backdrop-blur-md border-b border-champagne/15 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.35)]'
              : 'bg-obsidian/65 backdrop-blur-sm border-b border-champagne/10 py-4 sm:py-5'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between gap-3 sm:gap-4">
          <Link
            to="/"
            aria-label="AFLAN Home"
            data-cursor="HOME"
            onMouseEnter={() => prefetchRoute('/')}
            className="shrink-0 focus-visible:outline-2 focus-visible:outline-champagne rounded-sm"
          >
            <BrandSignature
              compact={scrolled}
              tone={isLightHeaderRoute ? 'dark' : 'light'}
            />
          </Link>

          <nav
            aria-label="Primary navigation"
            onMouseLeave={() => setNavHoverPath(null)}
            className={`hidden xl:flex items-center gap-0.5 2xl:gap-1 px-2 2xl:px-2.5 py-1.5 rounded-full backdrop-blur-md border ${
              isLightHeaderRoute
                ? 'bg-offwhite/90 border-espresso/15'
                : 'bg-espresso/55 border-champagne/15'
            }`}
          >
            {navigationRoutes.map((route) => {
              const isProjectDetail =
                route.path === '/projects' &&
                location.pathname.startsWith('/projects/');
              const isGhostHovered = navHoverPath === route.path;

              return (
                <NavLink
                  key={route.path}
                  to={route.path}
                  end={route.path === '/'}
                  onMouseEnter={() => {
                    setNavHoverPath(route.path);
                    prefetchRoute(route.path);
                  }}
                  onFocus={() => {
                    setNavHoverPath(route.path);
                    prefetchRoute(route.path);
                  }}
                  onTouchStart={() => prefetchRoute(route.path)}
                  className={({ isActive }) => {
                    const active = isActive || isProjectDetail;
                    if (isLightHeaderRoute) {
                      return `group/nav relative px-2.5 2xl:px-3.5 py-1.5 rounded-full font-mono text-[10px] 2xl:text-[11px] tracking-[0.14em] uppercase whitespace-nowrap transition-colors duration-300 ${
                        active
                          ? 'text-ivory font-medium'
                          : 'text-espresso/80 hover:text-mocha'
                      }`;
                    }
                    return `group/nav relative px-2.5 2xl:px-3.5 py-1.5 rounded-full font-mono text-[10px] 2xl:text-[11px] tracking-[0.14em] uppercase whitespace-nowrap transition-colors duration-300 ${
                      active
                        ? 'text-obsidian font-medium'
                        : 'text-ivory/80 hover:text-champagne'
                    }`;
                  }}
                >
                  {({ isActive }) => {
                    const active = isActive || isProjectDetail;
                    return (
                      <>
                        {!active && isGhostHovered && (
                          <motion.span
                            layoutId="nav-hover"
                            aria-hidden="true"
                            transition={prefersReducedMotion ? { duration: 0 } : SPRING_SILK}
                            className={`absolute inset-0 rounded-full -z-20 ${
                              isLightHeaderRoute ? 'bg-espresso/10' : 'bg-champagne/14'
                            }`}
                          />
                        )}
                        {active && (
                          <motion.span
                            layoutId="aflan-nav-pill"
                            aria-hidden="true"
                            transition={prefersReducedMotion ? { duration: 0 } : SPRING_SILK}
                            className={`absolute inset-0 rounded-full -z-10 shadow-xs ${
                              isLightHeaderRoute ? 'bg-espresso' : 'bg-champagne'
                            }`}
                          >
                            <span
                              className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-3 h-[1.5px] rounded-full ${
                                isLightHeaderRoute ? 'bg-champagne/75' : 'bg-obsidian/45'
                              }`}
                            />
                          </motion.span>
                        )}
                        <span className="relative z-10 inline-flex overflow-hidden align-middle leading-[1.35] py-0.5 px-0.5 -my-0.5">
                          <span className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/nav:-translate-y-[125%] motion-reduce:transform-none">
                            {route.shortLabel}
                          </span>
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-x-0 top-0.5 inline-block italic translate-y-[125%] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/nav:translate-y-0 motion-reduce:hidden"
                          >
                            {route.shortLabel}
                          </span>
                        </span>
                      </>
                    );
                  }}
                </NavLink>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex xl:hidden items-center gap-1.5 mr-1">
              {['/about', '/projects', '/lab', '/contact'].map((path) => {
                const route = navigationRoutes.find((r) => r.path === path);
                if (!route) return null;
                const isProjectDetail =
                  route.path === '/projects' &&
                  location.pathname.startsWith('/projects/');
                return (
                  <NavLink
                    key={route.path}
                    to={route.path}
                    onMouseEnter={() => prefetchRoute(route.path)}
                    onFocus={() => prefetchRoute(route.path)}
                    onTouchStart={() => prefetchRoute(route.path)}
                    className={({ isActive }) => {
                      const active = isActive || isProjectDetail;
                      return `relative px-2.5 py-2 font-mono text-[11px] tracking-[0.15em] uppercase whitespace-nowrap transition-colors ${
                        isLightHeaderRoute
                          ? active
                            ? 'text-mocha font-medium'
                            : 'text-espresso/75 hover:text-mocha'
                          : active
                            ? 'text-champagne'
                            : 'text-ivory/75 hover:text-champagne'
                      }`;
                    }}
                  >
                    {({ isActive }) => {
                      const active = isActive || isProjectDetail;
                      return (
                        <>
                          {route.shortLabel}
                          {active && (
                            <motion.span
                              layoutId="aflan-tablet-nav-underline"
                              aria-hidden="true"
                              transition={prefersReducedMotion ? { duration: 0 } : SPRING_SILK}
                              className={`absolute inset-x-2.5 bottom-1 h-[1.5px] ${
                                isLightHeaderRoute ? 'bg-mocha' : 'bg-champagne'
                              }`}
                            />
                          )}
                        </>
                      );
                    }}
                  </NavLink>
                );
              })}
            </div>

            <button
              ref={triggerRef}
              type="button"
              onClick={() => (menuOpen ? closeMenu() : openMenu())}
              aria-expanded={menuOpen}
              aria-controls="aflan-editorial-menu"
              aria-label={menuOpen ? 'Close full navigation' : 'Open full navigation'}
              data-cursor={menuOpen ? 'CLOSE' : 'MENU'}
              className={`group inline-flex items-center gap-2.5 min-h-[44px] px-4 sm:px-4.5 py-2 rounded-full border shrink-0 transition-all duration-300 cursor-pointer ${
                isLightHeaderRoute
                  ? 'border-espresso/30 bg-espresso text-ivory hover:bg-mocha hover:border-mocha'
                  : 'border-champagne/35 bg-espresso/75 text-ivory hover:bg-champagne hover:text-obsidian'
              }`}
            >
              <span className="font-mono text-[11px] tracking-[0.2em] uppercase">
                {menuOpen ? 'Close' : 'Menu'}
              </span>
              <span
                aria-hidden="true"
                className="relative w-4 h-3.5 flex flex-col justify-center items-end"
              >
                <span
                  className={`block h-[1.5px] bg-current rounded-full transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    menuOpen ? 'w-4 translate-y-[0.75px] rotate-45' : 'w-4 -translate-y-[3px]'
                  }`}
                />
                <span
                  className={`block h-[1.5px] bg-current rounded-full transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    menuOpen
                      ? 'w-4 -translate-y-[0.75px] -rotate-45'
                      : 'w-3 translate-y-[3px] group-hover:w-4'
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="aflan-editorial-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Full site navigation"
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -16 }
            }
            animate={{ opacity: 1, y: 0 }}
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -12 }
            }
            transition={{ duration: prefersReducedMotion ? 0.16 : 0.34, ease: EASE_LUXURY }}
            data-lenis-prevent
            className="fixed inset-0 z-65 bg-obsidian text-ivory overflow-y-auto overscroll-contain will-change-[transform,opacity]"
          >
            <div className="studio-vignette min-h-dvh flex flex-col justify-between px-4 sm:px-6 lg:px-12 py-5 sm:py-6">
              {/* Top Overlay Header */}
              <div className="max-w-[1440px] w-full mx-auto flex items-center justify-between gap-2.5 sm:gap-3 pb-4 sm:pb-5 border-b border-champagne/15">
                <Link to="/" onClick={closeMenu} aria-label="AFLAN Home" className="shrink-0">
                  <BrandSignature tone="light" />
                </Link>
                <div className="flex items-center gap-2 shrink-0">
                  {onOpenCommandPalette && (
                    <button
                      type="button"
                      onClick={() => {
                        closeMenu();
                        onOpenCommandPalette();
                      }}
                      aria-label="Open Quick Index Command Palette"
                      className="inline-flex items-center gap-1.5 min-h-[44px] px-3 sm:px-3.5 py-2 rounded-full border border-champagne/20 bg-espresso/70 text-champagne hover:border-champagne hover:bg-espresso transition-colors shrink-0 cursor-pointer font-mono text-[10px] sm:text-[11px] tracking-[0.15em] uppercase"
                    >
                      <Search className="size-3.5" aria-hidden="true" />
                      <span className="sm:hidden">⌘K</span>
                      <span className="hidden sm:inline">⌘K · Quick Index</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      closeMenu();
                      triggerRef.current?.focus();
                    }}
                    aria-label="Close navigation menu"
                    className="inline-flex items-center gap-2 min-h-[44px] px-3.5 sm:px-4 py-2 rounded-full border border-champagne/40 text-champagne hover:bg-champagne hover:text-obsidian transition-colors shrink-0 cursor-pointer"
                  >
                    <span className="font-mono text-[11px] tracking-[0.2em] uppercase">
                      Close
                    </span>
                    <X className="size-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Editorial Directory + Right Live Context Panel */}
              <div className="max-w-[1440px] w-full mx-auto py-5 sm:py-8 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center my-auto">
                <nav
                  aria-label="Portfolio page directory"
                  onMouseLeave={() => setHoveredPath(null)}
                  className="md:col-span-7 min-w-0 divide-y divide-champagne/12 border-y border-champagne/12"
                >
                  {navigationRoutes.map((route, i) => {
                    const isCurrent =
                      location.pathname === route.path ||
                      (route.path === '/projects' &&
                        location.pathname.startsWith('/projects/'));
                    const isFocused = hoveredPath === route.path;
                    const isDimmed = hoveredPath !== null && !isFocused;

                    return (
                      <motion.div
                        key={route.path}
                        whileTap={prefersReducedMotion ? undefined : { scale: 0.985 }}
                        className={`transition-opacity duration-300 ${
                          isDimmed ? 'md:opacity-40' : 'opacity-100'
                        }`}
                      >
                        <Link
                          to={route.path}
                          onMouseEnter={() => {
                            setHoveredPath(route.path);
                            prefetchRoute(route.path);
                          }}
                          onFocus={() => {
                            setHoveredPath(route.path);
                            prefetchRoute(route.path);
                          }}
                          onTouchStart={() => prefetchRoute(route.path)}
                          onClick={closeMenu}
                          className="relative group grid grid-cols-[minmax(0,1fr)_auto] sm:grid-cols-[minmax(195px,max-content)_minmax(0,1fr)_auto] md:grid-cols-[minmax(160px,max-content)_minmax(0,1fr)_auto] xl:grid-cols-[minmax(230px,max-content)_minmax(0,1fr)_auto] items-center gap-x-4 xl:gap-x-6 py-3 sm:py-3.5 px-2 sm:px-3 min-h-[56px] transition-colors"
                        >
                          <span
                            aria-hidden="true"
                            className={`pointer-events-none absolute left-0 inset-y-2.5 w-[2px] bg-champagne transition-transform duration-300 origin-top ${
                              isCurrent || isFocused
                                ? 'scale-y-100'
                                : 'scale-y-0 group-hover:scale-y-100'
                            }`}
                          />

                          <div className="min-w-0 flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-4">
                            <div className="flex items-baseline gap-3 sm:gap-4 min-w-0">
                              <span className="font-mono text-[11px] tracking-[0.22em] text-champagne/75 shrink-0">
                                {route.index}
                              </span>
                              <motion.span
                                initial={
                                  prefersReducedMotion
                                    ? false
                                    : { opacity: 0, y: 12 }
                                }
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  delay: prefersReducedMotion ? 0 : 0.03 + i * 0.025,
                                  duration: 0.36,
                                  ease: EASE_LUXURY,
                                }}
                                className="inline-block"
                              >
                                <span
                                  className={`inline-block font-serif text-[1.6rem] sm:text-3xl md:text-[1.75rem] xl:text-[2.45rem] leading-[1.32] py-1 pr-3 -my-1 whitespace-nowrap transition-[transform,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                                    isCurrent
                                      ? 'text-champagne italic translate-x-1'
                                      : 'text-ivory group-hover:text-champagne group-hover:italic group-hover:translate-x-1.5'
                                  }`}
                                >
                                  {route.label}
                                </span>
                              </motion.span>
                              {isCurrent && (
                                <span className="sm:hidden inline-flex items-center px-2 py-0.5 rounded-full border border-champagne/40 bg-champagne/10 font-mono text-[9px] tracking-[0.16em] uppercase text-champagne shrink-0">
                                  Active
                                </span>
                              )}
                            </div>

                            <span className="sm:hidden font-sans text-[11px] text-taupe truncate pl-7">
                              {route.subtitle}
                            </span>
                          </div>

                          <span className="hidden sm:block min-w-0 text-right font-sans text-xs leading-snug text-taupe group-hover:text-ivory/90 transition-colors">
                            {route.subtitle}
                          </span>

                          <ArrowUpRight
                            className={`size-4 shrink-0 transition-all duration-300 ${
                              isCurrent
                                ? 'text-champagne'
                                : 'text-champagne/55 group-hover:text-champagne group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
                            }`}
                            aria-hidden="true"
                          />
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                {/* Live Editorial Context Panel (Tablet & Desktop >= 768px) */}
                <aside className="hidden md:flex md:col-span-5 min-w-0 flex-col pl-4 lg:pl-8 border-l border-brass/20">
                  <div className="relative overflow-hidden border border-brass/25 bg-umber p-6 lg:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
                    <motion.div
                      key={activePreviewRoute.path}
                      initial={
                        prefersReducedMotion ? false : { opacity: 0.78, y: 4 }
                      }
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.18, ease: EASE_LUXURY }}
                      className="space-y-5"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-brass">
                          PAGE {activePreviewRoute.index} · {activeRouteContext.tag}
                        </span>
                        <MonogramMark size={24} className="text-brass/85 shrink-0" />
                      </div>

                      <div className="relative flex items-center justify-between gap-4 py-4 px-5 bg-obsidian/90 border border-brass/20">
                        <div className="min-w-0">
                          <p className="font-serif text-3xl lg:text-4xl font-light text-ivory leading-[1.22] pb-0.5">
                            {activePreviewRoute.label}
                          </p>
                          <p className="font-sans text-xs text-champagne/90 mt-1.5">
                            {activePreviewRoute.subtitle}
                          </p>
                        </div>
                        <div className="relative flex items-center justify-end shrink-0">
                          <ContextMotifSvg motif={activeRouteContext.motif} />
                          <span className="pointer-events-none absolute right-0 font-serif italic text-5xl text-champagne/15 leading-none select-none">
                            {activePreviewRoute.index}
                          </span>
                        </div>
                      </div>

                      <p className="font-sans text-xs lg:text-sm text-ivory/85 leading-relaxed">
                        {activeRouteContext.summary}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {activeRouteContext.highlights.map((chip) => (
                          <span
                            key={chip}
                            className="px-2.5 py-1 border border-champagne/25 bg-[#1A1412]/65 font-mono text-[9px] tracking-[0.16em] uppercase text-champagne"
                          >
                            {chip}
                          </span>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-champagne/15 text-xs">
                        <div>
                          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-taupe">
                            Identitas
                          </p>
                          <p className="text-ivory mt-1 truncate">{personalData.fullName}</p>
                        </div>
                        <div>
                          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-taupe">
                            Usia &amp; Basis
                          </p>
                          <p className="text-ivory mt-1">
                            {ageDetails.age} Tahun · Purwokerto
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </aside>
              </div>

              {/* Quick Utility Dock (Desktop, Tablet & Mobile) */}
              <div className="max-w-[1440px] w-full mx-auto pt-4 sm:pt-5 border-t border-champagne/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] sm:text-[11px] tracking-[0.18em] uppercase text-taupe">
                  <span className="inline-flex items-center gap-2 text-champagne tabular-nums">
                    <span
                      aria-hidden="true"
                      className="size-1.5 rounded-full bg-champagne"
                    />
                    PURWOKERTO · {wibTime} WIB
                  </span>
                  <span aria-hidden="true" className="hidden sm:inline text-champagne/25">
                    ·
                  </span>
                  <span className="hidden sm:inline">
                    {personalData.university}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                  {onOpenCommandPalette && (
                    <button
                      type="button"
                      onClick={() => {
                        closeMenu();
                        onOpenCommandPalette();
                      }}
                      className="inline-flex items-center gap-1.5 min-h-[44px] px-3.5 py-2 rounded-full border border-champagne/25 bg-espresso/60 font-mono text-[10px] tracking-[0.16em] uppercase text-champagne hover:border-champagne hover:bg-espresso transition-colors cursor-pointer"
                    >
                      <Search className="size-3" aria-hidden="true" />
                      <span>⌘K Quick Index</span>
                    </button>
                  )}

                  <CopyLinkButton
                    url={contactData.email}
                    label="Copy Email"
                    copiedLabel="Email Copied"
                    toastTitle="Email Tersalin"
                    surface="dark"
                    size="sm"
                    className="min-h-[44px]"
                  />

                  <a
                    href={contactData.githubHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Profil GitHub ${contactData.githubHandle}`}
                    className="inline-flex items-center gap-1.5 min-h-[44px] px-3.5 py-2 rounded-full border border-champagne/25 bg-espresso/50 font-mono text-[10px] tracking-[0.16em] uppercase text-ivory hover:border-champagne hover:text-champagne transition-colors"
                  >
                    <Github className="size-3.5" aria-hidden="true" />
                    <span>{contactData.githubHandle}</span>
                    <ArrowUpRight className="size-3" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export const Navbar = React.memo(NavbarComponent);
