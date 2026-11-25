import React, { useRef } from 'react';
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

const PLATE_CHAMFER_CLIP =
  'polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px))';

/**
 * Architectural Editorial Plate portrait for the Home Hero cover.
 * - Optical Viewfinder Monograph silhouette with subtle chamfered corners,
 *   4 thin Champagne/Ivory outer registration crop marks, and a seamless studio vignette blend.
 * - Desktop: lightweight ±3.5deg 3D spring tilt, gentle counter-parallax, and soft specular rim sheen.
 * - Tablet / Mobile: clean scroll-linked vertical parallax with zero continuous animation overhead.
 * - Anchored at the base by the locked 1-line dual-tone engraved `MU'AFA DZULFIQAR` signature.
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
  const enable3D = canHoverFine && !disableMotion;

  const normX = useMotionValue(0);
  const normY = useMotionValue(0);
  const glarePctX = useMotionValue(50);
  const glarePctY = useMotionValue(34);

  const springConfig = { stiffness: 150, damping: 24, mass: 0.7 };
  const smoothNormX = useSpring(normX, springConfig);
  const smoothNormY = useSpring(normY, springConfig);
  const smoothGlareX = useSpring(glarePctX, { stiffness: 120, damping: 24 });
  const smoothGlareY = useSpring(glarePctY, { stiffness: 120, damping: 24 });

  const rotateX = useTransform(smoothNormY, [-0.5, 0.5], [3.5, -3.5]);
  const rotateY = useTransform(smoothNormX, [-0.5, 0.5], [-3.5, 3.5]);

  const imgParallaxX = useTransform(smoothNormX, [-0.5, 0.5], [6, -6]);
  const imgParallaxY = useTransform(smoothNormY, [-0.5, 0.5], [5, -5]);

  const specularBg = useMotionTemplate`radial-gradient(280px circle at ${smoothGlareX}% ${smoothGlareY}%, rgba(244,239,230,0.18) 0%, rgba(216,195,165,0.08) 38%, transparent 72%)`;

  const { scrollYProgress: touchScrollProgress } = useScroll({
    target: frameRef,
    offset: ['start end', 'end start'],
  });
  const touchPortraitShift = useTransform(
    touchScrollProgress,
    [0, 1],
    !canHoverFine && !disableMotion ? [-8, 8] : [0, 0],
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enable3D) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const py = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    normX.set(px - 0.5);
    normY.set(py - 0.5);
    glarePctX.set(px * 100);
    glarePctY.set(py * 100);
  };

  const handleMouseLeave = () => {
    if (!enable3D) return;
    normX.set(0);
    normY.set(0);
    glarePctX.set(50);
    glarePctY.set(34);
  };

  return (
    <div
      ref={frameRef}
      className="relative w-full flex flex-col items-center [perspective:1100px]"
    >
      <motion.div
        style={{ y: portraitY }}
        initial={disableMotion ? false : { opacity: 0, y: 20 }}
        animate={introReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{
          duration: disableMotion ? 0 : MOTION_DURATION,
          delay: disableMotion ? 0 : 0.16,
          ease: EASE_LUXURY,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        data-cursor-label="DOSSIER"
        className="group relative z-10 w-full max-w-[290px] sm:max-w-[330px] lg:max-w-[365px] xl:max-w-[395px] aspect-[4/5]"
      >
        {/* Subtle Warm Studio Radiance behind plate */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-6 opacity-70 transition-opacity duration-700 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(ellipse 68% 62% at 50% 42%, rgba(216,195,165,0.13) 0%, rgba(138,109,75,0.06) 44%, transparent 74%)',
          }}
        />

        {/* 4 Optical Viewfinder Crop / Registration Marks outside corners */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-2.5 -left-2.5 size-4 border-t border-l border-champagne/65 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-x-0.5 group-hover:-translate-y-0.5"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-2.5 -right-2.5 size-4 border-t border-r border-ivory/65 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-2.5 -left-2.5 size-4 border-b border-l border-ivory/65 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-x-0.5 group-hover:translate-y-0.5"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-2.5 -right-2.5 size-4 border-b border-r border-champagne/65 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:translate-y-0.5"
        />

        {/* Chamfered Architectural Plate Container */}
        <motion.div
          style={
            enable3D
              ? {
                  rotateX,
                  rotateY,
                  transformStyle: 'preserve-3d',
                  clipPath: PLATE_CHAMFER_CLIP,
                }
              : { clipPath: PLATE_CHAMFER_CLIP }
          }
          whileTap={disableMotion ? undefined : { scale: 0.99 }}
          className="relative w-full h-full overflow-hidden bg-obsidian shadow-[0_28px_72px_rgba(0,0,0,0.68)] will-change-transform"
        >
          {/* Scroll-linked scale + touch vertical parallax */}
          <motion.div
            style={{
              scale: portraitScale,
              y: canHoverFine ? 0 : touchPortraitShift,
            }}
            className="w-full h-full will-change-transform"
          >
            {/* Subtle counter-parallax portrait image */}
            <motion.div
              style={enable3D ? { x: imgParallaxX, y: imgParallaxY } : undefined}
              className="w-full h-full will-change-transform"
            >
              <img
                src={personalData.portraitPath}
                alt="Potret studio Aflan Mu'afa Dzulfiqar"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="w-full h-full object-cover object-[50%_18%] scale-[1.02] group-hover:scale-[1.045] brightness-[0.98] contrast-[1.02] group-hover:brightness-[1.03] group-hover:contrast-[1.05] transition-[transform,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transform-none"
              />
            </motion.div>
          </motion.div>

          {/* Subtle Desktop Specular Sheen */}
          {enable3D && (
            <motion.div
              aria-hidden="true"
              style={{ background: specularBg }}
              className="pointer-events-none absolute inset-0 z-10 mix-blend-soft-light opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
          )}

          {/* Seamless Studio Vignette Dissolve into #171615 */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_92%_86%_at_50%_40%,transparent_48%,rgba(23,22,21,0.72)_88%,#171615_100%)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 z-10 bg-linear-to-t from-obsidian via-obsidian/55 to-transparent"
          />

          {/* Authoritative 1-Line Dual-Tone Engraved Signature */}
          <div className="absolute inset-x-0 bottom-0 z-20 px-4 sm:px-6 pb-5 sm:pb-6 pt-12 flex justify-center">
            <p
              aria-label="Mu'afa Dzulfiqar"
              className="select-none flex items-baseline justify-center gap-x-2.5 whitespace-nowrap text-lg sm:text-xl md:text-[1.4rem] tracking-[0.08em] leading-none font-serif italic font-medium"
            >
              <span className="text-engraved-brown">MU&apos;AFA</span>{' '}
              <span className="text-engraved-ivory">DZULFIQAR</span>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
