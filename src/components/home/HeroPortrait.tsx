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

/**
 * Living 3D editorial arch portrait for the Home Hero.
 * - Desktop fine-pointer: true 3D spring tilt, opposite-direction image counter-parallax,
 *   offset hairline depth frame, foreground plate depth lift, and dynamic Ivory-Champagne
 *   studio rim-light specular sweep driven purely via MotionValues (0 React re-renders).
 * - Tablet / Mobile touch: scroll-linked internal portrait parallax + gentle ambient rim sheen.
 * - Preserves `POTRET · I`, `AMDZ`, hairline divider, and 1-line engraved dual-tone `MU'AFA DZULFIQAR`.
 */
export const HeroPortrait: React.FC<HeroPortraitProps> = ({
  portraitY,
  portraitScale,
  introReady,
}) => {
  const archRef = useRef<HTMLDivElement | null>(null);
  const canHoverFine = useCanHoverFine();
  const prefersReducedMotion = useReducedMotion();
  const disableMotion = Boolean(prefersReducedMotion);
  const enable3D = canHoverFine && !disableMotion;

  const normX = useMotionValue(0);
  const normY = useMotionValue(0);
  const glarePctX = useMotionValue(50);
  const glarePctY = useMotionValue(32);

  const springConfig = { stiffness: 160, damping: 22, mass: 0.7 };
  const smoothNormX = useSpring(normX, springConfig);
  const smoothNormY = useSpring(normY, springConfig);
  const smoothGlareX = useSpring(glarePctX, { stiffness: 130, damping: 24 });
  const smoothGlareY = useSpring(glarePctY, { stiffness: 130, damping: 24 });

  const rotateX = useTransform(smoothNormY, [-0.5, 0.5], [5.5, -5.5]);
  const rotateY = useTransform(smoothNormX, [-0.5, 0.5], [-6.5, 6.5]);

  const imgParallaxX = useTransform(smoothNormX, [-0.5, 0.5], [10, -10]);
  const imgParallaxY = useTransform(smoothNormY, [-0.5, 0.5], [8, -8]);

  const frameOffsetX = useTransform(smoothNormX, [-0.5, 0.5], [-6, 6]);
  const frameOffsetY = useTransform(smoothNormY, [-0.5, 0.5], [-5, 5]);

  const plateOffsetX = useTransform(smoothNormX, [-0.5, 0.5], [-4, 4]);
  const plateOffsetY = useTransform(smoothNormY, [-0.5, 0.5], [-3, 3]);

  const specularBg = useMotionTemplate`radial-gradient(300px circle at ${smoothGlareX}% ${smoothGlareY}%, rgba(244,239,230,0.22) 0%, rgba(216,195,165,0.10) 36%, transparent 72%)`;

  const { scrollYProgress: touchScrollProgress } = useScroll({
    target: archRef,
    offset: ['start end', 'end start'],
  });
  const touchPortraitShift = useTransform(
    touchScrollProgress,
    [0, 1],
    !canHoverFine && !disableMotion ? [-10, 10] : [0, 0],
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
    glarePctY.set(32);
  };

  return (
    <div
      ref={archRef}
      className="relative w-full flex flex-col items-center [perspective:1100px]"
    >
      <motion.div
        style={{ y: portraitY }}
        initial={
          disableMotion
            ? false
            : { opacity: 0, y: 24, clipPath: 'inset(10% 0% 0% 0%)' }
        }
        animate={
          introReady
            ? { opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)' }
            : { opacity: 0, y: 24, clipPath: 'inset(10% 0% 0% 0%)' }
        }
        transition={{
          duration: disableMotion ? 0 : MOTION_DURATION,
          delay: disableMotion ? 0 : 0.16,
          ease: EASE_LUXURY,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        data-cursor-label="DOSSIER"
        className="group relative z-10 w-full max-w-[265px] sm:max-w-[300px] lg:max-w-[310px] xl:max-w-[340px] aspect-[3/4]"
      >
        {/* Warm studio ambient aura halo behind arch */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-4 rounded-t-full rounded-b-xl bg-[radial-gradient(circle_at_50%_40%,rgba(216,195,165,0.20)_0%,rgba(138,109,75,0.08)_46%,transparent_74%)] blur-xl opacity-55 group-hover:opacity-90 transition-opacity duration-700"
        />

        {/* Secondary architectural offset hairline frame for multi-plane depth */}
        <motion.div
          aria-hidden="true"
          style={
            enable3D
              ? { x: frameOffsetX, y: frameOffsetY }
              : undefined
          }
          className="pointer-events-none absolute inset-0 translate-x-2 translate-y-2 rounded-t-full rounded-b-lg border border-champagne/20 transition-colors duration-500 group-hover:border-champagne/40"
        />

        {/* Main 3D tilted arch container */}
        <motion.div
          style={
            enable3D
              ? {
                  rotateX,
                  rotateY,
                  transformStyle: 'preserve-3d',
                }
              : undefined
          }
          whileTap={disableMotion ? undefined : { scale: 0.985 }}
          className="relative w-full h-full rounded-t-full rounded-b-lg p-2 border border-champagne/25 bg-espresso/35 shadow-[0_32px_90px_rgba(0,0,0,0.75)] transition-colors duration-500 group-hover:border-champagne/55 will-change-transform"
        >
          <div className="relative w-full h-full rounded-t-full rounded-b-md overflow-hidden bg-obsidian">
            {/* Scroll-linked vertical parallax */}
            <motion.div
              style={{
                scale: portraitScale,
                y: canHoverFine ? 0 : touchPortraitShift,
              }}
              className="w-full h-full will-change-transform"
            >
              {/* Counter-parallax depth portrait layer */}
              <motion.div
                style={
                  enable3D
                    ? { x: imgParallaxX, y: imgParallaxY }
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
                  className="w-full h-full object-cover object-[50%_18%] scale-[1.06] group-hover:scale-[1.09] brightness-[0.98] contrast-[1.02] group-hover:brightness-[1.05] group-hover:contrast-[1.06] transition-[transform,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transform-none"
                />
              </motion.div>
            </motion.div>

            {/* Studio Specular Glass Sweep (Desktop pointer hover) */}
            {enable3D && (
              <motion.div
                aria-hidden="true"
                style={{ background: specularBg }}
                className="pointer-events-none absolute inset-0 z-10 mix-blend-soft-light opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
            )}

            {/* Touch device ambient rim-light shimmer */}
            {!canHoverFine && !disableMotion && (
              <motion.div
                aria-hidden="true"
                initial={{ opacity: 0.25, x: '-22%' }}
                animate={{
                  opacity: [0.22, 0.48, 0.22],
                  x: ['-22%', '24%', '-22%'],
                }}
                transition={{
                  duration: 9,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(115deg,transparent_28%,rgba(244,239,230,0.12)_50%,transparent_72%)]"
              />
            )}

            {/* Inner vignette depth + top arch rim catchlight */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-t-full rounded-b-md shadow-[inset_0_1px_18px_rgba(244,239,230,0.14)] bg-linear-to-t from-obsidian via-obsidian/20 to-transparent"
            />

            {/* Integrated Foreground Editorial Dossier Plate inside Arch Portrait Frame */}
            <motion.div
              style={
                enable3D
                  ? {
                      x: plateOffsetX,
                      y: plateOffsetY,
                      transform: 'translateZ(20px)',
                    }
                  : undefined
              }
              className="absolute inset-x-0 bottom-0 z-20 px-4 sm:px-5 pb-4 sm:pb-5 pt-10 sm:pt-12 flex flex-col items-center text-center bg-linear-to-t from-obsidian/95 via-obsidian/75 to-transparent will-change-transform"
            >
              <div className="w-full flex items-center justify-between text-[10px] font-mono tracking-[0.22em] uppercase text-champagne/75 pb-2.5 mb-2.5 border-b border-champagne/15">
                <span>POTRET · I</span>
                <span>AMDZ</span>
              </div>
              <p
                aria-hidden="true"
                className="select-none flex items-baseline justify-center gap-x-2 whitespace-nowrap text-lg sm:text-xl md:text-[1.45rem] tracking-[0.06em] leading-none font-serif italic font-medium"
              >
                <span className="text-engraved-brown">MU&apos;AFA</span>{' '}
                <span className="text-engraved-ivory">DZULFIQAR</span>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
