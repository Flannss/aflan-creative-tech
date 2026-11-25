import React, { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useReducedMotion,
} from 'framer-motion';
import { Check, Minus, Plus, Sparkles } from 'lucide-react';
import { CopyLinkButton } from '@/components/ui/CopyLinkButton';
import {
  EditorialAccordion,
  type EditorialAccordionItem,
} from '@/components/ui/EditorialAccordion';
import { EASE_LUXURY } from '@/utils/motion';

const QA_CHECKLIST_ITEMS = [
  { id: 'viewport', label: 'Viewport 375px–1440px' },
  { id: 'motion', label: 'Reduced-Motion Fallback' },
  { id: 'lint', label: 'Zero Console Warnings' },
] as const;

const MINI_ACCORDION_ITEMS: EditorialAccordionItem[] = [
  {
    id: 'easing-discipline',
    title: 'Easing Discipline',
    content: (
      <p>
        Kurva tunggal <span className="font-mono text-champagne">cubic-bezier(0.22, 1, 0.36, 1)</span>{' '}
        menjaga ritme bukaan panel tetap konsisten di seluruh rute.
      </p>
    ),
  },
  {
    id: 'touch-ergonomics',
    title: 'Touch Ergonomics',
    content: (
      <p>
        Setiap kontrol memakai tinggi minimal 44px pada perangkat sentuh agar bebas salah tekan.
      </p>
    ),
  },
];

const BURST_PARTICLES = [
  { angle: -90, distance: 34, tone: '#D8C3A5', kind: 'line' },
  { angle: -45, distance: 30, tone: '#F4EFE6', kind: 'dot' },
  { angle: 0, distance: 34, tone: '#D8C3A5', kind: 'line' },
  { angle: 45, distance: 30, tone: '#8A6D4B', kind: 'dot' },
  { angle: 90, distance: 34, tone: '#D8C3A5', kind: 'line' },
  { angle: 135, distance: 30, tone: '#F4EFE6', kind: 'dot' },
  { angle: 180, distance: 34, tone: '#D8C3A5', kind: 'line' },
  { angle: -135, distance: 30, tone: '#8A6D4B', kind: 'dot' },
] as const;

const STEPPER_MIN = 0;
const STEPPER_MAX = 12;

const stepperVariants = {
  enter: (dir: number) => ({ opacity: 0, y: dir > 0 ? 16 : -16 }),
  center: { opacity: 1, y: 0 },
  exit: (dir: number) => ({ opacity: 0, y: dir > 0 ? -16 : 16 }),
};

/**
 * LAB 09 — Tactile Micro-Interactions Deck:
 * Six interactive UI Engineering controls crafted inside the Espresso–Champagne–Ivory palette.
 */
export const TactileInteractionsDeck: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();

  // 01. Toggle Switch
  const [toggleActive, setToggleActive] = useState<boolean>(true);

  // 02. Checkbox Strike
  const [checkedIds, setCheckedIds] = useState<string[]>(['viewport']);

  // 03. Number Stepper (0..12)
  const [stepper, setStepper] = useState<{ value: number; dir: 1 | -1 }>({
    value: 4,
    dir: 1,
  });
  const [boundHit, setBoundHit] = useState<'MIN' | 'MAX' | null>(null);
  const stepperShake = useAnimationControls();
  const boundTimerRef = useRef<number | null>(null);

  // 06. Editorial Appreciation Burst
  const [appreciations, setAppreciations] = useState<number>(0);
  const [burstId, setBurstId] = useState<number>(0);
  const [showBurst, setShowBurst] = useState<boolean>(false);
  const burstTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (boundTimerRef.current !== null) window.clearTimeout(boundTimerRef.current);
      if (burstTimerRef.current !== null) window.clearTimeout(burstTimerRef.current);
    };
  }, []);

  const toggleChecklistItem = (id: string) => {
    setCheckedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const triggerBoundaryFeedback = (edge: 'MIN' | 'MAX') => {
    setBoundHit(edge);
    if (!prefersReducedMotion) {
      void stepperShake.start({
        x: [0, -5, 5, -3, 3, 0],
        transition: { duration: 0.32, ease: EASE_LUXURY },
      });
    }
    if (boundTimerRef.current !== null) window.clearTimeout(boundTimerRef.current);
    boundTimerRef.current = window.setTimeout(() => {
      setBoundHit(null);
      boundTimerRef.current = null;
    }, 1100);
  };

  const stepValue = (delta: 1 | -1) => {
    const next = stepper.value + delta;
    if (next < STEPPER_MIN) {
      triggerBoundaryFeedback('MIN');
      return;
    }
    if (next > STEPPER_MAX) {
      triggerBoundaryFeedback('MAX');
      return;
    }
    setBoundHit(null);
    setStepper({ value: next, dir: delta });
  };

  const triggerAppreciation = () => {
    setAppreciations((c) => c + 1);
    if (prefersReducedMotion) return;
    setBurstId((id) => id + 1);
    setShowBurst(true);
    if (burstTimerRef.current !== null) window.clearTimeout(burstTimerRef.current);
    burstTimerRef.current = window.setTimeout(() => {
      setShowBurst(false);
      burstTimerRef.current = null;
    }, 640);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
      {/* 01 · TOGGLE SWITCH */}
      <div className="bg-obsidian/85 border border-champagne/20 p-5 sm:p-6 flex flex-col justify-between gap-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2 font-mono text-[10px] tracking-[0.2em] uppercase">
            <span className="text-champagne">01 · TOGGLE SWITCH</span>
            <span className={toggleActive ? 'text-champagne' : 'text-taupe'}>
              {toggleActive ? 'ACTIVE' : 'STANDBY'}
            </span>
          </div>
          <h3 className="font-serif text-xl font-light text-ivory">
            Saklar Editorial Spring
          </h3>
          <p className="font-sans text-xs sm:text-sm text-ivory/75 leading-relaxed">
            Saklar taktil dengan transisi thumb berbasis layout spring dan indikator status langsung.
          </p>
        </div>

        <div className="pt-4 border-t border-champagne/15 flex items-center justify-between gap-3">
          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-taupe">
            {toggleActive ? 'EDITORIAL MODE: ACTIVE' : 'EDITORIAL MODE: STANDBY'}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={toggleActive}
            aria-label="Toggle Editorial Mode"
            onClick={() => setToggleActive((prev) => !prev)}
            className="inline-flex items-center min-h-[44px] px-1 cursor-pointer focus-visible:outline-2 focus-visible:outline-champagne rounded-full"
          >
            <span
              className={`relative flex items-center w-14 h-8 p-1 rounded-full border transition-colors duration-300 ${
                toggleActive
                  ? 'bg-champagne border-champagne justify-end'
                  : 'bg-espresso border-champagne/30 justify-start'
              }`}
            >
              <motion.span
                layout
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { type: 'spring', stiffness: 420, damping: 28 }
                }
                className={`size-6 rounded-full shadow-sm ${
                  toggleActive ? 'bg-obsidian' : 'bg-champagne'
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* 02 · CHECKBOX STRIKE */}
      <div className="bg-obsidian/85 border border-champagne/20 p-5 sm:p-6 flex flex-col justify-between gap-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2 font-mono text-[10px] tracking-[0.2em] uppercase">
            <span className="text-champagne">02 · CHECKBOX STRIKE</span>
            <span className="text-taupe">
              {checkedIds.length}/{QA_CHECKLIST_ITEMS.length} SELESAI
            </span>
          </div>
          <h3 className="font-serif text-xl font-light text-ivory">
            Mini QA Checklist
          </h3>
        </div>

        <div className="space-y-1.5">
          {QA_CHECKLIST_ITEMS.map((item) => {
            const checked = checkedIds.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                role="checkbox"
                aria-checked={checked}
                onClick={() => toggleChecklistItem(item.id)}
                className="w-full min-h-[44px] px-3 py-2 bg-espresso/60 border border-champagne/15 hover:border-champagne/45 flex items-center gap-3 text-left transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-champagne"
              >
                <span
                  aria-hidden="true"
                  className={`shrink-0 size-5 rounded border flex items-center justify-center transition-colors duration-200 ${
                    checked
                      ? 'bg-champagne border-champagne text-obsidian'
                      : 'border-champagne/35 text-transparent'
                  }`}
                >
                  <Check className="size-3.5 stroke-[2.5]" />
                </span>

                <span className="relative inline-block font-sans text-xs sm:text-sm text-ivory/90">
                  <span className={checked ? 'text-ivory/50 transition-colors' : ''}>
                    {item.label}
                  </span>
                  <motion.span
                    aria-hidden="true"
                    initial={false}
                    animate={{ scaleX: checked ? 1 : 0 }}
                    transition={
                      prefersReducedMotion
                        ? { duration: 0.1 }
                        : { duration: 0.32, ease: EASE_LUXURY }
                    }
                    className="pointer-events-none absolute left-0 right-0 top-1/2 h-[1.5px] origin-left bg-champagne"
                  />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 03 · NUMBER STEPPER */}
      <div className="bg-obsidian/85 border border-champagne/20 p-5 sm:p-6 flex flex-col justify-between gap-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2 font-mono text-[10px] tracking-[0.2em] uppercase">
            <span className="text-champagne">03 · NUMBER STEPPER</span>
            <span className={boundHit ? 'text-champagne' : 'text-taupe'}>
              {boundHit ? `BATAS ${boundHit}` : `RANGE ${STEPPER_MIN}–${STEPPER_MAX}`}
            </span>
          </div>
          <h3 className="font-serif text-xl font-light text-ivory">
            Odometer &amp; Boundary Shake
          </h3>
          <p className="font-sans text-xs sm:text-sm text-ivory/75 leading-relaxed">
            Angka bergulir vertikal serta getaran halus saat menyentuh batas minimum atau maksimum.
          </p>
        </div>

        <motion.div
          animate={stepperShake}
          className="pt-4 border-t border-champagne/15 flex items-center justify-between gap-3 will-change-transform"
        >
          <button
            type="button"
            onClick={() => stepValue(-1)}
            aria-label="Kurangi nilai stepper"
            className="size-11 rounded-full border border-champagne/30 bg-espresso/75 flex items-center justify-center text-champagne hover:bg-champagne hover:text-obsidian active:scale-95 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-champagne"
          >
            <Minus className="size-4" aria-hidden="true" />
          </button>

          <div className="relative h-10 w-16 overflow-hidden flex items-center justify-center">
            <AnimatePresence mode="wait" initial={false} custom={stepper.dir}>
              <motion.span
                key={stepper.value}
                custom={stepper.dir}
                variants={prefersReducedMotion ? undefined : stepperVariants}
                initial={prefersReducedMotion ? { opacity: 0 } : 'enter'}
                animate={prefersReducedMotion ? { opacity: 1 } : 'center'}
                exit={prefersReducedMotion ? { opacity: 0 } : 'exit'}
                transition={{ duration: 0.2, ease: EASE_LUXURY }}
                className="font-serif text-3xl text-ivory tabular-nums"
              >
                {String(stepper.value).padStart(2, '0')}
              </motion.span>
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={() => stepValue(1)}
            aria-label="Tambah nilai stepper"
            className="size-11 rounded-full border border-champagne/30 bg-espresso/75 flex items-center justify-center text-champagne hover:bg-champagne hover:text-obsidian active:scale-95 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-champagne"
          >
            <Plus className="size-4" aria-hidden="true" />
          </button>
        </motion.div>
      </div>

      {/* 04 · ACCORDION EXPAND */}
      <div className="bg-obsidian/85 border border-champagne/20 p-5 sm:p-6 flex flex-col justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2 font-mono text-[10px] tracking-[0.2em] uppercase">
            <span className="text-champagne">04 · ACCORDION EXPAND</span>
            <span className="text-taupe">SMOOTH PANEL</span>
          </div>
          <h3 className="font-serif text-xl font-light text-ivory">
            Mini Panel Lipat Editorial
          </h3>
        </div>

        <EditorialAccordion
          items={MINI_ACCORDION_ITEMS}
          surface="dark"
          defaultOpenIds={['easing-discipline']}
        />
      </div>

      {/* 05 · COPY LINK MORPH */}
      <div className="bg-obsidian/85 border border-champagne/20 p-5 sm:p-6 flex flex-col justify-between gap-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2 font-mono text-[10px] tracking-[0.2em] uppercase">
            <span className="text-champagne">05 · COPY LINK MORPH</span>
            <span className="text-taupe">CLIPBOARD + TOAST</span>
          </div>
          <h3 className="font-serif text-xl font-light text-ivory">
            Morph Ikon &amp; Global Toast
          </h3>
          <p className="font-sans text-xs sm:text-sm text-ivory/75 leading-relaxed">
            Menyalin tautan modul Lab disertai transisi ikon Link ke Check dan Toast Drop global.
          </p>
        </div>

        <div className="pt-4 border-t border-champagne/15 space-y-3">
          <div className="px-3 py-2 bg-espresso/70 border border-champagne/15 font-mono text-[10px] tracking-[0.12em] text-champagne/90 truncate">
            https://aflandossier.vercel.app/lab#lab-micro
          </div>
          <CopyLinkButton
            url="https://aflandossier.vercel.app/lab#lab-micro"
            label="Copy Lab URL"
            copiedLabel="Tersalin"
            toastTitle="Tautan Lab Tersalin"
            surface="dark"
            size="sm"
            className="w-full"
          />
        </div>
      </div>

      {/* 06 · EDITORIAL APPRECIATION BURST */}
      <div className="bg-obsidian/85 border border-champagne/20 p-5 sm:p-6 flex flex-col justify-between gap-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2 font-mono text-[10px] tracking-[0.2em] uppercase">
            <span className="text-champagne">06 · APPRECIATION BURST</span>
            <span className="text-taupe">LOCAL COUNTER</span>
          </div>
          <h3 className="font-serif text-xl font-light text-ivory">
            Ledakan Partikel Champagne
          </h3>
          <p className="font-sans text-xs sm:text-sm text-ivory/75 leading-relaxed">
            Simpul apresiasi geometris dengan pancaran garis tipis Champagne dan Ivory, lengkap dengan penghitung sesi lokal.
          </p>
        </div>

        <div className="pt-4 border-t border-champagne/15 flex items-center justify-between gap-4">
          <div className="relative inline-flex items-center justify-center">
            <AnimatePresence>
              {showBurst && !prefersReducedMotion && (
                <div
                  key={burstId}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 flex items-center justify-center"
                >
                  {BURST_PARTICLES.map((particle, idx) => {
                    const rad = (particle.angle * Math.PI) / 180;
                    const tx = Math.cos(rad) * particle.distance;
                    const ty = Math.sin(rad) * particle.distance;
                    return (
                      <motion.span
                        key={`${burstId}-${idx}`}
                        initial={{ x: 0, y: 0, opacity: 0.95, scale: 0.6 }}
                        animate={{ x: tx, y: ty, opacity: 0, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.58, ease: EASE_LUXURY }}
                        style={{
                          backgroundColor: particle.tone,
                          rotate: particle.kind === 'line' ? particle.angle : 0,
                        }}
                        className={
                          particle.kind === 'line'
                            ? 'absolute w-2.5 h-[1.5px] rounded-full'
                            : 'absolute size-1.5 rounded-full'
                        }
                      />
                    );
                  })}
                </div>
              )}
            </AnimatePresence>

            <motion.button
              type="button"
              onClick={triggerAppreciation}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.92 }}
              aria-label={`Beri apresiasi editorial (saat ini ${appreciations})`}
              className="relative z-10 inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-full bg-champagne text-obsidian font-mono text-[10px] tracking-[0.18em] uppercase font-medium hover:bg-ivory transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-champagne"
            >
              <Sparkles className="size-3.5" aria-hidden="true" />
              <span>Apresiasi</span>
            </motion.button>
          </div>

          <div className="text-right">
            <span className="block font-mono text-[9px] tracking-[0.2em] uppercase text-taupe">
              SESI LOKAL
            </span>
            <span className="font-serif text-2xl text-champagne tabular-nums">
              {String(appreciations).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
