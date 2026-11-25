import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import type { ProjectEntry } from '@/data/projects';

const NAVIGATE_DELAY_MS = 360;

export interface PreviewOriginRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface ProjectTransitionState {
  project: ProjectEntry;
  originRect: PreviewOriginRect;
}

function getSafeOriginRect(previewEl?: HTMLElement | null): PreviewOriginRect {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  if (previewEl) {
    const rect = previewEl.getBoundingClientRect();
    if (rect.width > 24 && rect.height > 24) {
      const width = Math.min(rect.width, vw);
      const height = Math.min(rect.height, vh);
      const left = Math.max(0, Math.min(rect.left, vw - width));
      const top = Math.max(0, Math.min(rect.top, vh - height));
      return { top, left, width, height };
    }
  }

  const fallbackWidth = Math.min(vw * 0.84, 520);
  const fallbackHeight = fallbackWidth * (9 / 16);
  return {
    top: Math.max(24, (vh - fallbackHeight) / 2),
    left: Math.max(16, (vw - fallbackWidth) / 2),
    width: fallbackWidth,
    height: fallbackHeight,
  };
}

/**
 * Coordinates a cinematic click/tap transition from any project list card to its detail route.
 * Holds route navigation briefly so the preview image box expands dramatically with slow-out easing,
 * while preserving native new-tab modifier clicks and reduced-motion accessibility.
 */
export function useProjectTransition() {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const [transitionState, setTransitionState] =
    useState<ProjectTransitionState | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const triggerProjectTransition = useCallback(
    (
      e: React.MouseEvent<HTMLAnchorElement>,
      project: ProjectEntry,
      previewEl?: HTMLElement | null,
    ) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        prefersReducedMotion
      ) {
        return;
      }

      e.preventDefault();

      if (timerRef.current !== null) {
        return;
      }

      const originRect = getSafeOriginRect(previewEl);
      setTransitionState({ project, originRect });

      timerRef.current = window.setTimeout(() => {
        timerRef.current = null;
        setTransitionState(null);
        navigate(`/projects/${project.slug}`);
      }, NAVIGATE_DELAY_MS);
    },
    [navigate, prefersReducedMotion],
  );

  return {
    transitionState,
    transitioningSlug: transitionState?.project.slug ?? null,
    triggerProjectTransition,
  };
}
