import React from 'react';

interface MonogramMarkProps {
  className?: string;
  size?: number;
}

/**
 * Custom architectural AMDZ monogram emblem.
 */
export const MonogramMark: React.FC<MonogramMarkProps> = ({
  className = '',
  size = 36,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="2"
        y="2"
        width="60"
        height="60"
        rx="10"
        stroke="currentColor"
        strokeOpacity="0.35"
        strokeWidth="1.2"
      />
      <path
        d="M17 45L32 16L47 45"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <path
        d="M23 35.5H41"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeOpacity="0.88"
      />
      <path
        d="M25.5 45L32 31.5L38.5 45"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeOpacity="0.45"
      />
      <circle cx="32" cy="46.5" r="2" fill="currentColor" />
    </svg>
  );
};

interface BrandSignatureProps {
  compact?: boolean;
  tone?: 'light' | 'dark';
}

export const BrandSignature: React.FC<BrandSignatureProps> = ({
  compact = false,
  tone = 'light',
}) => {
  const textColor = tone === 'light' ? 'text-[#F6F1E9]' : 'text-[#211814]';
  const accentColor = tone === 'light' ? 'text-[#DFC8A6]' : 'text-[#6E4F3A]';

  return (
    <span className="inline-flex items-center gap-2.5 sm:gap-3 select-none">
      <MonogramMark size={compact ? 28 : 34} className={`${accentColor} shrink-0`} />
      <span className="flex flex-col leading-none">
        <span
          className={`font-serif text-base sm:text-lg md:text-xl tracking-[0.22em] sm:tracking-[0.26em] font-medium uppercase ${textColor}`}
        >
          AFLAN
        </span>
        {!compact && (
          <>
            {' '}
            <span
              className={`font-mono text-[9px] tracking-[0.24em] sm:tracking-[0.3em] uppercase mt-0.5 ${accentColor} opacity-80`}
            >
              AMDZ · IDENTITY
            </span>
          </>
        )}
      </span>
    </span>
  );
};
