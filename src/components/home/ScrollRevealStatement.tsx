import React, { useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';

interface StatementToken {
  text: string;
  accent?: boolean;
}

const STATEMENT_TOKENS: readonly StatementToken[] = [
  { text: 'Merancang' },
  { text: 'antarmuka' },
  { text: 'web' },
  { text: 'di' },
  { text: 'mana' },
  { text: 'tipografi', accent: true },
  { text: 'editorial', accent: true },
  { text: 'bertemu' },
  { text: 'disiplin' },
  { text: 'frontend', accent: true },
  { text: 'engineering', accent: true },
  { text: '&' },
  { text: 'pengujian', accent: true },
  { text: 'QA.', accent: true },
];

interface ScrubWordProps {
  token: StatementToken;
  progress: MotionValue<number>;
  range: [number, number];
}

const ScrubWord: React.FC<ScrubWordProps> = ({ token, progress, range }) => {
  const opacity = useTransform(progress, range, [0.24, 1]);
  return (
    <motion.span
      style={{ opacity }}
      className={
        token.accent ? 'italic text-champagne will-change-[opacity]' : 'text-ivory will-change-[opacity]'
      }
    >
      {token.text}
    </motion.span>
  );
};

/**
 * Interactive scroll-scrubbed editorial thesis band between the Hero Discipline
 * Ribbon and Selected Works. Uses a dedicated child `ScrubWord` component so
 * Framer Motion `useTransform` hooks never run conditionally inside `.map()`.
 */
export const ScrollRevealStatement: React.FC = () => {
  const containerRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 86%', 'center 46%'],
  });

  const total = STATEMENT_TOKENS.length;

  return (
    <section
      ref={containerRef}
      aria-label="Filosofi Rekayasa Visual"
      className="relative bg-[#1A1412] text-ivory py-14 sm:py-18 lg:py-22 px-4 sm:px-6 lg:px-12 border-b border-champagne/12 overflow-x-clip"
    >
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
        <div className="lg:col-span-3 pt-1 space-y-1.5">
          <p className="font-mono text-[10px] sm:text-[11px] tracking-[0.24em] uppercase text-champagne">
            EDITORIAL THESIS
          </p>
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-taupe">
            SYSTEM &amp; CRAFT
          </p>
        </div>

        <div className="lg:col-span-9">
          <p className="font-serif text-[clamp(1.65rem,3.4vw,3.15rem)] font-light leading-[1.18] tracking-tight flex flex-wrap gap-x-[0.28em] gap-y-[0.06em]">
            {STATEMENT_TOKENS.map((token, idx) => {
              const start = (idx / total) * 0.72;
              const end = Math.min(1, start + 0.28);

              if (prefersReducedMotion) {
                return (
                  <span
                    key={`${token.text}-${idx}`}
                    className={token.accent ? 'italic text-champagne' : 'text-ivory'}
                  >
                    {token.text}
                  </span>
                );
              }

              return (
                <ScrubWord
                  key={`${token.text}-${idx}`}
                  token={token}
                  progress={scrollYProgress}
                  range={[start, end]}
                />
              );
            })}
          </p>
        </div>
      </div>
    </section>
  );
};
