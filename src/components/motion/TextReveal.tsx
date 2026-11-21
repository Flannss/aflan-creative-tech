import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE_LUXURY } from '@/utils/motion';
import { useIsCoarsePointer } from '@/hooks/useMediaQuery';

interface TextRevealProps {
  lines: React.ReactNode[];
  as?: 'h1' | 'h2' | 'h3' | 'p';
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  immediate?: boolean;
}

/**
 * Print-editorial masked line-by-line typography reveal.
 * Each line glides smoothly out of an overflow-hidden baseline using power4-style easing.
 */
export const TextReveal: React.FC<TextRevealProps> = ({
  lines,
  as: Tag = 'h2',
  className = '',
  lineClassName = '',
  delay = 0,
  stagger = 0.09,
  immediate = false,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const isCoarsePointer = useIsCoarsePointer();

  if (prefersReducedMotion || isCoarsePointer) {
    return (
      <Tag className={className}>
        {lines.map((line, index) => (
          <React.Fragment key={index}>
            <span className={`block ${lineClassName}`}>
              {line}
            </span>
            {index < lines.length - 1 ? ' ' : null}
          </React.Fragment>
        ))}
      </Tag>
    );
  }

  return (
    <Tag className={className}>
      {lines.map((line, index) => (
        <React.Fragment key={index}>
          <span className={`block overflow-hidden pb-[0.08em] -mb-[0.08em] ${lineClassName}`}>
            <motion.span
              className="block will-change-transform"
              initial={{ y: '108%', opacity: 0.15 }}
              {...(immediate
                ? { animate: { y: '0%', opacity: 1 } }
                : {
                    whileInView: { y: '0%', opacity: 1 },
                    viewport: { once: true, amount: 0.25 },
                  })}
              transition={{
                duration: 0.96,
                delay: delay + index * stagger,
                ease: EASE_LUXURY,
              }}
            >
              {line}
            </motion.span>
          </span>
          {index < lines.length - 1 ? ' ' : null}
        </React.Fragment>
      ))}
    </Tag>
  );
};
