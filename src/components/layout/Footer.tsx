import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Check, Copy } from 'lucide-react';
import { BrandSignature } from '@/components/brand/Monogram';
import { navigationRoutes, personalData } from '@/data/personal';
import { contactData } from '@/data/contact';

export const Footer: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<number | null>(null);
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
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
      copyTimerRef.current = window.setTimeout(() => setCopied(false), 2200);
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

      <div className="relative z-10 max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pt-20 sm:pt-28 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-16 border-b border-champagne/15 items-end">
          <div className="lg:col-span-7">
            <p className="font-mono text-[11px] tracking-[0.28em] uppercase text-champagne mb-4">
              KORESPONDENSI &amp; KOLABORASI
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.03] font-light text-ivory">
              Punya ide menarik untuk{' '}
              <span className="italic text-champagne">dieksplorasi bersama?</span>
            </h2>
          </div>

          <div className="lg:col-span-5 flex flex-wrap lg:justify-end gap-3">
            <Link
              to="/contact"
              data-cursor="KONTAK"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-champagne text-obsidian font-mono text-xs tracking-[0.18em] uppercase font-medium hover:bg-ivory transition-colors"
            >
              Mulai Percakapan
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
            <button
              type="button"
              onClick={handleCopyEmail}
              data-cursor="SALIN"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full border border-champagne/35 bg-espresso/60 text-ivory font-mono text-xs tracking-[0.16em] uppercase hover:border-champagne hover:bg-espresso transition-colors"
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

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 py-16 border-b border-champagne/15">
          <div className="md:col-span-4 space-y-5">
            <BrandSignature tone="light" />
            <p className="font-sans text-sm leading-relaxed text-ivory/75 max-w-sm">
              <span className="text-ivory font-medium">{personalData.fullName}</span> —{' '}
              {personalData.positioning}. Mahasiswa {personalData.studyProgram} di{' '}
              {personalData.university}.
            </p>
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-taupe">
              {personalData.currentLocation} · {personalData.coordinates}
            </p>
          </div>

          <div className="md:col-span-4">
            <p className="font-mono text-[11px] tracking-[0.26em] uppercase text-champagne mb-5">
              INDEKS HALAMAN (01 — 09)
            </p>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5">
              {navigationRoutes.map((route) => (
                <li key={route.path}>
                  <Link
                    to={route.path}
                    className="group inline-flex items-baseline gap-2.5 text-sm text-ivory/75 hover:text-champagne transition-colors"
                  >
                    <span className="font-mono text-[10px] text-taupe group-hover:text-champagne">
                      {route.index}
                    </span>
                    <span>{route.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
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
                    className="group flex items-center justify-between gap-3 py-1.5 border-b border-champagne/10 hover:border-champagne/40 transition-colors"
                  >
                    <div>
                      <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-taupe">
                        {ch.label}
                      </span>
                      <span className="block text-sm text-ivory group-hover:text-champagne transition-colors break-all">
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

        <div className="py-12 sm:py-16 select-none overflow-hidden">
          <Link
            to="/contact"
            data-cursor="HUBUNGI"
            className="group block text-center"
            aria-label="Hubungi Aflan"
          >
            <div className="flex flex-wrap items-baseline justify-center gap-x-4 sm:gap-x-8 leading-[0.86]">
              <span className="font-serif font-light tracking-[0.06em] text-[clamp(3.6rem,13vw,11.5rem)] text-ivory group-hover:text-champagne transition-colors duration-500">
                AFLAN
              </span>
              <span className="font-serif italic font-light tracking-[0.04em] text-[clamp(3.2rem,11.5vw,10.2rem)] editorial-outline group-hover:text-champagne/25 transition-all duration-500">
                CONNECT
              </span>
            </div>
          </Link>
        </div>

        <div className="pt-6 border-t border-champagne/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-[11px] tracking-[0.16em] uppercase text-taupe">
          <p>
            © {currentYear} {personalData.fullName} ({personalData.monogram}). Dirancang dengan presisi.
          </p>
          <p className="text-champagne/75">
            Tangerang → Purwokerto · Identitas Digital
          </p>
        </div>
      </div>
    </footer>
  );
};
