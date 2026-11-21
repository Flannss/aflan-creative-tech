import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <section className="min-h-[80vh] bg-obsidian text-ivory flex flex-col items-center justify-center px-6 sm:px-8 pt-28 pb-20 text-center">
          <p className="font-mono text-[11px] tracking-[0.28em] uppercase text-champagne mb-4">
            PEMULIHAN HALAMAN
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light max-w-xl mb-6">
            Terjadi gangguan saat memuat halaman.
          </h1>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-full bg-champagne text-obsidian font-mono text-xs tracking-[0.18em] uppercase font-medium hover:bg-ivory transition-colors"
          >
            Muat Ulang Halaman
          </button>
        </section>
      );
    }

    return this.props.children;
  }
}
