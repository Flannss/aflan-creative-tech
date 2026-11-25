import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useCanHoverFine } from '@/hooks/useMediaQuery';

interface KineticWaveFieldProps {
  active?: boolean;
  className?: string;
}

const WAVE_STYLES = [
  { amp: 20, freq: 1.55, speed: 0.42, stroke: 'rgba(223, 201, 168, 0.14)', width: 1.0 },
  { amp: 26, freq: 1.9, speed: 0.55, stroke: 'rgba(176, 135, 94, 0.16)', width: 1.1 },
  { amp: 16, freq: 2.2, speed: 0.36, stroke: 'rgba(110, 79, 58, 0.22)', width: 0.9 },
  { amp: 24, freq: 1.45, speed: 0.48, stroke: 'rgba(223, 201, 168, 0.11)', width: 0.85 },
  { amp: 18, freq: 2.05, speed: 0.62, stroke: 'rgba(176, 135, 94, 0.12)', width: 0.95 },
] as const;

/**
 * Flowing Silk Current / Wave Ribbons for the Home Hero backdrop:
 * - Waits until `active` (`introReady`) is true before starting its RAF loop so intro
 *   hydration remains lightweight.
 * - Caps DPR at 1.5, pauses automatically via `IntersectionObserver` when scrolled
 *   out of view and when the document tab is hidden.
 * - Desktop: bends fluidly around pointer movement; Tablet & Mobile: calm gentle tidal drift.
 */
export const KineticWaveField: React.FC<KineticWaveFieldProps> = ({
  active = true,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canHoverFine = useCanHoverFine();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let rafId = 0;
    let isInView = true;
    let time = 0;
    let lastFrameTime = performance.now();

    const pointer = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      vy: 0,
      active: false,
      lastMoveAt: 0,
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawFrame = (t: number) => {
      ctx.clearRect(0, 0, width, height);

      const interactive = canHoverFine && !prefersReducedMotion;
      const pointerAlive =
        interactive &&
        pointer.active &&
        performance.now() - pointer.lastMoveAt < 2400;

      if (pointerAlive) {
        const nextY = pointer.y + (pointer.targetY - pointer.y) * 0.12;
        pointer.vy = nextY - pointer.y;
        pointer.x += (pointer.targetX - pointer.x) * 0.12;
        pointer.y = nextY;
      } else {
        pointer.vy *= 0.9;
      }

      const segments = width >= 768 ? 18 : 12;

      WAVE_STYLES.forEach((wave, index) => {
        const ratio = (index + 1) / (WAVE_STYLES.length + 1);
        const baseY = height * (0.16 + ratio * 0.66);

        ctx.beginPath();
        const pts: Array<{ x: number; y: number }> = [];

        for (let s = 0; s <= segments; s += 1) {
          const u = s / segments;
          const x = -18 + u * (width + 36);
          let y =
            baseY +
            Math.sin(u * Math.PI * wave.freq + t * wave.speed + index * 1.15) *
              wave.amp +
            Math.cos(u * Math.PI * 0.85 - t * 0.25 + index) * (wave.amp * 0.35);

          if (pointerAlive) {
            const dx = x - pointer.x;
            const dy = y - pointer.y;
            const dist = Math.hypot(dx, dy);
            const radius = 240;
            if (dist < radius) {
              const influence = Math.pow(1 - dist / radius, 1.75);
              const dir = dy >= 0 ? 1 : -1;
              y +=
                dir * influence * 26 +
                Math.max(-18, Math.min(18, pointer.vy * 1.15)) * influence;
            }
          }

          pts.push({ x, y });
        }

        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length - 1; i += 1) {
          const midX = (pts[i].x + pts[i + 1].x) * 0.5;
          const midY = (pts[i].y + pts[i + 1].y) * 0.5;
          ctx.quadraticCurveTo(pts[i].x, pts[i].y, midX, midY);
        }
        const last = pts[pts.length - 1];
        ctx.lineTo(last.x, last.y);

        ctx.strokeStyle = wave.stroke;
        ctx.lineWidth = wave.width;
        ctx.stroke();
      });
    };

    const tick = (now: number) => {
      rafId = 0;
      if (!isInView || document.hidden || prefersReducedMotion) return;

      const dt = Math.min(0.05, (now - lastFrameTime) / 1000);
      lastFrameTime = now;
      time += dt;

      drawFrame(time);
      rafId = window.requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (prefersReducedMotion) {
        drawFrame(0.6);
        return;
      }
      if (!rafId && isInView && !document.hidden) {
        lastFrameTime = performance.now();
        rafId = window.requestAnimationFrame(tick);
      }
    };

    const stopLoop = () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    resize();
    startLoop();

    const handlePointerMove = (e: PointerEvent) => {
      if (!canHoverFine || prefersReducedMotion || e.pointerType !== 'mouse') {
        return;
      }
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      pointer.targetX = e.clientX - rect.left;
      pointer.targetY = e.clientY - rect.top;
      pointer.active = true;
      pointer.lastMoveAt = performance.now();
    };

    const handleVisibility = () => {
      if (document.hidden) {
        stopLoop();
      } else {
        startLoop();
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInView = Boolean(entry?.isIntersecting);
        if (isInView) {
          startLoop();
        } else {
          stopLoop();
        }
      },
      { threshold: 0.02 },
    );
    observer.observe(canvas);

    window.addEventListener('resize', resize, { passive: true });
    if (canHoverFine) {
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
    }
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      stopLoop();
      observer.disconnect();
      window.removeEventListener('resize', resize);
      if (canHoverFine) {
        window.removeEventListener('pointermove', handlePointerMove);
      }
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [active, canHoverFine, prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 w-full h-full ${className}`}
    />
  );
};
