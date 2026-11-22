import type React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE_LUXURY } from '@/utils/motion';

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
 * Tactile iOS/macOS-inspired luxury segmented control with a gliding champagne indicator pill
 * driven by Framer Motion layoutId, cubic-bezier(0.22, 1, 0.36, 1), and full keyboard arrow support.
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

  const trackClass =
    surface === 'dark'
      ? 'bg-obsidian/70 border-champagne/20'
      : 'bg-espresso/95 border-espresso/20 shadow-xs';

  const padClass =
    size === 'sm'
      ? 'px-3 py-1.5 text-[10px] tracking-[0.15em]'
      : 'px-3.5 sm:px-4 py-2 text-[10px] sm:text-[11px] tracking-[0.16em]';

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
      buttons[nextIndex]?.focus();
    }
  };

  return (
    <div
      role={roleMode}
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      className={`inline-flex flex-wrap items-center gap-1 p-1 rounded-2xl sm:rounded-full border max-w-full ${trackClass} ${className}`}
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
            className={`relative inline-flex items-center gap-1.5 rounded-xl sm:rounded-full font-mono uppercase transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-champagne ${padClass} ${
              active
                ? 'text-obsidian font-medium'
                : 'text-ivory/80 hover:text-champagne'
            }`}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                aria-hidden="true"
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { duration: 0.42, ease: EASE_LUXURY }
                }
                className="absolute inset-0 rounded-xl sm:rounded-full bg-champagne shadow-[0_4px_16px_rgba(216,195,165,0.22)]"
              />
            )}
            <span className="relative z-10 whitespace-nowrap">{option.label}</span>
            {option.badge !== undefined && (
              <span
                className={`relative z-10 text-[10px] ${
                  active ? 'text-espresso/80' : 'text-champagne/80'
                }`}
              >
                ({option.badge})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
