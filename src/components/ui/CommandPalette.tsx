import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowUpRight,
  CornerDownLeft,
  ExternalLink,
  Search,
  X,
} from 'lucide-react';
import { navigationRoutes, personalData } from '@/data/personal';
import { projectsData } from '@/data/projects';
import { contactData } from '@/data/contact';
import { useToast } from '@/hooks/useToast';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { EASE_LUXURY } from '@/utils/motion';

type CommandGroup = 'SITE INDEX · 01–09' | 'SELECTED WORKS · CASE STUDIES' | 'QUICK ACTIONS';

interface CommandItem {
  id: string;
  group: CommandGroup;
  index?: string;
  title: string;
  subtitle: string;
  badge?: string;
  keywords: string;
  external?: boolean;
  isCurrent?: boolean;
  onSelect: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disabled?: boolean;
}

const GROUP_ORDER: readonly CommandGroup[] = [
  'SITE INDEX · 01–09',
  'SELECTED WORKS · CASE STUDIES',
  'QUICK ACTIONS',
];

const ROUTE_ENGLISH_ALIASES: Record<string, string> = {
  '/': 'home beranda utama',
  '/about': 'about profil biodata',
  '/journey': 'journey experience linimasa riwayat',
  '/skills': 'skills keahlian stack',
  '/projects': 'projects karya arsip',
  '/lab': 'lab creative-lab workbench motion eksperimen',
  '/gallery': 'gallery potret monograf',
  '/achievements': 'honors achievements sertifikasi ccna jpmba',
  '/contact': 'contact hubungi email whatsapp',
};

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  open,
  onOpenChange,
  disabled = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const { pauseScroll, resumeScroll } = useSmoothScroll();
  const prefersReducedMotion = useReducedMotion();

  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const skipRestoreFocusRef = useRef(false);
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const closePalette = useCallback(
    (skipRestoreFocus = false) => {
      skipRestoreFocusRef.current = skipRestoreFocus;
      setQuery('');
      setActiveIndex(0);
      onOpenChange(false);
    },
    [onOpenChange],
  );

  const openPalette = useCallback(() => {
    skipRestoreFocusRef.current = false;
    setQuery('');
    setActiveIndex(0);
    onOpenChange(true);
  }, [onOpenChange]);

  const copyToClipboard = useCallback(
    async (value: string, toastTitle: string, fallbackHref?: string) => {
      try {
        await navigator.clipboard.writeText(value);
        showToast(toastTitle, value);
      } catch {
        if (fallbackHref) {
          window.location.href = fallbackHref;
        } else {
          showToast('Salin Manual', value);
        }
      }
    },
    [showToast],
  );

  const allItems = useMemo<CommandItem[]>(() => {
    const pageItems: CommandItem[] = navigationRoutes.map((route) => {
      const isCurrent =
        location.pathname === route.path ||
        (route.path === '/projects' && location.pathname.startsWith('/projects/'));
      const extraKeywords = ROUTE_ENGLISH_ALIASES[route.path] ?? '';

      return {
        id: `page-${route.path}`,
        group: 'SITE INDEX · 01–09',
        index: route.index,
        title: route.label,
        subtitle: route.subtitle,
        badge: isCurrent ? 'AKTIF' : `BAB ${route.index}`,
        keywords: `${route.shortLabel} ${route.path} ${extraKeywords}`,
        isCurrent,
        onSelect: () => {
          closePalette(true);
          navigate(route.path);
        },
      };
    });

    const projectItems: CommandItem[] = projectsData.map((project) => ({
      id: `project-${project.slug}`,
      group: 'SELECTED WORKS · CASE STUDIES',
      index: project.index,
      title: project.title,
      subtitle: project.subtitle,
      badge: project.category,
      keywords: `${project.slug} ${project.platform} ${project.category} ${project.verificationState} ${project.stack.join(' ')}`,
      isCurrent: location.pathname === `/projects/${project.slug}`,
      onSelect: () => {
        closePalette(true);
        navigate(`/projects/${project.slug}`);
      },
    }));

    const quickActionItems: CommandItem[] = [
      {
        id: 'action-copy-email',
        group: 'QUICK ACTIONS',
        title: 'Salin Email Resmi',
        subtitle: contactData.email,
        badge: 'COPY',
        keywords: `email mail kontak hubungi salin copy ${contactData.email}`,
        onSelect: () => {
          closePalette(false);
          void copyToClipboard(
            contactData.email,
            'Email Tersalin',
            `mailto:${contactData.email}`,
          );
        },
      },
      {
        id: 'action-copy-url',
        group: 'QUICK ACTIONS',
        title: 'Salin URL Portofolio',
        subtitle: personalData.siteUrl,
        badge: 'COPY',
        keywords: `url link share bagikan salin copy domain ${personalData.siteDomain}`,
        onSelect: () => {
          closePalette(false);
          void copyToClipboard(personalData.siteUrl, 'URL Portofolio Tersalin');
        },
      },
      {
        id: 'action-open-github',
        group: 'QUICK ACTIONS',
        title: `Buka GitHub · ${contactData.githubHandle}`,
        subtitle: contactData.githubHref,
        badge: 'OPEN',
        keywords: `github kode repositori source code ${contactData.githubHandle}`,
        external: true,
        onSelect: () => {
          closePalette(false);
          window.open(contactData.githubHref, '_blank', 'noopener,noreferrer');
        },
      },
    ];

    return [...pageItems, ...projectItems, ...quickActionItems];
  }, [closePalette, copyToClipboard, location.pathname, navigate]);

  const filteredItems = useMemo(() => {
    const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return allItems;

    return allItems.filter((item) => {
      const haystack =
        `${item.title} ${item.subtitle} ${item.badge ?? ''} ${item.group} ${item.keywords}`.toLowerCase();
      return tokens.every((token) => haystack.includes(token));
    });
  }, [allItems, query]);

  const safeActiveIndex =
    filteredItems.length > 0 ? Math.min(activeIndex, filteredItems.length - 1) : 0;

  const groupedSections = useMemo(() => {
    let runningIndex = 0;
    return GROUP_ORDER.map((group) => {
      const entries = filteredItems
        .filter((item) => item.group === group)
        .map((item) => {
          const flatIndex = runningIndex;
          runningIndex += 1;
          return { item, flatIndex };
        });
      return { group, entries };
    }).filter((section) => section.entries.length > 0);
  }, [filteredItems]);

  // Global Ctrl+K / Cmd+K shortcut + keyboard navigation when palette is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled) return;

      const isCommandK =
        (e.metaKey || e.ctrlKey) &&
        !e.altKey &&
        !e.shiftKey &&
        e.key.toLowerCase() === 'k';

      if (isCommandK) {
        e.preventDefault();
        if (open) {
          closePalette(false);
        } else {
          openPalette();
        }
        return;
      }

      if (!open) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        closePalette(false);
        return;
      }

      if (filteredItems.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % filteredItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(
          (prev) => (prev - 1 + filteredItems.length) % filteredItems.length,
        );
      } else if (e.key === 'Enter' && !e.isComposing) {
        const selected = filteredItems[safeActiveIndex];
        if (selected) {
          e.preventDefault();
          selected.onSelect();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    closePalette,
    disabled,
    filteredItems,
    open,
    openPalette,
    safeActiveIndex,
  ]);

  // Body scroll lock & input focus management
  useEffect(() => {
    if (!open) return;

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    pauseScroll();

    const rafId = window.requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    return () => {
      window.cancelAnimationFrame(rafId);
      document.body.style.overflow = prevOverflow;
      resumeScroll();
      if (
        !skipRestoreFocusRef.current &&
        previousFocusRef.current &&
        previousFocusRef.current.isConnected
      ) {
        previousFocusRef.current.focus();
      }
    };
  }, [open, pauseScroll, resumeScroll]);

  // Keep active keyboard-selected item scrolled into view
  useEffect(() => {
    if (!open || filteredItems.length === 0) return;
    const activeItem = filteredItems[safeActiveIndex];
    if (!activeItem) return;
    itemRefs.current[activeItem.id]?.scrollIntoView({ block: 'nearest' });
  }, [filteredItems, open, safeActiveIndex]);

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="aflan-command-palette-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.12 : 0.24, ease: EASE_LUXURY }}
          onClick={() => closePalette(false)}
          className="fixed inset-0 z-[85] flex items-start justify-center pt-[9vh] sm:pt-[13vh] px-3 sm:px-6 pb-6 bg-obsidian/75 backdrop-blur-md"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Indeks Cepat dan Pencarian Editorial AFLAN"
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -12, scale: 0.98 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -8, scale: 0.985 }
            }
            transition={{
              duration: prefersReducedMotion ? 0.12 : 0.28,
              ease: EASE_LUXURY,
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl rounded-2xl border border-champagne/20 bg-[#1A1412] text-ivory shadow-[0_32px_90px_rgba(0,0,0,0.78)] overflow-hidden flex flex-col max-h-[78dvh]"
          >
            {/* Search Input Header */}
            <div className="flex items-center gap-3 px-4 sm:px-5 py-3.5 border-b border-champagne/15 focus-within:border-champagne/40 transition-colors shrink-0">
              <Search
                className="size-4 shrink-0 text-champagne/75"
                aria-hidden="true"
              />
              <input
                ref={inputRef}
                type="text"
                role="combobox"
                aria-expanded={true}
                aria-controls="aflan-command-listbox"
                aria-activedescendant={
                  filteredItems[safeActiveIndex]?.id
                    ? `cmd-opt-${filteredItems[safeActiveIndex].id}`
                    : undefined
                }
                aria-label="Cari halaman, case study, atau quick action"
                placeholder="Cari halaman, case study, atau quick action..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                className="flex-1 min-w-0 bg-transparent text-ivory placeholder:text-taupe/70 font-sans text-base sm:text-sm outline-none focus:outline-none focus-visible:outline-none"
              />
              {query.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setActiveIndex(0);
                    inputRef.current?.focus();
                  }}
                  aria-label="Hapus kata kunci pencarian"
                  className="shrink-0 px-2 py-1 rounded-md text-[10px] font-mono uppercase tracking-[0.15em] text-taupe hover:text-champagne transition-colors cursor-pointer"
                >
                  Hapus
                </button>
              )}
              <button
                type="button"
                onClick={() => closePalette(false)}
                aria-label="Tutup indeks cepat"
                className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-champagne/20 bg-espresso/60 text-champagne/80 hover:text-ivory hover:border-champagne/45 font-mono text-[10px] tracking-[0.15em] uppercase transition-colors cursor-pointer"
              >
                <span className="hidden sm:inline">ESC</span>
                <X className="size-3.5" aria-hidden="true" />
              </button>
            </div>

            {/* Results Listbox */}
            <div
              id="aflan-command-listbox"
              role="listbox"
              aria-label="Hasil indeks cepat"
              data-lenis-prevent
              className="flex-1 overflow-y-auto overscroll-contain py-2"
            >
              {groupedSections.length > 0 ? (
                groupedSections.map((section) => (
                  <div key={section.group} className="pb-1">
                    <p className="px-4 sm:px-5 pt-2.5 pb-1.5 text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] text-[#8A6D4B]">
                      {section.group}
                    </p>
                    <div className="space-y-0.5">
                      {section.entries.map(({ item, flatIndex }) => {
                        const isSelected = flatIndex === safeActiveIndex;
                        return (
                          <button
                            key={item.id}
                            id={`cmd-opt-${item.id}`}
                            ref={(el) => {
                              itemRefs.current[item.id] = el;
                            }}
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            onMouseEnter={() => setActiveIndex(flatIndex)}
                            onClick={() => item.onSelect()}
                            className={`w-full text-left px-4 sm:px-5 py-2.5 flex items-center justify-between gap-3 border-l-2 transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-champagne/12 border-champagne text-ivory'
                                : 'border-transparent text-ivory/80 hover:bg-champagne/6'
                            }`}
                          >
                            <div className="flex items-baseline gap-3 min-w-0 flex-1">
                              {item.index && (
                                <span
                                  className={`shrink-0 font-mono text-[10px] tracking-[0.18em] uppercase ${
                                    isSelected ? 'text-champagne' : 'text-taupe'
                                  }`}
                                >
                                  {item.index}
                                </span>
                              )}
                              <div className="min-w-0 flex-1">
                                <span
                                  className={`block font-serif text-lg sm:text-xl font-light leading-snug truncate ${
                                    isSelected ? 'text-ivory' : 'text-ivory/90'
                                  }`}
                                >
                                  {item.title}
                                </span>
                                <span className="block font-sans text-xs text-taupe truncate mt-0.5">
                                  {item.subtitle}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {item.badge && (
                                <span
                                  className={`hidden sm:inline-block px-2 py-0.5 rounded-full border text-[10px] font-mono uppercase tracking-[0.14em] ${
                                    item.isCurrent
                                      ? 'border-champagne/60 bg-champagne/15 text-champagne'
                                      : 'border-champagne/20 text-taupe'
                                  }`}
                                >
                                  {item.badge}
                                </span>
                              )}
                              {item.external ? (
                                <ExternalLink
                                  className={`size-3.5 ${
                                    isSelected ? 'text-champagne' : 'text-taupe/70'
                                  }`}
                                  aria-hidden="true"
                                />
                              ) : isSelected ? (
                                <CornerDownLeft
                                  className="size-3.5 text-champagne"
                                  aria-hidden="true"
                                />
                              ) : (
                                <ArrowUpRight
                                  className="size-3.5 text-taupe/60"
                                  aria-hidden="true"
                                />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-5 py-10 text-center space-y-3">
                  <p className="font-serif text-xl font-light text-ivory/90">
                    Tidak ditemukan entri untuk &ldquo;{query.trim()}&rdquo;
                  </p>
                  <p className="font-sans text-xs text-taupe">
                    Coba cari Beranda, SOMASII, ASIS Builder, Lab, atau Email.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('');
                      setActiveIndex(0);
                      inputRef.current?.focus();
                    }}
                    className="inline-flex items-center px-4 py-2 rounded-full border border-champagne/30 text-[10px] font-mono uppercase tracking-[0.15em] text-champagne hover:bg-champagne hover:text-obsidian transition-colors cursor-pointer"
                  >
                    Reset Pencarian
                  </button>
                </div>
              )}
            </div>

            {/* Footer Keybind Legend */}
            <div className="border-t border-champagne/15 px-4 sm:px-5 py-2.5 bg-obsidian/50 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono uppercase tracking-[0.15em] text-taupe shrink-0">
              <span>↑↓ Navigasi · ↵ Buka · ESC Tutup</span>
              <span className="text-champagne/75">AFLAN DOSSIER · ⌘K</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};
