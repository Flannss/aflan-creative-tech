import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useCanHoverFine } from '@/hooks/useMediaQuery';

interface KineticDisplayWordProps {
  word: string;
  ariaLabel?: string;
  className?: string;
}

/**
 * Editorial monumental masthead display word with sturdy Cormorant Garamond SemiBold serifs,
 * smooth Ivory-to-Champagne metallic gradient, and individual per-letter cursor hover reaction.
 * - Zero React re-renders; static & clean on touch devices and `prefers-reduced-motion`.
 */
export const KineticDisplayWord: React.FC<KineticDisplayWordProps> = ({
  word,
  ariaLabel,
  className = '',
}) => {
  const canHoverFine = useCanHoverFine();
  const prefersReducedMotion = useReducedMotion();
  const enableKineticLetters = canHoverFine && !prefersReducedMotion;
  const letters = Array.from(word);

  return (
    <h1
      aria-label={ariaLabel ?? word}
      className={`font-serif font-semibold uppercase text-center select-none text-[clamp(3.6rem,10.5vw,7.8rem)] leading-[0.92] tracking-[0.04em] sm:tracking-[0.07em] pl-[0.04em] sm:pl-[0.07em] pb-1 ${className}`}
    >
      {letters.map((char, idx) => {
        const hoverRotate = idx % 2 === 0 ? -2.2 : 2.2;
        return (
          <motion.span
            key={`${char}-${idx}`}
            aria-hidden="true"
            whileHover={
              enableKineticLetters
                ? {
                    y: -6,
                    rotate: hoverRotate,
                    scale: 1.03,
                  }
                : undefined
            }
            transition={{ type: 'spring', stiffness: 320, damping: 20 }}
            className="inline-block bg-gradient-to-b from-[#F4EFE6] via-[#EFE5D5] to-[#CBB492] bg-clip-text text-transparent px-[0.02em] will-change-transform drop-shadow-[0_10px_28px_rgba(23,22,21,0.55)]"
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        );
      })}
    </h1>
  );
};
