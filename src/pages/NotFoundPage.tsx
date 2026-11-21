import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <section className="min-h-[82vh] bg-obsidian text-ivory flex flex-col items-center justify-center px-6 sm:px-8 pt-28 pb-20 text-center">
      <span className="font-serif italic text-[clamp(4.5rem,14vw,10rem)] leading-none editorial-outline select-none">
        404
      </span>
      <p className="font-mono text-[11px] tracking-[0.28em] uppercase text-champagne mt-4 mb-3">
        BAB TIDAK TERDAFTAR
      </p>
      <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light max-w-xl mb-8">
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
