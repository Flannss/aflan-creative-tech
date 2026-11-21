import React from 'react';
import { personalData } from '@/data/personal';

interface EditorialMarqueeProps {
  items?: readonly string[];
  variant?: 'espresso' | 'ivory' | 'obsidian';
}

export const EditorialMarquee: React.FC<EditorialMarqueeProps> = ({
  items = personalData.marqueeTerms,
  variant = 'espresso',
}) => {
  const variantClasses = {
    espresso: 'bg-espresso border-y border-champagne/15 text-ivory',
    obsidian: 'bg-obsidian border-y border-champagne/15 text-ivory',
    ivory: 'bg-ivory border-y border-espresso/15 text-espresso',
  }[variant];

  const isLight = variant === 'ivory';

  const renderGroup = (prefix: string, ariaHidden = false) => (
    <div
      key={prefix}
      aria-hidden={ariaHidden}
      className="flex items-center shrink-0 gap-8 sm:gap-12 pr-8 sm:pr-12"
    >
      {items.map((term, idx) => {
        const isOutlined = idx % 2 === 1;
        return (
          <React.Fragment key={`${prefix}-${term}-${idx}`}>
            <span
              className={`font-serif text-2xl sm:text-3xl md:text-4xl tracking-[0.14em] uppercase whitespace-nowrap ${
                isOutlined
                  ? isLight
                    ? 'editorial-outline-dark italic'
                    : 'editorial-outline italic'
                  : isLight
                    ? 'text-espresso font-normal'
                    : 'text-ivory font-light'
              }`}
            >
              {term}
            </span>
            <span
              aria-hidden="true"
              className={`inline-block w-1.5 h-1.5 rotate-45 shrink-0 ${
                isLight ? 'bg-mocha' : 'bg-champagne/65'
              }`}
            />
          </React.Fragment>
        );
      })}
    </div>
  );

  return (
    <div
      className={`aflan-marquee-wrapper relative w-full overflow-hidden py-4 sm:py-5 select-none ${variantClasses}`}
      role="region"
      aria-label="AFLAN identity keywords"
    >
      <div className="aflan-marquee-track">
        {renderGroup('primary', false)}
        {renderGroup('duplicate', true)}
      </div>
    </div>
  );
};
