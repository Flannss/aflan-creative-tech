import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Eye, EyeOff, Maximize2, X } from 'lucide-react';
import { galleryItems } from '@/data/gallery';
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
    cssFilter: 'none',
    note: 'Nada warna studio hangat autentik sesuai tangkapan asli.',
  },
  sepia: {
    label: 'Sepia Editorial',
    cssFilter: 'sepia(34%) contrast(1.06) brightness(0.98)',
    note: 'Nuansa cetak arsip hangat selaras dengan palet Espresso & Champagne.',
  },
  monochrome: {
    label: 'Monokrom Hangat',
    cssFilter: 'grayscale(86%) sepia(18%) contrast(1.12)',
    note: 'Studi kontras tinggi yang menonjolkan arah cahaya dan komposisi.',
  },
};

const PORTRAIT_PALETTE = [
  { name: 'Obsidian', hex: '#171615' },
  { name: 'Espresso', hex: '#2B1D17' },
  { name: 'Mocha', hex: '#765641' },
  { name: 'Champagne', hex: '#D8C3A5' },
  { name: 'Ivory', hex: '#F5F0E8' },
] as const;

export const GalleryPage: React.FC = () => {
  const [tonalMode, setTonalMode] = useState<TonalTreatment>('original');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showCaptions, setShowCaptions] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  const hasMultiplePlates = galleryItems.length > 1;
  const activeItem =
    lightboxIndex !== null ? galleryItems[lightboxIndex] ?? null : null;

  useEffect(() => {
    if (lightboxIndex === null) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (hasMultiplePlates && e.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev === null ? 0 : (prev + 1) % galleryItems.length,
        );
      } else if (hasMultiplePlates && e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev === null
            ? 0
            : (prev - 1 + galleryItems.length) % galleryItems.length,
        );
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [lightboxIndex, hasMultiplePlates]);

  const stepLightbox = (delta: number) => {
    setLightboxIndex((prev) =>
      prev === null ? 0 : (prev + delta + galleryItems.length) % galleryItems.length,
    );
  };

  return (
    <div className="w-full overflow-x-clip">
      <section className="bg-offwhite text-espresso pt-32 sm:pt-40 pb-20 sm:pb-24 px-5 sm:px-8 lg:px-12 border-b border-espresso/15">
        <div className="max-w-[1440px] mx-auto">
          <Reveal variant="up" className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-espresso/15">
            <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.28em] uppercase text-mocha">
              BAB 07 — GALERI MONOGRAF · {String(galleryItems.length).padStart(2, '0')} PELAT
            </span>
            <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-espresso/65">
              KUALITAS KOMPOSISI DI ATAS KUANTITAS · FOTOGRAFI ASLI
            </span>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-14 items-end">
            <div className="lg:col-span-7">
              <TextReveal
                as="h1"
                immediate
                className="font-serif text-5xl sm:text-6xl lg:text-[4.85rem] leading-[0.98] font-light"
                lines={[
                  <>Edisi Monograf</>,
                  <>
                    <span className="italic text-mocha">Potret &amp; Studi Cahaya</span>
                  </>,
                ]}
              />
            </div>

            <Reveal variant="up" delay={0.14} className="lg:col-span-5">
              <p className="font-sans text-sm sm:text-base text-charcoal/80 leading-relaxed">
                Menampilkan fotografi personal autentik dalam ruang pamer yang lapang—tanpa
                foto stok, tanpa gambar AI, dan tanpa pengisi galeri kosong.
              </p>
            </Reveal>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-espresso/15">
            <div
              className="flex flex-wrap items-center gap-2"
              role="group"
              aria-label="Pilihan tonal visual"
            >
              <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-mocha mr-2">
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
                    className={`px-4 py-2 rounded-full font-mono text-[11px] tracking-[0.16em] uppercase border transition-colors ${
                      active
                        ? 'bg-espresso text-ivory border-espresso'
                        : 'bg-ivory text-espresso border-espresso/20 hover:border-mocha'
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
      </section>

      <section className="bg-obsidian text-ivory py-20 sm:py-28 px-5 sm:px-8 lg:px-12">
        <div className="max-w-[1440px] mx-auto space-y-24 sm:space-y-32">
          {galleryItems.map((item, idx) => {
            const isPortrait = idx === 0;
            return (
              <Reveal key={item.id} variant="up">
                <article className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center border-b border-champagne/15 pb-20 sm:pb-28 last:border-b-0 last:pb-0">
                  <div
                    className={
                      isPortrait
                        ? 'lg:col-span-6 lg:order-1'
                        : 'lg:col-span-7 lg:order-2'
                    }
                  >
                    <button
                      type="button"
                      onClick={() => setLightboxIndex(idx)}
                      data-cursor="LIGHTBOX"
                      aria-label={`Buka ${item.title} pada lightbox layar penuh`}
                      className="group relative block w-full text-left border border-champagne/25 bg-espresso p-3 sm:p-5 shadow-[0_32px_90px_rgba(0,0,0,0.65)] focus-visible:outline-2 focus-visible:outline-champagne"
                    >
                      <div className="relative">
                        <ParallaxFrame
                          className={isPortrait ? 'aspect-4/5' : 'aspect-16/11'}
                          offset={16}
                        >
                          <img
                            src={item.src}
                            alt={item.title}
                            style={{
                              objectPosition: item.objectPosition ?? 'center',
                              filter: TONAL_FILTERS[tonalMode].cssFilter,
                            }}
                            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.03]"
                          />
                        </ParallaxFrame>
                        <span className="absolute top-4 right-4 size-10 rounded-full bg-obsidian/80 border border-champagne/35 flex items-center justify-center text-champagne group-hover:bg-champagne group-hover:text-obsidian transition-colors">
                          <Maximize2 className="size-4" aria-hidden="true" />
                        </span>
                      </div>

                      <div className="pt-4 flex items-center justify-between gap-4 font-mono text-[10px] tracking-[0.22em] uppercase text-champagne/80">
                        <span>{item.plateNumber}</span>
                        <span className="inline-flex items-center gap-1.5">
                          <Maximize2 className="size-3" aria-hidden="true" />
                          KLIK UNTUK PERBESAR
                        </span>
                      </div>
                    </button>
                  </div>

                  <div
                    className={`${
                      isPortrait
                        ? 'lg:col-span-6 lg:order-2 lg:pl-6'
                        : 'lg:col-span-5 lg:order-1 lg:pr-6'
                    } space-y-8`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.26em] uppercase text-champagne">
                        <span>{item.plateNumber}</span>
                        <span className="text-champagne/35">/</span>
                        <span className="text-taupe">{item.category}</span>
                      </div>

                      <h2 className="font-serif text-4xl sm:text-5xl font-light leading-[1.05] text-ivory">
                        {item.title}
                      </h2>

                      <p className="font-serif italic text-xl text-champagne/85">
                        {item.subtitle}
                      </p>
                    </div>

                    <p className="font-sans text-sm sm:text-base leading-[1.85] text-ivory/80">
                      {item.caption}
                    </p>

                    <div className="pt-6 border-t border-champagne/15 space-y-3">
                      <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-champagne">
                        PENEMPATAN &amp; KONTEKS EDITORIAL
                      </p>
                      <p className="font-sans text-sm text-taupe leading-relaxed">
                        {item.contextNote}
                      </p>
                      <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-champagne/70 pt-1">
                        {item.technicalNote}
                      </p>
                    </div>

                    {isPortrait && (
                      <div className="pt-6 border-t border-champagne/15 space-y-3">
                        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-champagne">
                          EKSTRAKSI PALET WARNA DARI POTRET
                        </p>
                        <div className="grid grid-cols-5 gap-2">
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
            onClick={() => setLightboxIndex(null)}
            className="fixed inset-0 z-80 bg-obsidian/95 backdrop-blur-lg flex flex-col justify-between p-4 sm:p-8 overflow-y-auto"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="max-w-[1360px] w-full mx-auto flex items-center justify-between gap-4 pb-4 border-b border-champagne/15"
            >
              <span className="font-mono text-xs tracking-[0.24em] uppercase text-champagne">
                {String(lightboxIndex + 1).padStart(2, '0')} /{' '}
                {String(galleryItems.length).padStart(2, '0')} · {activeItem.plateNumber}
              </span>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowCaptions((prev) => !prev)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-champagne/30 text-ivory font-mono text-[10px] tracking-[0.18em] uppercase hover:border-champagne transition-colors"
                >
                  {showCaptions ? (
                    <>
                      <EyeOff className="size-3.5" aria-hidden="true" />
                      Sembunyikan Teks
                    </>
                  ) : (
                    <>
                      <Eye className="size-3.5" aria-hidden="true" />
                      Tampilkan Teks
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setLightboxIndex(null)}
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
                transition={{ duration: 0.45, ease: EASE_LUXURY }}
                className="flex-1 flex flex-col items-center"
              >
                <div className="w-full max-w-[780px] max-h-[66vh] border border-champagne/25 bg-espresso overflow-hidden flex items-center justify-center">
                  <img
                    src={activeItem.src}
                    alt={activeItem.title}
                    style={{ filter: TONAL_FILTERS[tonalMode].cssFilter }}
                    className="max-h-[65vh] w-auto max-w-full object-contain"
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
                  <p className="font-sans text-sm text-ivory/75 max-w-2xl mx-auto">
                    {activeItem.caption}
                  </p>
                  <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-taupe pt-1">
                    {activeItem.technicalNote}
                    {hasMultiplePlates ? ' · GUNAKAN TOMBOL ← / → UNTUK NAVIGASI' : ' · TEKAN ESC UNTUK MENUTUP'}
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
