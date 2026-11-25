import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useCanHoverFine } from '@/hooks/useMediaQuery';

interface KineticCursorFieldProps {
  variant?: 'gate' | 'hero';
  className?: string;
}

interface KineticNode {
  bx: number;
  by: number;
  phase: number;
  speed: number;
  size: number;
  diamond: boolean;
  tone: string;
  ox: number;
  oy: number;
}

const IDLE_SLEEP_MS = 1200;

/**
 * Lightweight 60fps HTML5 Canvas field rendering ultra-thin architectural silk ribbons
 * and magnetic micro-nodes in Ivory & Champagne.
 * - Desktop fine-pointer: caps DPR at 1.5, bends elastically along pointer velocity,
 *   and auto-sleeps RAF after 1.2s of pointer inactivity (0% idle CPU).
 * - Touch devices (Mobile / Tablet): renders a zero-cost static CSS radial ambient gradient.
 * - Honors `prefers-reduced-motion` (static editorial composition, zero RAF).
 */
export const KineticCursorField: React.FC<KineticCursorFieldProps> = ({
  variant = 'hero',
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canHoverFine = useCanHoverFine();
  const prefersReducedMotion = useReducedMotion();
  const interactive = canHoverFine && !prefersReducedMotion;

  useEffect(() => {
    if (!canHoverFine) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let rafId = 0;
    let isInView = true;
    let time = 0;
    let lastActiveTime = performance.now();

    const pointer = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      vx: 0,
      vy: 0,
      active: false,
    };

    let nodes: KineticNode[] = [];

    const buildNodes = () => {
      const count = 10;
      const tones = [
        'rgba(244, 239, 230, 0.20)',
        'rgba(216, 195, 165, 0.22)',
        'rgba(244, 239, 230, 0.14)',
        'rgba(216, 195, 165, 0.16)',
      ];

      nodes = Array.from({ length: count }, (_, idx) => {
        const bx = (((idx * 37 + 13) % 88) + 6) * 0.01;
        let by = (((idx * 53 + 17) % 84) + 8) * 0.01;
        // Keep the upper-center AFLAN masthead zone clean from floating micro-dots
        if (bx >= 0.22 && bx <= 0.78 && by < 0.4) {
          by = 0.46 + (idx % 3) * 0.08;
        }
        return {
          bx,
          by,
          phase: idx * 0.85,
          speed: 0.45 + (idx % 5) * 0.14,
          size: 1.5 + (idx % 3) * 0.45,
          diamond: idx % 2 === 0,
          tone: tones[idx % tones.length],
          ox: 0,
          oy: 0,
        };
      });
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildNodes();
    };

    const drawRibbon = (index: number, total: number, t: number) => {
      const ratio = (index + 1) / (total + 1);
      const baseY = height * (0.2 + ratio * 0.6);
      const segments = 12;
      const amp = (variant === 'gate' ? 22 : 26) + (index % 2) * 8;
      const freq = 1.65 + index * 0.22;

      const pts: Array<{ x: number; y: number }> = [];
      for (let s = 0; s <= segments; s += 1) {
        const u = s / segments;
        const x = -24 + u * (width + 48);
        let y =
          baseY +
          Math.sin(u * Math.PI * freq + t * (0.65 + index * 0.12) + index) * amp;

        if (pointer.active && interactive) {
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const dist = Math.hypot(dx, dy);
          const radius = 250;
          if (dist < radius) {
            const influence = Math.pow(1 - dist / radius, 1.8);
            const sign = dy >= 0 ? 1 : -1;
            y +=
              sign * influence * 32 +
              Math.max(-22, Math.min(22, pointer.vy * 1.1)) * influence;
          }
        }
        pts.push({ x, y });
      }

      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length - 1; i += 1) {
        const midX = (pts[i].x + pts[i + 1].x) * 0.5;
        const midY = (pts[i].y + pts[i + 1].y) * 0.5;
        ctx.quadraticCurveTo(pts[i].x, pts[i].y, midX, midY);
      }
      const last = pts[pts.length - 1];
      ctx.lineTo(last.x, last.y);

      const isIvory = index % 2 === 0;
      ctx.strokeStyle = isIvory
        ? 'rgba(244, 239, 230, 0.095)'
        : 'rgba(216, 195, 165, 0.145)';
      ctx.lineWidth = isIvory ? 0.9 : 1.05;
      ctx.stroke();
    };

    const drawDiamond = (cx: number, cy: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(cx, cy - r * 1.45);
      ctx.lineTo(cx + r * 1.45, cy);
      ctx.lineTo(cx, cy + r * 1.45);
      ctx.lineTo(cx - r * 1.45, cy);
      ctx.closePath();
      ctx.fill();
    };

    const drawFrame = () => {
      rafId = 0;
      if (width <= 0 || height <= 0) return;

      ctx.clearRect(0, 0, width, height);

      const now = performance.now();
      const idleElapsed = now - lastActiveTime;
      const shouldStep = interactive && idleElapsed < IDLE_SLEEP_MS;

      if (shouldStep) {
        time += 0.011;
      }

      let maxDelta = 0;
      if (interactive) {
        const prevX = pointer.x;
        const prevY = pointer.y;
        const dxTarget = pointer.targetX - pointer.x;
        const dyTarget = pointer.targetY - pointer.y;
        pointer.x += dxTarget * 0.16;
        pointer.y += dyTarget * 0.16;
        pointer.vx = (pointer.x - prevX) * 0.85 + pointer.vx * 0.15;
        pointer.vy = (pointer.y - prevY) * 0.85 + pointer.vy * 0.15;
        maxDelta = Math.max(maxDelta, Math.abs(dxTarget), Math.abs(dyTarget));
      }

      const ribbonCount = 3;
      for (let r = 0; r < ribbonCount; r += 1) {
        drawRibbon(r, ribbonCount, time);
      }

      const resolvedNodes: Array<{ x: number; y: number; node: KineticNode }> = [];
      for (const node of nodes) {
        const baseX =
          node.bx * width +
          (prefersReducedMotion ? 0 : Math.sin(time * node.speed + node.phase) * 12);
        const baseY =
          node.by * height +
          (prefersReducedMotion ? 0 : Math.cos(time * node.speed * 0.9 + node.phase) * 10);

        if (interactive && pointer.active && idleElapsed < IDLE_SLEEP_MS) {
          const dx = baseX - pointer.x;
          const dy = baseY - pointer.y;
          const dist = Math.hypot(dx, dy) || 1;
          const radius = 185;
          if (dist < radius) {
            const pull = (1 - dist / radius) * 24;
            const targetOx = (dx / dist) * pull + pointer.vx * 0.6;
            const targetOy = (dy / dist) * pull + pointer.vy * 0.6;
            node.ox += (targetOx - node.ox) * 0.16;
            node.oy += (targetOy - node.oy) * 0.16;
          } else {
            node.ox *= 0.88;
            node.oy *= 0.88;
          }
        } else {
          node.ox *= 0.88;
          node.oy *= 0.88;
        }

        maxDelta = Math.max(maxDelta, Math.abs(node.ox), Math.abs(node.oy));

        const nx = baseX + node.ox;
        const ny = baseY + node.oy;
        resolvedNodes.push({ x: nx, y: ny, node });

        ctx.fillStyle = node.tone;
        if (node.diamond) {
          drawDiamond(nx, ny, node.size);
        } else {
          ctx.beginPath();
          ctx.arc(nx, ny, node.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (interactive && pointer.active) {
        for (const item of resolvedNodes) {
          const dist = Math.hypot(item.x - pointer.x, item.y - pointer.y);
          if (dist < 165) {
            const alpha = (1 - dist / 165) * 0.16;
            ctx.strokeStyle = `rgba(244, 239, 230, ${alpha.toFixed(3)})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(item.x, item.y);
            ctx.lineTo(pointer.x, pointer.y);
            ctx.stroke();
          }
        }
      }

      if (interactive && isInView && (idleElapsed < IDLE_SLEEP_MS || maxDelta > 0.08)) {
        rafId = window.requestAnimationFrame(drawFrame);
      }
    };

    const wakeLoop = () => {
      lastActiveTime = performance.now();
      if (interactive && isInView && !rafId) {
        rafId = window.requestAnimationFrame(drawFrame);
      }
    };

    resize();
    drawFrame();

    const handlePointerMove = (e: PointerEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left - 80 &&
        e.clientX <= rect.right + 80 &&
        e.clientY >= rect.top - 80 &&
        e.clientY <= rect.bottom + 80;
      if (!inside) {
        pointer.active = false;
        return;
      }
      pointer.targetX = e.clientX - rect.left;
      pointer.targetY = e.clientY - rect.top;
      if (!pointer.active) {
        pointer.x = pointer.targetX;
        pointer.y = pointer.targetY;
        pointer.active = true;
      }
      wakeLoop();
    };

    const handlePointerLeave = () => {
      pointer.active = false;
      lastActiveTime = performance.now();
    };

    if (interactive) {
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
      document.addEventListener('pointerleave', handlePointerLeave);
    }

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        resize();
        drawFrame();
      });
      resizeObserver.observe(canvas);
    } else {
      window.addEventListener('resize', resize, { passive: true });
    }

    let intersectionObserver: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          const visible = entries[0]?.isIntersecting ?? true;
          isInView = visible;
          if (!visible && rafId) {
            window.cancelAnimationFrame(rafId);
            rafId = 0;
          } else if (visible && interactive && performance.now() - lastActiveTime < IDLE_SLEEP_MS && !rafId) {
            rafId = window.requestAnimationFrame(drawFrame);
          }
        },
        { threshold: 0.02 },
      );
      intersectionObserver.observe(canvas);
    }

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      window.removeEventListener('resize', resize);
      if (interactive) {
        window.removeEventListener('pointermove', handlePointerMove);
        document.removeEventListener('pointerleave', handlePointerLeave);
      }
    };
  }, [canHoverFine, interactive, prefersReducedMotion, variant]);

  if (!canHoverFine) {
    return (
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
        style={{
          background:
            variant === 'gate'
              ? 'radial-gradient(ellipse 72% 56% at 50% 44%, rgba(216,195,165,0.09) 0%, rgba(138,109,75,0.04) 44%, transparent 76%)'
              : 'radial-gradient(ellipse 68% 54% at 50% 34%, rgba(216,195,165,0.08) 0%, rgba(138,109,75,0.03) 48%, transparent 78%)',
        }}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};
