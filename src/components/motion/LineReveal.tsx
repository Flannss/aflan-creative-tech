import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE_LUXURY } from '@/utils/motion';

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
 * Splits editorial prose into balanced sentence/clause lines for masked line-by-line scroll reveals.
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
 * Calm masked line-by-line typography reveal driven by Framer Motion whileInView.
 * Uses GPU-only transform (translateY) and opacity with cubic-bezier(0.22, 1, 0.36, 1).
 */
export const LineReveal: React.FC<LineRevealProps> = ({
  text = '',
  lines,
  as: Tag = 'p',
  className = '',
  lineClassName = '',
  delay = 0,
  stagger = 0.085,
}) => {
  const prefersReducedMotion = useReducedMotion();

  const resolvedLines = useMemo(() => {
    if (lines && lines.length > 0) return lines;
    return splitEditorialLines(text);
  }, [lines, text]);

  const fullText = useMemo(() => resolvedLines.join(' '), [resolvedLines]);

  if (prefersReducedMotion) {
    return <Tag className={className}>{fullText}</Tag>;
  }

  return (
    <Tag className={className} aria-label={fullText || undefined}>
      {resolvedLines.map((line, index) => (
        <React.Fragment key={`${index}-${line.slice(0, 18)}`}>
          <span
            aria-hidden="true"
            className={`block overflow-hidden pb-[0.06em] -mb-[0.06em] ${lineClassName}`}
          >
            <motion.span
              className="block will-change-transform"
              initial={{ y: '104%', opacity: 0 }}
              whileInView={{ y: '0%', opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.78,
                delay: delay + index * stagger,
                ease: EASE_LUXURY,
              }}
            >
              {line}
            </motion.span>
          </span>
          {index < resolvedLines.length - 1 ? ' ' : null}
        </React.Fragment>
      ))}
    </Tag>
  );
};
