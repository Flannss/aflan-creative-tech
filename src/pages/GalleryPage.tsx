import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  Aperture,
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
 * Renders subtle aesthetic frame treatments for each gallery visual preset:
 * Korean Photobooth, Retro Digicam (Sony Cyber-shot), Studio Gradient Backdrop,
 * 0.5x Ultra-Wide Perspective, and GCam HDR+ Color Grading.
 */
const OpticalPresetOverlay: React.FC<OpticalPresetOverlayProps> = ({
  item,
  filmGrain,
}) => {
  return (
    <>
      {item.visualPreset === 'korean-photobooth' && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-2.5 sm:inset-3.5 border-2 border-ivory/65 flex flex-col justify-between p-2.5"
          >
            <div className="flex items-center justify-between font-mono text-[8px] tracking-[0.24em] uppercase text-ivory/85 bg-obsidian/60 px-2 py-0.5">
              <span>LIFE4CUT · SEOUL EDITION</span>
              <span>FRAME 01 / 04</span>
            </div>
            <div className="grid grid-cols-4 gap-1 pt-1">
              <span className="h-0.5 bg-ivory/75" />
              <span className="h-0.5 bg-ivory/45" />
              <span className="h-0.5 bg-ivory/45" />
              <span className="h-0.5 bg-ivory/45" />
            </div>
          </div>
        </>
      )}

      {item.visualPreset === 'retro-digicam' && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 55% 40%, rgba(255,235,200,0.16) 0%, transparent 55%, rgba(23,22,21,0.58) 100%)',
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-3 right-3.5 font-mono text-xs tracking-[0.22em] text-[#FFB347] drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]"
          >
            &apos;26 11 21
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-3 left-3.5 font-mono text-[9px] tracking-[0.2em] uppercase text-ivory/85 bg-obsidian/65 px-2 py-0.5 border border-champagne/25"
          >
            CYBER-SHOT · CCD 12.1MP
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
                'radial-gradient(ellipse at center, transparent 42%, rgba(23,22,21,0.72) 100%)',
            }}
          />
          <svg
            aria-hidden="true"
            viewBox="0 0 400 260"
            className="pointer-events-none absolute inset-0 w-full h-full opacity-40"
            preserveAspectRatio="none"
          >
            <line x1="0" y1="0" x2="200" y2="130" stroke="#D8C3A5" strokeWidth="0.6" strokeDasharray="3 3" />
            <line x1="400" y1="0" x2="200" y2="130" stroke="#D8C3A5" strokeWidth="0.6" strokeDasharray="3 3" />
            <line x1="0" y1="260" x2="200" y2="130" stroke="#D8C3A5" strokeWidth="0.6" strokeDasharray="3 3" />
            <line x1="400" y1="260" x2="200" y2="130" stroke="#D8C3A5" strokeWidth="0.6" strokeDasharray="3 3" />
            <rect x="40" y="26" width="320" height="208" fill="none" stroke="#D8C3A5" strokeWidth="0.75" strokeOpacity="0.55" />
          </svg>
        </>
      )}

      {item.visualPreset === 'gcam-hdr-grading' && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(135deg, rgba(216,195,165,0.16) 0%, rgba(118,86,65,0.12) 48%, rgba(23,22,21,0.68) 100%)',
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-3 left-3 right-3 bg-obsidian/75 backdrop-blur-xs border border-champagne/25 p-2 flex items-center justify-between gap-2"
          >
            <span className="font-mono text-[8px] tracking-[0.2em] uppercase text-champagne">
              HDR+ SPLIT-TONE LUT
            </span>
            <div className="flex items-center gap-1">
              <span className="size-2.5 bg-[#171615] border border-champagne/30" />
              <span className="size-2.5 bg-[#2B1D17]" />
              <span className="size-2.5 bg-[#765641]" />
              <span className="size-2.5 bg-[#D8C3A5]" />
              <span className="size-2.5 bg-[#F5F0E8]" />
            </div>
          </div>
        </>
      )}

      {item.visualPreset === 'gradient-studio-backdrop' && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 36%, rgba(216,195,165,0.24) 0%, rgba(118,86,65,0.32) 38%, rgba(43,29,23,0.72) 70%, rgba(23,22,21,0.92) 100%)',
          }}
        />
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
  const [selectedCategory, setSelectedCategory] = useState<'All' | GalleryCategory>('All');
  const [layoutMode, setLayoutMode] = useState<'masonry' | 'monograph'>('masonry');
  const [filmGrainEnabled, setFilmGrainEnabled] = useState<boolean>(true);
  const [lightboxId, setLightboxId] = useState<string | null>(null);
  const [showCaptions, setShowCaptions] = useState(true);
  const [fallbackIds, setFallbackIds] = useState<Record<string, boolean>>({});
  const prefersReducedMotion = useReducedMotion();

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'All') return galleryItems;
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

  const resolveImageSrc = (item: GalleryItem): string => {
    return fallbackIds[item.id] ? item.fallbackSrc : item.src;
  };

  const handleImageError = (id: string) => {
    setFallbackIds((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
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
              MASONRY ARCHIVE · HOVER UNTUK TELEMETRI EXIF
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
                    <span className="italic text-mocha">Estetika &amp; Optik</span>
                  </>,
                ]}
              />
            </div>

            <Reveal variant="up" delay={0.14} className="lg:col-span-5 space-y-4">
              <p className="font-sans text-[15px] sm:text-base text-charcoal/85 leading-relaxed">
                Kurasi eksplorasi visual mulai dari{' '}
                <span className="font-medium text-espresso">Soft Direct Flash</span>,{' '}
                <span className="font-medium text-espresso">Korean Photobooth Aesthetic</span>,{' '}
                <span className="font-medium text-espresso">Retro Digicam (Sony Cyber-shot)</span>,{' '}
                <span className="font-medium text-espresso">Studio Gradient Backdrop</span>, hingga{' '}
                <span className="font-medium text-espresso">0.5x Ultra-wide Perspective</span>.
              </p>
            </Reveal>
          </div>

          {/* Interactive Controls Deck: Dynamic Category Filter + Film Grain Toggle + Layout Mode + Tonal Filter */}
          <div className="mt-10 lg:mt-12 pt-6 border-t border-espresso/15 space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div
                role="tablist"
                aria-label="Filter kategori galeri"
                className="flex flex-wrap gap-2"
              >
                {galleryCategories.map((cat) => {
                  const active = selectedCategory === cat;
                  const count =
                    cat === 'All'
                      ? galleryItems.length
                      : galleryItems.filter((item) => item.category === cat).length;

                  return (
                    <button
                      key={cat}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setSelectedCategory(cat)}
                      className={`inline-flex items-center gap-2 px-4 py-2.5 lg:py-2 rounded-full font-mono text-[11px] tracking-[0.16em] uppercase border transition-colors ${
                        active
                          ? 'bg-espresso text-ivory border-espresso font-medium'
                          : 'bg-ivory text-espresso border-espresso/20 hover:border-mocha'
                      }`}
                    >
                      <span>{cat}</span>
                      <span
                        className={`text-[10px] ${
                          active ? 'text-champagne' : 'text-mocha'
                        }`}
                      >
                        ({count})
                      </span>
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
                    Masonry Grid
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
            /* Editorial Masonry Grid Layout (Multi-Column Interlocking Portrait, Square & Landscape Cards) */
            <div className="columns-1 md:columns-2 lg:columns-3 gap-7 space-y-7">
              {filteredItems.map((item, idx) => (
                <Reveal
                  key={item.id}
                  variant="up"
                  delay={idx * 0.05}
                  className="break-inside-avoid"
                >
                  <article className="group bg-espresso/55 border border-champagne/20 hover:border-champagne/65 transition-all duration-500 flex flex-col justify-between overflow-hidden shadow-[0_24px_70px_rgba(0,0,0,0.6)]">
                    <button
                      type="button"
                      onClick={() => setLightboxId(item.id)}
                      data-cursor="EXIF / ZOOM"
                      aria-label={`Buka ${item.title} pada lightbox layar penuh`}
                      className="relative block w-full text-left overflow-hidden bg-obsidian focus-visible:outline-2 focus-visible:outline-champagne"
                    >
                      <div className={`relative ${item.aspectClass} w-full overflow-hidden`}>
                        <img
                          src={resolveImageSrc(item)}
                          onError={() => handleImageError(item.id)}
                          alt={item.title}
                          loading="lazy"
                          style={{
                            objectPosition: item.objectPosition ?? 'center',
                            filter: getCombinedFilter(item),
                          }}
                          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06] ${
                            item.imageScaleClass ?? ''
                          }`}
                        />
                        <OpticalPresetOverlay
                          item={item}
                          filmGrain={filmGrainEnabled}
                        />

                        {/* Top Always-Visible Pill Badge */}
                        <div className="absolute top-3.5 left-3.5 right-3.5 z-10 flex items-center justify-between gap-2 pointer-events-none">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-obsidian/85 backdrop-blur-xs border border-champagne/35 font-mono text-[10px] tracking-[0.18em] uppercase text-champagne">
                            <Camera className="size-3" aria-hidden="true" />
                            {item.techniqueBadge}
                          </span>
                          <span className="size-8 rounded-full bg-obsidian/80 border border-champagne/35 flex items-center justify-center text-champagne group-hover:bg-champagne group-hover:text-obsidian transition-colors">
                            <Maximize2 className="size-3.5" aria-hidden="true" />
                          </span>
                        </div>

                        {/* Interactive Hover Reveal: Transparent EXIF & Aesthetic Telemetry Overlay */}
                        <div className="absolute inset-0 z-20 bg-obsidian/84 backdrop-blur-[4px] p-5 sm:p-6 flex flex-col justify-end opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0 transition-all duration-300">
                          <div className="space-y-3 border-t border-champagne/30 pt-3.5">
                            <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.22em] uppercase text-champagne">
                              <span className="inline-flex items-center gap-1.5">
                                <Aperture className="size-3.5" aria-hidden="true" />
                                EXIF &amp; AESTHETIC DATA
                              </span>
                              <span>{item.plateNumber}</span>
                            </div>

                            <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                              <div>
                                <dt className="font-mono text-[9px] tracking-[0.18em] uppercase text-taupe">
                                  Estetika / Teknik
                                </dt>
                                <dd className="text-ivory font-medium mt-0.5">
                                  {item.exifTelemetry.technique}
                                </dd>
                              </div>
                              <div>
                                <dt className="font-mono text-[9px] tracking-[0.18em] uppercase text-taupe">
                                  Perangkat / Sensor
                                </dt>
                                <dd className="text-champagne mt-0.5">
                                  {item.exifTelemetry.camera}
                                </dd>
                              </div>
                              <div>
                                <dt className="font-mono text-[9px] tracking-[0.18em] uppercase text-taupe">
                                  Optik &amp; Bukaan
                                </dt>
                                <dd className="text-ivory/90 mt-0.5">
                                  {item.exifTelemetry.lens}
                                </dd>
                              </div>
                              <div>
                                <dt className="font-mono text-[9px] tracking-[0.18em] uppercase text-taupe">
                                  Eksposur &amp; Profil
                                </dt>
                                <dd className="text-ivory/90 mt-0.5">
                                  {item.exifTelemetry.exposure}
                                </dd>
                              </div>
                            </dl>

                            <div className="pt-2 border-t border-champagne/15 flex items-center justify-between font-mono text-[10px] tracking-[0.18em] uppercase text-champagne">
                              <span className="truncate">{item.exifTelemetry.colorProfile}</span>
                              <span className="shrink-0 ml-2 underline">Perbesar ↗</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>

                    <div className="p-5 sm:p-6 space-y-3.5">
                      <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] tracking-[0.2em] uppercase">
                        <span className="text-champagne">
                          {item.plateNumber} · {item.category}
                        </span>
                        <span className="text-taupe">{item.techniqueBadge}</span>
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

                      <div className="pt-3 border-t border-champagne/15 flex items-center justify-between gap-2 font-mono text-[10px] tracking-[0.16em] uppercase text-taupe">
                        <span className="truncate">{item.exifSpec}</span>
                        <button
                          type="button"
                          onClick={() => setLightboxId(item.id)}
                          className="shrink-0 inline-flex items-center gap-1 text-champagne hover:text-ivory transition-colors"
                        >
                          Lightbox
                          <Maximize2 className="size-3" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
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
                          <div className={`relative ${item.aspectClass} overflow-hidden`}>
                            <img
                              src={resolveImageSrc(item)}
                              onError={() => handleImageError(item.id)}
                              alt={item.title}
                              loading="lazy"
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

                          <p className="font-serif italic text-xl text-champagne/85">
                            {item.subtitle}
                          </p>
                        </div>

                        <p className="font-sans text-[15px] sm:text-base leading-[1.85] text-ivory/80">
                          {item.caption}
                        </p>

                        <dl className="grid grid-cols-2 gap-4 pt-5 border-t border-champagne/15 text-sm">
                          <div>
                            <dt className="font-mono text-[10px] tracking-[0.2em] uppercase text-champagne">
                              Perangkat &amp; Lensa
                            </dt>
                            <dd className="text-ivory/85 mt-1">
                              {item.exifTelemetry.camera} · {item.exifTelemetry.lens}
                            </dd>
                          </div>
                          <div>
                            <dt className="font-mono text-[10px] tracking-[0.2em] uppercase text-champagne">
                              Eksposur &amp; Profil
                            </dt>
                            <dd className="text-ivory/85 mt-1">
                              {item.exifTelemetry.exposure} · {item.exifTelemetry.colorProfile}
                            </dd>
                          </div>
                        </dl>

                        {idx === 0 && (
                          <div className="pt-5 border-t border-champagne/15 space-y-3">
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
                    src={resolveImageSrc(activeItem)}
                    onError={() => handleImageError(activeItem.id)}
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
                    {activeItem.exifTelemetry.camera} · {activeItem.exifTelemetry.lens} ·{' '}
                    {activeItem.exifTelemetry.exposure}
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
