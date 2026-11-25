import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE_LUXURY } from '@/utils/motion';

interface ApertureFrameProps {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  delay?: number;
  immediate?: boolean;
}

/**
 * Aperture clip-path frame paired with subtle counter-scale reveal (1.06 -> 1)
 * for curated project thumbnails and monograph gallery plates.
 */
export const ApertureFrame: React.FC<ApertureFrameProps> = ({
  children,
  className = '',
  innerClassName = '',
  delay = 0,
  immediate = false,
}) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div className={`overflow-hidden ${className}`}>
        <div className={`w-full h-full ${innerClassName}`}>{children}</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ clipPath: 'inset(7% 0% 7% 0%)', opacity: 0.45 }}
      {...(immediate
        ? { animate: { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 } }
        : {
            whileInView: { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 },
            viewport: { once: true, amount: 'some' },
          })}
      transition={{ duration: 0.76, delay, ease: EASE_LUXURY }}
      className={`overflow-hidden will-change-[clip-path,opacity] ${className}`}
    >
      <motion.div
        initial={{ scale: 1.06 }}
        {...(immediate
          ? { animate: { scale: 1 } }
          : {
              whileInView: { scale: 1 },
              viewport: { once: true, amount: 'some' },
            })}
        transition={{ duration: 0.86, delay, ease: EASE_LUXURY }}
        className={`w-full h-full will-change-transform ${innerClassName}`}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};
