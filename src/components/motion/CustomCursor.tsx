import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import { useCanHoverFine } from '@/hooks/useMediaQuery';

type CursorMode = 'default' | 'interactive' | 'labeled' | 'hidden';

/**
 * Luminous Ivory Architectural Reticle custom cursor for fine-pointer Desktop devices.
 * - Crisp Luminous Ivory (#F4EFE6) with `mix-blend-difference` on diamond core & velocity-reactive outer ring.
 * - Contextual morphs:
 *   - `labeled` (`[data-cursor-label]` / `[data-cursor]`): high-contrast solid Ivory capsule lens with sharp Obsidian text.
 *   - `interactive` (buttons, links, controls): locks outer ring into precision corner-bracketed frame reticle.
 *   - `hidden`: steps back smoothly over text inputs, textareas, selects, or when pointer leaves window.
 * - Zero React state updates on pointermove (pure 60fps RAF + DOM refs), disabled on touch/reduced-motion.
 */
export const CustomCursor: React.FC = () => {
  const { pathname } = useLocation();
  const canHoverFine = useCanHoverFine();
  const prefersReducedMotion = useReducedMotion();
  const enabled = canHoverFine && !prefersReducedMotion;

  const coreRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const lensRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (coreRef.current) coreRef.current.style.opacity = '0';
    if (ringRef.current) {
      ringRef.current.dataset.mode = 'default';
      ringRef.current.style.opacity = '0';
    }
    if (lensRef.current) {
      lensRef.current.dataset.visible = 'false';
      lensRef.current.style.opacity = '0';
    }
  }, [pathname]);

  useEffect(() => {
    const rootEl = document.documentElement;
    if (!enabled) {
      rootEl.classList.remove('aflan-cursor-active');
      return;
    }

    rootEl.classList.add('aflan-cursor-active');

    let targetX = -160;
    let targetY = -160;
    let ringX = -160;
    let ringY = -160;
    let visible = false;
    let pressed = false;
    let currentMode: CursorMode = 'default';
    let rafId = 0;

    const core = coreRef.current;
    const ring = ringRef.current;
    const lens = lensRef.current;
    const label = labelRef.current;

    const applyMode = (mode: CursorMode, text = '') => {
      currentMode = mode;
      const showMain = visible && mode !== 'hidden' && mode !== 'labeled';

      if (core) {
        core.dataset.mode = mode;
        core.style.opacity = showMain ? '1' : '0';
      }
      if (ring) {
        ring.dataset.mode = mode;
        ring.style.opacity = showMain ? '1' : '0';
      }
      if (lens && label) {
        const showLens = visible && mode === 'labeled';
        lens.dataset.visible = showLens ? 'true' : 'false';
        lens.style.opacity = showLens ? '1' : '0';
        if (text) {
          label.textContent = text;
        }
      }
    };

    const render = () => {
      rafId = 0;
      const dx = targetX - ringX;
      const dy = targetY - ringY;
      const settled = Math.abs(dx) <= 0.15 && Math.abs(dy) <= 0.15;

      if (settled) {
        ringX = targetX;
        ringY = targetY;
      } else {
        ringX += dx * 0.22;
        ringY += dy * 0.22;
      }

      const pressScale = pressed ? 0.78 : 1;

      if (core) {
        core.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%) scale(${pressScale})`;
      }

      if (ring) {
        if (currentMode === 'default' && !settled) {
          const speed = Math.hypot(dx, dy);
          const angle = speed > 0.6 ? Math.atan2(dy, dx) * (180 / Math.PI) : 0;
          const stretch = speed > 0.6 ? 1 + Math.min(speed * 0.011, 0.34) : 1;
          const squash = 1 / Math.sqrt(stretch);
          ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) rotate(${angle.toFixed(1)}deg) scale(${(stretch * pressScale).toFixed(3)}, ${(squash * pressScale).toFixed(3)})`;
        } else {
          ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${pressScale})`;
        }
      }

      if (lens) {
        lens.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${pressed ? 0.9 : 1})`;
      }

      if (visible && !settled) {
        rafId = window.requestAnimationFrame(render);
      }
    };

    const scheduleRender = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(render);
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') {
        return;
      }

      targetX = e.clientX;
      targetY = e.clientY;
      if (!visible) {
        visible = true;
        ringX = targetX;
        ringY = targetY;
      }

      const target = e.target as HTMLElement | null;
      const isInputTarget = Boolean(
        target?.closest('input, textarea, select, [contenteditable="true"]'),
      );
      const labeledEl = target?.closest<HTMLElement>('[data-cursor-label], [data-cursor]');
      const isInteractive = Boolean(
        target?.closest(
          'a, button, label, summary, [role="button"], [role="tab"], [role="switch"], [role="checkbox"], [role="link"]',
        ),
      );

      if (isInputTarget) {
        applyMode('hidden');
      } else {
        const customText =
          labeledEl?.dataset.cursorLabel || labeledEl?.dataset.cursor || '';
        if (customText) {
          applyMode('labeled', customText);
        } else if (isInteractive) {
          applyMode('interactive');
        } else {
          applyMode('default');
        }
      }

      render();
      scheduleRender();
    };

    const handlePointerDown = () => {
      pressed = true;
      render();
    };

    const handlePointerUp = () => {
      pressed = false;
      render();
    };

    const handleLeave = () => {
      visible = false;
      pressed = false;
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
      applyMode('hidden');
    };

    const handleMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget) {
        handleLeave();
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    window.addEventListener('blur', handleLeave);
    document.addEventListener('pointerleave', handleLeave);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      rootEl.classList.remove('aflan-cursor-active');
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('blur', handleLeave);
      document.removeEventListener('pointerleave', handleLeave);
      document.removeEventListener('mouseout', handleMouseOut);
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [enabled]);

  if (!enabled || typeof document === 'undefined') return null;

  return createPortal(
    <>
      {/* 1. Core Precision 4-Point Ivory Diamond */}
      <div
        ref={coreRef}
        aria-hidden="true"
        data-mode="default"
        style={{ opacity: 0 }}
        className="pointer-events-none fixed top-0 left-0 z-[9999] mix-blend-difference transition-opacity duration-150 will-change-transform"
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          className="block"
        >
          <path
            d="M5 0.5L6.15 3.85L9.5 5L6.15 6.15L5 9.5L3.85 6.15L0.5 5L3.85 3.85L5 0.5Z"
            fill="#F4EFE6"
          />
        </svg>
      </div>

      {/* 2. Architectural Luminous Ivory Outer Ring / Interactive Reticle Frame */}
      <div
        ref={ringRef}
        aria-hidden="true"
        data-mode="default"
        style={{ opacity: 0 }}
        className="pointer-events-none fixed top-0 left-0 z-[9999] size-[34px] rounded-full border border-[#F4EFE6]/85 mix-blend-difference transition-[width,height,border-radius,border-color,opacity] duration-200 ease-out will-change-transform data-[mode=interactive]:size-10 data-[mode=interactive]:rounded-md data-[mode=interactive]:border-[#F4EFE6]/25"
      >
        {/* Architectural corner reticle brackets shown on interactive hover */}
        <span className="opacity-0 in-data-[mode=interactive]:opacity-100 transition-opacity duration-200">
          <span className="absolute -top-px -left-px size-2 border-t-[1.5px] border-l-[1.5px] border-[#F6F1E9]" />
          <span className="absolute -top-px -right-px size-2 border-t-[1.5px] border-r-[1.5px] border-[#F6F1E9]" />
          <span className="absolute -bottom-px -left-px size-2 border-b-[1.5px] border-l-[1.5px] border-[#F6F1E9]" />
          <span className="absolute -bottom-px -right-px size-2 border-b-[1.5px] border-r-[1.5px] border-[#F6F1E9]" />
        </span>
      </div>

      {/* 3. High-Contrast Luminous Ivory Capsule Lens for Contextual Labels */}
      <div
        ref={lensRef}
        aria-hidden="true"
        data-visible="false"
        style={{ opacity: 0 }}
        className="pointer-events-none fixed top-0 left-0 z-[9999] inline-flex items-center justify-center rounded-full bg-[#F6F1E9] text-[#211814] px-4 py-1.5 shadow-[0_14px_34px_rgba(0,0,0,0.45)] ring-1 ring-[#DFC8A6]/65 transition-opacity duration-150 will-change-transform"
      >
        <span
          ref={labelRef}
          className="font-mono text-[10px] font-medium tracking-[0.22em] uppercase whitespace-nowrap"
        />
      </div>
    </>,
    document.body,
  );
};
