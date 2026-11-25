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
 * Fluid GPU-only image entrance paired with gentle counter-scale settle (1.04 -> 1)
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
      initial={{ opacity: 0, y: 16 }}
      {...(immediate
        ? { animate: { opacity: 1, y: 0 } }
        : {
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, amount: 'some' },
          })}
      transition={{ duration: 0.56, delay, ease: EASE_LUXURY }}
      className={`overflow-hidden will-change-[transform,opacity] ${className}`}
    >
      <motion.div
        initial={{ scale: 1.04 }}
        {...(immediate
          ? { animate: { scale: 1 } }
          : {
              whileInView: { scale: 1 },
              viewport: { once: true, amount: 'some' },
            })}
        transition={{ duration: 0.68, delay, ease: EASE_LUXURY }}
        className={`w-full h-full will-change-transform ${innerClassName}`}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};
