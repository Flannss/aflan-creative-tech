import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <section className="min-h-[82vh] bg-obsidian text-ivory flex flex-col items-center justify-center px-4 sm:px-6 pt-24 pb-16 text-center">
      <span className="font-serif italic text-[clamp(4.5rem,14vw,8.5rem)] leading-none editorial-outline select-none">
        404
      </span>
      <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] font-medium text-champagne mt-4 mb-3">
        BAB TIDAK TERDAFTAR
      </p>
      <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-tight max-w-xl mb-8 text-ivory/95">
        Halaman yang Anda tuju tidak terdapat di dalam arsip AFLAN.
      </h1>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-champagne text-obsidian font-mono text-xs tracking-[0.18em] uppercase font-medium hover:bg-ivory transition-colors"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Kembali ke Beranda
      </Link>
    </section>
  );
};
