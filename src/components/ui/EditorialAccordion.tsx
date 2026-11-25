import React, { useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { EASE_LUXURY } from '@/utils/motion';

export interface EditorialAccordionItem {
  id: string;
  eyebrow?: string;
  title: string;
  content: React.ReactNode;
}

interface EditorialAccordionProps {
  items: ReadonlyArray<EditorialAccordionItem>;
  surface?: 'dark' | 'light';
  allowMultiple?: boolean;
  defaultOpenIds?: string[];
  className?: string;
}

/**
 * Hairline-divided editorial accordion with fluid height + opacity choreography
 * and smooth 45deg Plus-to-Close icon rotation.
 */
export const EditorialAccordion: React.FC<EditorialAccordionProps> = ({
  items,
  surface = 'dark',
  allowMultiple = false,
  defaultOpenIds = [],
  className = '',
}) => {
  const [openIds, setOpenIds] = useState<string[]>(defaultOpenIds);
  const prefersReducedMotion = useReducedMotion();
  const baseId = useId();

  const toggleItem = (id: string) => {
    setOpenIds((current) => {
      const isOpen = current.includes(id);
      if (isOpen) {
        return current.filter((item) => item !== id);
      }
      return allowMultiple ? [...current, id] : [id];
    });
  };

  const borderClass =
    surface === 'dark' ? 'border-champagne/20' : 'border-espresso/15';
  const eyebrowClass =
    surface === 'dark' ? 'text-champagne/80' : 'text-[#8A6D4B]';
  const titleClass =
    surface === 'dark' ? 'text-ivory group-hover:text-champagne' : 'text-espresso group-hover:text-[#8A6D4B]';
  const bodyClass =
    surface === 'dark' ? 'text-ivory/80' : 'text-espresso/80';
  const iconWrapClass =
    surface === 'dark'
      ? 'border-champagne/25 text-champagne group-hover:border-champagne'
      : 'border-espresso/20 text-[#8A6D4B] group-hover:border-[#8A6D4B]';

  return (
    <div className={`divide-y border-y ${borderClass} ${className}`}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        const panelId = `${baseId}-panel-${item.id}`;
        const triggerId = `${baseId}-trigger-${item.id}`;

        return (
          <div key={item.id} className="min-w-0">
            <button
              id={triggerId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggleItem(item.id)}
              className="group w-full min-h-[52px] py-4 flex items-center justify-between gap-4 text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-champagne"
            >
              <div className="min-w-0 space-y-1">
                {item.eyebrow && (
                  <span
                    className={`block font-mono text-[10px] tracking-[0.2em] uppercase ${eyebrowClass}`}
                  >
                    {item.eyebrow}
                  </span>
                )}
                <span
                  className={`block font-serif text-lg sm:text-xl font-light leading-snug transition-colors duration-300 ${titleClass}`}
                >
                  {item.title}
                </span>
              </div>

              <motion.span
                aria-hidden="true"
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { duration: 0.32, ease: EASE_LUXURY }
                }
                className={`shrink-0 size-9 rounded-full border flex items-center justify-center transition-colors duration-300 ${iconWrapClass}`}
              >
                <Plus className="size-4" />
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  initial={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { height: 0, opacity: 0 }
                  }
                  animate={
                    prefersReducedMotion
                      ? { opacity: 1 }
                      : { height: 'auto', opacity: 1 }
                  }
                  exit={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { height: 0, opacity: 0 }
                  }
                  transition={
                    prefersReducedMotion
                      ? { duration: 0.14 }
                      : { duration: 0.36, ease: EASE_LUXURY }
                  }
                  className="overflow-hidden"
                >
                  <div
                    className={`pb-5 pt-1 font-sans text-sm leading-relaxed space-y-2.5 ${bodyClass}`}
                  >
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
