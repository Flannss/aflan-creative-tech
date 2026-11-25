import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE_LUXURY } from '@/utils/motion';

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
 * Masked upward typography reveal with line stagger.
 * Pads vertical mask slightly (`py-[0.08em] -my-[0.08em]`) so italic Cormorant Garamond
 * ascenders and descenders never clip while rising cleanly into view.
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
              {index < lines.length - 1 ? ' ' : null}
            </span>
          </React.Fragment>
        ))}
      </Tag>
    );
  }

  return (
    <Tag id={id} className={className} aria-label={fullAccessibleText || undefined}>
      {lines.map((line, index) => (
        <React.Fragment key={index}>
          <span
            aria-hidden="true"
            className="block overflow-hidden py-[0.08em] -my-[0.08em]"
          >
            <motion.span
              className={`block will-change-transform ${lineClassName}`}
              initial={{ y: '108%', opacity: 0.001 }}
              {...(immediate
                ? { animate: { y: '0%', opacity: 1 } }
                : {
                    whileInView: { y: '0%', opacity: 1 },
                    viewport: { once: true, amount: 'some' },
                  })}
              transition={{
                duration: 0.74,
                delay: delay + index * stagger,
                ease: EASE_LUXURY,
              }}
            >
              {line}
              {index < lines.length - 1 ? ' ' : null}
            </motion.span>
          </span>
        </React.Fragment>
      ))}
    </Tag>
  );
};
