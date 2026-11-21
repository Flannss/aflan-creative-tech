import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useCanHoverFine } from '@/hooks/useMediaQuery';

/**
 * Refined editorial trailing cursor aura for pointer-fine desktop devices.
 * - Demand-driven requestAnimationFrame loop: sleeps at 0% CPU when pointer settles or leaves.
 * - Preserves native cursor for accessibility and precision.
 * - Automatically disabled on coarse touch pointers and reduced-motion settings.
 */
export const CustomCursor: React.FC = () => {
  const canHoverFine = useCanHoverFine();
  const prefersReducedMotion = useReducedMotion();
  const enabled = canHoverFine && !prefersReducedMotion;

  const ringRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let targetX = -120;
    let targetY = -120;
    let currentX = -120;
    let currentY = -120;
    let visible = false;
    let rafId = 0;

    const ring = ringRef.current;
    const label = labelRef.current;

    const setCursorMode = (mode: 'default' | 'interactive' | 'labeled', text = '') => {
      if (!ring || !label) return;
      ring.dataset.mode = mode;
      label.textContent = text;
    };

    const tick = () => {
      rafId = 0;
      const dx = targetX - currentX;
      const dy = targetY - currentY;
      currentX += dx * 0.18;
      currentY += dy * 0.18;

      if (ring) {
        ring.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      }

      if (visible && (Math.abs(dx) > 0.15 || Math.abs(dy) > 0.15)) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    const scheduleTick = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    const handleMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!visible && ring) {
        visible = true;
        currentX = targetX;
        currentY = targetY;
        ring.style.opacity = '1';
      }

      const target = e.target as HTMLElement | null;
      const labeledEl = target?.closest<HTMLElement>('[data-cursor]');
      if (labeledEl && labeledEl.dataset.cursor) {
        setCursorMode('labeled', labeledEl.dataset.cursor);
      } else if (target?.closest('a, button, input, textarea, select, [role="button"]')) {
        setCursorMode('interactive', '');
      } else {
        setCursorMode('default', '');
      }

      scheduleTick();
    };

    const handleLeave = () => {
      visible = false;
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
      if (ring) {
        ring.style.opacity = '0';
      }
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    document.addEventListener('pointerleave', handleLeave);

    return () => {
      window.removeEventListener('pointermove', handleMove);
      document.removeEventListener('pointerleave', handleLeave);
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={ringRef}
      aria-hidden="true"
      data-mode="default"
      style={{ opacity: 0 }}
      className="pointer-events-none fixed top-0 left-0 z-75 flex size-7 items-center justify-center rounded-full border border-champagne/55 bg-transparent transition-[width,height,background-color,border-color,opacity] duration-200 ease-out data-[mode=interactive]:size-10 data-[mode=interactive]:border-champagne/85 data-[mode=interactive]:bg-champagne/10 data-[mode=labeled]:h-8 data-[mode=labeled]:w-auto data-[mode=labeled]:border-champagne/75 data-[mode=labeled]:bg-espresso/95 data-[mode=labeled]:px-3.5 data-[mode=labeled]:shadow-lg"
    >
      <span
        ref={labelRef}
        className="font-mono text-[10px] tracking-[0.22em] uppercase text-champagne whitespace-nowrap"
      />
    </div>
  );
};
