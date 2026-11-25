import React, { useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';

const TOP_TRACK_TEXT =
  'FRONTEND ARCHITECTURE · VISUAL SYSTEMS · INTERACTIVE CRAFT · ';
const BOTTOM_TRACK_TEXT =
  'UI ENGINEERING · SOFTWARE QA · SATURUANG CREATIVE · ';

/**
 * Scroll-Linked Dual-Axis Kinetic Typography Band:
 * - Two opposing large display lines driven purely by GPU `translateX` from scroll progress.
 * - Top row features fine serif light contrast; bottom row renders subtle Champagne outline stroke.
 * - Active across Desktop, Tablet, and Mobile (`overflow-x-clip` prevents page horizontal scroll).
 */
export const KineticScrollBand: React.FC = () => {
  const bandRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: bandRef,
    offset: ['start end', 'end start'],
  });

  const topX = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? ['0%', '0%'] : ['3%', '-9%'],
  );
  const bottomX = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? ['0%', '0%'] : ['-9%', '3%'],
  );

  return (
    <div
      ref={bandRef}
      aria-hidden="true"
      className="relative bg-[#1A1412] py-8 sm:py-11 border-b border-champagne/15 overflow-x-clip select-none"
    >
      <div className="space-y-2 sm:space-y-3 overflow-hidden">
        <motion.div
          style={{ x: topX }}
          className="flex w-max will-change-transform"
        >
          {[0, 1, 2].map((dup) => (
            <span
              key={`top-${dup}`}
              className="font-serif font-light uppercase tracking-[0.06em] text-[clamp(1.6rem,4.2vw,3.4rem)] leading-none text-ivory/85 whitespace-nowrap pr-4"
            >
              {TOP_TRACK_TEXT}
            </span>
          ))}
        </motion.div>

        <motion.div
          style={{ x: bottomX }}
          className="flex w-max will-change-transform"
        >
          {[0, 1, 2].map((dup) => (
            <span
              key={`bot-${dup}`}
              className="font-serif italic font-light uppercase tracking-[0.06em] text-[clamp(1.6rem,4.2vw,3.4rem)] leading-none aflan-stroke-champagne whitespace-nowrap pr-4"
            >
              {BOTTOM_TRACK_TEXT}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
