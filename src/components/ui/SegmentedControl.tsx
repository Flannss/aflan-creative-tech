import type React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { SPRING_NAV_PILL } from '@/utils/motion';

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  badge?: string | number;
}

interface SegmentedControlProps<T extends string> {
  options: ReadonlyArray<SegmentedOption<T>>;
  value: T;
  onChange: (nextValue: T) => void;
  layoutId: string;
  ariaLabel: string;
  surface?: 'dark' | 'light';
  size?: 'sm' | 'md';
  roleMode?: 'tablist' | 'group';
  className?: string;
}

/**
 * Horizontal-scrollable luxury segmented control backed by Tier A `.glass-liquid-lens`
 * (`.glass-liquid-lens-light` on light sections), scroll-snap ergonomics on mobile,
 * `>= 44px` touch targets, and strict `relative isolate` + `z-0` pill + `relative z-10` label.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  layoutId,
  ariaLabel,
  surface = 'dark',
  size = 'md',
  roleMode = 'tablist',
  className = '',
}: SegmentedControlProps<T>) {
  const prefersReducedMotion = useReducedMotion();
  const isLight = surface === 'light';

  const padClass =
    size === 'sm'
      ? 'min-h-[40px] sm:min-h-[38px] px-3.5 sm:px-4 py-1.5 text-[10px] tracking-[0.14em]'
      : 'min-h-[44px] sm:min-h-[40px] px-4 sm:px-4.5 py-2 text-[10px] sm:text-[11px] tracking-[0.15em]';

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (options.length <= 1) return;
    const currentIndex = options.findIndex((o) => o.value === value);
    if (currentIndex < 0) return;

    let nextIndex: number | null = null;
    if (e.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % options.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + options.length) % options.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = options.length - 1;
    }

    if (nextIndex !== null) {
      e.preventDefault();
      onChange(options[nextIndex].value);
      const buttons = e.currentTarget.querySelectorAll<HTMLButtonElement>('button');
      const targetBtn = buttons[nextIndex];
      targetBtn?.focus();
      targetBtn?.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        inline: 'nearest',
        block: 'nearest',
      });
    }
  };

  return (
    <div
      className={`w-full max-w-full min-w-0 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-px-2 py-0.5 ${className}`}
    >
      <div
        role={roleMode}
        aria-label={ariaLabel}
        onKeyDown={handleKeyDown}
        className={`relative isolate inline-flex flex-nowrap items-center gap-1.5 p-1.5 rounded-full w-max whitespace-nowrap ${
          isLight ? 'glass-liquid-lens-light' : 'glass-liquid-lens'
        }`}
      >
        {options.map((option) => {
          const active = option.value === value;
          const tabProps =
            roleMode === 'tablist'
              ? {
                  role: 'tab' as const,
                  'aria-selected': active,
                  tabIndex: active ? 0 : -1,
                }
              : { 'aria-pressed': active };

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              {...tabProps}
              className={`relative z-10 isolate snap-start shrink-0 inline-flex items-center gap-1.5 rounded-full font-mono uppercase whitespace-nowrap transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-champagne ${padClass} ${
                isLight
                  ? active
                    ? 'text-[#F6F1E9] font-medium'
                    : 'text-[#3E2D20] hover:text-[#211814]'
                  : active
                    ? 'text-[#211814] font-medium'
                    : 'text-[#F6F1E9]/90 hover:text-[#DFC8A6]'
              }`}
            >
              {active && (
                <motion.span
                  layoutId={layoutId}
                  aria-hidden="true"
                  transition={prefersReducedMotion ? { duration: 0 } : SPRING_NAV_PILL}
                  className={`pointer-events-none absolute inset-0 z-0 rounded-full ${
                    isLight
                      ? 'bg-[#211814] shadow-[inset_0_1px_0_rgba(223,200,166,0.28),0_4px_14px_rgba(33,24,20,0.22)]'
                      : 'bg-[#DFC8A6] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_4px_14px_rgba(12,8,6,0.26)]'
                  }`}
                />
              )}
              <span className="relative z-10 whitespace-nowrap">{option.label}</span>
              {option.badge !== undefined && (
                <span
                  className={`relative z-10 text-[10px] tabular-nums whitespace-nowrap ${
                    isLight
                      ? active
                        ? 'text-[#DFC8A6]/90'
                        : 'text-[#6E4F3A]'
                      : active
                        ? 'text-[#211814]/80'
                        : 'text-[#DFC8A6]/90'
                  }`}
                >
                  ({option.badge})
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
