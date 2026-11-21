import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Pause, Play, RotateCcw, Sliders, Sparkles } from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';
import { TextReveal } from '@/components/motion/TextReveal';
import { MonogramMark } from '@/components/brand/Monogram';
import { useIsCoarsePointer } from '@/hooks/useMediaQuery';

const PALETTE_SWATCHES = [
  { name: 'Obsidian', hex: '#171615' },
  { name: 'Espresso', hex: '#2B1D17' },
  { name: 'Dark Chocolate', hex: '#3A2921' },
  { name: 'Charcoal', hex: '#292725' },
  { name: 'Mocha', hex: '#765641' },
  { name: 'Warm Taupe', hex: '#A58B76' },
  { name: 'Champagne', hex: '#D8C3A5' },
  { name: 'Ivory', hex: '#F5F0E8' },
  { name: 'Off White', hex: '#FAF8F4' },
] as const;

const EASING_PRESETS = [
  {
    id: 'luxury',
    label: 'Luxury Power4 Out',
    bezier: [0.16, 1, 0.3, 1] as [number, number, number, number],
    css: 'cubic-bezier(0.16, 1, 0.3, 1)',
    duration: 1.15,
    note: 'Akselerasi tajam yang mendarat tenang—standar transisi editorial utama AFLAN.',
  },
  {
    id: 'editorial',
    label: 'Editorial Expo',
    bezier: [0.22, 1, 0.36, 1] as [number, number, number, number],
    css: 'cubic-bezier(0.22, 1, 0.36, 1)',
    duration: 1.0,
    note: 'Ritme halus dan tegas untuk reveal tipografi serta elemen konten.',
  },
  {
    id: 'snap',
    label: 'Architectural Snap',
    bezier: [0.4, 0, 0.2, 1] as [number, number, number, number],
    css: 'cubic-bezier(0.4, 0, 0.2, 1)',
    duration: 0.62,
    note: 'Respons cepat dan taktil untuk kontrol filter, tombol, dan drawer.',
  },
] as const;

function hexToLuminance(hex: string): number {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const transform = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * transform(r) + 0.7152 * transform(g) + 0.0722 * transform(b);
}

function getContrastRatio(hexA: string, hexB: string): number {
  const l1 = hexToLuminance(hexA);
  const l2 = hexToLuminance(hexB);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const ChiaroscuroCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const isCoarsePointer = useIsCoarsePointer();
  const [userToggle, setUserToggle] = useState<boolean | null>(null);
  const running = userToggle ?? (!prefersReducedMotion && !isCoarsePointer);

  const [density, setDensity] = useState<number>(48);
  const ripplesRef = useRef<Array<{ x: number; y: number; r: number; alpha: number }>>([]);
  const redrawRef = useRef<(() => void) | null>(null);
  const pointerRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0.5,
    y: 0.5,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let width = 0;
    let height = 0;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      tone: string;
    }

    const tones = ['#D8C3A5', '#A58B76', '#765641', '#F5F0E8'];
    let particles: Particle[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      particles = Array.from({ length: density }, (_, idx) => ({
        x: ((idx * 73) % 100) * 0.01 * width,
        y: ((idx * 41) % 100) * 0.01 * height,
        vx: ((idx % 7) - 3) * 0.14 || 0.15,
        vy: ((idx % 5) - 2) * 0.14 || -0.12,
        size: 1.4 + (idx % 4) * 0.75,
        tone: tones[idx % tones.length],
      }));
    };

    resize();
    window.addEventListener('resize', resize);

    const drawFrame = () => {
      ctx.fillStyle = '#171615';
      ctx.fillRect(0, 0, width, height);

      const lightX = pointerRef.current.active ? pointerRef.current.x : width * 0.52;
      const lightY = pointerRef.current.active ? pointerRef.current.y : height * 0.44;

      const grad = ctx.createRadialGradient(
        lightX,
        lightY,
        10,
        lightX,
        lightY,
        Math.max(width, height) * 0.62,
      );
      grad.addColorStop(0, 'rgba(216, 195, 165, 0.22)');
      grad.addColorStop(0.38, 'rgba(118, 86, 65, 0.14)');
      grad.addColorStop(1, 'rgba(23, 22, 21, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        if (running) {
          const dx = lightX - p.x;
          const dy = lightY - p.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < 180) {
            p.vx += (dx / dist) * 0.018;
            p.vy += (dy / dist) * 0.018;
          }
          p.vx *= 0.988;
          p.vy *= 0.988;
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        }

        for (let j = i + 1; j < particles.length; j += 1) {
          const q = particles[j];
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 92) {
            ctx.strokeStyle = `rgba(216, 195, 165, ${(1 - d / 92) * 0.16})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }

        ctx.fillStyle = p.tone;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ripplesRef.current = ripplesRef.current.filter((rp) => rp.alpha > 0.02);
      for (const rp of ripplesRef.current) {
        ctx.strokeStyle = `rgba(216, 195, 165, ${rp.alpha})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.stroke();
        if (running) {
          rp.r += 2.2;
          rp.alpha *= 0.94;
        }
      }

      if (running) {
        rafId = window.requestAnimationFrame(drawFrame);
      }
    };

    redrawRef.current = drawFrame;
    drawFrame();

    return () => {
      redrawRef.current = null;
      window.removeEventListener('resize', resize);
      window.cancelAnimationFrame(rafId);
    };
  }, [running, density]);

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    pointerRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    };
    if (!running) {
      redrawRef.current?.();
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    ripplesRef.current.push({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      r: running ? 8 : 26,
      alpha: 0.72,
    });
    if (!running) {
      redrawRef.current?.();
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative border border-champagne/25 bg-obsidian overflow-hidden">
        <canvas
          ref={canvasRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={() => {
            pointerRef.current.active = false;
          }}
          onClick={handleClick}
          data-cursor="RIPPLE"
          aria-label="Kanvas interaktif chiaroscuro hangat. Gerakkan pointer untuk mengarahkan cahaya dan klik untuk memicu riak."
          className="block w-full h-[300px] sm:h-[360px] cursor-crosshair"
        />
        <div className="pointer-events-none absolute top-4 left-4 font-mono text-[10px] tracking-[0.22em] uppercase text-champagne/80 bg-obsidian/70 px-2.5 py-1 border border-champagne/20">
          GERAKKAN POINTER · KLIK UNTUK RIAK CAHAYA
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setUserToggle(!running)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-champagne/35 bg-espresso text-ivory font-mono text-[11px] tracking-[0.18em] uppercase hover:bg-champagne hover:text-obsidian transition-colors"
          >
            {running ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
            {running ? 'Jeda Kanvas' : 'Jalankan Kanvas'}
          </button>
          <button
            type="button"
            onClick={() => {
              ripplesRef.current = [];
              setDensity(48);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-champagne/25 text-taupe font-mono text-[11px] tracking-[0.18em] uppercase hover:text-ivory hover:border-champagne/60 transition-colors"
          >
            <RotateCcw className="size-3.5" />
            Atur Ulang
          </button>
        </div>

        <label className="flex items-center gap-3 font-mono text-[11px] tracking-[0.18em] uppercase text-champagne">
          <span>Partikel: {density}</span>
          <input
            type="range"
            min={18}
            max={84}
            step={6}
            value={density}
            onChange={(e) => setDensity(Number(e.target.value))}
            className="accent-champagne w-28"
          />
        </label>
      </div>
    </div>
  );
};

export const CreativeLabPage: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const isCoarsePointer = useIsCoarsePointer();

  const [specimenText, setSpecimenText] = useState('AFLAN · CREATIVE CRAFT');
  const [tracking, setTracking] = useState(0.1);
  const [fontSize, setFontSize] = useState(56);
  const [italicMode, setItalicMode] = useState(true);
  const [outlineMode, setOutlineMode] = useState(false);

  const [selectedPreset, setSelectedPreset] = useState<(typeof EASING_PRESETS)[number]>(
    EASING_PRESETS[0],
  );
  const [runCount, setRunCount] = useState(0);
  const [magnetOffset, setMagnetOffset] = useState({ x: 0, y: 0 });
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [trackTravel, setTrackTravel] = useState(260);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const measure = () => {
      const available = Math.max(80, el.clientWidth - 104);
      setTrackTravel(available);
    };
    measure();
    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(measure);
      observer.observe(el);
      return () => observer.disconnect();
    }
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const [bgHex, setBgHex] = useState<string>('#2B1D17');
  const [fgHex, setFgHex] = useState<string>('#F5F0E8');

  const contrastRatio = useMemo(() => getContrastRatio(bgHex, fgHex), [bgHex, fgHex]);
  const contrastGrade = useMemo(() => {
    if (contrastRatio >= 7) return 'AAA · Keterbacaan Sangat Tinggi';
    if (contrastRatio >= 4.5) return 'AA · Ideal untuk Teks & UI';
    if (contrastRatio >= 3) return 'AA Large · Khusus Display Headline';
    return 'Aksen Dekoratif · Hindari untuk Teks Kecil';
  }, [contrastRatio]);

  return (
    <div className="w-full overflow-x-clip">
      <section className="relative bg-obsidian text-ivory pt-28 sm:pt-36 lg:pt-40 pb-16 sm:pb-24 px-6 sm:px-8 lg:px-12 border-b border-champagne/15">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 studio-warm-halo opacity-60"
        />
        <div className="relative z-10 max-w-[1440px] mx-auto">
          <Reveal variant="up" className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-champagne/15">
            <span className="inline-flex items-center gap-2 font-mono text-[10px] sm:text-[11px] tracking-[0.28em] uppercase text-champagne">
              <Sparkles className="size-3.5" aria-hidden="true" />
              BAB 06 — CREATIVE LAB
            </span>
            <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-taupe">
              04 STUDI INTERAKTIF LANGSUNG
            </span>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-12 lg:pt-14 items-end">
            <div className="lg:col-span-7">
              <TextReveal
                as="h1"
                immediate
                className="font-serif text-[2.25rem] sm:text-5xl md:text-6xl lg:text-[4.9rem] leading-[1.04] lg:leading-[0.98] font-light"
                lines={[
                  <>Sistem Visual</>,
                  <>
                    <span className="italic editorial-outline-strong">Interaktif</span>
                  </>,
                ]}
              />
            </div>
            <Reveal variant="up" delay={0.14} className="lg:col-span-5">
              <p className="font-sans text-[15px] sm:text-base text-ivory/75 leading-relaxed">
                Etalase interaktif Interactive UI Implementation—menampilkan kompositor
                tipografi editorial, pencahayaan kanvas chiaroscuro, koreografi kurva motion,
                dan analisis rasio kontras aksesibilitas secara langsung.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* LAB 01 — TYPOGRAPHY COMPOSITOR */}
      <section className="bg-espresso text-ivory py-16 sm:py-24 lg:py-28 px-6 sm:px-8 lg:px-12 border-b border-champagne/15">
        <div className="max-w-[1440px] mx-auto space-y-8">
          <Reveal variant="up" className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="font-mono text-[11px] tracking-[0.26em] uppercase text-champagne">
                LAB 01 · SPESIMEN TIPOGRAFI
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light mt-2">
                Kompositor Display Editorial
              </h2>
            </div>
            <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-taupe">
              <Sliders className="size-3.5" aria-hidden="true" />
              Cormorant Garamond Live
            </span>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            <div className="md:col-span-7 lg:col-span-8 min-h-[240px] sm:min-h-[320px] bg-obsidian border border-champagne/25 p-6 sm:p-8 flex items-center justify-center text-center overflow-hidden relative">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-15"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgba(216,195,165,0.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(216,195,165,0.22) 1px, transparent 1px)',
                  backgroundSize: '44px 44px',
                }}
              />
              <p
                className={`relative z-10 font-serif font-light leading-[1.08] wrap-break-word max-w-full transition-all duration-200 ${
                  italicMode ? 'italic' : 'not-italic'
                } ${outlineMode ? 'editorial-outline-strong' : 'text-ivory'}`}
                style={{
                  fontSize: `min(${fontSize}px, 11.5vw)`,
                  letterSpacing: `${tracking}em`,
                }}
              >
                {specimenText.trim() || 'AFLAN'}
              </p>
            </div>

            <div className="md:col-span-5 lg:col-span-4 bg-obsidian/70 border border-champagne/20 p-6 space-y-5">
              <div>
                <label
                  htmlFor="lab-specimen-input"
                  className="block font-mono text-[10px] tracking-[0.22em] uppercase text-champagne mb-2"
                >
                  Teks Display
                </label>
                <input
                  id="lab-specimen-input"
                  type="text"
                  maxLength={36}
                  value={specimenText}
                  onChange={(e) => setSpecimenText(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-espresso border border-champagne/30 text-ivory text-base sm:text-sm focus:border-champagne focus:outline-hidden"
                />
              </div>

              <div>
                <label
                  htmlFor="lab-size-range"
                  className="flex justify-between font-mono text-[10px] tracking-[0.2em] uppercase text-taupe mb-1.5"
                >
                  <span>Skala Display</span>
                  <span className="text-champagne">{fontSize}px</span>
                </label>
                <input
                  id="lab-size-range"
                  type="range"
                  min={32}
                  max={82}
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full accent-champagne"
                />
              </div>

              <div>
                <label
                  htmlFor="lab-tracking-range"
                  className="flex justify-between font-mono text-[10px] tracking-[0.2em] uppercase text-taupe mb-1.5"
                >
                  <span>Letter Tracking</span>
                  <span className="text-champagne">{tracking.toFixed(2)}em</span>
                </label>
                <input
                  id="lab-tracking-range"
                  type="range"
                  min={-0.04}
                  max={0.28}
                  step={0.01}
                  value={tracking}
                  onChange={(e) => setTracking(Number(e.target.value))}
                  className="w-full accent-champagne"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setItalicMode((prev) => !prev)}
                  aria-pressed={italicMode}
                  className={`py-2.5 px-3 border font-mono text-[10px] tracking-[0.18em] uppercase transition-colors ${
                    italicMode
                      ? 'bg-champagne text-obsidian border-champagne font-medium'
                      : 'border-champagne/30 text-ivory hover:border-champagne'
                  }`}
                >
                  Italic: {italicMode ? 'Aktif' : 'Mati'}
                </button>
                <button
                  type="button"
                  onClick={() => setOutlineMode((prev) => !prev)}
                  aria-pressed={outlineMode}
                  className={`py-2.5 px-3 border font-mono text-[10px] tracking-[0.18em] uppercase transition-colors ${
                    outlineMode
                      ? 'bg-champagne text-obsidian border-champagne font-medium'
                      : 'border-champagne/30 text-ivory hover:border-champagne'
                  }`}
                >
                  Gaya: {outlineMode ? 'Outline' : 'Solid'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LAB 02 — CHIAROSCURO CANVAS */}
      <section className="bg-obsidian text-ivory py-16 sm:py-24 lg:py-28 px-6 sm:px-8 lg:px-12 border-b border-champagne/15">
        <div className="max-w-[1440px] mx-auto space-y-8">
          <Reveal variant="up" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-7">
              <span className="font-mono text-[11px] tracking-[0.26em] uppercase text-champagne">
                LAB 02 · CREATIVE CODING · HTML5 CANVAS
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light mt-2">
                Medan Cahaya Warm Chiaroscuro
              </h2>
            </div>
            <p className="lg:col-span-5 font-sans text-[15px] sm:text-base lg:text-sm text-ivory/75 leading-relaxed">
              Terinspirasi dari pencahayaan amber studio pada Potret Utama. Partikel bergerak
              lembut mengikuti arah pointer dan memancarkan gelombang konsentris saat diklik.
            </p>
          </Reveal>

          <ChiaroscuroCanvas />
        </div>
      </section>

      {/* LAB 03 — EASING & MAGNETIC SEAL */}
      <section className="bg-ivory text-espresso py-16 sm:py-24 lg:py-28 px-6 sm:px-8 lg:px-12 border-b border-espresso/15">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 items-start">
          <div className="md:col-span-7 space-y-6">
            <div>
              <span className="font-mono text-[11px] tracking-[0.26em] uppercase text-mocha">
                LAB 03 · KOREOGRAFI MOTION
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light mt-2">
                Koreografi Kurva Easing
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {EASING_PRESETS.map((preset) => {
                const active = selectedPreset.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setSelectedPreset(preset);
                      setRunCount((c) => c + 1);
                    }}
                    className={`px-4 py-2.5 lg:py-2 rounded-full font-mono text-[11px] tracking-[0.16em] uppercase border transition-colors ${
                      active
                        ? 'bg-espresso text-ivory border-espresso'
                        : 'bg-offwhite text-espresso border-espresso/20 hover:border-mocha'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            <div className="bg-offwhite border border-espresso/15 p-5 sm:p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-mocha">
                <span>{selectedPreset.css}</span>
                <span>DURASI: {selectedPreset.duration}s</span>
              </div>

              <div
                ref={trackRef}
                className="relative h-14 bg-ivory border border-espresso/15 overflow-hidden flex items-center px-3"
              >
                <motion.div
                  key={`${selectedPreset.id}-${runCount}`}
                  initial={{ x: 0 }}
                  animate={{ x: prefersReducedMotion ? 0 : trackTravel }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : selectedPreset.duration,
                    ease: selectedPreset.bezier,
                  }}
                  className="px-4 py-2 bg-espresso text-champagne font-mono text-[10px] tracking-[0.22em] uppercase shrink-0"
                >
                  AMDZ
                </motion.div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="font-sans text-[15px] sm:text-base lg:text-sm text-charcoal/80">
                  {selectedPreset.note}
                </p>
                <button
                  type="button"
                  onClick={() => setRunCount((c) => c + 1)}
                  className="self-start sm:self-auto shrink-0 px-4 py-2.5 lg:py-2 rounded-full bg-mocha text-ivory font-mono text-[10px] tracking-[0.18em] uppercase hover:bg-espresso transition-colors"
                >
                  Putar Ulang
                </button>
              </div>
            </div>
          </div>

          <div className="md:col-span-5">
            <div
              onPointerMove={(e) => {
                if (prefersReducedMotion || isCoarsePointer) return;
                const rect = e.currentTarget.getBoundingClientRect();
                const relX = (e.clientX - rect.left - rect.width / 2) * 0.24;
                const relY = (e.clientY - rect.top - rect.height / 2) * 0.24;
                setMagnetOffset({
                  x: Math.max(-28, Math.min(28, relX)),
                  y: Math.max(-28, Math.min(28, relY)),
                });
              }}
              onPointerLeave={() => setMagnetOffset({ x: 0, y: 0 })}
              className="h-full min-h-[280px] lg:min-h-[290px] bg-espresso text-ivory border border-espresso p-7 sm:p-8 flex flex-col items-center justify-between text-center"
            >
              <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-champagne">
                STUDI MAGNETIK · ARAHKAN KURSOR
              </span>

              <motion.div
                animate={{ x: magnetOffset.x, y: magnetOffset.y }}
                transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                data-cursor="MAGNET"
                className="size-28 rounded-full border border-champagne/45 bg-obsidian/70 flex items-center justify-center shadow-2xl"
              >
                <MonogramMark size={48} className="text-champagne" />
              </motion.div>

              <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-taupe">
                OFFSET X: {magnetOffset.x.toFixed(0)}PX · Y: {magnetOffset.y.toFixed(0)}PX
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LAB 04 — CONTRAST MATRIX */}
      <section className="bg-chocolate text-ivory py-16 sm:py-24 lg:py-28 px-6 sm:px-8 lg:px-12">
        <div className="max-w-[1440px] mx-auto space-y-8">
          <Reveal variant="up">
            <span className="font-mono text-[11px] tracking-[0.26em] uppercase text-champagne">
              LAB 04 · AKSESIBILITAS DESIGN SYSTEM
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light mt-2">
              Matriks Kontras Palet AFLAN
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            <div className="md:col-span-5 space-y-6 bg-obsidian/70 border border-champagne/20 p-5 sm:p-6">
              <div>
                <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-champagne mb-3">
                  WARNA LATAR ({bgHex})
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {PALETTE_SWATCHES.map((sw) => (
                    <button
                      key={`bg-${sw.hex}`}
                      type="button"
                      onClick={() => setBgHex(sw.hex)}
                      className={`p-2 text-left border transition-all ${
                        bgHex === sw.hex
                          ? 'border-champagne ring-1 ring-champagne'
                          : 'border-champagne/15 hover:border-champagne/50'
                      }`}
                    >
                      <span
                        className="block w-full h-5 border border-champagne/20 mb-1.5"
                        style={{ backgroundColor: sw.hex }}
                      />
                      <span className="block font-mono text-[10px] text-ivory truncate">
                        {sw.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-champagne mb-3">
                  WARNA TEKS ({fgHex})
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {PALETTE_SWATCHES.map((sw) => (
                    <button
                      key={`fg-${sw.hex}`}
                      type="button"
                      onClick={() => setFgHex(sw.hex)}
                      className={`p-2 text-left border transition-all ${
                        fgHex === sw.hex
                          ? 'border-champagne ring-1 ring-champagne'
                          : 'border-champagne/15 hover:border-champagne/50'
                      }`}
                    >
                      <span
                        className="block w-full h-5 border border-champagne/20 mb-1.5"
                        style={{ backgroundColor: sw.hex }}
                      />
                      <span className="block font-mono text-[10px] text-ivory truncate">
                        {sw.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div
              className="md:col-span-7 p-6 sm:p-10 lg:p-12 border border-champagne/25 flex flex-col justify-between transition-colors duration-300 min-h-[300px] lg:min-h-[320px]"
              style={{ backgroundColor: bgHex, color: fgHex }}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-current/20 pb-4 font-mono text-[11px] tracking-[0.2em] uppercase">
                <span>SPESIMEN EDITORIAL LIVE</span>
                <span>RASIO KONTRAS {contrastRatio.toFixed(2)} : 1</span>
              </div>

              <div className="py-8 space-y-4">
                <p className="font-serif text-2xl sm:text-4xl md:text-5xl font-light leading-tight">
                  Nuansa espresso &amp; obsidian dengan{' '}
                  <span className="italic">keterbacaan presisi</span>.
                </p>
                <p className="font-sans text-[15px] sm:text-base opacity-90 max-w-xl leading-relaxed">
                  Menjaga rasio luminansi secara presisi memastikan karakter editorial tetap
                  nyaman dibaca pada permukaan gelap maupun terang.
                </p>
              </div>

              <div className="pt-4 border-t border-current/20 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] tracking-[0.18em] uppercase">
                <span>STATUS WCAG</span>
                <span className="font-semibold">{contrastGrade}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
