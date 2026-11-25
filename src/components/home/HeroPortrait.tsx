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

const FEATHERED_SILHOUETTE_MASK =
  'radial-gradient(ellipse 76% 78% at 50% 42%, #000 52%, rgba(0, 0, 0, 0.62) 75%, transparent 98%)';

/**
 * Unboxed Seamless Editorial Silhouette portrait for the Home Hero.
 * - Zero rigid outer boxes, borders, chamfered corners, or shadows.
 * - Uses 4-side elliptical `mask-image` feathering + bottom studio dissolve so all
 *   four edges melt organically into the #171615 / #1A1412 background.
 * - Desktop: fluid pointer parallax (±6px) without boxy 3D tilt.
 * - Tablet / Mobile: soft scroll-linked vertical drift.
 */
export const HeroPortrait: React.FC<HeroPortraitProps> = ({
  portraitY,
  portraitScale,
  introReady,
}) => {
  const silhouetteRef = useRef<HTMLDivElement | null>(null);
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
    target: silhouetteRef,
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
    <div
      ref={silhouetteRef}
      className="relative w-full flex items-center justify-center"
    >
      {/* Subtle Asymmetric Hairline Editorial Index Axis (Left Margin) */}
      <motion.div
        aria-hidden="true"
        initial={disableMotion ? false : { opacity: 0, y: 12 }}
        animate={introReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{
          duration: disableMotion ? 0 : MOTION_DURATION,
          delay: disableMotion ? 0 : 0.22,
          ease: EASE_LUXURY,
        }}
        className="hidden sm:flex flex-col items-center gap-3 mr-2 sm:mr-3 select-none shrink-0"
      >
        <span className="size-1 rounded-full bg-champagne/60" />
        <span className="block w-px h-16 bg-linear-to-b from-champagne/45 via-champagne/15 to-transparent" />
        <span className="font-mono text-[9px] tracking-[0.28em] uppercase text-champagne/55 [writing-mode:vertical-rl] rotate-180">
          01 · AMDZ
        </span>
      </motion.div>

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
        className="group relative z-10 w-full max-w-[300px] sm:max-w-[350px] lg:max-w-[390px] xl:max-w-[420px] aspect-[4/5]"
      >
        {/* Warm Unboxed Studio Ambient Halo behind Subject */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-8 opacity-75 transition-opacity duration-700 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(ellipse 64% 60% at 50% 42%, rgba(216,195,165,0.13) 0%, rgba(138,109,75,0.06) 46%, transparent 74%)',
          }}
        />

        {/* 4-Side Optical Feathered Portrait Container (Zero Hard Crop Edges) */}
        <div
          className="relative w-full h-full overflow-hidden"
          style={{
            maskImage: FEATHERED_SILHOUETTE_MASK,
            WebkitMaskImage: FEATHERED_SILHOUETTE_MASK,
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

          {/* Soft Bottom Studio Dissolve into #171615 / #1A1412 */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-obsidian via-obsidian/55 to-transparent"
          />
        </div>

        {/* Floating 1-Line Dual-Tone Engraved Signature */}
        <div className="pointer-events-none absolute inset-x-0 bottom-1 sm:bottom-2 z-20 px-2 flex justify-center">
          <p
            aria-label="Mu'afa Dzulfiqar"
            className="select-none flex items-baseline justify-center gap-x-2.5 whitespace-nowrap text-lg sm:text-xl md:text-[1.45rem] tracking-[0.08em] leading-none font-serif italic font-medium"
          >
            <span className="text-engraved-brown">MU&apos;AFA</span>{' '}
            <span className="text-engraved-ivory">DZULFIQAR</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
