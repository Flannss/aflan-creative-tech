import React, { useRef, useState } from 'react';
import {
  motion,
  useMotionTemplate,
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
  'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.68) 10%, #000 26%, #000 66%, rgba(0, 0, 0, 0.45) 86%, transparent 100%)',
].join(', ');

const TILT_SPRING = { stiffness: 145, damping: 24, mass: 0.65 };

/**
 * Center-Stage Sculpted Atelier Double-Contour Portrait Frame:
 * - Enlarged sculpted dome outer hairline silhouette (`rounded-t-[195px] rounded-b-[24px]`) paired
 *   with a spacing-calibrated inner Champagne-to-Caramel-Bronze rim and apex registration diamond.
 * - Progressive 4-side edge opacity fade dissolving smoothly into `#211814`, anchored by
 *   the dual-tone engraved 1-line `MU'AFA DZULFIQAR` signature.
 * - Desktop (`canHoverFine`): 3D perspective tilt, counter-parallax, opposite signature drift,
 *   and specular studio rim-light; Tablet/Mobile: smooth scroll parallax + ambient diagonal sheen.
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

  const [isHovered, setIsHovered] = useState(false);

  const normX = useMotionValue(0);
  const normY = useMotionValue(0);
  const pctX = useMotionValue(50);
  const pctY = useMotionValue(42);

  const smoothNormX = useSpring(normX, TILT_SPRING);
  const smoothNormY = useSpring(normY, TILT_SPRING);
  const smoothPctX = useSpring(pctX, TILT_SPRING);
  const smoothPctY = useSpring(pctY, TILT_SPRING);

  const cardRotateX = useTransform(
    smoothNormY,
    [-0.5, 0.5],
    enablePointerParallax ? [4.5, -4.5] : [0, 0],
  );
  const cardRotateY = useTransform(
    smoothNormX,
    [-0.5, 0.5],
    enablePointerParallax ? [-5.5, 5.5] : [0, 0],
  );
  const photoParallaxX = useTransform(
    smoothNormX,
    [-0.5, 0.5],
    enablePointerParallax ? [9, -9] : [0, 0],
  );
  const photoParallaxY = useTransform(
    smoothNormY,
    [-0.5, 0.5],
    enablePointerParallax ? [7, -7] : [0, 0],
  );
  const signatureShiftX = useTransform(
    smoothNormX,
    [-0.5, 0.5],
    enablePointerParallax ? [-3, 3] : [0, 0],
  );
  const signatureShiftY = useTransform(
    smoothNormY,
    [-0.5, 0.5],
    enablePointerParallax ? [-2.5, 2.5] : [0, 0],
  );

  const specularRimLight = useMotionTemplate`radial-gradient(280px circle at ${smoothPctX}% ${smoothPctY}%, rgba(244,238,228,0.16) 0%, rgba(176,135,94,0.10) 42%, transparent 72%)`;

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
    const rx = (e.clientX - rect.left) / Math.max(1, rect.width);
    const ry = (e.clientY - rect.top) / Math.max(1, rect.height);
    normX.set(rx - 0.5);
    normY.set(ry - 0.5);
    pctX.set(Math.min(100, Math.max(0, rx * 100)));
    pctY.set(Math.min(100, Math.max(0, ry * 100)));
  };

  const handleMouseEnter = () => {
    if (!enablePointerParallax) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (!enablePointerParallax) return;
    setIsHovered(false);
    normX.set(0);
    normY.set(0);
    pctX.set(50);
    pctY.set(42);
  };

  return (
    <div
      ref={frameRef}
      style={enablePointerParallax ? { perspective: 1100 } : undefined}
      className="relative w-full flex items-center justify-center"
    >
      {/* Caramel–Mocha Ambient Backdrop Halo behind Sculpted Plate */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-6 max-w-[460px] mx-auto"
        style={{
          background:
            'radial-gradient(ellipse 68% 68% at 50% 48%, rgba(185,141,97,0.22) 0%, rgba(110,79,58,0.22) 48%, transparent 74%)',
        }}
      />

      <motion.div
        style={{
          y: portraitY,
          rotateX: cardRotateX,
          rotateY: cardRotateY,
        }}
        initial={disableMotion ? false : { opacity: 0, y: 14 }}
        animate={introReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
        transition={{
          duration: disableMotion ? 0 : MOTION_DURATION,
          delay: disableMotion ? 0 : 0.1,
          ease: EASE_LUXURY,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        data-cursor-label="DOSSIER"
        className="group relative z-10 w-full max-w-[285px] sm:max-w-[310px] md:max-w-[330px] lg:max-w-[360px] xl:max-w-[400px] aspect-[4/5] rounded-t-[195px] rounded-b-[24px] border border-champagne/35 hover:border-champagne/70 bg-[#211814]/75 p-3 sm:p-3.5 transition-colors duration-500 overflow-hidden will-change-transform shadow-[0_24px_64px_rgba(0,0,0,0.42)]"
      >
        {/* Subtle Champagne-to-Caramel Bronze Rim Wash */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-t-[195px] rounded-b-[24px] opacity-40 group-hover:opacity-70 transition-opacity duration-500"
          style={{
            background:
              'linear-gradient(180deg, rgba(223,200,166,0.16) 0%, rgba(185,141,97,0.08) 42%, transparent 78%)',
          }}
        />
        {/* Floating Inner Contour Rim + Apex Diamond & Corner Registration Pips */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[7px] z-20 rounded-t-[186px] rounded-b-[18px] border border-champagne/20 group-hover:border-champagne/48 transition-colors duration-500"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-[5px] left-1/2 -translate-x-1/2 z-30 size-2 rotate-45 bg-linear-to-br from-[#DFC8A6] to-[#B98D61] shadow-[0_0_8px_rgba(223,200,166,0.45)]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-3 left-3 z-30 size-1.5 rounded-full bg-brass/85"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-3 right-3 z-30 size-1.5 rounded-full bg-brass/85"
        />

        {/* Subtle Inner Warm Studio Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-85 transition-opacity duration-700 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(ellipse 68% 62% at 50% 42%, rgba(223,201,168,0.14) 0%, rgba(176,135,94,0.09) 48%, transparent 76%)',
          }}
        />

        {/* Desktop Dynamic Ivory-Brass Specular Studio Rim-Light */}
        {enablePointerParallax && (
          <motion.div
            aria-hidden="true"
            style={{ background: specularRimLight }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.35, ease: EASE_LUXURY }}
            className="pointer-events-none absolute inset-0 z-20"
          />
        )}

        {/* Mobile & Tablet Subtle Diagonal Ambient Rim-Light Sheen */}
        {!canHoverFine && !disableMotion && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
          >
            <div
              className="aflan-portrait-sheen h-full w-1/2"
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(244,238,228,0.11) 50%, transparent 100%)',
              }}
            />
          </div>
        )}

        {/* Progressive 4-Side Edge Opacity Fading Portrait */}
        <div
          className="relative w-full h-full rounded-t-[182px] rounded-b-[14px] overflow-hidden"
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
                  ? { x: photoParallaxX, y: photoParallaxY }
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
                className="w-full h-full object-cover object-[50%_18%] scale-[1.035] group-hover:scale-[1.06] brightness-[0.98] contrast-[1.03] group-hover:brightness-[1.03] group-hover:contrast-[1.06] transition-[transform,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transform-none"
              />
            </motion.div>
          </motion.div>

          {/* Soft Bottom Studio Dissolve into #211814 Warm Espresso */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-[#211814] via-[#211814]/55 to-transparent"
          />
        </div>

        {/* Authoritative 1-Line Dual-Tone Engraved Signature */}
        <motion.div
          style={
            enablePointerParallax
              ? { x: signatureShiftX, y: signatureShiftY }
              : undefined
          }
          className="pointer-events-none absolute inset-x-0 bottom-3.5 sm:bottom-4 z-30 px-3 flex justify-center will-change-transform"
        >
          <p
            aria-label="Mu'afa Dzulfiqar"
            className="select-none flex items-baseline justify-center gap-x-2 whitespace-nowrap text-[1rem] sm:text-lg lg:text-[1.35rem] tracking-[0.08em] leading-none font-serif italic font-medium"
          >
            <span className="text-engraved-brown">MU&apos;AFA</span>{' '}
            <span className="text-engraved-ivory">DZULFIQAR</span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};
