import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Compass,
  Eye,
  Magnet,
  Pause,
  Play,
  RotateCcw,
  Sliders,
  Sparkles,
} from 'lucide-react';
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

const MAGNETIC_NODES = [
  {
    id: 'ui-arch',
    code: '01',
    label: 'UI Architecture',
    sub: 'Component Precision',
  },
  {
    id: 'motion-craft',
    code: '02',
    label: 'Motion Physics',
    sub: 'Spring Kinematics',
  },
  {
    id: 'optical-grid',
    code: '03',
    label: 'Editorial Grid',
    sub: 'Asymmetric Balance',
  },
  {
    id: 'qa-discipline',
    code: '04',
    label: 'Quality Assurance',
    sub: 'Zero-Defect Flow',
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

/* ============================================================================
   MODULE A — DYNAMIC SPOTLIGHT MASKING STAGE
============================================================================ */
type SpotlightLensMode = 'amber' | 'blueprint' | 'halo';

const DynamicSpotlightStage: React.FC = () => {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const isCoarsePointer = useIsCoarsePointer();

  const [radius, setRadius] = useState<number>(175);
  const [lensMode, setLensMode] = useState<SpotlightLensMode>('amber');
  const [autoSweep, setAutoSweep] = useState<boolean>(false);
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  useEffect(() => {
    if (!autoSweep || prefersReducedMotion) return;
    let rafId = 0;
    const start = performance.now();

    const step = (now: number) => {
      const elapsed = (now - start) * 0.0014;
      const x = 50 + Math.sin(elapsed) * 34;
      const y = 50 + Math.sin(elapsed * 2) * 24;
      setCoords({ x, y });
      rafId = window.requestAnimationFrame(step);
    };

    rafId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(rafId);
  }, [autoSweep, prefersReducedMotion]);

  const updatePointerCoords = (clientX: number, clientY: number) => {
    const el = stageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
    setCoords({ x, y });
  };

  const maskGradient = `radial-gradient(circle ${radius}px at ${coords.x.toFixed(1)}% ${coords.y.toFixed(1)}%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.86) 52%, rgba(0,0,0,0) 100%)`;

  const lensAccentStyle = {
    amber:
      'radial-gradient(circle at center, rgba(216,195,165,0.25) 0%, rgba(118,86,65,0.12) 55%, transparent 100%)',
    blueprint:
      'radial-gradient(circle at center, rgba(245,240,232,0.22) 0%, rgba(216,195,165,0.15) 55%, transparent 100%)',
    halo:
      'radial-gradient(circle at center, transparent 35%, rgba(216,195,165,0.32) 62%, transparent 100%)',
  }[lensMode];

  return (
    <div className="space-y-5">
      <div
        ref={stageRef}
        onPointerMove={(e) => {
          if (autoSweep) setAutoSweep(false);
          updatePointerCoords(e.clientX, e.clientY);
        }}
        onClick={(e) => updatePointerCoords(e.clientX, e.clientY)}
        data-cursor="SENTER"
        role="region"
        aria-label="Kanvas Dynamic Spotlight. Arahkan kursor atau sentuh area untuk menyinari lapisan arsitektur tipografi yang tersembunyi."
        className="relative min-h-[340px] sm:min-h-[410px] border border-champagne/30 bg-obsidian overflow-hidden select-none cursor-crosshair"
      >
        {/* Base Dimmed Architectural Layer (Always faintly visible) */}
        <div className="absolute inset-0 p-6 sm:p-10 lg:p-12 flex flex-col justify-between opacity-20 pointer-events-none">
          <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.24em] uppercase text-taupe">
            <span>LAYER 00 · DORMANT SUBSTRATE</span>
            <span>7.4244° S · 109.2302° E</span>
          </div>
          <div className="my-auto space-y-3">
            <p className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light uppercase tracking-[0.08em] text-taupe/60">
              AFLAN MU&apos;AFA DZULFIQAR
            </p>
            <p className="font-mono text-xs tracking-[0.22em] uppercase text-taupe/50">
              ARAHKAN SENTER UNTUK MENGUNGKAP ARSITEKTUR EDITORIAL
            </p>
          </div>
          <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.2em] uppercase text-taupe">
            <span>MASKING ENGINE · CSS RADIAL COMPOSITE</span>
            <span>AMDZ · LIVE</span>
          </div>
        </div>

        {/* Illuminated Hidden Layer (Revealed by Cursor Spotlight Mask) */}
        <div
          className="absolute inset-0 p-6 sm:p-10 lg:p-12 flex flex-col justify-between bg-espresso text-ivory pointer-events-none"
          style={{
            WebkitMaskImage: maskGradient,
            maskImage: maskGradient,
          }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(216,195,165,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(216,195,165,0.35) 1px, transparent 1px)',
              backgroundSize: '36px 36px',
            }}
          />

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] tracking-[0.24em] uppercase text-champagne">
            <span>LAYER 01 · ILLUMINATED DOSSIER</span>
            <span>
              BEAM X:{coords.x.toFixed(0)}% · Y:{coords.y.toFixed(0)}% · R:{radius}PX
            </span>
          </div>

          <div className="relative z-10 my-auto space-y-4">
            <p className="font-mono text-[11px] tracking-[0.28em] uppercase text-champagne">
              HIDDEN EDITORIAL MANIFESTO · REVEALED
            </p>
            <p className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light leading-[1.04] text-ivory">
              Di balik permukaan gelap terdapat{' '}
              <span className="italic text-champagne">struktur kode, presisi QA,</span>{' '}
              dan komposisi tipografi yang terukur.
            </p>
            <div className="flex flex-wrap gap-2.5 pt-2 font-mono text-[10px] tracking-[0.2em] uppercase">
              <span className="px-3 py-1 bg-obsidian/80 border border-champagne/40 text-champagne">
                AFLAN MU&apos;AFA DZULFIQAR
              </span>
              <span className="px-3 py-1 bg-obsidian/80 border border-champagne/40 text-ivory">
                CREATIVE TECHNOLOGIST
              </span>
              <span className="px-3 py-1 bg-obsidian/80 border border-champagne/40 text-champagne">
                PURWOKERTO · INDONESIA
              </span>
            </div>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] tracking-[0.22em] uppercase text-champagne/90">
            <span>DYNAMIC MASKING · ZERO-LATENCY POINTER TRACKING</span>
            <span>MODE: {lensMode.toUpperCase()}</span>
          </div>
        </div>

        {/* Optical Halo Ring Following Spotlight Center */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-champagne/35 transition-[width,height] duration-150"
          style={{
            left: `${coords.x}%`,
            top: `${coords.y}%`,
            width: `${radius * 1.85}px`,
            height: `${radius * 1.85}px`,
            background: lensAccentStyle,
          }}
        />
      </div>

      {/* Spotlight Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-obsidian/70 border border-champagne/20 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setAutoSweep((prev) => !prev)}
            aria-pressed={autoSweep}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-mono text-[11px] tracking-[0.16em] uppercase border transition-colors ${
              autoSweep
                ? 'bg-champagne text-obsidian border-champagne font-medium'
                : 'bg-espresso text-ivory border-champagne/35 hover:border-champagne'
            }`}
          >
            <Eye className="size-3.5" aria-hidden="true" />
            {autoSweep
              ? 'Sapuan Otomatis: Aktif'
              : isCoarsePointer
                ? 'Jalankan Sapuan Senter'
                : 'Sapuan Otomatis'}
          </button>

          {(['amber', 'blueprint', 'halo'] as SpotlightLensMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setLensMode(mode)}
              aria-pressed={lensMode === mode}
              className={`px-3.5 py-2 rounded-full font-mono text-[10px] tracking-[0.16em] uppercase border transition-colors ${
                lensMode === mode
                  ? 'bg-ivory text-obsidian border-ivory font-medium'
                  : 'bg-transparent text-taupe border-champagne/20 hover:text-ivory'
              }`}
            >
              Lensa: {mode}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-3 font-mono text-[11px] tracking-[0.18em] uppercase text-champagne">
          <span>Radius Senter: {radius}px</span>
          <input
            type="range"
            min={95}
            max={290}
            step={5}
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="accent-champagne w-28 sm:w-36"
          />
        </label>
      </div>
    </div>
  );
};

/* ============================================================================
   MODULE B — MULTI-NODE MAGNETIC CURSOR UI PLAYGROUND
============================================================================ */
const MagneticCursorPlayground: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const isCoarsePointer = useIsCoarsePointer();

  const [pullStrength, setPullStrength] = useState<number>(0.38);
  const [activeNodeId, setActiveNodeId] = useState<string>('NONE');
  const [offsets, setOffsets] = useState<Record<string, { x: number; y: number }>>({});
  const pulseTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (pulseTimerRef.current !== null) {
        window.clearTimeout(pulseTimerRef.current);
      }
    };
  }, []);

  const handleNodeMove = (
    id: string,
    e: React.PointerEvent<HTMLButtonElement | HTMLDivElement>,
  ) => {
    if (prefersReducedMotion || isCoarsePointer) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = (e.clientX - centerX) * pullStrength;
    const dy = (e.clientY - centerY) * pullStrength;

    setActiveNodeId(id.toUpperCase());
    setOffsets((prev) => ({
      ...prev,
      [id]: {
        x: Math.max(-36, Math.min(36, dx)),
        y: Math.max(-36, Math.min(36, dy)),
      },
    }));
  };

  const resetNode = (id: string) => {
    setActiveNodeId('IDLE');
    setOffsets((prev) => ({
      ...prev,
      [id]: { x: 0, y: 0 },
    }));
  };

  const triggerTouchPulse = (id: string) => {
    setActiveNodeId(id.toUpperCase());
    setOffsets((prev) => ({
      ...prev,
      [id]: { x: 0, y: -12 },
    }));
    if (pulseTimerRef.current !== null) {
      window.clearTimeout(pulseTimerRef.current);
    }
    pulseTimerRef.current = window.setTimeout(() => {
      setOffsets((prev) => ({
        ...prev,
        [id]: { x: 0, y: 0 },
      }));
    }, 260);
  };

  const currentVector = offsets[activeNodeId.toLowerCase()] ?? { x: 0, y: 0 };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* Left 4 Magnetic Interactive Nodes */}
        <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {MAGNETIC_NODES.map((node) => {
            const pos = offsets[node.id] ?? { x: 0, y: 0 };
            return (
              <div
                key={node.id}
                className="relative bg-offwhite border border-espresso/15 p-5 flex items-center justify-center min-h-[145px]"
              >
                <motion.button
                  type="button"
                  onPointerMove={(e) => handleNodeMove(node.id, e)}
                  onPointerLeave={() => resetNode(node.id)}
                  onClick={() => triggerTouchPulse(node.id)}
                  animate={{ x: pos.x, y: pos.y }}
                  transition={{ type: 'spring', stiffness: 240, damping: 16, mass: 0.7 }}
                  data-cursor="MAGNET"
                  className="w-full p-4 bg-espresso text-ivory border border-champagne/30 hover:border-champagne shadow-lg text-left transition-colors"
                >
                  <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.22em] uppercase text-champagne mb-2">
                    <span>NODE {node.code}</span>
                    <Magnet className="size-3.5" aria-hidden="true" />
                  </div>
                  <p className="font-serif text-2xl font-light text-ivory leading-tight">
                    {node.label}
                  </p>
                  <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-taupe mt-1">
                    {node.sub}
                  </p>
                </motion.button>
              </div>
            );
          })}
        </div>

        {/* Right Centerpiece Magnetic Core Seal */}
        <div
          onPointerMove={(e) => handleNodeMove('amdz-core', e)}
          onPointerLeave={() => resetNode('amdz-core')}
          onClick={() => triggerTouchPulse('amdz-core')}
          className="md:col-span-5 min-h-[300px] bg-espresso text-ivory border border-espresso p-7 sm:p-8 flex flex-col items-center justify-between text-center cursor-pointer"
        >
          <div className="w-full flex items-center justify-between font-mono text-[10px] tracking-[0.22em] uppercase text-champagne">
            <span>MAGNETIC CORE · AMDZ</span>
            <span>NODE: {activeNodeId}</span>
          </div>

          <motion.div
            animate={{
              x: offsets['amdz-core']?.x ?? 0,
              y: offsets['amdz-core']?.y ?? 0,
            }}
            transition={{ type: 'spring', stiffness: 210, damping: 15 }}
            data-cursor="TARIK"
            className="size-32 rounded-full border border-champagne/50 bg-obsidian/80 flex flex-col items-center justify-center gap-1 shadow-[0_24px_60px_rgba(0,0,0,0.65)]"
          >
            <MonogramMark size={46} className="text-champagne" />
            <span className="font-mono text-[9px] tracking-[0.24em] uppercase text-taupe">
              PULL ME
            </span>
          </motion.div>

          <div className="w-full pt-3 border-t border-champagne/15 flex items-center justify-between font-mono text-[10px] tracking-[0.18em] uppercase text-taupe">
            <span>
              ΔX: { (offsets['amdz-core']?.x ?? currentVector.x).toFixed(1) }PX
            </span>
            <span>
              ΔY: { (offsets['amdz-core']?.y ?? currentVector.y).toFixed(1) }PX
            </span>
            <span className="text-champagne">
              GAIN: {Math.round(pullStrength * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Magnetic Physics Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-offwhite border border-espresso/15 p-4 sm:p-5">
        <p className="font-sans text-[15px] sm:text-sm text-charcoal/85">
          Gerakkan kursor mendekati tombol untuk merasakan gaya tarik pegas (*magnetic pull*), atau ketuk elemen pada layar sentuh.
        </p>

        <label className="flex items-center gap-3 font-mono text-[11px] tracking-[0.18em] uppercase text-mocha">
          <span>Gaya Tarik: {Math.round(pullStrength * 100)}%</span>
          <input
            type="range"
            min={0.18}
            max={0.65}
            step={0.03}
            value={pullStrength}
            onChange={(e) => setPullStrength(Number(e.target.value))}
            className="accent-espresso w-28 sm:w-36"
          />
        </label>
      </div>
    </div>
  );
};

/* ============================================================================
   MODULE C — WARM CHIAROSCURO PARTICLE CANVAS
============================================================================ */
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

  const [specimenText, setSpecimenText] = useState("AFLAN MU'AFA DZULFIQAR");
  const [tracking, setTracking] = useState(0.08);
  const [fontSize, setFontSize] = useState(54);
  const [italicMode, setItalicMode] = useState(true);
  const [outlineMode, setOutlineMode] = useState(false);

  const [selectedPreset, setSelectedPreset] = useState<(typeof EASING_PRESETS)[number]>(
    EASING_PRESETS[0],
  );
  const [runCount, setRunCount] = useState(0);
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
          <Reveal
            variant="up"
            className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-champagne/15"
          >
            <span className="inline-flex items-center gap-2 font-mono text-[10px] sm:text-[11px] tracking-[0.28em] uppercase text-champagne">
              <Sparkles className="size-3.5" aria-hidden="true" />
              BAB 06 — CREATIVE LAB
            </span>
            <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-taupe">
              06 MODUL INTERAKTIF CREATIVE-TECH
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
                Etalase interaktif Creative-Tech &amp; Interactive UI Implementation—menampilkan{' '}
                <span className="text-champagne">Dynamic Spotlight Masking</span>,{' '}
                <span className="text-champagne">Magnetic Cursor UI</span>, kompositor tipografi
                editorial, kanvas cahaya chiaroscuro, koreografi motion, dan matriks kontras WCAG.
              </p>
            </Reveal>
          </div>

          {/* Quick-Jump Module Index Bar */}
          <div className="mt-10 pt-6 border-t border-champagne/15 flex flex-wrap gap-2">
            {[
              { href: '#lab-spotlight', label: '01 · Dynamic Spotlight' },
              { href: '#lab-magnetic', label: '02 · Magnetic Cursor UI' },
              { href: '#lab-typography', label: '03 · Tipografi Live' },
              { href: '#lab-chiaroscuro', label: '04 · Chiaroscuro Canvas' },
              { href: '#lab-easing', label: '05 · Koreografi Motion' },
              { href: '#lab-contrast', label: '06 · Matriks Kontras' },
            ].map((mod) => (
              <a
                key={mod.href}
                href={mod.href}
                className="px-3.5 py-2 rounded-full bg-espresso/60 border border-champagne/20 font-mono text-[10px] tracking-[0.18em] uppercase text-champagne hover:bg-champagne hover:text-obsidian transition-colors"
              >
                {mod.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* LAB 01 — DYNAMIC SPOTLIGHT MASKING */}
      <section
        id="lab-spotlight"
        className="bg-espresso text-ivory py-16 sm:py-24 lg:py-28 px-6 sm:px-8 lg:px-12 border-b border-champagne/15"
      >
        <div className="max-w-[1440px] mx-auto space-y-8">
          <Reveal variant="up" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.26em] uppercase text-champagne">
                <Compass className="size-3.5" aria-hidden="true" />
                LAB 01 · DYNAMIC SPOTLIGHT · CSS MASK COMPOSITING
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light mt-2">
                Senter Masking Editorial Interaktif
              </h2>
            </div>
            <p className="lg:col-span-5 font-sans text-[15px] sm:text-base lg:text-sm text-ivory/75 leading-relaxed">
              Kursor berfungsi sebagai senter optik yang menembus lapisan gelap untuk mengungkap
              manifesto tipografi dan cetak biru koordinat di baliknya secara real-time.
            </p>
          </Reveal>

          <DynamicSpotlightStage />
        </div>
      </section>

      {/* LAB 02 — MAGNETIC CURSOR UI PLAYGROUND */}
      <section
        id="lab-magnetic"
        className="bg-ivory text-espresso py-16 sm:py-24 lg:py-28 px-6 sm:px-8 lg:px-12 border-b border-espresso/15"
      >
        <div className="max-w-[1440px] mx-auto space-y-8">
          <Reveal variant="up" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.26em] uppercase text-mocha">
                <Magnet className="size-3.5" aria-hidden="true" />
                LAB 02 · MAGNETIC CURSOR UI · SPRING KINEMATICS
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light mt-2">
                Medan Interaksi Magnetik Multi-Elemen
              </h2>
            </div>
            <p className="lg:col-span-5 font-sans text-[15px] sm:text-base lg:text-sm text-charcoal/80 leading-relaxed">
              Setiap kartu dan segel merespons jarak vektor kursor dengan tarikan fisik berbasis
              pegas (*spring physics*), kembali presisi ke titik kesetimbangan saat kursor menjauh.
            </p>
          </Reveal>

          <MagneticCursorPlayground />
        </div>
      </section>

      {/* LAB 03 — TYPOGRAPHY COMPOSITOR */}
      <section
        id="lab-typography"
        className="bg-espresso text-ivory py-16 sm:py-24 lg:py-28 px-6 sm:px-8 lg:px-12 border-b border-champagne/15"
      >
        <div className="max-w-[1440px] mx-auto space-y-8">
          <Reveal variant="up" className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="font-mono text-[11px] tracking-[0.26em] uppercase text-champagne">
                LAB 03 · SPESIMEN TIPOGRAFI
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

      {/* LAB 04 — CHIAROSCURO CANVAS */}
      <section
        id="lab-chiaroscuro"
        className="bg-obsidian text-ivory py-16 sm:py-24 lg:py-28 px-6 sm:px-8 lg:px-12 border-b border-champagne/15"
      >
        <div className="max-w-[1440px] mx-auto space-y-8">
          <Reveal variant="up" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-7">
              <span className="font-mono text-[11px] tracking-[0.26em] uppercase text-champagne">
                LAB 04 · CREATIVE CODING · HTML5 CANVAS
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

      {/* LAB 05 — EASING CHOREOGRAPHY */}
      <section
        id="lab-easing"
        className="bg-ivory text-espresso py-16 sm:py-24 lg:py-28 px-6 sm:px-8 lg:px-12 border-b border-espresso/15"
      >
        <div className="max-w-[1440px] mx-auto space-y-6">
          <div>
            <span className="font-mono text-[11px] tracking-[0.26em] uppercase text-mocha">
              LAB 05 · KOREOGRAFI MOTION
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
      </section>

      {/* LAB 06 — CONTRAST MATRIX */}
      <section
        id="lab-contrast"
        className="bg-chocolate text-ivory py-16 sm:py-24 lg:py-28 px-6 sm:px-8 lg:px-12"
      >
        <div className="max-w-[1440px] mx-auto space-y-8">
          <Reveal variant="up">
            <span className="font-mono text-[11px] tracking-[0.26em] uppercase text-champagne">
              LAB 06 · AKSESIBILITAS DESIGN SYSTEM
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
