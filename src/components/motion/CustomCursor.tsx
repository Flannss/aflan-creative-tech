import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import { useCanHoverFine } from '@/hooks/useMediaQuery';

const TOOLTIP_OFFSET_X = 28;
const TOOLTIP_OFFSET_Y = 28;
const VIEWPORT_MARGIN = 14;

/**
 * Refined editorial trailing cursor aura + offset pill tooltip for pointer-fine desktop devices.
 * - Subtle ring stays centered on the pointer while pill tooltips ("HUBUNGI", "SENTER", etc.)
 *   are strictly offset by at least +28px on X and Y so they never cover hovered text.
 * - Resets tooltip state on SPA route transitions and window blur so pills never linger.
 * - Demand-driven requestAnimationFrame loop: sleeps at 0% CPU when pointer settles or leaves.
 */
export const CustomCursor: React.FC = () => {
  const { pathname } = useLocation();
  const canHoverFine = useCanHoverFine();
  const prefersReducedMotion = useReducedMotion();
  const enabled = canHoverFine && !prefersReducedMotion;

  const ringRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (ringRef.current) {
      ringRef.current.dataset.mode = 'default';
    }
    if (tooltipRef.current) {
      tooltipRef.current.dataset.visible = 'false';
    }
  }, [pathname]);

  useEffect(() => {
    if (!enabled) return;

    let targetX = -120;
    let targetY = -120;
    let currentX = -120;
    let currentY = -120;
    let visible = false;
    let rafId = 0;

    const ring = ringRef.current;
    const tooltip = tooltipRef.current;
    const label = labelRef.current;

    const positionElements = () => {
      if (ring) {
        ring.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      }

      if (tooltip) {
        const pillWidth = tooltip.offsetWidth || 88;
        const pillHeight = tooltip.offsetHeight || 32;

        let tipX = currentX + TOOLTIP_OFFSET_X;
        let tipY = currentY + TOOLTIP_OFFSET_Y;

        if (tipX + pillWidth > window.innerWidth - VIEWPORT_MARGIN) {
          tipX = Math.max(VIEWPORT_MARGIN, currentX - pillWidth - TOOLTIP_OFFSET_X);
        }
        if (tipY + pillHeight > window.innerHeight - VIEWPORT_MARGIN) {
          tipY = Math.max(VIEWPORT_MARGIN, currentY - pillHeight - TOOLTIP_OFFSET_Y);
        }

        tooltip.style.transform = `translate3d(${tipX}px, ${tipY}px, 0)`;
      }
    };

    const setCursorMode = (mode: 'default' | 'interactive' | 'labeled', text = '') => {
      if (ring) {
        ring.dataset.mode = mode;
      }
      if (tooltip && label) {
        tooltip.dataset.visible = mode === 'labeled' && visible ? 'true' : 'false';
        if (text) {
          label.textContent = text;
        }
      }
    };

    const tick = () => {
      rafId = 0;
      const dx = targetX - currentX;
      const dy = targetY - currentY;
      currentX += dx * 0.22;
      currentY += dy * 0.22;

      positionElements();

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
      if (!visible) {
        visible = true;
        currentX = targetX;
        currentY = targetY;
        if (ring) {
          ring.style.opacity = '1';
        }
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

      positionElements();
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
      if (tooltip) {
        tooltip.dataset.visible = 'false';
      }
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    window.addEventListener('blur', handleLeave);
    document.addEventListener('pointerleave', handleLeave);

    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('blur', handleLeave);
      document.removeEventListener('pointerleave', handleLeave);
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        data-mode="default"
        style={{ opacity: 0 }}
        className="pointer-events-none fixed top-0 left-0 z-75 size-7 rounded-full border border-champagne/55 bg-transparent transition-[width,height,background-color,border-color,opacity] duration-200 ease-out data-[mode=interactive]:size-10 data-[mode=interactive]:border-champagne/85 data-[mode=interactive]:bg-champagne/10 data-[mode=labeled]:size-5 data-[mode=labeled]:border-champagne/70 data-[mode=labeled]:bg-champagne/10"
      />
      <div
        ref={tooltipRef}
        aria-hidden="true"
        data-visible="false"
        className="pointer-events-none fixed top-0 left-0 z-75 inline-flex h-8 items-center justify-center rounded-full border border-champagne/75 bg-espresso/95 px-3.5 shadow-lg opacity-0 scale-95 transition-[opacity,scale] duration-150 ease-out data-[visible=true]:opacity-100 data-[visible=true]:scale-100"
      >
        <span
          ref={labelRef}
          className="font-mono text-[10px] tracking-[0.22em] uppercase text-champagne whitespace-nowrap"
        />
      </div>
    </>
  );
};
