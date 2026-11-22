import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
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
 * Editorial line-by-line typography reveal.
 * Observes the untransformed outer wrapper with amount: 'some' so clipped child spans never stall invisible.
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
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const isInView = useInView(wrapperRef, { once: true, amount: 'some' });
  const shouldReveal = immediate || isInView;

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
    <div ref={wrapperRef}>
      <Tag id={id} className={className} aria-label={fullAccessibleText || undefined}>
        {lines.map((line, index) => (
          <React.Fragment key={index}>
            <span
              aria-hidden="true"
              className={`block overflow-hidden pb-[0.08em] -mb-[0.08em] ${lineClassName}`}
            >
              <motion.span
                className="block will-change-transform"
                initial={{ y: '104%', opacity: 0 }}
                animate={
                  shouldReveal ? { y: '0%', opacity: 1 } : { y: '104%', opacity: 0 }
                }
                transition={{
                  duration: MOTION_DURATION,
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
    </div>
  );
};
