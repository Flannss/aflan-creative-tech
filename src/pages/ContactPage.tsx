import React, { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useReducedMotion,
} from 'framer-motion';
import {
  ArrowUpRight,
  Check,
  Clock,
  Copy,
  Github,
  Link2,
  Loader2,
  Mail,
  MessageCircle,
  Send,
} from 'lucide-react';
import { contactData } from '@/data/contact';
import { personalData } from '@/data/personal';
import { Reveal } from '@/components/motion/Reveal';
import { TextReveal } from '@/components/motion/TextReveal';
import { useToast } from '@/hooks/useToast';
import { EASE_LUXURY } from '@/utils/motion';

interface FormValues {
  name: string;
  email: string;
  topic: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

type SubmitPhase = 'idle' | 'loading' | 'success';

const TOPICS = [
  'Kolaborasi Web Development',
  'Diskusi Proyek / QA',
  'Akademik & Riset',
  'Percakapan Umum',
];

const ERROR_SHAKE_KEYFRAMES = [0, -7, 7, -5, 5, -2, 2, 0];

function getPurwokertoTime(): string {
  try {
    return new Intl.DateTimeFormat('id-ID', {
      timeZone: personalData.timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date());
  } catch {
    return '--:--';
  }
}

export const ContactPage: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const copyTimerRef = useRef<number | null>(null);
  const submitTimerRef = useRef<number | null>(null);
  const resetSuccessTimerRef = useRef<number | null>(null);

  const [localTime, setLocalTime] = useState<string>(() => getPurwokertoTime());
  const { showToast } = useToast();
  const prefersReducedMotion = useReducedMotion();

  const [values, setValues] = useState<FormValues>({
    name: '',
    email: '',
    topic: TOPICS[0],
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitPhase, setSubmitPhase] = useState<SubmitPhase>('idle');
  const [preparedDraft, setPreparedDraft] = useState<{
    mailtoHref: string;
    whatsappHref: string;
    plainText: string;
  } | null>(null);

  const nameShake = useAnimationControls();
  const emailShake = useAnimationControls();
  const messageShake = useAnimationControls();
  const submitShake = useAnimationControls();

  useEffect(() => {
    const timer = window.setInterval(() => {
      setLocalTime(getPurwokertoTime());
    }, 30000);

    return () => {
      window.clearInterval(timer);
      if (copyTimerRef.current !== null) window.clearTimeout(copyTimerRef.current);
      if (submitTimerRef.current !== null) window.clearTimeout(submitTimerRef.current);
      if (resetSuccessTimerRef.current !== null) {
        window.clearTimeout(resetSuccessTimerRef.current);
      }
    };
  }, []);

  const copyValue = async (
    id: string,
    text: string,
    toastTitle: string,
    toastDetail?: string,
  ) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      showToast(toastTitle, toastDetail ?? text);
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
      copyTimerRef.current = window.setTimeout(() => {
        setCopiedId((current) => (current === id ? null : current));
      }, 3000);
    } catch {
      showToast('Salin Manual', text);
    }
  };

  const validate = (form: FormValues): FormErrors => {
    const nextErrors: FormErrors = {};
    if (form.name.trim().length < 2) {
      nextErrors.name = 'Mohon isi nama Anda minimal 2 karakter.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      nextErrors.email = 'Mohon masukkan alamat email yang valid.';
    }
    if (form.message.trim().length < 15) {
      nextErrors.message = 'Mohon tuliskan pesan singkat minimal 15 karakter.';
    }
    return nextErrors;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitPhase === 'loading') return;

    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setPreparedDraft(null);
      setSubmitPhase('idle');
      if (!prefersReducedMotion) {
        const shakeAnimation = {
          x: ERROR_SHAKE_KEYFRAMES,
          transition: { duration: 0.42, ease: EASE_LUXURY },
        };
        if (validationErrors.name) void nameShake.start(shakeAnimation);
        if (validationErrors.email) void emailShake.start(shakeAnimation);
        if (validationErrors.message) void messageShake.start(shakeAnimation);
        void submitShake.start(shakeAnimation);
      }
      return;
    }

    const subject = `[AFLAN Portfolio] ${values.topic} — dari ${values.name.trim()}`;
    const bodyLines = [
      'Halo Aflan,',
      '',
      `Nama: ${values.name.trim()}`,
      `Email: ${values.email.trim()}`,
      `Topik: ${values.topic}`,
      '',
      'Pesan:',
      values.message.trim(),
    ].join('\n');

    const mailtoHref = `mailto:${contactData.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(bodyLines)}`;

    const whatsappHref = `${contactData.whatsappHref}?text=${encodeURIComponent(
      bodyLines,
    )}`;

    setSubmitPhase('loading');

    if (submitTimerRef.current !== null) {
      window.clearTimeout(submitTimerRef.current);
    }
    if (resetSuccessTimerRef.current !== null) {
      window.clearTimeout(resetSuccessTimerRef.current);
    }

    const loadingMs = prefersReducedMotion ? 120 : 620;
    submitTimerRef.current = window.setTimeout(() => {
      submitTimerRef.current = null;
      setPreparedDraft({
        mailtoHref,
        whatsappHref,
        plainText: `${subject}\n\n${bodyLines}`,
      });
      setSubmitPhase('success');
      showToast('Draf Terkirim & Siap', 'Lanjutkan pengiriman lewat Email atau WhatsApp.');

      const tempLink = document.createElement('a');
      tempLink.href = mailtoHref;
      tempLink.click();

      resetSuccessTimerRef.current = window.setTimeout(() => {
        resetSuccessTimerRef.current = null;
        setSubmitPhase('idle');
      }, 3200);
    }, loadingMs);
  };

  return (
    <div className="w-full overflow-x-clip">
      <section className="bg-ivory text-espresso pt-28 sm:pt-36 lg:pt-40 pb-16 sm:pb-24 px-6 sm:px-8 lg:px-12 border-b border-espresso/15">
        <div className="max-w-[1440px] mx-auto">
          <Reveal
            variant="up"
            className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-espresso/15"
          >
            <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.28em] uppercase text-mocha">
              BAB 09 — KONTAK &amp; KORESPONDENSI
            </span>
            <span className="inline-flex items-center gap-2 font-mono text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-espresso/75">
              <Clock className="size-3.5 text-mocha" aria-hidden="true" />
              WAKTU LOKAL PURWOKERTO · {localTime} WIB
            </span>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-12 lg:pt-14 items-end">
            <div className="lg:col-span-7">
              <TextReveal
                as="h1"
                immediate
                className="font-serif text-[2.25rem] sm:text-5xl md:text-6xl lg:text-[5rem] leading-[1.04] lg:leading-[0.96] font-light"
                lines={[
                  <>Mari mulai</>,
                  <>
                    <span className="italic text-mocha">Percakapan Bermakna</span>.
                  </>,
                ]}
              />
            </div>

            <Reveal variant="up" delay={0.14} className="lg:col-span-5">
              <p className="font-sans text-[15px] sm:text-base text-charcoal/80 leading-relaxed">
                {contactData.availabilityNote} Hubungi langsung lewat email, WhatsApp,
                Instagram, atau susun draf pesan terstruktur melalui formulir di bawah.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-obsidian text-ivory py-16 sm:py-24 lg:py-28 px-6 sm:px-8 lg:px-12">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
          <Reveal variant="up" className="lg:col-span-5 space-y-6">
            <p className="font-mono text-[11px] tracking-[0.26em] uppercase text-champagne">
              KANAL KOMUNIKASI RESMI
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
              {contactData.channels.map((channel) => {
                const isCopied = copiedId === channel.id;
                const isEmail = channel.id === 'email';
                return (
                  <div
                    key={channel.id}
                    className={`p-6 bg-espresso/65 border border-champagne/20 hover:border-champagne/55 transition-colors flex flex-col justify-between space-y-4 ${
                      isEmail ? 'md:col-span-2 lg:col-span-1' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 sm:gap-4">
                      <div className="min-w-0 flex-1">
                        <span className="block font-mono text-[10px] tracking-[0.24em] uppercase text-champagne">
                          {channel.label}
                        </span>{' '}
                        <a
                          href={channel.href}
                          target={channel.external ? '_blank' : undefined}
                          rel={channel.external ? 'noopener noreferrer' : undefined}
                          className={`block font-serif text-ivory hover:text-champagne transition-colors mt-1 ${
                            isEmail
                              ? 'text-[clamp(0.98rem,4.1vw,1.35rem)] md:text-[1.45rem] lg:text-[clamp(1.02rem,1.45vw,1.48rem)] sm:whitespace-nowrap wrap-break-word'
                              : 'text-xl sm:text-2xl lg:text-[1.6rem] wrap-break-word'
                          }`}
                        >
                          {channel.value}
                        </a>
                      </div>
                      <a
                        href={channel.href}
                        target={channel.external ? '_blank' : undefined}
                        rel={channel.external ? 'noopener noreferrer' : undefined}
                        aria-label={`Buka ${channel.label}`}
                        className="shrink-0 size-10 rounded-full border border-champagne/30 flex items-center justify-center text-champagne hover:bg-champagne hover:text-obsidian active:scale-95 transition-all"
                      >
                        <ArrowUpRight className="size-4" aria-hidden="true" />
                      </a>
                    </div>

                    <div className="pt-3 border-t border-champagne/15 flex flex-wrap items-center justify-between gap-3">
                      <span className="font-sans text-sm lg:text-xs text-taupe">
                        {channel.displayHint}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          copyValue(
                            channel.id,
                            channel.value,
                            `${channel.label} Tersalin`,
                            channel.value,
                          )
                        }
                        aria-label={`Salin ${channel.label}`}
                        className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] uppercase text-champagne hover:text-ivory transition-colors cursor-pointer"
                      >
                        {isCopied ? (
                          <>
                            <Check className="size-3.5" aria-hidden="true" />
                            Tersalin
                          </>
                        ) : (
                          <>
                            <Copy className="size-3.5" aria-hidden="true" />
                            Salin
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}

              <div className="md:col-span-2 lg:col-span-1 p-6 bg-chocolate/65 border border-champagne/20 font-mono text-[11px] tracking-[0.16em] uppercase text-ivory/85 flex flex-col justify-between gap-4 lg:mt-2">
                <div className="space-y-1.5">
                  <p className="text-champagne">BASIS &amp; INSTITUSI</p>
                  <p>{contactData.location}</p>
                  <p>{`${personalData.university} · ${personalData.studyProgram}`}</p>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-champagne/15">
                  <a
                    href={contactData.githubHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-ivory hover:text-champagne transition-colors"
                  >
                    <Github className="size-3.5" aria-hidden="true" />
                    GitHub (Flannss)
                    <ArrowUpRight className="size-3" aria-hidden="true" />
                  </a>
                  <button
                    type="button"
                    onClick={() =>
                      copyValue(
                        'site-link',
                        personalData.siteUrl,
                        'Tautan Portofolio Tersalin',
                        personalData.siteUrl,
                      )
                    }
                    aria-label="Salin tautan portofolio"
                    className="inline-flex items-center gap-1.5 text-champagne hover:text-ivory transition-colors cursor-pointer"
                  >
                    {copiedId === 'site-link' ? (
                      <>
                        <Check className="size-3.5" aria-hidden="true" />
                        Link Tersalin
                      </>
                    ) : (
                      <>
                        <Link2 className="size-3.5" aria-hidden="true" />
                        Salin Link
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal variant="up" delay={0.1} className="lg:col-span-7">
            <div className="bg-ivory text-espresso border border-champagne/25 p-6 sm:p-10 lg:p-12 shadow-2xl">
              <div className="pb-6 mb-8 border-b border-espresso/15">
                <p className="font-mono text-[11px] tracking-[0.26em] uppercase text-mocha">
                  PENYUSUN PESAN
                </p>
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light mt-2">
                  Siapkan catatan langsung untuk Aflan
                </h2>
                <p className="font-sans text-sm sm:text-[15px] lg:text-sm text-charcoal/75 mt-2 leading-relaxed">
                  Portofolio ini tidak menyimpan data di server pihak ketiga. Pengiriman akan
                  memvalidasi pesan Anda lalu membuka draf siap kirim lewat Email atau
                  WhatsApp resmi Aflan.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <motion.div animate={nameShake} className="will-change-transform">
                    <label
                      htmlFor="contact-name"
                      className="block font-mono text-[10px] tracking-[0.22em] uppercase text-mocha mb-2"
                    >
                      Nama Anda *
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      value={values.name}
                      onChange={(e) => {
                        setValues((v) => ({ ...v, name: e.target.value }));
                        if (errors.name) setErrors((err) => ({ ...err, name: undefined }));
                        if (submitPhase === 'success') setSubmitPhase('idle');
                      }}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? 'contact-name-error' : undefined}
                      placeholder="Nama lengkap Anda"
                      className={`w-full px-4 py-3 bg-offwhite border text-espresso text-base sm:text-sm placeholder:text-espresso/40 focus:border-mocha focus:outline-hidden transition-colors ${
                        errors.name ? 'border-mocha' : 'border-espresso/25'
                      }`}
                    />
                    {errors.name && (
                      <p
                        id="contact-name-error"
                        role="alert"
                        className="mt-1.5 font-sans text-sm lg:text-xs font-medium text-mocha border-l-2 border-mocha pl-2.5"
                      >
                        {errors.name}
                      </p>
                    )}
                  </motion.div>

                  <motion.div animate={emailShake} className="will-change-transform">
                    <label
                      htmlFor="contact-email"
                      className="block font-mono text-[10px] tracking-[0.22em] uppercase text-mocha mb-2"
                    >
                      Email Anda *
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      value={values.email}
                      onChange={(e) => {
                        setValues((v) => ({ ...v, email: e.target.value }));
                        if (errors.email) setErrors((err) => ({ ...err, email: undefined }));
                        if (submitPhase === 'success') setSubmitPhase('idle');
                      }}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'contact-email-error' : undefined}
                      placeholder="nama@domain.com"
                      className={`w-full px-4 py-3 bg-offwhite border text-espresso text-base sm:text-sm placeholder:text-espresso/40 focus:border-mocha focus:outline-hidden transition-colors ${
                        errors.email ? 'border-mocha' : 'border-espresso/25'
                      }`}
                    />
                    {errors.email && (
                      <p
                        id="contact-email-error"
                        role="alert"
                        className="mt-1.5 font-sans text-sm lg:text-xs font-medium text-mocha border-l-2 border-mocha pl-2.5"
                      >
                        {errors.email}
                      </p>
                    )}
                  </motion.div>
                </div>

                <div>
                  <span className="block font-mono text-[10px] tracking-[0.22em] uppercase text-mocha mb-2.5">
                    Topik
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {TOPICS.map((topic) => {
                      const active = values.topic === topic;
                      return (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => setValues((v) => ({ ...v, topic }))}
                          aria-pressed={active}
                          className={`px-3.5 py-2.5 lg:py-2 rounded-full font-mono text-[10px] tracking-[0.16em] uppercase border transition-colors cursor-pointer ${
                            active
                              ? 'bg-espresso text-ivory border-espresso'
                              : 'bg-offwhite text-espresso border-espresso/20 hover:border-mocha'
                          }`}
                        >
                          {topic}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <motion.div animate={messageShake} className="will-change-transform">
                  <label
                    htmlFor="contact-message"
                    className="block font-mono text-[10px] tracking-[0.22em] uppercase text-mocha mb-2"
                  >
                    Pesan *
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    value={values.message}
                    onChange={(e) => {
                      setValues((v) => ({ ...v, message: e.target.value }));
                      if (errors.message) {
                        setErrors((err) => ({ ...err, message: undefined }));
                      }
                      if (submitPhase === 'success') setSubmitPhase('idle');
                    }}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={
                      errors.message ? 'contact-message-error' : undefined
                    }
                    placeholder="Ceritakan ide, kebutuhan proyek, atau pertanyaan Anda..."
                    className={`w-full px-4 py-3 bg-offwhite border text-espresso text-base sm:text-sm placeholder:text-espresso/40 focus:border-mocha focus:outline-hidden resize-y transition-colors ${
                      errors.message ? 'border-mocha' : 'border-espresso/25'
                    }`}
                  />
                  {errors.message && (
                    <p
                      id="contact-message-error"
                      role="alert"
                      className="mt-1.5 font-sans text-sm lg:text-xs font-medium text-mocha border-l-2 border-mocha pl-2.5"
                    >
                      {errors.message}
                    </p>
                  )}
                </motion.div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <motion.div animate={submitShake} className="will-change-transform">
                    <button
                      type="submit"
                      disabled={submitPhase === 'loading'}
                      aria-busy={submitPhase === 'loading'}
                      className={`inline-flex items-center justify-center gap-2.5 w-full sm:w-auto sm:min-w-[250px] px-7 py-3.5 rounded-full font-mono text-xs tracking-[0.2em] uppercase active:scale-[0.97] transition-all duration-300 cursor-pointer disabled:cursor-wait ${
                        submitPhase === 'success'
                          ? 'bg-mocha text-ivory'
                          : 'bg-espresso text-ivory hover:bg-mocha'
                      }`}
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {submitPhase === 'loading' && (
                          <motion.span
                            key="loading"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.22, ease: EASE_LUXURY }}
                            className="inline-flex items-center gap-2.5"
                          >
                            <Loader2
                              className="size-4 animate-spin text-champagne"
                              aria-hidden="true"
                            />
                            Menyiapkan Draf...
                          </motion.span>
                        )}

                        {submitPhase === 'success' && (
                          <motion.span
                            key="success"
                            initial={{ opacity: 0, scale: 0.92 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            transition={{ duration: 0.28, ease: EASE_LUXURY }}
                            className="inline-flex items-center gap-2.5 text-champagne"
                          >
                            <Check className="size-4 stroke-[2.5]" aria-hidden="true" />
                            Terkirim · Draf Siap
                          </motion.span>
                        )}

                        {submitPhase === 'idle' && (
                          <motion.span
                            key="idle"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.22, ease: EASE_LUXURY }}
                            className="inline-flex items-center gap-2.5"
                          >
                            <Send className="size-4" aria-hidden="true" />
                            Siapkan &amp; Buka Draf Email
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                  </motion.div>

                  <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-espresso/60">
                    TERINTEGRASI EMAIL &amp; WHATSAPP
                  </span>
                </div>
              </form>

              <AnimatePresence>
                {preparedDraft && (
                  <motion.div
                    initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.42, ease: EASE_LUXURY }}
                    role="status"
                    aria-live="polite"
                    className="mt-8 p-6 bg-espresso text-ivory border border-champagne/30 space-y-4"
                  >
                    <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-champagne">
                      DRAF SIAP — PILIH KANAL PENGIRIMAN
                    </p>
                    <p className="font-sans text-[15px] sm:text-base lg:text-sm text-ivory/85 leading-relaxed">
                      Pesan Anda lolos validasi dan diarahkan ke aplikasi email menuju{' '}
                      <span className="text-champagne">{contactData.email}</span>. Anda juga
                      dapat mengirim draf yang sama via WhatsApp atau menyalin teksnya:
                    </p>

                    <div className="flex flex-wrap gap-3 pt-1">
                      <a
                        href={preparedDraft.mailtoHref}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-champagne text-obsidian font-mono text-[11px] tracking-[0.16em] uppercase font-medium hover:bg-ivory transition-colors"
                      >
                        <Mail className="size-3.5" aria-hidden="true" />
                        Buka Aplikasi Email
                      </a>
                      <a
                        href={preparedDraft.whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-champagne/40 text-ivory font-mono text-[11px] tracking-[0.16em] uppercase hover:border-champagne transition-colors"
                      >
                        <MessageCircle className="size-3.5" aria-hidden="true" />
                        Kirim via WhatsApp
                      </a>
                      <button
                        type="button"
                        onClick={() =>
                          copyValue(
                            'draft',
                            preparedDraft.plainText,
                            'Teks Draf Tersalin',
                            'Siap ditempel ke aplikasi pesan pilihan Anda.',
                          )
                        }
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-champagne/30 text-champagne font-mono text-[11px] tracking-[0.16em] uppercase hover:border-champagne transition-colors cursor-pointer"
                      >
                        {copiedId === 'draft' ? (
                          <>
                            <Check className="size-3.5" aria-hidden="true" />
                            Draf Tersalin
                          </>
                        ) : (
                          <>
                            <Copy className="size-3.5" aria-hidden="true" />
                            Salin Teks Draf
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};
