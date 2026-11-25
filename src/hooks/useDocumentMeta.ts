import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { personalData } from '@/data/personal';
import { getProjectBySlug } from '@/data/projects';

const CANONICAL_ORIGIN = personalData.siteUrl.replace(/\/$/, '');

const ROUTE_TITLES: Record<string, string> = {
  '/': "AFLAN DOSSIER — Aflan Mu'afa Dzulfiqar · Creative Technologist",
  '/about': 'AFLAN DOSSIER — Personal Dossier',
  '/journey': 'AFLAN DOSSIER — Experience & Journey',
  '/skills': 'AFLAN DOSSIER — Core Capabilities',
  '/projects': 'AFLAN DOSSIER — Selected Works',
  '/lab': 'AFLAN DOSSIER — Creative Lab',
  '/gallery': 'AFLAN DOSSIER — Visual Archive',
  '/achievements': 'AFLAN DOSSIER — Verified Honors',
  '/contact': 'AFLAN DOSSIER — Start a Conversation',
};

/**
 * Synchronizes dynamic document.title, canonical URL, Open Graph/Twitter titles,
 * and header contrast theme across client-side routes.
 */
export function useDocumentMeta(): void {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    delete document.documentElement.dataset.headerTheme;
    window.dispatchEvent(new Event('aflan-nav-theme-sync'));

    let nextTitle = ROUTE_TITLES[pathname];
    if (!nextTitle) {
      if (pathname.startsWith('/projects/')) {
        const slug = pathname.slice('/projects/'.length);
        const matchedProject = getProjectBySlug(slug);
        nextTitle = matchedProject
          ? `AFLAN DOSSIER — ${matchedProject.title}`
          : 'AFLAN DOSSIER — Case Study Not Found';
      } else {
        nextTitle = '404 · AFLAN DOSSIER — Archive Not Found';
      }
    }

    document.title = nextTitle;

    const canonicalUrl =
      pathname === '/' ? `${CANONICAL_ORIGIN}/` : `${CANONICAL_ORIGIN}${pathname}`;

    const canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.href = canonicalUrl;
    }

    const ogUrl = document.querySelector<HTMLMetaElement>('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.content = canonicalUrl;
    }

    const ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.content = nextTitle;
    }

    const twitterUrl = document.querySelector<HTMLMetaElement>('meta[name="twitter:url"]');
    if (twitterUrl) {
      twitterUrl.content = canonicalUrl;
    }

    const twitterTitle = document.querySelector<HTMLMetaElement>(
      'meta[name="twitter:title"]',
    );
    if (twitterTitle) {
      twitterTitle.content = nextTitle;
    }
  }, [pathname]);
}
