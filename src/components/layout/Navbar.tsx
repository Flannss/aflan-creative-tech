import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Menu, Search, X } from 'lucide-react';
import { BrandSignature, MonogramMark } from '@/components/brand/Monogram';
import { navigationRoutes, personalData } from '@/data/personal';
import { contactData } from '@/data/contact';
import { calculateExactAge } from '@/utils/age';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { EASE_LUXURY, SPRING_SILK } from '@/utils/motion';

interface NavbarProps {
  onOpenCommandPalette?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCommandPalette }) => {
  const location = useLocation();
  const [menuOpenPath, setMenuOpenPath] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [overDarkSurface, setOverDarkSurface] = useState(false);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const { pauseScroll, resumeScroll } = useSmoothScroll();
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const menuOpen = menuOpenPath === location.pathname;
  const openMenu = () => setMenuOpenPath(location.pathname);
  const closeMenu = () => setMenuOpenPath(null);

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

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpenPath(null);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      resumeScroll();
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
            aria-label="Beranda AFLAN"
            data-cursor="BERANDA"
            className="shrink-0 focus-visible:outline-2 focus-visible:outline-champagne rounded-sm"
          >
            <BrandSignature
              compact={scrolled}
              tone={isLightHeaderRoute ? 'dark' : 'light'}
            />
          </Link>

          <nav
            aria-label="Navigasi utama"
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

              return (
                <NavLink
                  key={route.path}
                  to={route.path}
                  end={route.path === '/'}
                  className={({ isActive }) => {
                    const active = isActive || isProjectDetail;
                    if (isLightHeaderRoute) {
                      return `relative px-2.5 2xl:px-3.5 py-1.5 rounded-full font-mono text-[10px] 2xl:text-[11px] tracking-[0.14em] uppercase whitespace-nowrap transition-colors duration-300 ${
                        active
                          ? 'text-ivory font-medium'
                          : 'text-espresso/80 hover:text-mocha'
                      }`;
                    }
                    return `relative px-2.5 2xl:px-3.5 py-1.5 rounded-full font-mono text-[10px] 2xl:text-[11px] tracking-[0.14em] uppercase whitespace-nowrap transition-colors duration-300 ${
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
                        {active && (
                          <motion.span
                            layoutId="aflan-nav-pill"
                            transition={prefersReducedMotion ? { duration: 0 } : SPRING_SILK}
                            className={`absolute inset-0 rounded-full -z-10 ${
                              isLightHeaderRoute ? 'bg-espresso' : 'bg-champagne'
                            }`}
                          />
                        )}
                        {route.shortLabel}
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
              aria-label={menuOpen ? 'Tutup indeks navigasi' : 'Buka indeks navigasi penuh'}
              data-cursor={menuOpen ? 'TUTUP' : 'INDEKS'}
              className={`inline-flex items-center gap-2 sm:gap-2.5 min-h-[44px] lg:min-h-0 px-4 py-2.5 lg:py-2 rounded-full border shrink-0 transition-all duration-300 ${
                isLightHeaderRoute
                  ? 'border-espresso/30 bg-espresso text-ivory hover:bg-mocha hover:border-mocha'
                  : 'border-champagne/35 bg-espresso/75 text-ivory hover:bg-champagne hover:text-obsidian'
              }`}
            >
              <span className="font-mono text-[11px] tracking-[0.2em] uppercase">
                {menuOpen ? 'Tutup' : 'Indeks'}
              </span>
              <span className="font-mono text-[10px] opacity-70 hidden sm:inline">
                {String(navigationRoutes.length).padStart(2, '0')}
              </span>
              {menuOpen ? (
                <X className="size-4" aria-hidden="true" />
              ) : (
                <Menu className="size-4" aria-hidden="true" />
              )}
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
            aria-label="Indeks navigasi sembilan bab"
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
            transition={{ duration: prefersReducedMotion ? 0.16 : 0.32, ease: EASE_LUXURY }}
            data-lenis-prevent
            className="fixed inset-0 z-65 bg-obsidian text-ivory overflow-y-auto overscroll-contain will-change-[transform,opacity]"
          >
            <div className="studio-vignette min-h-dvh flex flex-col justify-between px-4 sm:px-6 lg:px-12 py-6">
              <div className="max-w-[1440px] w-full mx-auto flex items-center justify-between gap-2.5 sm:gap-3 pb-5 sm:pb-6 border-b border-champagne/15">
                <Link to="/" onClick={closeMenu} aria-label="Beranda AFLAN" className="shrink-0">
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
                      aria-label="Buka indeks cepat Command Palette"
                      className="inline-flex items-center gap-1.5 min-h-[44px] lg:min-h-0 px-3 sm:px-3.5 py-2.5 lg:py-2 rounded-full border border-champagne/20 bg-espresso/70 text-champagne hover:border-champagne hover:bg-espresso transition-colors shrink-0 cursor-pointer font-mono text-[10px] sm:text-[11px] tracking-[0.15em] uppercase"
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
                    aria-label="Tutup menu navigasi"
                    className="inline-flex items-center gap-2 min-h-[44px] lg:min-h-0 px-3.5 sm:px-4 py-2.5 lg:py-2 rounded-full border border-champagne/40 text-champagne hover:bg-champagne hover:text-obsidian transition-colors shrink-0"
                  >
                    <span className="font-mono text-[11px] tracking-[0.2em] uppercase">
                      Tutup
                    </span>
                    <X className="size-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="max-w-[1440px] w-full mx-auto py-6 sm:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-center my-auto">
                <nav
                  aria-label="Daftar 9 bab portofolio"
                  className="lg:col-span-7 min-w-0 divide-y divide-champagne/10"
                >
                  {navigationRoutes.map((route, i) => {
                    const isCurrent =
                      location.pathname === route.path ||
                      (route.path === '/projects' &&
                        location.pathname.startsWith('/projects/'));

                    return (
                      <motion.div
                        key={route.path}
                        initial={prefersReducedMotion ? false : { opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: prefersReducedMotion ? 0 : 0.04 + i * 0.025,
                          duration: 0.34,
                          ease: EASE_LUXURY,
                        }}
                      >
                        <Link
                          to={route.path}
                          onMouseEnter={() => setHoveredPath(route.path)}
                          onFocus={() => setHoveredPath(route.path)}
                          onClick={closeMenu}
                          className="group grid grid-cols-[minmax(0,1fr)_auto] sm:grid-cols-[minmax(195px,max-content)_minmax(0,1fr)_auto] lg:grid-cols-[minmax(185px,max-content)_minmax(0,1fr)_auto] xl:grid-cols-[minmax(240px,max-content)_minmax(0,1fr)_auto] items-center gap-x-4 xl:gap-x-6 py-3.5 min-h-[52px] lg:min-h-0 transition-colors"
                        >
                          <div className="flex items-baseline gap-3 sm:gap-5 min-w-0">
                            <span className="font-mono text-xs tracking-[0.22em] text-champagne/70 shrink-0">
                              {route.index}
                            </span>{' '}
                            <span
                              className={`font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[2rem] xl:text-[2.6rem] leading-tight lg:leading-none whitespace-nowrap transition-all duration-300 ${
                                isCurrent
                                  ? 'text-champagne italic translate-x-1'
                                  : 'text-ivory group-hover:text-champagne group-hover:italic group-hover:translate-x-1.5'
                              }`}
                            >
                              {route.label}
                            </span>
                          </div>

                          <span className="hidden sm:block min-w-0 text-right font-sans text-xs leading-snug text-taupe group-hover:text-ivory/90 transition-colors">
                            {route.subtitle}
                          </span>

                          <ArrowUpRight
                            className="size-4 shrink-0 text-champagne/60 group-hover:text-champagne group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                            aria-hidden="true"
                          />
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                <aside className="hidden lg:flex lg:col-span-5 min-w-0 flex-col gap-6 pl-6 border-l border-champagne/15">
                  <div className="relative overflow-hidden border border-champagne/20 bg-espresso/60 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-champagne">
                        BAB {activePreviewRoute.index}
                      </span>
                      <MonogramMark size={26} className="text-champagne/70" />
                    </div>
                    <div className="relative aspect-16/10 overflow-hidden mb-5 bg-obsidian border border-champagne/10">
                      <img
                        src={personalData.portraitPath}
                        alt="Potret studio Aflan Mu'afa Dzulfiqar"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover object-[50%_22%] opacity-85"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-obsidian/90 via-obsidian/20 to-transparent" />
                      <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                        <div>
                          <p className="font-serif text-2xl text-ivory leading-none">
                            {activePreviewRoute.label}
                          </p>
                          <p className="font-sans text-xs text-champagne/85 mt-1">
                            {activePreviewRoute.subtitle}
                          </p>
                        </div>
                        <span className="font-serif italic text-4xl text-champagne/30 leading-none">
                          {activePreviewRoute.index}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-champagne/15 text-xs">
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-taupe">
                          Identitas
                        </p>
                        <p className="text-ivory mt-1">{personalData.fullName}</p>
                      </div>
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-taupe">
                          Usia &amp; Basis
                        </p>
                        <p className="text-ivory mt-1">
                          {ageDetails.age}{' '}Tahun · Purwokerto
                        </p>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>

              <div className="max-w-[1440px] w-full mx-auto pt-5 border-t border-champagne/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm lg:text-xs text-taupe">
                <p className="font-mono tracking-[0.16em] uppercase text-[11px]">
                  {personalData.university} · {personalData.studyProgram}
                </p>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                  <a
                    href={`mailto:${contactData.email}`}
                    className="py-1 lg:py-0 wrap-break-word hover:text-champagne transition-colors"
                  >
                    {contactData.email}
                  </a>
                  <a
                    href={contactData.githubHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Profil GitHub ${contactData.githubHandle}`}
                    className="py-1 lg:py-0 hover:text-champagne transition-colors"
                  >
                    GitHub ({contactData.githubHandle})
                  </a>
                  <a
                    href={contactData.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-1 lg:py-0 hover:text-champagne transition-colors"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={contactData.instagramHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-1 lg:py-0 hover:text-champagne transition-colors"
                  >
                    {contactData.instagramHandle}
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
