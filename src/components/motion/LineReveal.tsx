import React, { useMemo, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { EASE_LUXURY, MOTION_DURATION } from '@/utils/motion';

interface LineRevealProps {
  text?: string;
  lines?: string[];
  as?: 'p' | 'div' | 'blockquote';
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
}

/**
 * Splits editorial prose into balanced sentence/clause lines for staggered scroll reveals.
 */
function splitEditorialLines(text: string): string[] {
  const sentences = text
    .split(/(?<=[.!?—])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (sentences.length > 1) {
    return sentences;
  }

  const clauses = text
    .split(/(?<=,|;)\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (clauses.length > 1) {
    return clauses;
  }

  return [text.trim()].filter(Boolean);
}

/**
 * Standard fade-in + translateY line-by-line reveal without overflow-hidden clipping.
 * Observes the untransformed container with amount: 'some' so text is guaranteed 100% visible on scroll.
 */
export const LineReveal: React.FC<LineRevealProps> = ({
  text = '',
  lines,
  as: Tag = 'p',
  className = '',
  lineClassName = '',
  delay = 0,
  stagger = 0.065,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const isInView = useInView(containerRef, { once: true, amount: 'some' });

  const resolvedLines = useMemo(() => {
    if (lines && lines.length > 0) return lines;
    return splitEditorialLines(text);
  }, [lines, text]);

  const fullText = useMemo(() => resolvedLines.join(' '), [resolvedLines]);

  if (prefersReducedMotion) {
    return <Tag className={className}>{fullText}</Tag>;
  }

  return (
    <div ref={containerRef}>
      <Tag className={className} aria-label={fullText || undefined}>
        {resolvedLines.map((line, index) => (
          <React.Fragment key={`${index}-${line.slice(0, 18)}`}>
            <motion.span
              aria-hidden="true"
              className={`block will-change-transform ${lineClassName}`}
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{
                duration: MOTION_DURATION,
                delay: delay + index * stagger,
                ease: EASE_LUXURY,
              }}
            >
              {line}
            </motion.span>
            {index < resolvedLines.length - 1 ? ' ' : null}
          </React.Fragment>
        ))}
      </Tag>
    </div>
  );
};
