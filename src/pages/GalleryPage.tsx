import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  LayoutGrid,
  Maximize2,
  Rows3,
  Sparkles,
  X,
} from 'lucide-react';
import {
  galleryCategories,
  galleryItems,
  type GalleryCategory,
  type GalleryItem,
} from '@/data/gallery';
import { Reveal } from '@/components/motion/Reveal';
import { TextReveal } from '@/components/motion/TextReveal';
import { ParallaxFrame } from '@/components/motion/ParallaxFrame';
import { EASE_LUXURY } from '@/utils/motion';

type TonalTreatment = 'original' | 'sepia' | 'monochrome';

const TONAL_FILTERS: Record<
  TonalTreatment,
  { label: string; cssFilter: string; note: string }
> = {
  original: {
    label: 'Chiaroscuro Asli',
    cssFilter: '',
    note: 'Nada warna studio hangat autentik sesuai karakter optik masing-masing pelat.',
  },
  sepia: {
    label: 'Sepia Editorial',
    cssFilter: 'sepia(34%) contrast(1.06) brightness(0.98)',
    note: 'Nuansa cetak arsip hangat selaras dengan palet Espresso & Champagne.',
  },
  monochrome: {
    label: 'Monokrom Hangat',
    cssFilter: 'grayscale(86%) sepia(18%) contrast(1.12)',
    note: 'Studi kontras tinggi yang menonjolkan arah cahaya dan geometri ruang.',
  },
};

const PORTRAIT_PALETTE = [
  { name: 'Obsidian', hex: '#171615' },
  { name: 'Espresso', hex: '#2B1D17' },
  { name: 'Mocha', hex: '#765641' },
  { name: 'Champagne', hex: '#D8C3A5' },
  { name: 'Ivory', hex: '#F5F0E8' },
] as const;

const FILM_GRAIN_DATA_URI =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E\")";

interface OpticalPresetOverlayProps {
  item: GalleryItem;
  filmGrain: boolean;
}

/**
 * Renders distinct optical and lighting treatment overlays for each gallery study:
 * Soft Direct Flash, 0.5x Ultra-Wide Perspective, GCam HDR+ Color Grading, and Gradient Studio Backdrop.
 */
const OpticalPresetOverlay: React.FC<OpticalPresetOverlayProps> = ({
  item,
  filmGrain,
}) => {
  return (
    <>
      {item.visualPreset === 'soft-direct-flash' && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 52% 28%, rgba(250,248,244,0.26) 0%, rgba(216,195,165,0.12) 28%, rgba(23,22,21,0.82) 78%)',
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-3 sm:inset-4 border border-ivory/20 flex flex-col justify-between p-3"
          >
            <div className="flex items-center justify-between font-mono text-[9px] tracking-[0.22em] uppercase text-ivory/80">
              <span>FLASH SYNC · 1/160S</span>
              <span>DIFFUSED DIRECT KEY</span>
            </div>
            <div className="flex items-center justify-between font-mono text-[9px] tracking-[0.2em] uppercase text-champagne/85">
              <span>SPECULAR HIGHLIGHT +0.7 EV</span>
              <span>SHADOW FALLOFF</span>
            </div>
          </div>
        </>
      )}

      {item.visualPreset === 'ultra-wide-perspective' && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at center, transparent 42%, rgba(23,22,21,0.75) 100%)',
            }}
          />
          <svg
            aria-hidden="true"
            viewBox="0 0 400 260"
            className="pointer-events-none absolute inset-0 w-full h-full opacity-45"
            preserveAspectRatio="none"
          >
            <line x1="0" y1="0" x2="200" y2="130" stroke="#D8C3A5" strokeWidth="0.6" strokeDasharray="3 3" />
            <line x1="400" y1="0" x2="200" y2="130" stroke="#D8C3A5" strokeWidth="0.6" strokeDasharray="3 3" />
            <line x1="0" y1="260" x2="200" y2="130" stroke="#D8C3A5" strokeWidth="0.6" strokeDasharray="3 3" />
            <line x1="400" y1="260" x2="200" y2="130" stroke="#D8C3A5" strokeWidth="0.6" strokeDasharray="3 3" />
            <rect x="44" y="28" width="312" height="204" fill="none" stroke="#D8C3A5" strokeWidth="0.75" strokeOpacity="0.6" />
            <circle cx="200" cy="130" r="36" fill="none" stroke="#F5F0E8" strokeWidth="0.75" strokeOpacity="0.65" />
          </svg>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-3 left-3 right-3 flex items-center justify-between font-mono text-[9px] tracking-[0.22em] uppercase text-champagne/90 bg-obsidian/70 px-2.5 py-1 border border-champagne/20"
          >
            <span>0.5X ULTRA-WIDE · 13MM EQUIV</span>
            <span>FOV 120° · SPATIAL GRID</span>
          </div>
        </>
      )}

      {item.visualPreset === 'gcam-hdr-grading' && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(135deg, rgba(216,195,165,0.18) 0%, rgba(118,86,65,0.14) 48%, rgba(23,22,21,0.72) 100%)',
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-3 left-3 right-3 bg-obsidian/80 backdrop-blur-xs border border-champagne/25 p-2.5 space-y-1.5"
          >
            <div className="flex items-center justify-between font-mono text-[9px] tracking-[0.2em] uppercase text-champagne">
              <span>GCAM HDR+ · MULTI-FRAME MERGE</span>
              <span>14-BIT TONE MAP</span>
            </div>
            <div className="grid grid-cols-5 gap-1 h-1.5">
              <span className="bg-[#171615] border border-champagne/20" />
              <span className="bg-[#2B1D17]" />
              <span className="bg-[#765641]" />
              <span className="bg-[#D8C3A5]" />
              <span className="bg-[#F5F0E8]" />
            </div>
          </div>
        </>
      )}

      {item.visualPreset === 'gradient-studio-backdrop' && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 50% 34%, rgba(216,195,165,0.28) 0%, rgba(118,86,65,0.34) 36%, rgba(43,29,23,0.76) 68%, rgba(23,22,21,0.95) 100%)',
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 font-mono text-[9px] tracking-[0.22em] uppercase text-champagne/90"
          >
            <span className="bg-obsidian/75 px-2.5 py-1 border border-champagne/25">
              RADIAL BACKDROP · MOCHA → OBSIDIAN
            </span>
            <span className="bg-obsidian/75 px-2.5 py-1 border border-champagne/25">
              LUMINANCE FALLOFF STUDY
            </span>
          </div>
        </>
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
    </>
  );
};

export const GalleryPage: React.FC = () => {
  const [tonalMode, setTonalMode] = useState<TonalTreatment>('original');
  const [selectedCategory, setSelectedCategory] = useState<'Semua' | GalleryCategory>(
    'Semua',
  );
  const [layoutMode, setLayoutMode] = useState<'masonry' | 'monograph'>('masonry');
  const [filmGrainEnabled, setFilmGrainEnabled] = useState<boolean>(true);
  const [lightboxId, setLightboxId] = useState<string | null>(null);
  const [showCaptions, setShowCaptions] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'Semua') return galleryItems;
    return galleryItems.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

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
    document.body.style.overflow = 'hidden';

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
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [lightboxIndex, hasMultiplePlates, filteredItems]);

  const stepLightbox = (delta: number) => {
    if (lightboxIndex === null || filteredItems.length === 0) return;
    const nextIdx =
      (lightboxIndex + delta + filteredItems.length) % filteredItems.length;
    setLightboxId(filteredItems[nextIdx]?.id ?? null);
  };

  const getCombinedFilter = (item: GalleryItem): string => {
    const tonal = TONAL_FILTERS[tonalMode].cssFilter;
    const custom = item.customFilter ?? '';
    return [custom, tonal].filter(Boolean).join(' ') || 'none';
  };

  return (
    <div className="relative w-full overflow-x-clip">
      {/* Page-Wide Interactive Film Grain Overlay when toggled ON */}
      {filmGrainEnabled && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-40 opacity-[0.055] mix-blend-overlay"
          style={{
            backgroundImage: FILM_GRAIN_DATA_URI,
            backgroundSize: '180px 180px',
          }}
        />
      )}

      <section className="bg-offwhite text-espresso pt-28 sm:pt-36 lg:pt-40 pb-16 sm:pb-24 px-6 sm:px-8 lg:px-12 border-b border-espresso/15">
        <div className="max-w-[1440px] mx-auto">
          <Reveal
            variant="up"
            className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-espresso/15"
          >
            <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.28em] uppercase text-mocha">
              BAB 07 — GALERI MONOGRAF · {String(filteredItems.length).padStart(2, '0')} PELAT VISUAL
            </span>
            <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-espresso/65">
              EKSPLORASI OPTIK, PENCAHAYAAN &amp; COLOR GRADING
            </span>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-12 lg:pt-14 items-end">
            <div className="lg:col-span-7">
              <TextReveal
                as="h1"
                immediate
                className="font-serif text-[2.25rem] sm:text-5xl md:text-6xl lg:text-[4.85rem] leading-[1.04] lg:leading-[0.98] font-light"
                lines={[
                  <>Edisi Monograf</>,
                  <>
                    <span className="italic text-mocha">Optik &amp; Studi Cahaya</span>
                  </>,
                ]}
              />
            </div>

            <Reveal variant="up" delay={0.14} className="lg:col-span-5 space-y-4">
              <p className="font-sans text-[15px] sm:text-base text-charcoal/85 leading-relaxed">
                Kurasi studi visual dan fotografi personal yang mengeksplorasi karakter{' '}
                <span className="font-medium text-espresso">Soft Direct Flash</span>,{' '}
                <span className="font-medium text-espresso">0.5x Ultra-wide perspective</span>,{' '}
                <span className="font-medium text-espresso">GCam HDR+ Color Grading</span>, serta{' '}
                <span className="font-medium text-espresso">Gradient Studio Backdrop</span>.
              </p>
            </Reveal>
          </div>

          {/* Interactive Controls Deck: Category Filter + Film Grain Toggle + Layout Mode + Tonal Filter */}
          <div className="mt-10 lg:mt-12 pt-6 border-t border-espresso/15 space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div
                role="tablist"
                aria-label="Filter kategori studi visual"
                className="flex flex-wrap gap-2"
              >
                {galleryCategories.map((cat) => {
                  const active = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2.5 lg:py-2 rounded-full font-mono text-[11px] tracking-[0.16em] uppercase border transition-colors ${
                        active
                          ? 'bg-espresso text-ivory border-espresso font-medium'
                          : 'bg-ivory text-espresso border-espresso/20 hover:border-mocha'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* Interactive Film Grain Filter Toggle */}
                <button
                  type="button"
                  onClick={() => setFilmGrainEnabled((prev) => !prev)}
                  aria-pressed={filmGrainEnabled}
                  data-cursor="GRAIN"
                  className={`inline-flex items-center gap-2 px-4 py-2.5 lg:py-2 rounded-full font-mono text-[11px] tracking-[0.16em] uppercase border transition-all ${
                    filmGrainEnabled
                      ? 'bg-mocha text-ivory border-mocha shadow-sm'
                      : 'bg-ivory text-espresso/80 border-espresso/25 hover:border-espresso'
                  }`}
                >
                  <Sparkles className="size-3.5" aria-hidden="true" />
                  <span>Film Grain: {filmGrainEnabled ? 'ON (35mm)' : 'OFF'}</span>
                </button>

                {/* Layout View Mode Switcher */}
                <div className="inline-flex items-center rounded-full border border-espresso/25 bg-ivory p-1">
                  <button
                    type="button"
                    onClick={() => setLayoutMode('masonry')}
                    aria-pressed={layoutMode === 'masonry'}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-[10px] tracking-[0.16em] uppercase transition-colors ${
                      layoutMode === 'masonry'
                        ? 'bg-espresso text-ivory font-medium'
                        : 'text-espresso/75 hover:text-mocha'
                    }`}
                  >
                    <LayoutGrid className="size-3.5" aria-hidden="true" />
                    Masonry Parallax
                  </button>
                  <button
                    type="button"
                    onClick={() => setLayoutMode('monograph')}
                    aria-pressed={layoutMode === 'monograph'}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-[10px] tracking-[0.16em] uppercase transition-colors ${
                      layoutMode === 'monograph'
                        ? 'bg-espresso text-ivory font-medium'
                        : 'text-espresso/75 hover:text-mocha'
                    }`}
                  >
                    <Rows3 className="size-3.5" aria-hidden="true" />
                    Monograf
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-espresso/10">
              <div
                className="flex flex-wrap items-center gap-2"
                role="group"
                aria-label="Pilihan tonal visual"
              >
                <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-mocha mr-1">
                  STUDI TONAL:
                </span>
                {(Object.keys(TONAL_FILTERS) as TonalTreatment[]).map((key) => {
                  const active = tonalMode === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setTonalMode(key)}
                      className={`px-3.5 py-1.5 rounded-full font-mono text-[10px] tracking-[0.16em] uppercase border transition-colors ${
                        active
                          ? 'bg-espresso text-ivory border-espresso'
                          : 'bg-offwhite text-espresso border-espresso/20 hover:border-mocha'
                      }`}
                    >
                      {TONAL_FILTERS[key].label}
                    </button>
                  );
                })}
              </div>

              <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-espresso/65">
                {TONAL_FILTERS[tonalMode].note}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY EXHIBITION STAGE */}
      <section className="bg-obsidian text-ivory py-16 sm:py-24 lg:py-28 px-6 sm:px-8 lg:px-12">
        <div className="max-w-[1440px] mx-auto">
          {layoutMode === 'masonry' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
              {filteredItems.map((item, idx) => {
                const staggerClass =
                  idx % 2 === 1 && item.gridSpanClass !== 'md:col-span-2 lg:col-span-12'
                    ? 'lg:mt-14'
                    : '';

                return (
                  <Reveal
                    key={item.id}
                    variant="up"
                    delay={idx * 0.06}
                    className={`${item.gridSpanClass} ${staggerClass}`}
                  >
                    <article className="group bg-espresso/55 border border-champagne/20 hover:border-champagne/60 transition-all duration-500 flex flex-col justify-between overflow-hidden shadow-[0_28px_80px_rgba(0,0,0,0.6)]">
                      <button
                        type="button"
                        onClick={() => setLightboxId(item.id)}
                        data-cursor="LIGHTBOX"
                        aria-label={`Buka ${item.title} pada lightbox layar penuh`}
                        className="relative block w-full text-left overflow-hidden bg-obsidian focus-visible:outline-2 focus-visible:outline-champagne"
                      >
                        <ParallaxFrame
                          className={`${item.aspectClass} w-full`}
                          offset={item.parallaxOffset}
                        >
                          <img
                            src={item.src}
                            alt={item.title}
                            style={{
                              objectPosition: item.objectPosition ?? 'center',
                              filter: getCombinedFilter(item),
                            }}
                            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05] ${
                              item.imageScaleClass ?? ''
                            }`}
                          />
                          <OpticalPresetOverlay
                            item={item}
                            filmGrain={filmGrainEnabled}
                          />
                        </ParallaxFrame>

                        <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 pointer-events-none">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-obsidian/85 backdrop-blur-xs border border-champagne/35 font-mono text-[10px] tracking-[0.2em] uppercase text-champagne">
                            <Camera className="size-3" aria-hidden="true" />
                            {item.techniqueBadge}
                          </span>
                          <span className="size-9 rounded-full bg-obsidian/80 border border-champagne/35 flex items-center justify-center text-champagne group-hover:bg-champagne group-hover:text-obsidian transition-colors">
                            <Maximize2 className="size-4" aria-hidden="true" />
                          </span>
                        </div>
                      </button>

                      <div className="p-6 sm:p-8 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] tracking-[0.22em] uppercase">
                          <span className="text-champagne">
                            {item.plateNumber} · {item.category}
                          </span>
                          <span className="text-taupe">{item.exifSpec}</span>
                        </div>

                        <div>
                          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light text-ivory group-hover:text-champagne transition-colors">
                            {item.title}
                          </h2>
                          <p className="font-serif italic text-lg text-champagne/85 mt-1">
                            {item.subtitle}
                          </p>
                        </div>

                        <p className="font-sans text-[15px] sm:text-base lg:text-sm leading-relaxed text-ivory/80">
                          {item.caption}
                        </p>

                        <div className="pt-4 border-t border-champagne/15 flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] tracking-[0.18em] uppercase text-taupe">
                          <span>{item.technicalNote}</span>
                          <button
                            type="button"
                            onClick={() => setLightboxId(item.id)}
                            className="inline-flex items-center gap-1.5 text-champagne hover:text-ivory transition-colors"
                          >
                            Inspeksi Pelat
                            <Maximize2 className="size-3" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          ) : (
            <div className="space-y-20 sm:space-y-28">
              {filteredItems.map((item, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <Reveal key={item.id} variant="up">
                    <article className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-center border-b border-champagne/15 pb-16 sm:pb-24 last:border-b-0 last:pb-0">
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
                          className="group relative block w-full text-left border border-champagne/25 bg-espresso p-3 sm:p-5 shadow-[0_32px_90px_rgba(0,0,0,0.65)] focus-visible:outline-2 focus-visible:outline-champagne"
                        >
                          <div className="relative">
                            <ParallaxFrame
                              className={item.aspectClass}
                              offset={item.parallaxOffset}
                            >
                              <img
                                src={item.src}
                                alt={item.title}
                                style={{
                                  objectPosition: item.objectPosition ?? 'center',
                                  filter: getCombinedFilter(item),
                                }}
                                className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.04] ${
                                  item.imageScaleClass ?? ''
                                }`}
                              />
                              <OpticalPresetOverlay
                                item={item}
                                filmGrain={filmGrainEnabled}
                              />
                            </ParallaxFrame>
                            <span className="absolute top-4 right-4 size-10 rounded-full bg-obsidian/80 border border-champagne/35 flex items-center justify-center text-champagne group-hover:bg-champagne group-hover:text-obsidian transition-colors">
                              <Maximize2 className="size-4" aria-hidden="true" />
                            </span>
                          </div>

                          <div className="pt-4 flex items-center justify-between gap-4 font-mono text-[10px] tracking-[0.22em] uppercase text-champagne/80">
                            <span>
                              {item.plateNumber} · {item.techniqueBadge}
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
                        } space-y-7`}
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

                          <p className="font-serif italic text-xl text-champagne/85">
                            {item.subtitle}
                          </p>
                        </div>

                        <p className="font-sans text-[15px] sm:text-base leading-[1.85] text-ivory/80">
                          {item.caption}
                        </p>

                        <div className="pt-6 border-t border-champagne/15 space-y-3">
                          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-champagne">
                            SPESIFIKASI OPTIK &amp; KONTEKS
                          </p>
                          <p className="font-sans text-[15px] sm:text-base lg:text-sm text-taupe leading-relaxed">
                            {item.contextNote}
                          </p>
                          <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-champagne/75 pt-1">
                            {item.exifSpec} · {item.technicalNote}
                          </p>
                        </div>

                        {idx === 0 && (
                          <div className="pt-6 border-t border-champagne/15 space-y-3">
                            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-champagne">
                              EKSTRAKSI PALET WARNA DARI POTRET
                            </p>
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 sm:gap-2">
                              {PORTRAIT_PALETTE.map((swatch) => (
                                <div key={swatch.hex} className="space-y-1.5">
                                  <span
                                    className="block h-8 border border-champagne/20"
                                    style={{ backgroundColor: swatch.hex }}
                                  />
                                  <span className="block font-mono text-[9px] tracking-[0.12em] uppercase text-taupe truncate">
                                    {swatch.name}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {activeItem && lightboxIndex !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Penampil Lightbox: ${activeItem.title}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.15 : 0.35, ease: EASE_LUXURY }}
            onClick={() => setLightboxId(null)}
            className="fixed inset-0 z-80 bg-obsidian/95 backdrop-blur-lg flex flex-col justify-between p-5 sm:p-8 overflow-y-auto"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="max-w-[1360px] w-full mx-auto flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-champagne/15"
            >
              <span className="font-mono text-xs tracking-[0.22em] uppercase text-champagne">
                {String(lightboxIndex + 1).padStart(2, '0')} /{' '}
                {String(filteredItems.length).padStart(2, '0')} · {activeItem.plateNumber} ·{' '}
                {activeItem.techniqueBadge}
              </span>

              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                <button
                  type="button"
                  onClick={() => setFilmGrainEnabled((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-champagne/30 text-champagne font-mono text-[10px] tracking-[0.16em] uppercase hover:border-champagne transition-colors"
                >
                  <Sparkles className="size-3.5" aria-hidden="true" />
                  Grain: {filmGrainEnabled ? 'ON' : 'OFF'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCaptions((prev) => !prev)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-champagne/30 text-ivory font-mono text-[10px] tracking-[0.16em] uppercase hover:border-champagne transition-colors"
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
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-champagne text-obsidian font-mono text-[10px] tracking-[0.2em] uppercase font-medium hover:bg-ivory transition-colors"
                >
                  Tutup
                  <X className="size-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div
              onClick={(e) => e.stopPropagation()}
              className="max-w-[1200px] w-full mx-auto my-auto py-6 flex items-center justify-between gap-4"
            >
              {hasMultiplePlates && (
                <button
                  type="button"
                  onClick={() => stepLightbox(-1)}
                  aria-label="Pelat sebelumnya"
                  className="shrink-0 size-11 rounded-full border border-champagne/35 bg-espresso/75 flex items-center justify-center text-champagne hover:bg-champagne hover:text-obsidian transition-colors"
                >
                  <ChevronLeft className="size-5" aria-hidden="true" />
                </button>
              )}

              <motion.div
                key={activeItem.id}
                initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease: EASE_LUXURY }}
                className="flex-1 flex flex-col items-center"
              >
                <div className="relative w-full max-w-[780px] max-h-[66vh] border border-champagne/25 bg-espresso overflow-hidden flex items-center justify-center">
                  <img
                    src={activeItem.src}
                    alt={activeItem.title}
                    style={{ filter: getCombinedFilter(activeItem) }}
                    className={`max-h-[65vh] w-auto max-w-full object-contain ${
                      activeItem.imageScaleClass ?? ''
                    }`}
                  />
                  <OpticalPresetOverlay
                    item={activeItem}
                    filmGrain={filmGrainEnabled}
                  />
                </div>
              </motion.div>

              {hasMultiplePlates && (
                <button
                  type="button"
                  onClick={() => stepLightbox(1)}
                  aria-label="Pelat berikutnya"
                  className="shrink-0 size-11 rounded-full border border-champagne/35 bg-espresso/75 flex items-center justify-center text-champagne hover:bg-champagne hover:text-obsidian transition-colors"
                >
                  <ChevronRight className="size-5" aria-hidden="true" />
                </button>
              )}
            </div>

            <div
              onClick={(e) => e.stopPropagation()}
              className="max-w-[1000px] w-full mx-auto pt-4 border-t border-champagne/15 text-center"
            >
              {showCaptions && (
                <div className="space-y-1.5">
                  <h3 className="font-serif text-2xl sm:text-3xl font-light text-ivory">
                    {activeItem.title}
                  </h3>
                  <p className="font-sans text-[15px] sm:text-base lg:text-sm text-ivory/75 max-w-2xl mx-auto">
                    {activeItem.caption}
                  </p>
                  <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-taupe pt-1">
                    {activeItem.exifSpec} · {activeItem.technicalNote}
                    {hasMultiplePlates
                      ? ' · GUNAKAN TOMBOL ← / → UNTUK NAVIGASI'
                      : ' · TEKAN ESC UNTUK MENUTUP'}
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
