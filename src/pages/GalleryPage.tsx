import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Info,
  Maximize2,
  Sparkles,
  X,
} from 'lucide-react';
import {
  galleryCategories,
  galleryItems,
  type GalleryCategory,
  type GalleryItem,
} from '@/data/gallery';
import { MonogramMark } from '@/components/brand/Monogram';
import { Reveal, StaggerGroup, StaggerItem } from '@/components/motion/Reveal';
import { TextReveal } from '@/components/motion/TextReveal';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { EASE_LUXURY } from '@/utils/motion';

type TonalTreatment = 'original' | 'sepia' | 'monochrome';

const TONAL_FILTERS: Record<
  TonalTreatment,
  { label: string; cssFilter: string; note: string }
> = {
  original: {
    label: 'Asli',
    cssFilter: '',
    note: 'Nada warna autentik masing-masing pelat personal.',
  },
  sepia: {
    label: 'Sepia',
    cssFilter: 'sepia(34%) contrast(1.06) brightness(0.98)',
    note: 'Nuansa cetak hangat selaras dengan palet Espresso & Champagne.',
  },
  monochrome: {
    label: 'Monokrom',
    cssFilter: 'grayscale(90%) sepia(14%) contrast(1.14)',
    note: 'Kontras hitam-putih hangat yang menonjolkan arah cahaya.',
  },
};

const PALETTE_BARS = [
  { name: 'Obsidian', hex: '#1A1412' },
  { name: 'Espresso', hex: '#2B1D17' },
  { name: 'Mocha', hex: '#765641' },
  { name: 'Champagne', hex: '#D8C3A5' },
  { name: 'Ivory', hex: '#F5F0E8' },
] as const;

const FILM_GRAIN_DATA_URI =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E\")";

interface PlateVisualProps {
  item: GalleryItem;
  tonalMode: TonalTreatment;
  filmGrain: boolean;
  inLightbox?: boolean;
}

/**
 * Renders either a CSS-treated variation of AFLAN's personal studio portrait
 * or a minimalist typographic abstract plate.
 * In Lightbox mode, strictly uses object-contain so portraits are never cropped on mobile.
 */
const PlateVisual: React.FC<PlateVisualProps> = ({
  item,
  tonalMode,
  filmGrain,
  inLightbox = false,
}) => {
  const combinedFilter =
    [item.customFilter ?? '', TONAL_FILTERS[tonalMode].cssFilter]
      .filter(Boolean)
      .join(' ') || 'none';

  if (inLightbox && item.kind === 'photo' && item.src) {
    return (
      <div className="relative inline-flex items-center justify-center max-w-full max-h-[82vh] overflow-hidden">
        <img
          src={item.src}
          alt={item.title}
          loading="eager"
          style={{ filter: combinedFilter }}
          className="block max-w-full max-h-[82vh] w-auto h-auto object-contain mx-auto"
        />
        {filmGrain && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay"
            style={{
              backgroundImage: FILM_GRAIN_DATA_URI,
              backgroundSize: '160px 160px',
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden bg-obsidian ${
        inLightbox
          ? `w-[min(84vw,540px)] max-h-[76vh] ${item.aspectClass} mx-auto`
          : 'w-full h-full'
      }`}
    >
      {item.kind === 'photo' && item.src && (
        <img
          src={item.src}
          alt={item.title}
          loading="lazy"
          style={{
            objectPosition: item.objectPosition ?? 'center',
            filter: combinedFilter,
          }}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05] ${
            item.imageScaleClass ?? ''
          }`}
        />
      )}

      {item.kind === 'abstract-monogram' && (
        <div
          className="w-full h-full bg-[#1A1412] text-ivory p-6 sm:p-8 flex flex-col justify-between relative"
          style={{ filter: TONAL_FILTERS[tonalMode].cssFilter || 'none' }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-12"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(216,195,165,0.28) 1px, transparent 1px), linear-gradient(to bottom, rgba(216,195,165,0.28) 1px, transparent 1px)',
              backgroundSize: '36px 36px',
            }}
          />
          <div className="relative z-10 flex items-center justify-between font-mono text-[9px] tracking-[0.22em] uppercase text-champagne/80">
            <span>AMDZ · GEOMETRI</span>
            <span>01 : 01</span>
          </div>
          <div className="relative z-10 my-auto py-6 flex flex-col items-center justify-center">
            <div className="size-32 sm:size-36 rounded-full border border-dashed border-champagne/40 bg-obsidian/70 flex items-center justify-center transition-transform duration-700 group-hover:scale-105">
              <MonogramMark size={78} className="text-champagne" />
            </div>
            <span className="mt-4 font-serif text-xl tracking-[0.28em] uppercase text-ivory/90">
              AFLAN
            </span>
          </div>
          <div className="relative z-10 flex items-center justify-between font-mono text-[9px] tracking-[0.2em] uppercase text-taupe border-t border-champagne/15 pt-2.5">
            <span>IDENTITAS PERSONAL</span>
            <span>PURWOKERTO</span>
          </div>
        </div>
      )}

      {item.kind === 'abstract-palette' && (
        <div
          className="w-full h-full bg-obsidian text-ivory p-5 sm:p-6 flex flex-col justify-between"
          style={{ filter: TONAL_FILTERS[tonalMode].cssFilter || 'none' }}
        >
          <div className="flex items-center justify-between font-mono text-[9px] tracking-[0.22em] uppercase text-champagne">
            <span>PALET IDENTITAS</span>
            <span>05 NADA</span>
          </div>

          <div className="my-auto py-3.5 space-y-3">
            <div className="flex flex-col gap-1.5">
              {PALETTE_BARS.map((bar) => {
                const isLightSwatch = bar.hex === '#F5F0E8' || bar.hex === '#D8C3A5';
                return (
                  <div
                    key={bar.hex}
                    className="border border-champagne/20 flex items-center justify-between gap-3 px-3 py-2 transition-transform duration-500 group-hover:translate-x-0.5"
                    style={{ backgroundColor: bar.hex }}
                  >
                    <span
                      className={`font-mono text-[10px] tracking-[0.14em] uppercase whitespace-nowrap font-medium ${
                        isLightSwatch ? 'text-obsidian' : 'text-ivory'
                      }`}
                    >
                      {bar.name}
                    </span>
                    <span
                      className={`font-mono text-[9px] tracking-[0.14em] uppercase whitespace-nowrap ${
                        isLightSwatch ? 'text-espresso/80' : 'text-champagne/85'
                      }`}
                    >
                      {bar.hex}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-baseline justify-between gap-2 pt-1">
              <span className="font-serif italic text-3xl sm:text-4xl font-light text-champagne leading-none">
                Aa
              </span>
              <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-taupe text-right whitespace-nowrap">
                CORMORANT GARAMOND
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between font-mono text-[9px] tracking-[0.18em] uppercase text-taupe border-t border-champagne/15 pt-2.5">
            <span>#1A1412 → #F5F0E8</span>
            <span>CHIAROSCURO</span>
          </div>
        </div>
      )}

      {item.kind === 'abstract-typography' && (
        <div
          className="w-full h-full bg-chocolate text-ivory p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden"
          style={{ filter: TONAL_FILTERS[tonalMode].cssFilter || 'none' }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 studio-warm-halo opacity-70"
          />
          <div className="relative z-10 flex items-center justify-between font-mono text-[9px] tracking-[0.22em] uppercase text-champagne">
            <span>STUDI DISPLAY</span>
            <span>SERIF EDITORIAL</span>
          </div>
          <div className="relative z-10 my-auto py-4 space-y-1 text-center">
            <p className="font-serif text-4xl sm:text-5xl font-light tracking-[0.12em] uppercase text-ivory leading-[0.9] transition-transform duration-700 group-hover:scale-[1.03]">
              AFLAN
            </p>
            <p className="font-serif italic text-2xl sm:text-3xl font-light tracking-[0.06em] uppercase editorial-outline-strong leading-none">
              MU&apos;AFA DZULFIQAR
            </p>
          </div>
          <div className="relative z-10 flex items-center justify-between font-mono text-[9px] tracking-[0.2em] uppercase text-taupe border-t border-champagne/15 pt-2.5">
            <span>SOLID · OUTLINE</span>
            <span>AMDZ</span>
          </div>
        </div>
      )}

      {filmGrain && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-22 mix-blend-overlay transition-opacity duration-300"
          style={{
            backgroundImage: FILM_GRAIN_DATA_URI,
            backgroundSize: '160px 160px',
          }}
        />
      )}
    </div>
  );
};

export const GalleryPage: React.FC = () => {
  const [tonalMode, setTonalMode] = useState<TonalTreatment>('original');
  const [selectedCategory, setSelectedCategory] = useState<'Semua' | GalleryCategory>(
    'Semua',
  );
  const [layoutMode, setLayoutMode] = useState<'masonry' | 'monograph'>('masonry');
  const [filmGrainEnabled, setFilmGrainEnabled] = useState<boolean>(true);
  const [revealedCardId, setRevealedCardId] = useState<string | null>(null);
  const [lightboxId, setLightboxId] = useState<string | null>(null);
  const [showCaptions, setShowCaptions] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'Semua') return galleryItems;
    return galleryItems.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  const categoryOptions = useMemo(
    () =>
      galleryCategories.map((cat) => ({
        value: cat,
        label: cat,
        badge:
          cat === 'Semua'
            ? galleryItems.length
            : galleryItems.filter((item) => item.category === cat).length,
      })),
    [],
  );

  const layoutOptions = useMemo(
    () =>
      [
        { value: 'masonry', label: 'Masonry' },
        { value: 'monograph', label: 'Monograf' },
      ] as const,
    [],
  );

  const tonalOptions = useMemo(
    () =>
      (Object.keys(TONAL_FILTERS) as TonalTreatment[]).map((key) => ({
        value: key,
        label: TONAL_FILTERS[key].label,
      })),
    [],
  );

  const lightboxIndex = useMemo(() => {
    if (!lightboxId) return null;
    const idx = filteredItems.findIndex((item) => item.id === lightboxId);
    return idx >= 0 ? idx : null;
  }, [lightboxId, filteredItems]);

  const activeItem =
    lightboxIndex !== null ? filteredItems[lightboxIndex] ?? null : null;
  const hasMultiplePlates = filteredItems.length > 1;

  useEffect(() => {
    if (lightboxIndex === null) return;
    const prevOverflow = document.body.style.overflow;
    const prevHeaderTheme = document.documentElement.dataset.headerTheme;

    document.body.style.overflow = 'hidden';
    document.documentElement.dataset.headerTheme = 'dark';
    window.dispatchEvent(new Event('aflan-nav-theme-sync'));

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxId(null);
      } else if (hasMultiplePlates && e.key === 'ArrowRight') {
        const nextIdx = (lightboxIndex + 1) % filteredItems.length;
        setLightboxId(filteredItems[nextIdx]?.id ?? null);
      } else if (hasMultiplePlates && e.key === 'ArrowLeft') {
        const prevIdx =
          (lightboxIndex - 1 + filteredItems.length) % filteredItems.length;
        setLightboxId(filteredItems[prevIdx]?.id ?? null);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      if (prevHeaderTheme === undefined) {
        delete document.documentElement.dataset.headerTheme;
      } else {
        document.documentElement.dataset.headerTheme = prevHeaderTheme;
      }
      window.dispatchEvent(new Event('aflan-nav-theme-sync'));
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [lightboxIndex, hasMultiplePlates, filteredItems]);

  const stepLightbox = (delta: number) => {
    if (lightboxIndex === null || filteredItems.length === 0) return;
    const nextIdx =
      (lightboxIndex + delta + filteredItems.length) % filteredItems.length;
    setLightboxId(filteredItems[nextIdx]?.id ?? null);
  };

  return (
    <div className="relative w-full overflow-x-clip">
      {filmGrainEnabled && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-40 opacity-[0.045] mix-blend-overlay"
          style={{
            backgroundImage: FILM_GRAIN_DATA_URI,
            backgroundSize: '180px 180px',
          }}
        />
      )}

      <section className="bg-offwhite text-espresso pt-24 sm:pt-28 lg:pt-32 pb-16 md:pb-20 px-4 sm:px-6 lg:px-12 border-b border-espresso/10">
        <div className="max-w-[1440px] mx-auto">
          <Reveal
            variant="up"
            className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-espresso/10"
          >
            <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] font-medium text-bronze">
              BAB 07 / GALERI PERSONAL · {String(filteredItems.length).padStart(2, '0')} PELAT
            </span>
            <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] font-medium text-bronze">
              POTRET PERSONAL &amp; STUDI TIPOGRAFI AFLAN
            </span>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-10 lg:pt-12 items-end">
            <div className="lg:col-span-7">
              <TextReveal
                as="h1"
                immediate
                className="font-serif text-3xl sm:text-4xl md:text-5xl leading-[1.08] font-light tracking-tight text-espresso/90"
                lines={[
                  <>Edisi Monograf</>,
                  <>
                    <span className="italic text-mocha">Potret &amp; Abstrak Personal</span>
                  </>,
                ]}
              />
            </div>

            <Reveal variant="up" delay={0.14} className="lg:col-span-5">
              <p className="font-sans text-sm md:text-base text-espresso/80 leading-relaxed">
                Kurasi visual personal AFLAN yang memadukan variasi tonal potret studio bersama
                pelat abstrak tipografi dan sistem warna, disusun lapang dalam grid Masonry.
              </p>
            </Reveal>
          </div>

          <div className="mt-8 lg:mt-12 pt-6 border-t border-espresso/10 space-y-5 min-w-0">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 min-w-0">
              <SegmentedControl
                options={categoryOptions}
                value={selectedCategory}
                onChange={setSelectedCategory}
                layoutId="gallery-category-pill"
                ariaLabel="Filter kategori galeri"
                surface="light"
                className="lg:w-auto"
              />

              <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 min-w-0">
                <button
                  type="button"
                  onClick={() => setFilmGrainEnabled((prev) => !prev)}
                  aria-pressed={filmGrainEnabled}
                  data-cursor="GRAIN"
                  className={`self-start sm:self-auto shrink-0 inline-flex items-center gap-2 px-4 py-2.5 lg:py-2 rounded-full font-mono text-[11px] tracking-[0.16em] uppercase border active:scale-[0.97] transition-all cursor-pointer ${
                    filmGrainEnabled
                      ? 'bg-mocha text-ivory border-mocha shadow-sm'
                      : 'bg-ivory text-espresso/80 border-espresso/25 hover:border-espresso'
                  }`}
                >
                  <Sparkles className="size-3.5" aria-hidden="true" />
                  <span>Grain 35mm: {filmGrainEnabled ? 'Aktif' : 'Mati'}</span>
                </button>

                <SegmentedControl
                  options={layoutOptions}
                  value={layoutMode}
                  onChange={setLayoutMode}
                  layoutId="gallery-layout-pill"
                  ariaLabel="Pilihan tata letak galeri"
                  surface="light"
                  roleMode="group"
                  size="sm"
                  className="sm:w-auto"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-espresso/10 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 min-w-0">
                <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-mocha shrink-0">
                  TONAL:
                </span>
                <SegmentedControl
                  options={tonalOptions}
                  value={tonalMode}
                  onChange={setTonalMode}
                  layoutId="gallery-tonal-pill"
                  ariaLabel="Pilihan tonal visual"
                  surface="light"
                  roleMode="group"
                  size="sm"
                  className="sm:w-auto"
                />
              </div>

              <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-bronze">
                {TONAL_FILTERS[tonalMode].note}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        data-nav-surface="dark"
        className="bg-obsidian text-ivory py-16 md:py-24 px-4 sm:px-6 lg:px-12"
      >
        <div className="max-w-[1440px] mx-auto">
          {layoutMode === 'masonry' ? (
            <StaggerGroup
              key={selectedCategory}
              className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8"
            >
              {filteredItems.map((item) => {
                const isDetailOpen = revealedCardId === item.id;
                return (
                  <StaggerItem key={item.id} className="break-inside-avoid">
                    <article className="group bg-espresso/40 border border-champagne/15 hover:border-champagne/50 active:border-champagne transition-all duration-500 flex flex-col justify-between overflow-hidden shadow-[0_24px_70px_rgba(0,0,0,0.55)]">
                      <div className={`relative ${item.aspectClass} w-full overflow-hidden bg-obsidian`}>
                        <button
                          type="button"
                          onClick={() => setLightboxId(item.id)}
                          data-cursor="LIHAT"
                          aria-label={`Buka ${item.title} pada lightbox layar penuh`}
                          className="block w-full h-full text-left focus-visible:outline-2 focus-visible:outline-champagne"
                        >
                          <PlateVisual
                            item={item}
                            tonalMode={tonalMode}
                            filmGrain={filmGrainEnabled}
                          />
                        </button>

                        <div className="absolute top-3.5 left-3.5 right-3.5 z-30 flex items-center justify-between gap-2 pointer-events-none">
                          <span className="px-3 py-1 bg-obsidian/85 backdrop-blur-xs border border-champagne/25 font-mono text-[10px] tracking-[0.18em] uppercase text-champagne">
                            {item.badge}
                          </span>
                          <div className="flex items-center gap-1.5 pointer-events-auto">
                            <button
                              type="button"
                              onClick={() =>
                                setRevealedCardId((prev) =>
                                  prev === item.id ? null : item.id,
                                )
                              }
                              aria-pressed={isDetailOpen}
                              aria-label={`Tampilkan detail teknis ${item.title}`}
                              className={`size-8 rounded-full border flex items-center justify-center active:scale-95 transition-colors ${
                                isDetailOpen
                                  ? 'bg-champagne text-obsidian border-champagne'
                                  : 'bg-obsidian/80 text-champagne border-champagne/30 hover:bg-champagne hover:text-obsidian'
                              }`}
                            >
                              <Info className="size-3.5" aria-hidden="true" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setLightboxId(item.id)}
                              aria-label={`Perbesar ${item.title}`}
                              className="size-8 rounded-full bg-obsidian/80 border border-champagne/30 flex items-center justify-center text-champagne hover:bg-champagne hover:text-obsidian active:scale-95 transition-colors"
                            >
                              <Maximize2 className="size-3.5" aria-hidden="true" />
                            </button>
                          </div>
                        </div>

                        <div
                          className={`pointer-events-none absolute inset-0 z-20 bg-obsidian/84 backdrop-blur-[4px] p-5 sm:p-6 flex flex-col justify-end transition-all duration-300 ${
                            isDetailOpen
                              ? 'opacity-100 translate-y-0'
                              : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
                          }`}
                        >
                          <div className="space-y-3 border-t border-champagne/25 pt-3.5">
                            <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.22em] uppercase text-champagne">
                              <span>CATATAN VISUAL</span>
                              <span>{item.plateNumber}</span>
                            </div>

                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2 text-xs">
                              <div>
                                <dt className="font-mono text-[9px] tracking-[0.18em] uppercase text-taupe">
                                  Medium
                                </dt>
                                <dd className="text-ivory font-medium mt-0.5">
                                  {item.meta.medium}
                                </dd>
                              </div>
                              <div>
                                <dt className="font-mono text-[9px] tracking-[0.18em] uppercase text-taupe">
                                  Karakter
                                </dt>
                                <dd className="text-champagne mt-0.5">
                                  {item.meta.treatment}
                                </dd>
                              </div>
                              <div>
                                <dt className="font-mono text-[9px] tracking-[0.18em] uppercase text-taupe">
                                  Komposisi
                                </dt>
                                <dd className="text-ivory/90 mt-0.5">
                                  {item.meta.composition}
                                </dd>
                              </div>
                              <div>
                                <dt className="font-mono text-[9px] tracking-[0.18em] uppercase text-taupe">
                                  Palet
                                </dt>
                                <dd className="text-ivory/90 mt-0.5">
                                  {item.meta.palette}
                                </dd>
                              </div>
                            </dl>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] tracking-[0.2em] uppercase">
                          <span className="text-champagne">
                            {item.plateNumber} · {item.category}
                          </span>
                          <span className="text-taupe">{item.technicalNote}</span>
                        </div>

                        <div>
                          <h2 className="font-serif text-2xl sm:text-[1.75rem] leading-snug font-light text-ivory group-hover:text-champagne transition-colors">
                            {item.title}
                          </h2>
                          <p className="font-serif italic text-base text-champagne/85 mt-0.5">
                            {item.subtitle}
                          </p>
                        </div>

                        <p className="font-sans text-sm leading-relaxed text-ivory/75">
                          {item.caption}
                        </p>
                      </div>
                    </article>
                  </StaggerItem>
                );
              })}
            </StaggerGroup>
          ) : (
            <div className="space-y-12 sm:space-y-16">
              {filteredItems.map((item, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <Reveal key={item.id} variant="up">
                    <article className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-14 items-center border-b border-champagne/10 pb-12 sm:pb-16 last:border-b-0 last:pb-0">
                      <div
                        className={
                          isEven
                            ? 'md:col-span-6 md:order-1'
                            : 'md:col-span-6 md:order-2'
                        }
                      >
                        <button
                          type="button"
                          onClick={() => setLightboxId(item.id)}
                          data-cursor="LIGHTBOX"
                          aria-label={`Buka ${item.title} pada lightbox layar penuh`}
                          className="group relative block w-full text-left border border-champagne/20 bg-espresso/60 p-3 sm:p-5 shadow-[0_32px_90px_rgba(0,0,0,0.65)] active:scale-[0.99] transition-transform focus-visible:outline-2 focus-visible:outline-champagne"
                        >
                          <div className={`relative ${item.aspectClass} overflow-hidden`}>
                            <PlateVisual
                              item={item}
                              tonalMode={tonalMode}
                              filmGrain={filmGrainEnabled}
                            />
                            <span className="absolute top-4 right-4 size-10 rounded-full bg-obsidian/80 border border-champagne/35 flex items-center justify-center text-champagne group-hover:bg-champagne group-hover:text-obsidian transition-colors">
                              <Maximize2 className="size-4" aria-hidden="true" />
                            </span>
                          </div>

                          <div className="pt-4 flex items-center justify-between gap-4 font-mono text-[10px] tracking-[0.22em] uppercase text-champagne/80">
                            <span>
                              {item.plateNumber} · {item.badge}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <Maximize2 className="size-3" aria-hidden="true" />
                              PERBESAR
                            </span>
                          </div>
                        </button>
                      </div>

                      <div
                        className={`${
                          isEven
                            ? 'md:col-span-6 md:order-2 lg:pl-6'
                            : 'md:col-span-6 md:order-1 lg:pr-6'
                        } space-y-6`}
                      >
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] tracking-[0.24em] uppercase text-champagne">
                            <span>{item.plateNumber}</span>
                            <span className="text-champagne/35">/</span>
                            <span className="text-taupe">{item.category}</span>
                          </div>

                          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light leading-[1.06] text-ivory">
                            {item.title}
                          </h2>

                          <p className="font-serif italic text-base md:text-lg text-champagne/85">
                            {item.subtitle}
                          </p>
                        </div>

                        <p className="font-sans text-sm md:text-base leading-relaxed text-ivory/80">
                          {item.caption}
                        </p>

                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-5 border-t border-champagne/15 text-sm">
                          <div>
                            <dt className="font-mono text-[10px] tracking-[0.2em] uppercase text-champagne">
                              Medium &amp; Karakter
                            </dt>
                            <dd className="text-ivory/85 mt-1">
                              {item.meta.medium} · {item.meta.treatment}
                            </dd>
                          </div>
                          <div>
                            <dt className="font-mono text-[10px] tracking-[0.2em] uppercase text-champagne">
                              Komposisi &amp; Palet
                            </dt>
                            <dd className="text-ivory/85 mt-1">
                              {item.meta.composition} · {item.meta.palette}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* FULL-SCREEN LIGHTBOX — MOBILE-SAFE OBJECT-CONTAIN & GENEROUS TOUCH PADDING */}
      <AnimatePresence>
        {activeItem && lightboxIndex !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Penampil Lightbox: ${activeItem.title}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.15 : 0.3, ease: EASE_LUXURY }}
            onClick={() => setLightboxId(null)}
            className="fixed inset-0 z-80 bg-obsidian/96 backdrop-blur-lg flex flex-col justify-between p-4 sm:p-6 md:p-8 overflow-y-auto"
          >
            {/* Top Toolbar */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="max-w-[1360px] w-full mx-auto flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-champagne/15 shrink-0"
            >
              <span className="font-mono text-xs tracking-[0.22em] uppercase text-champagne">
                {String(lightboxIndex + 1).padStart(2, '0')} /{' '}
                {String(filteredItems.length).padStart(2, '0')} · {activeItem.plateNumber}
              </span>

              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                <button
                  type="button"
                  onClick={() => setFilmGrainEnabled((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-champagne/30 text-champagne font-mono text-[10px] tracking-[0.16em] uppercase hover:border-champagne active:scale-95 transition-all"
                >
                  <Sparkles className="size-3.5" aria-hidden="true" />
                  Grain: {filmGrainEnabled ? 'ON' : 'OFF'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCaptions((prev) => !prev)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-champagne/30 text-ivory font-mono text-[10px] tracking-[0.16em] uppercase hover:border-champagne active:scale-95 transition-all"
                >
                  {showCaptions ? (
                    <>
                      <EyeOff className="size-3.5" aria-hidden="true" />
                      <span className="hidden sm:inline">Sembunyikan Teks</span>
                      <span className="sm:hidden">Teks</span>
                    </>
                  ) : (
                    <>
                      <Eye className="size-3.5" aria-hidden="true" />
                      <span className="hidden sm:inline">Tampilkan Teks</span>
                      <span className="sm:hidden">Teks</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setLightboxId(null)}
                  aria-label="Tutup lightbox"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-champagne text-obsidian font-mono text-[10px] tracking-[0.2em] uppercase font-medium hover:bg-ivory active:scale-95 transition-all"
                >
                  Tutup
                  <X className="size-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Center Media Viewport — Never Cropped on Mobile or Desktop */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="max-w-[1280px] w-full mx-auto my-auto py-4 sm:py-6 flex items-center justify-center sm:justify-between gap-4"
            >
              {hasMultiplePlates && (
                <button
                  type="button"
                  onClick={() => stepLightbox(-1)}
                  aria-label="Pelat sebelumnya"
                  className="hidden sm:flex shrink-0 size-11 rounded-full border border-champagne/35 bg-espresso/75 items-center justify-center text-champagne hover:bg-champagne hover:text-obsidian active:scale-95 transition-all"
                >
                  <ChevronLeft className="size-5" aria-hidden="true" />
                </button>
              )}

              <motion.div
                key={activeItem.id}
                initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.32, ease: EASE_LUXURY }}
                className="flex-1 w-full flex items-center justify-center p-4 sm:p-6"
              >
                <div className="max-w-full max-h-[84vh] flex items-center justify-center border border-champagne/25 bg-espresso/40 p-2 sm:p-3 shadow-2xl">
                  <PlateVisual
                    item={activeItem}
                    tonalMode={tonalMode}
                    filmGrain={filmGrainEnabled}
                    inLightbox
                  />
                </div>
              </motion.div>

              {hasMultiplePlates && (
                <button
                  type="button"
                  onClick={() => stepLightbox(1)}
                  aria-label="Pelat berikutnya"
                  className="hidden sm:flex shrink-0 size-11 rounded-full border border-champagne/35 bg-espresso/75 items-center justify-center text-champagne hover:bg-champagne hover:text-obsidian active:scale-95 transition-all"
                >
                  <ChevronRight className="size-5" aria-hidden="true" />
                </button>
              )}
            </div>

            {/* Mobile Touch Navigation + Caption Footer */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="max-w-[1000px] w-full mx-auto pt-3.5 border-t border-champagne/15 text-center shrink-0 space-y-3"
            >
              {hasMultiplePlates && (
                <div className="flex sm:hidden items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => stepLightbox(-1)}
                    aria-label="Pelat sebelumnya"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-champagne/35 bg-espresso/75 text-champagne font-mono text-[10px] tracking-[0.18em] uppercase active:scale-95 transition-all"
                  >
                    <ChevronLeft className="size-4" aria-hidden="true" />
                    Sebelumnya
                  </button>
                  <button
                    type="button"
                    onClick={() => stepLightbox(1)}
                    aria-label="Pelat berikutnya"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-champagne/35 bg-espresso/75 text-champagne font-mono text-[10px] tracking-[0.18em] uppercase active:scale-95 transition-all"
                  >
                    Berikutnya
                    <ChevronRight className="size-4" aria-hidden="true" />
                  </button>
                </div>
              )}

              {showCaptions && (
                <div className="space-y-1">
                  <h3 className="font-serif text-xl sm:text-3xl font-light text-ivory">
                    {activeItem.title}
                  </h3>
                  <p className="font-sans text-sm text-ivory/75 max-w-2xl mx-auto">
                    {activeItem.caption}
                  </p>
                  <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-taupe pt-0.5">
                    {activeItem.meta.medium} · {activeItem.meta.treatment}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
