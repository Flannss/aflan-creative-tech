import React from 'react';

interface KineticLabelProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * GPU-only vertical kinetic slot hover inside a `.group` interactive control.
 * Respects `prefers-reduced-motion` via Tailwind `motion-reduce:` fallbacks.
 */
export const KineticLabel: React.FC<KineticLabelProps> = ({
  children,
  className = '',
}) => (
  <span className={`relative inline-flex overflow-hidden align-middle ${className}`}>
    <span className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[115%] motion-reduce:transform-none">
      {children}
    </span>
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 inline-block translate-y-[115%] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 motion-reduce:hidden"
    >
      {children}
    </span>
  </span>
);
