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
 * Monumental Editorial Masthead rendered in Playfair Display (`500/600`):
 * - Centered magazine-cover lockup with Warm Ivory -> Champagne -> Caramel Bronze
 *   metallic gradient per letter and fluid spring lift on fine-pointer hover.
 * - Keeps staggered entrance synchronized with `introReady` without text clipping.
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
      className={`font-masthead font-semibold uppercase text-center select-none text-[clamp(3.6rem,11vw,8.6rem)] leading-[0.9] tracking-[0.04em] sm:tracking-[0.06em] py-2 -my-2 ${className}`}
    >
      <span aria-hidden="true" className="inline-flex items-baseline justify-center">
        {letters.map((char, idx) =>
          disableMotion ? (
            <span
              key={`${char}-${idx}`}
              className="inline-block bg-linear-to-b from-[#F4EEE4] via-[#DFC9A8] to-[#B0875E] bg-clip-text text-transparent px-[0.015em]"
            >
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
                duration: 0.48,
                delay: 0.03 + idx * 0.035,
                ease: EASE_LUXURY,
              }}
              className={`inline-block cursor-default will-change-transform bg-linear-to-b from-[#F4EEE4] via-[#DFC9A8] to-[#B0875E] bg-clip-text text-transparent px-[0.015em] ${
                enableInteractiveLetters
                  ? 'transition-[filter] duration-300 hover:brightness-125 hover:drop-shadow-[0_6px_18px_rgba(223,201,168,0.28)]'
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
