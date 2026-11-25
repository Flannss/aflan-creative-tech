import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Search } from 'lucide-react';
import { KineticLabel } from '@/components/motion/KineticLabel';

export const NotFoundPage: React.FC = () => {
  return (
    <section className="min-h-[82vh] bg-obsidian text-ivory flex flex-col items-center justify-center px-5 md:px-8 pt-28 pb-20 text-center">
      <div className="max-w-2xl mx-auto space-y-6">
        <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.18em] font-medium text-champagne">
          404 · ARCHIVE NOT FOUND / ARSIP TIDAK DITEMUKAN
        </p>

        <span
          aria-hidden="true"
          className="block font-serif italic text-7xl sm:text-8xl md:text-9xl leading-none text-engraved-champagne select-none"
        >
          404
        </span>

        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-ivory/95 leading-[1.1]">
          Halaman tidak ditemukan{' '}
          <span className="italic text-champagne/90">di dalam arsip</span>.
        </h1>

        <p className="font-sans text-sm md:text-base text-ivory/75 max-w-lg mx-auto leading-relaxed">
          Tautan yang Anda tuju mungkin telah berpindah atau belum terdaftar di dalam indeks resmi{' '}
          <span className="font-mono text-xs text-champagne">AFLAN DOSSIER</span>.
        </p>

        <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-champagne text-obsidian font-mono text-xs tracking-[0.16em] uppercase font-medium hover:bg-ivory active:scale-[0.97] transition-all"
          >
            <ArrowLeft
              className="size-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-x-1 motion-reduce:transform-none"
              aria-hidden="true"
            />
            <KineticLabel>Kembali ke Beranda</KineticLabel>
          </Link>

          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event('aflan-open-command-palette'))}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-champagne/30 bg-espresso/60 text-champagne font-mono text-xs tracking-[0.16em] uppercase hover:border-champagne hover:text-ivory active:scale-[0.97] transition-all cursor-pointer"
          >
            <Search className="size-3.5" aria-hidden="true" />
            <span>⌘K · Quick Index</span>
          </button>

          <Link
            to="/projects"
            className="group inline-flex items-center gap-1.5 px-5 py-3 rounded-full border border-champagne/20 text-ivory/85 font-mono text-xs tracking-[0.16em] uppercase hover:border-champagne hover:text-champagne active:scale-[0.97] transition-all"
          >
            <span>Selected Works</span>
            <ArrowUpRight
              className="size-3.5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};
