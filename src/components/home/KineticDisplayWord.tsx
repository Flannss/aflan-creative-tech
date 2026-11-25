import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useCanHoverFine } from '@/hooks/useMediaQuery';
import { EASE_LUXURY } from '@/utils/motion';

interface KineticDisplayWordProps {
  word: string;
  ariaLabel?: string;
  className?: string;
  align?: 'center' | 'left';
  introReady?: boolean;
}

/**
 * Interactive sculptural masthead rendered in Cinzel architectural serif.
 * Fluid scale fits 375px, 768px, and 1440px without horizontal overflow,
 * isolating tactile per-letter elevation to fine-pointer desktop cursors.
 */
export const KineticDisplayWord: React.FC<KineticDisplayWordProps> = ({
  word,
  ariaLabel,
  className = '',
  align = 'center',
  introReady = true,
}) => {
  const canHoverFine = useCanHoverFine();
  const prefersReducedMotion = useReducedMotion();
  const disableMotion = Boolean(prefersReducedMotion);
  const enableInteractiveLetters = canHoverFine && !disableMotion;

  const letters = word.split('');
  const alignText = align === 'left' ? 'text-center lg:text-left' : 'text-center';
  const alignFlex =
    align === 'left' ? 'justify-center lg:justify-start' : 'justify-center';

  return (
    <h1
      aria-label={ariaLabel ?? word}
      className={`font-masthead font-semibold uppercase select-none text-[clamp(2.9rem,11.5vw,6.8rem)] leading-[0.94] tracking-[0.06em] sm:tracking-[0.08em] pb-1 text-ivory ${alignText} ${className}`}
    >
      <span aria-hidden="true" className={`inline-flex items-baseline ${alignFlex}`}>
        {letters.map((char, idx) =>
          disableMotion ? (
            <span key={`${char}-${idx}`} className="inline-block">
              {char}
            </span>
          ) : (
            <motion.span
              key={`${char}-${idx}`}
              initial={{ opacity: 0, y: 12 }}
              animate={
                introReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }
              }
              whileHover={
                enableInteractiveLetters
                  ? {
                      y: -6,
                      scale: 1.04,
                      color: '#C9A97C',
                      transition: {
                        type: 'spring',
                        stiffness: 340,
                        damping: 22,
                        mass: 0.45,
                      },
                    }
                  : undefined
              }
              transition={{
                duration: 0.46,
                delay: 0.03 + idx * 0.035,
                ease: EASE_LUXURY,
              }}
              className={`inline-block cursor-default will-change-transform ${
                enableInteractiveLetters
                  ? 'transition-[filter] duration-300 hover:drop-shadow-[0_6px_18px_rgba(201,169,124,0.24)]'
                  : ''
              }`}
            >
              {char}
            </motion.span>
          ),
        )}
      </span>
    </h1>
  );
};
