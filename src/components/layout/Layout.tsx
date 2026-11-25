import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScrollProgress } from '@/components/motion/ScrollProgress';
import { CustomCursor } from '@/components/motion/CustomCursor';
import { BackToTop } from '@/components/ui/BackToTop';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';

interface LayoutProps {
  children: React.ReactNode;
  splashActive?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, splashActive = false }) => {
  const [commandOpen, setCommandOpen] = useState(false);

  useDocumentMeta();

  useEffect(() => {
    const handleOpenCommand = () => {
      if (!splashActive) {
        setCommandOpen(true);
      }
    };
    window.addEventListener('aflan-open-command-palette', handleOpenCommand);
    return () => {
      window.removeEventListener('aflan-open-command-palette', handleOpenCommand);
    };
  }, [splashActive]);

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
      <BackToTop />
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
