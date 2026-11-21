import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Briefcase,
  Calendar,
  Download,
  ExternalLink,
  Github,
  GraduationCap,
  MapPin,
} from 'lucide-react';
import { personalData } from '@/data/personal';
import { contactData } from '@/data/contact';
import { getProjectBySlug } from '@/data/projects';
import { calculateExactAge } from '@/utils/age';
import { Reveal } from '@/components/motion/Reveal';
import { TextReveal } from '@/components/motion/TextReveal';
import { ParallaxFrame } from '@/components/motion/ParallaxFrame';
import { MonogramMark } from '@/components/brand/Monogram';

export const AboutPage: React.FC = () => {
  const ageInfo = useMemo(() => calculateExactAge(personalData.birthDateISO), []);
  const satuRuangUrl =
    getProjectBySlug('satu-ruang-creative')?.liveUrl ??
    'https://saturuangcreative.framer.website/';

  const dossierRows = [
    { label: 'Nama Lengkap', value: personalData.fullName },
    { label: 'Posisi Fokus', value: personalData.positioning },
    { label: 'Identitas Brand', value: `${personalData.brandName} · ${personalData.monogram}` },
    { label: 'Tanggal Lahir', value: '2 Desember 2005' },
    {
      label: 'Usia Aktual',
      value: ageInfo.isBirthdayToday
        ? `${ageInfo.age} Tahun — Berulang Tahun Hari Ini`
        : `${ageInfo.age} Tahun (${ageInfo.daysUntilNextBirthday} hari menuju usia ${ageInfo.age + 1})`,
    },
    { label: 'Tempat Lahir', value: personalData.birthplace },
    { label: 'Domisili Saat Ini', value: personalData.currentLocation },
    { label: 'Universitas', value: personalData.university },
    { label: 'Program Studi', value: personalData.studyProgram },
    {
      label: 'Pengalaman Magang',
      value: `${personalData.internship.role} — ${personalData.internship.company} (${personalData.internship.period})`,
    },
    {
      label: 'Inisiatif Studio',
      value: 'Co-Founder & Web Developer — Satu Ruang Creative',
    },
  ];

  return (
    <div className="w-full overflow-x-clip">
      <section className="relative bg-ivory text-espresso pt-28 sm:pt-36 lg:pt-40 pb-20 sm:pb-28 lg:pb-32 px-6 sm:px-8 lg:px-12 border-b border-espresso/15">
        <div className="max-w-[1440px] mx-auto">
          <Reveal variant="up" className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-espresso/15">
            <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.28em] uppercase text-mocha">
              BAB 02 — TENTANG AFLAN
            </span>
            <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-espresso/70">
              {personalData.positioning}
            </span>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-10 pt-12 lg:pt-14 items-start">
            <div className="lg:col-span-8">
              <TextReveal
                as="h1"
                immediate
                className="font-serif text-[2.25rem] sm:text-5xl md:text-6xl lg:text-[4.85rem] leading-[1.04] lg:leading-[0.98] font-light text-espresso"
                lines={[
                  <>Merancang Web Software dengan</>,
                  <>
                    <span className="italic text-mocha">kepekaan editorial</span> &amp;
                    disiplin QA.
                  </>,
                ]}
              />
            </div>

            <Reveal variant="up" delay={0.14} className="lg:col-span-4 lg:pt-4 space-y-5">
              <p className="font-sans text-[15px] sm:text-base leading-relaxed text-charcoal/85">
                Berfokus pada High-Performance Web Development, pengembangan aplikasi lintas
                platform, dan evaluasi kualitas perangkat lunak yang terstruktur.
              </p>
              <div className="flex flex-wrap gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-mocha">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-3.5" aria-hidden="true" />
                  Purwokerto
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <GraduationCap className="size-3.5" aria-hidden="true" />
                  Amikom Purwokerto
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="size-3.5" aria-hidden="true" />
                  Usia {ageInfo.age}
                </span>
              </div>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 mt-14 sm:mt-20 lg:mt-24 items-start">
            <Reveal variant="clip" className="md:col-span-5">
              <figure className="group relative bg-obsidian p-4 sm:p-5 border border-espresso/20 shadow-2xl">
                <ParallaxFrame className="aspect-3/4 bg-obsidian" offset={18}>
                  <img
                    src={personalData.portraitPath}
                    alt="Studi potret editorial Aflan Mu'afa Dzulfiqar"
                    className="w-full h-full object-cover object-[50%_14%] sepia-[22%] contrast-105 group-hover:sepia-0 group-hover:contrast-100 transition-all duration-700"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-linear-to-tr from-obsidian/55 via-transparent to-transparent"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute top-4 left-4 font-mono text-[9px] tracking-[0.24em] uppercase px-2.5 py-1 bg-obsidian/75 text-champagne border border-champagne/25"
                  >
                    POTRET EDITORIAL · AMDZ
                  </span>
                </ParallaxFrame>
                <figcaption className="pt-4 pb-1 px-1 flex items-center justify-between gap-4 text-ivory">
                  <div>
                    <p className="font-serif text-lg leading-none">
                      {personalData.fullName}
                    </p>
                    <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-champagne/80 mt-1">
                      TANGERANG · PURWOKERTO · USIA {ageInfo.age}
                    </p>
                  </div>
                  <MonogramMark size={28} className="text-champagne shrink-0" />
                </figcaption>
              </figure>
            </Reveal>

            <div className="md:col-span-7 md:pl-2 lg:pl-6 space-y-10">
              <Reveal variant="up" delay={0.1}>
                <p className="font-mono text-[11px] tracking-[0.26em] uppercase text-mocha mb-4">
                  NARASI PERSONAL &amp; TEKNIS
                </p>
                <div className="space-y-5 font-sans text-base sm:text-[1.06rem] leading-[1.85] text-charcoal">
                  {personalData.extendedStory.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </Reveal>

              <Reveal variant="up" delay={0.15}>
                <div className="bg-espresso text-ivory p-6 sm:p-8 border border-espresso space-y-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.24em] uppercase text-champagne">
                      <Briefcase className="size-3.5" aria-hidden="true" />
                      PENGALAMAN PROFESIONAL TERVERIFIKASI
                    </span>
                    <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-taupe">
                      {personalData.internship.period}
                    </span>
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-light text-ivory">
                    {personalData.internship.role} —{' '}
                    <span className="italic text-champagne">
                      {personalData.internship.company}
                    </span>
                  </h2>
                  <p className="font-sans text-[15px] sm:text-base lg:text-sm text-ivory/80 leading-relaxed">
                    {personalData.internship.focus}
                  </p>
                </div>
              </Reveal>

              <Reveal variant="up" delay={0.2} className="pt-4 border-t border-espresso/15">
                <p className="font-mono text-[11px] tracking-[0.26em] uppercase text-mocha mb-4">
                  KARAKTER KERJA
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {personalData.traits.map((trait, index) => (
                    <div
                      key={trait}
                      className="flex items-center justify-between px-4 py-3.5 bg-offwhite border border-espresso/15"
                    >
                      <span className="font-serif text-lg sm:text-xl text-espresso">{trait}</span>
                      <span className="font-mono text-[10px] tracking-[0.2em] text-mocha">
                        0{index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-espresso text-ivory py-20 sm:py-28 lg:py-32 px-6 sm:px-8 lg:px-12">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-14 lg:pb-16 border-b border-champagne/15 items-end">
            <div className="lg:col-span-7">
              <p className="font-mono text-[11px] tracking-[0.28em] uppercase text-champagne mb-4">
                PRINSIP PENGEMBANGAN
              </p>
              <TextReveal
                as="h2"
                className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-[1.06] lg:leading-[1.04]"
                lines={[
                  <>Kebiasaan di balik setiap</>,
                  <>
                    <span className="italic text-champagne">build &amp; evaluasi</span>
                  </>,
                ]}
              />
            </div>
            <Reveal variant="up" delay={0.1} className="lg:col-span-5">
              <p className="font-sans text-[15px] sm:text-base text-ivory/75 leading-relaxed">
                Memadukan ketelitian Software QA dengan kepekaan antarmuka menjaga setiap
                implementasi tetap bersih, teruji, dan transparan terhadap ruang lingkupnya.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-6 lg:gap-0 divide-y md:divide-y-0 lg:divide-x divide-champagne/15 border-b border-champagne/15 md:py-10 lg:py-0">
            {personalData.philosophyPillars.map((pillar, idx) => (
              <Reveal
                key={pillar.number}
                variant="up"
                delay={idx * 0.1}
                className={`py-10 md:p-7 md:border md:border-champagne/15 lg:border-0 lg:py-14 lg:px-9 first:lg:pl-0 last:lg:pr-0 flex flex-col justify-between gap-6 ${
                  idx === personalData.philosophyPillars.length - 1
                    ? 'md:col-span-2 lg:col-span-1'
                    : ''
                }`}
              >
                <div className="space-y-4">
                  <span className="font-serif italic text-4xl sm:text-5xl text-champagne/65 block leading-none">
                    {pillar.number}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-light text-ivory">
                    {pillar.title}
                  </h3>
                  <p className="font-sans text-[15px] sm:text-base lg:text-sm font-medium text-champagne/90 leading-relaxed">
                    {pillar.summary}
                  </p>
                </div>
                <p className="font-sans text-[15px] sm:text-base lg:text-sm text-ivory/75 leading-relaxed">
                  {pillar.detail}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-offwhite text-espresso py-20 sm:py-28 lg:py-32 px-6 sm:px-8 lg:px-12">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-14 items-start">
          <Reveal variant="up" className="lg:col-span-7">
            <p className="font-mono text-[11px] tracking-[0.28em] uppercase text-mocha mb-3">
              DOSSIER TERVERIFIKASI
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-espresso mb-8 sm:mb-10">
              Spesifikasi <span className="italic text-mocha">Identitas</span>
            </h2>

            <dl className="divide-y divide-espresso/15 border-y border-espresso/15">
              {dossierRows.map((row) => (
                <div
                  key={row.label}
                  className="py-4.5 grid grid-cols-1 sm:grid-cols-12 gap-1.5 sm:gap-4"
                >
                  <dt className="sm:col-span-4 font-mono text-[11px] uppercase tracking-[0.18em] text-mocha">
                    {row.label}
                  </dt>
                  <dd className="sm:col-span-8 font-sans text-[15px] sm:text-base text-espresso">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal variant="up" delay={0.12} className="lg:col-span-5 space-y-6">
            <aside className="bg-obsidian text-ivory border border-espresso/20 p-7 sm:p-10 space-y-8 shadow-xl">
              <div className="flex items-center justify-between border-b border-champagne/15 pb-5">
                <span className="font-mono text-[10px] tracking-[0.26em] uppercase text-champagne">
                  SOROTAN TERVERIFIKASI · 2026
                </span>
                <MonogramMark size={28} className="text-champagne/80" />
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] uppercase text-taupe">
                    <Award className="size-3.5 text-champagne" aria-hidden="true" />
                    KREDENSIAL &amp; PUBLIKASI
                  </span>
                  <p className="font-serif text-2xl text-ivory leading-snug">
                    CCNA: Introduction to Networks &amp; Publikasi Jurnal Garuda
                  </p>
                  <p className="font-sans text-sm lg:text-xs text-ivory/70 leading-relaxed">
                    Cisco Networking Academy (2026) serta Jurnal Pengabdian Masyarakat
                    Bangsa (Terindeks Garuda, 2026).
                  </p>
                </div>

                <div className="pt-5 border-t border-champagne/15 space-y-2.5">
                  <span className="block font-mono text-[10px] tracking-[0.2em] uppercase text-taupe">
                    INISIATIF STUDIO MAHASISWA
                  </span>
                  <p className="font-serif text-2xl text-champagne italic leading-snug">
                    Satu Ruang Creative
                  </p>
                  <p className="font-sans text-sm lg:text-xs text-ivory/75 leading-relaxed">
                    Co-Founder &amp; Web Developer — &ldquo;Satu Ruang, Banyak Ide, Satu
                    Cerita&rdquo;.
                  </p>
                  <a
                    href={satuRuangUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 max-w-full min-w-0 pt-1 font-mono text-[10px] tracking-[0.18em] uppercase text-champagne hover:text-ivory transition-colors"
                  >
                    <span className="truncate">saturuangcreative.framer.website</span>
                    <ExternalLink className="size-3 shrink-0" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </aside>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href={contactData.cvHref}
                download={contactData.cvFilename}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Unduh CV Aflan Mu'afa Dzulfiqar"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-espresso text-ivory font-mono text-xs tracking-[0.18em] uppercase hover:bg-mocha active:scale-[0.97] transition-all"
              >
                <Download className="size-3.5" aria-hidden="true" />
                Unduh CV
              </a>
              <Link
                to="/journey"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-espresso/30 text-espresso font-mono text-xs tracking-[0.18em] uppercase hover:border-espresso hover:bg-ivory active:scale-[0.97] transition-all"
              >
                Jelajahi Perjalanan
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                to="/achievements"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-espresso/30 text-espresso font-mono text-xs tracking-[0.18em] uppercase hover:border-espresso hover:bg-ivory active:scale-[0.97] transition-all"
              >
                Pencapaian &amp; Sertifikasi
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-espresso/15 font-mono text-[11px] tracking-[0.18em] uppercase text-espresso/80">
              <a
                href={contactData.githubHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-mocha transition-colors"
              >
                <Github className="size-3.5" aria-hidden="true" />
                GitHub (Flannss)
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};
