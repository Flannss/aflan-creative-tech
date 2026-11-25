import React, { useLayoutEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScrollProgress } from '@/components/motion/ScrollProgress';
import { CustomCursor } from '@/components/motion/CustomCursor';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { navigationRoutes, personalData } from '@/data/personal';

const CANONICAL_ORIGIN = personalData.siteUrl.replace(/\/$/, '');

interface LayoutProps {
  children: React.ReactNode;
  splashActive?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, splashActive = false }) => {
  const { pathname } = useLocation();
  const [commandOpen, setCommandOpen] = useState(false);

  useLayoutEffect(() => {
    delete document.documentElement.dataset.headerTheme;
    window.dispatchEvent(new Event('aflan-nav-theme-sync'));

    const matched = navigationRoutes.find((r) => r.path === pathname);
    if (matched) {
      document.title =
        matched.path === '/'
          ? "AFLAN · Aflan Mu'afa Dzulfiqar | Identitas Digital Personal"
          : `${matched.label} · AFLAN (AMDZ)`;
    } else if (pathname.startsWith('/projects/')) {
      document.title = 'Dossier Proyek · AFLAN (AMDZ)';
    } else {
      document.title = 'AFLAN · Identitas Digital Personal';
    }

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
    const twitterUrl = document.querySelector<HTMLMetaElement>('meta[name="twitter:url"]');
    if (twitterUrl) {
      twitterUrl.content = canonicalUrl;
    }
  }, [pathname]);

  return (
    <div className="relative min-h-screen flex flex-col bg-obsidian text-ivory">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-90 focus:px-4 focus:py-2 focus:bg-champagne focus:text-obsidian focus:font-mono focus:text-xs focus:uppercase focus:tracking-widest"
      >
        Lompat ke konten utama
      </a>

      <div className="aflan-grain-overlay" aria-hidden="true" />

      <ScrollProgress />
      <CustomCursor />
      <Navbar onOpenCommandPalette={() => setCommandOpen(true)} />

      <main id="main-content" className="flex-1 w-full">
        {children}
      </main>

      <Footer onOpenCommandPalette={() => setCommandOpen(true)} />
      <CommandPalette
        open={commandOpen}
        onOpenChange={setCommandOpen}
        disabled={splashActive}
      />
    </div>
  );
};
