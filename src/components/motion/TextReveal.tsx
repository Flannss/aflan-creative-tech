import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE_LUXURY, MOTION_DURATION } from '@/utils/motion';

interface TextRevealProps {
  id?: string;
  lines: React.ReactNode[];
  as?: 'h1' | 'h2' | 'h3' | 'p';
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  immediate?: boolean;
}

function extractNodeText(node: React.ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(extractNodeText).join('');
  }
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return extractNodeText(node.props.children);
  }
  return '';
}

/**
 * Reliable staggered fade-in + translateY typography reveal without overflow-hidden clipping.
 * Uses standard Framer Motion whileInView with amount: 'some' so headings are guaranteed 100% visible on scroll.
 */
export const TextReveal: React.FC<TextRevealProps> = ({
  id,
  lines,
  as: Tag = 'h2',
  className = '',
  lineClassName = '',
  delay = 0,
  stagger = 0.08,
  immediate = false,
}) => {
  const prefersReducedMotion = useReducedMotion();

  const fullAccessibleText = lines
    .map((line) => extractNodeText(line).replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join(' ');

  if (prefersReducedMotion) {
    return (
      <Tag id={id} className={className} aria-label={fullAccessibleText || undefined}>
        {lines.map((line, index) => (
          <React.Fragment key={index}>
            <span aria-hidden="true" className={`block ${lineClassName}`}>
              {line}
            </span>
            {index < lines.length - 1 ? ' ' : null}
          </React.Fragment>
        ))}
      </Tag>
    );
  }

  return (
    <Tag id={id} className={className} aria-label={fullAccessibleText || undefined}>
      {lines.map((line, index) => (
        <React.Fragment key={index}>
          <motion.span
            aria-hidden="true"
            className={`block will-change-transform ${lineClassName}`}
            initial={{ opacity: 0, y: 16 }}
            {...(immediate
              ? { animate: { opacity: 1, y: 0 } }
              : {
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, amount: 'some' },
                })}
            transition={{
              duration: MOTION_DURATION,
              delay: delay + index * stagger,
              ease: EASE_LUXURY,
            }}
          >
            {line}
          </motion.span>
          {index < lines.length - 1 ? ' ' : null}
        </React.Fragment>
      ))}
    </Tag>
  );
};
