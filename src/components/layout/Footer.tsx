import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Check, Copy, Github } from 'lucide-react';
import { BrandSignature } from '@/components/brand/Monogram';
import { navigationRoutes, personalData } from '@/data/personal';
import { contactData } from '@/data/contact';
import { useToast } from '@/hooks/useToast';

export const Footer: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<number | null>(null);
  const { showToast } = useToast();
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    return () => {
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contactData.email);
      setCopied(true);
      showToast('Email Tersalin', contactData.email);
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
      copyTimerRef.current = window.setTimeout(() => setCopied(false), 3000);
    } catch {
      window.location.href = `mailto:${contactData.email}`;
    }
  };

  return (
    <footer className="relative bg-obsidian text-ivory border-t border-champagne/15 overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[440px] rounded-full opacity-35"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(118,86,65,0.45) 0%, rgba(43,29,23,0.18) 48%, rgba(23,22,21,0) 75%)',
        }}
      />

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pt-14 sm:pt-20 lg:pt-24 pb-10 sm:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 sm:pb-14 border-b border-champagne/15 items-end">
          <div className="lg:col-span-7">
            <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] font-medium text-champagne mb-3">
              KORESPONDENSI &amp; KOLABORASI
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl leading-[1.08] font-light tracking-tight text-ivory/95">
              Punya ide menarik untuk{' '}
              <span className="italic text-champagne/90">dieksplorasi bersama?</span>
            </h2>
          </div>

          <div className="lg:col-span-5 flex flex-wrap lg:justify-end gap-3">
            <Link
              to="/contact"
              data-cursor="KONTAK"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-champagne text-obsidian font-mono text-xs tracking-[0.18em] uppercase font-medium hover:bg-ivory active:scale-[0.97] transition-all"
            >
              Mulai Percakapan
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full border border-champagne/35 bg-espresso/60 text-ivory font-mono text-xs tracking-[0.16em] uppercase hover:border-champagne hover:bg-espresso active:scale-[0.97] transition-all"
            >
              {copied ? (
                <>
                  <Check className="size-3.5 text-champagne" aria-hidden="true" />
                  Email Tersalin
                </>
              ) : (
                <>
                  <Copy className="size-3.5 text-champagne" aria-hidden="true" />
                  Salin Email
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 py-14 sm:py-16 border-b border-champagne/15">
          <div className="md:col-span-2 lg:col-span-4 space-y-5">
            <BrandSignature tone="light" />
            <p className="font-sans text-sm md:text-base leading-relaxed text-ivory/80 max-w-md lg:max-w-sm">
              <span className="text-ivory font-medium">{personalData.fullName}</span>
              {` — ${personalData.positioning}. Mahasiswa ${personalData.studyProgram} di ${personalData.university}.`}
            </p>
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-taupe">
              {`${personalData.currentLocation} · ${personalData.coordinates}`}
            </p>
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <a
                href={contactData.githubHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Flannss"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-champagne/25 bg-espresso/50 font-mono text-[11px] tracking-[0.16em] uppercase text-ivory/90 hover:border-champagne hover:text-champagne active:scale-[0.97] transition-all"
              >
                <Github className="size-3.5" aria-hidden="true" />
                <span>GitHub</span>
                <ArrowUpRight className="size-3" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="md:col-span-1 lg:col-span-4">
            <p className="font-mono text-[11px] tracking-[0.26em] uppercase text-champagne mb-5">
              INDEKS HALAMAN (01 — 09)
            </p>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3 md:gap-y-2.5">
              {navigationRoutes.map((route) => (
                <li key={route.path}>
                  <Link
                    to={route.path}
                    className="group inline-flex items-baseline gap-2.5 py-0.5 text-[15px] md:text-sm text-ivory/75 hover:text-champagne transition-colors"
                  >
                    <span className="font-mono text-[10px] text-taupe group-hover:text-champagne">
                      {route.index}
                    </span>{' '}
                    <span>{route.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-1 lg:col-span-4">
            <p className="font-mono text-[11px] tracking-[0.26em] uppercase text-champagne mb-5">
              KANAL RESMI
            </p>
            <ul className="space-y-3.5">
              {contactData.channels.map((ch) => (
                <li key={ch.id}>
                  <a
                    href={ch.href}
                    target={ch.external ? '_blank' : undefined}
                    rel={ch.external ? 'noopener noreferrer' : undefined}
                    className="group flex items-center justify-between gap-3 py-2 md:py-1.5 border-b border-champagne/10 hover:border-champagne/40 transition-colors"
                  >
                    <div className="min-w-0">
                      <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-taupe">
                        {ch.label}
                      </span>{' '}
                      <span className="block text-[15px] md:text-sm text-ivory group-hover:text-champagne transition-colors wrap-break-word">
                        {ch.value}
                      </span>
                    </div>
                    <ArrowUpRight
                      className="size-4 shrink-0 text-taupe group-hover:text-champagne group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="py-10 sm:py-14 lg:py-16 select-none overflow-hidden">
          <Link
            to="/contact"
            data-cursor="HUBUNGI"
            className="group block text-center"
            aria-label="AFLAN CONNECT — Hubungi Aflan"
          >
            <div
              aria-hidden="true"
              className="flex flex-wrap items-baseline justify-center gap-x-3 sm:gap-x-6 lg:gap-x-8 leading-[0.88] lg:leading-[0.86]"
            >
              <span className="font-serif font-light tracking-[0.06em] text-[clamp(2.65rem,12.5vw,4.8rem)] md:text-[clamp(4.8rem,12.5vw,7.4rem)] lg:text-[clamp(3.6rem,13vw,11.5rem)] text-ivory group-hover:text-champagne transition-colors duration-500">
                AFLAN
              </span>{' '}
              <span className="font-serif italic font-light tracking-[0.04em] text-[clamp(2.35rem,11vw,4.3rem)] md:text-[clamp(4.2rem,11vw,6.6rem)] lg:text-[clamp(3.2rem,11.5vw,10.2rem)] editorial-outline group-hover:text-champagne/25 transition-all duration-500">
                CONNECT
              </span>
            </div>
          </Link>
        </div>

        <div className="pt-6 border-t border-champagne/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-[11px] tracking-[0.16em] uppercase text-taupe">
          <p>
            {`© ${currentYear} ${personalData.fullName} (${personalData.monogram}). Dirancang dengan presisi.`}
          </p>
          <p className="text-champagne/75">
            Tangerang → Purwokerto · Identitas Digital
          </p>
        </div>
      </div>
    </footer>
  );
};
