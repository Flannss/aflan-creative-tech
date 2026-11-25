import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';

interface EditorialMarqueeProps {
  active?: boolean;
}

const TOP_TRACK_ITEMS = [
  'AFLAN DOSSIER',
  'FRONTEND ARCHITECTURE',
  'UI/UX ENGINEERING',
  'CREATIVE TECHNOLOGY',
  'SATURUANG CREATIVE',
] as const;

const BOTTOM_TRACK_ITEMS = [
  'PRECISION SYSTEMS',
  'SOFTWARE QA',
  'EDITORIAL MOTION',
  'CCNA DISCIPLINE',
  'PURWOKERTO, ID',
] as const;

/**
 * Variative Dual-Track Kinetic Running Text Band:
 * - Pauses automatically while `SplashIntro` covers the viewport (`!active`) so intro entry
 *   keeps full 60fps headroom, then glides with opposing GPU CSS tracks + Lenis scroll drift.
 */
export const EditorialMarquee: React.FC<EditorialMarqueeProps> = ({
  active = true,
}) => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isInView, setIsInView] = useState(true);
  const [isTabHidden, setIsTabHidden] = useState(
    () => typeof document !== 'undefined' && document.hidden,
  );

  useEffect(() => {
    const el = sectionRef.current;
    const observer =
      el && typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            ([entry]) => {
              setIsInView(Boolean(entry?.isIntersecting));
            },
            { threshold: 0.02 },
          )
        : null;

    if (el && observer) {
      observer.observe(el);
    }

    const handleVisibility = () => {
      setIsTabHidden(document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      observer?.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const scrollShiftTop = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [18, -22],
  );
  const scrollShiftBottom = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [-20, 18],
  );

  const paused = !active || !isInView || isTabHidden;

  return (
    <section
      ref={sectionRef}
      aria-label="Ringkasan disiplin inti"
      className={`aflan-marquee-group relative w-full bg-umber py-5 sm:py-6 overflow-x-clip select-none ${
        paused ? 'aflan-marquee-paused' : ''
      }`}
    >
      {/* Warm Gradient Border Hairlines */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-champagne/35 to-transparent"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 inset-x-0 h-px bg-linear-to-r from-transparent via-champagne/35 to-transparent"
      />

      <div className="space-y-3 overflow-hidden">
        {/* Top Track: Leftward Large Serif Alternating Solid Warm Ivory & Italic Champagne */}
        <motion.div
          style={{ x: scrollShiftTop }}
          className="aflan-marquee-wrapper overflow-hidden will-change-transform"
        >
          <div className="aflan-marquee-left">
            {[false, true].map((hidden, dupIdx) => (
              <div
                key={`top-${dupIdx}`}
                aria-hidden={hidden}
                className="flex items-center shrink-0 gap-6 sm:gap-9 pr-6 sm:pr-9"
              >
                {TOP_TRACK_ITEMS.map((item, idx) => (
                  <React.Fragment key={`${dupIdx}-${item}`}>
                    <span
                      className={`font-serif text-[1.45rem] sm:text-3xl lg:text-[2.15rem] tracking-[0.05em] uppercase whitespace-nowrap leading-none ${
                        idx % 2 === 1
                          ? 'italic font-light text-champagne'
                          : 'font-light text-ivory'
                      }`}
                    >
                      {item}
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-xs sm:text-sm text-brass shrink-0"
                    >
                      ✦
                    </span>
                  </React.Fragment>
                ))}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bottom Track: Rightward Architectural Outline & High-Contrast Monospace */}
        <motion.div
          style={{ x: scrollShiftBottom }}
          className="aflan-marquee-wrapper overflow-hidden will-change-transform"
        >
          <div className="aflan-marquee-right">
            {[false, true].map((hidden, dupIdx) => (
              <div
                key={`bot-${dupIdx}`}
                aria-hidden={hidden}
                className="flex items-center shrink-0 gap-6 sm:gap-8 pr-6 sm:pr-8"
              >
                {BOTTOM_TRACK_ITEMS.map((item, idx) => (
                  <React.Fragment key={`${dupIdx}-${item}`}>
                    <span
                      className={
                        idx % 2 === 0
                          ? 'font-serif italic font-light uppercase tracking-[0.08em] text-lg sm:text-2xl aflan-stroke-champagne whitespace-nowrap leading-none'
                          : 'font-mono text-[11px] sm:text-xs tracking-[0.26em] uppercase text-champagne/90 whitespace-nowrap'
                      }
                    >
                      {item}
                    </span>
                    <span
                      aria-hidden="true"
                      className="size-1 rounded-full bg-brass shrink-0"
                    />
                  </React.Fragment>
                ))}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
