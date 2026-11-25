import React, { useRef } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { personalData } from '@/data/personal';
import { useCanHoverFine } from '@/hooks/useMediaQuery';
import { EASE_LUXURY, MOTION_DURATION } from '@/utils/motion';

interface HeroPortraitProps {
  portraitY: MotionValue<number>;
  portraitScale: MotionValue<number>;
  introReady: boolean;
}

const PROGRESSIVE_EDGE_MASK = [
  'linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.58) 14%, #000 30%, #000 70%, rgba(0, 0, 0, 0.58) 86%, transparent 100%)',
  'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.65) 10%, #000 26%, #000 66%, rgba(0, 0, 0, 0.45) 86%, transparent 100%)',
].join(', ');

/**
 * Refined Editorial Portrait Frame for the Home Hero:
 * - Single clean architectural outer border (`rounded-[22px] border-champagne/20`) with airy inset.
 * - Progressive 4-side edge opacity feathering (`mask-image` composite + bottom studio dissolve)
 *   so left, right, top, and bottom blazer edges fade organically into `#1A1412`.
 * - Zero dangling vertical labels; anchored by 1-line dual-tone engraved `MU'AFA DZULFIQAR`.
 */
export const HeroPortrait: React.FC<HeroPortraitProps> = ({
  portraitY,
  portraitScale,
  introReady,
}) => {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const canHoverFine = useCanHoverFine();
  const prefersReducedMotion = useReducedMotion();
  const disableMotion = Boolean(prefersReducedMotion);
  const enablePointerParallax = canHoverFine && !disableMotion;

  const pointerOffsetX = useMotionValue(0);
  const pointerOffsetY = useMotionValue(0);
  const springConfig = { stiffness: 120, damping: 22, mass: 0.7 };
  const smoothX = useSpring(pointerOffsetX, springConfig);
  const smoothY = useSpring(pointerOffsetY, springConfig);

  const { scrollYProgress: touchScrollProgress } = useScroll({
    target: frameRef,
    offset: ['start end', 'end start'],
  });
  const touchPortraitDrift = useTransform(
    touchScrollProgress,
    [0, 1],
    !canHoverFine && !disableMotion ? [-8, 8] : [0, 0],
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enablePointerParallax) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    pointerOffsetX.set(-nx * 12);
    pointerOffsetY.set(-ny * 12);
  };

  const handleMouseLeave = () => {
    if (!enablePointerParallax) return;
    pointerOffsetX.set(0);
    pointerOffsetY.set(0);
  };

  return (
    <div ref={frameRef} className="relative w-full flex items-center justify-center">
      <motion.div
        style={{ y: portraitY }}
        initial={disableMotion ? false : { opacity: 0, y: 18 }}
        animate={introReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
        transition={{
          duration: disableMotion ? 0 : MOTION_DURATION,
          delay: disableMotion ? 0 : 0.14,
          ease: EASE_LUXURY,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        data-cursor-label="DOSSIER"
        className="group relative z-10 w-full max-w-[300px] sm:max-w-[345px] lg:max-w-[385px] xl:max-w-[415px] aspect-[4/5] rounded-[22px] border border-champagne/20 hover:border-champagne/40 bg-[#1A1412]/70 p-3 sm:p-4 transition-colors duration-500 overflow-hidden"
      >
        {/* Subtle Warm Studio Ambient Glow inside frame */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-75 transition-opacity duration-700 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(ellipse 68% 62% at 50% 42%, rgba(216,195,165,0.12) 0%, rgba(138,109,75,0.05) 48%, transparent 76%)',
          }}
        />

        {/* Progressive 4-Side Edge Opacity Fading Portrait */}
        <div
          className="relative w-full h-full rounded-[14px] overflow-hidden"
          style={{
            maskImage: PROGRESSIVE_EDGE_MASK,
            WebkitMaskImage: PROGRESSIVE_EDGE_MASK,
            maskComposite: 'intersect',
            WebkitMaskComposite: 'source-in',
          }}
        >
          <motion.div
            style={{
              scale: portraitScale,
              y: canHoverFine ? 0 : touchPortraitDrift,
            }}
            className="w-full h-full will-change-transform"
          >
            <motion.div
              style={
                enablePointerParallax
                  ? { x: smoothX, y: smoothY }
                  : undefined
              }
              className="w-full h-full will-change-transform"
            >
              <img
                src={personalData.portraitPath}
                alt="Potret studio Aflan Mu'afa Dzulfiqar"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="w-full h-full object-cover object-[50%_18%] scale-[1.03] group-hover:scale-[1.05] brightness-[0.98] contrast-[1.03] group-hover:brightness-[1.03] group-hover:contrast-[1.06] transition-[transform,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transform-none"
              />
            </motion.div>
          </motion.div>

          {/* Soft Bottom Studio Dissolve into #1A1412 */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-[#1A1412] via-[#1A1412]/55 to-transparent"
          />
        </div>

        {/* Authoritative 1-Line Dual-Tone Engraved Signature */}
        <div className="pointer-events-none absolute inset-x-0 bottom-4 sm:bottom-5 z-20 px-4 flex justify-center">
          <p
            aria-label="Mu'afa Dzulfiqar"
            className="select-none flex items-baseline justify-center gap-x-2.5 whitespace-nowrap text-lg sm:text-xl md:text-[1.4rem] tracking-[0.08em] leading-none font-serif italic font-medium"
          >
            <span className="text-engraved-brown">MU&apos;AFA</span>{' '}
            <span className="text-engraved-ivory">DZULFIQAR</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
