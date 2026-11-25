import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { ToastContext, type ToastPayload } from '@/hooks/useToast';
import { EASE_LUXURY } from '@/utils/motion';

const TOAST_DURATION_MS = 3000;

interface ToastProviderProps {
  children: React.ReactNode;
}

/**
 * Global luxury "Toast Drop" notification provider.
 * Slides softly from the top edge for 3 seconds using GPU-only transform & opacity.
 */
export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toast, setToast] = useState<ToastPayload | null>(null);
  const timerRef = useRef<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const clearExistingTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => clearExistingTimer, [clearExistingTimer]);

  const showToast = useCallback(
    (title: string, detail?: string) => {
      clearExistingTimer();
      const id = Date.now();
      setToast({ id, title, detail });

      timerRef.current = window.setTimeout(() => {
        setToast((current) => (current?.id === id ? null : current));
        timerRef.current = null;
      }, TOAST_DURATION_MS);
    },
    [clearExistingTimer],
  );

  const dismissToast = useCallback(() => {
    clearExistingTimer();
    setToast(null);
  }, [clearExistingTimer]);

  const contextValue = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {typeof document !== 'undefined' &&
        createPortal(
          <div
            aria-live="polite"
            aria-atomic="true"
            aria-label="Notifikasi sistem"
            className="pointer-events-none fixed inset-x-0 top-20 sm:top-24 z-[110] flex justify-center px-4 sm:px-6"
          >
            <AnimatePresence mode="wait">
              {toast && (
                <motion.div
                  key={toast.id}
                  role="status"
                  initial={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, y: -22, scale: 0.96 }
                  }
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, y: -14, scale: 0.97 }
                  }
                  transition={{ duration: 0.42, ease: EASE_LUXURY }}
                  className="pointer-events-auto relative overflow-hidden max-w-md w-full sm:w-auto min-w-[240px] rounded-2xl bg-obsidian/95 backdrop-blur-md border border-champagne/40 text-ivory shadow-[0_24px_64px_rgba(0,0,0,0.68)] px-4 sm:px-5 py-3.5"
                >
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="shrink-0 size-7 rounded-full bg-champagne text-obsidian flex items-center justify-center"
                    >
                      <Check className="size-3.5 stroke-[2.4]" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-champagne">
                        {toast.title}
                      </p>
                      {toast.detail && (
                        <p className="font-sans text-xs text-ivory/80 mt-0.5 truncate max-w-[240px] sm:max-w-[320px]">
                          {toast.detail}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={dismissToast}
                      aria-label="Tutup notifikasi"
                      className="shrink-0 size-7 rounded-full flex items-center justify-center text-champagne/70 hover:text-champagne hover:bg-espresso/80 transition-colors cursor-pointer"
                    >
                      <X className="size-3.5" aria-hidden="true" />
                    </button>
                  </div>

                  {/* GPU scaleX countdown hairline */}
                  {!prefersReducedMotion && (
                    <motion.span
                      aria-hidden="true"
                      initial={{ scaleX: 1 }}
                      animate={{ scaleX: 0 }}
                      transition={{ duration: TOAST_DURATION_MS / 1000, ease: 'linear' }}
                      className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-champagne/75 will-change-transform"
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  );
};
