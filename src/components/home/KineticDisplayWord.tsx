import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useCanHoverFine } from '@/hooks/useMediaQuery';
import { EASE_LUXURY } from '@/utils/motion';

interface KineticDisplayWordProps {
  word: string;
  ariaLabel?: string;
  className?: string;
  introReady?: boolean;
}

/**
 * Interactive sculptural masthead rendered in Cinzel architectural serif.
 * Keeps `introReady` staggered letter choreography crisp across Desktop, Tablet,
 * and Mobile while isolating subtle magnetic hover elevation to fine-pointer devices.
 */
export const KineticDisplayWord: React.FC<KineticDisplayWordProps> = ({
  word,
  ariaLabel,
  className = '',
  introReady = true,
}) => {
  const canHoverFine = useCanHoverFine();
  const prefersReducedMotion = useReducedMotion();
  const disableMotion = Boolean(prefersReducedMotion);
  const enableInteractiveLetters = canHoverFine && !disableMotion;

  const letters = word.split('');

  return (
    <h1
      aria-label={ariaLabel ?? word}
      className={`font-masthead font-semibold uppercase text-center select-none text-[clamp(3.1rem,9.2vw,7.2rem)] leading-[0.94] tracking-[0.06em] sm:tracking-[0.09em] pl-[0.06em] sm:pl-[0.09em] pb-1 text-ivory ${className}`}
    >
      <span aria-hidden="true" className="inline-flex items-baseline justify-center">
        {letters.map((char, idx) =>
          disableMotion ? (
            <span key={`${char}-${idx}`} className="inline-block">
              {char}
            </span>
          ) : (
            <motion.span
              key={`${char}-${idx}`}
              initial={{ opacity: 0, y: 14 }}
              animate={
                introReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }
              }
              whileHover={
                enableInteractiveLetters
                  ? {
                      y: -6,
                      scale: 1.04,
                      color: '#D8C3A5',
                      transition: {
                        type: 'spring',
                        stiffness: 360,
                        damping: 22,
                        mass: 0.45,
                      },
                    }
                  : undefined
              }
              transition={{
                duration: 0.54,
                delay: 0.04 + idx * 0.04,
                ease: EASE_LUXURY,
              }}
              className={`inline-block cursor-default will-change-transform ${
                enableInteractiveLetters
                  ? 'transition-[filter] duration-300 hover:drop-shadow-[0_6px_18px_rgba(216,195,165,0.22)]'
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
