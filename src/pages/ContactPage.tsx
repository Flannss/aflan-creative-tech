import React, { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useReducedMotion,
} from 'framer-motion';
import {
  AlertCircle,
  ArrowUpRight,
  Check,
  Clock,
  Copy,
  Github,
  Instagram,
  Link2,
  Loader2,
  Mail,
  MapPin,
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
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

type SubmitPhase = 'idle' | 'loading' | 'success' | 'error';

const CONTACT_ENDPOINT =
  import.meta.env.VITE_CONTACT_ENDPOINT ||
  'https://formsubmit.co/ajax/aflanmuafazulfiqar02@gmail.com';

const SUBJECT_PRESETS = [
  'Kolaborasi Web Development',
  'Software QA & Evaluasi',
  'Peluang Magang / Proyek',
  'Akademik & Diskusi Umum',
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
  const resetSuccessTimerRef = useRef<number | null>(null);

  const [localTime, setLocalTime] = useState<string>(() => getPurwokertoTime());
  const { showToast } = useToast();
  const prefersReducedMotion = useReducedMotion();

  const [values, setValues] = useState<FormValues>({
    name: '',
    email: '',
    subject: SUBJECT_PRESETS[0],
    message: '',
  });
  const [honey, setHoney] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitPhase, setSubmitPhase] = useState<SubmitPhase>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isActivationNotice, setIsActivationNotice] = useState<boolean>(false);

  const nameShake = useAnimationControls();
  const emailShake = useAnimationControls();
  const subjectShake = useAnimationControls();
  const messageShake = useAnimationControls();
  const submitShake = useAnimationControls();

  useEffect(() => {
    const timer = window.setInterval(() => {
      setLocalTime(getPurwokertoTime());
    }, 30000);

    return () => {
      window.clearInterval(timer);
      if (copyTimerRef.current !== null) window.clearTimeout(copyTimerRef.current);
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
      nextErrors.name = 'Mohon isi nama lengkap minimal 2 karakter.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      nextErrors.email = 'Mohon masukkan format alamat email yang valid.';
    }
    if (form.subject.trim().length < 3) {
      nextErrors.subject = 'Mohon pilih atau tulis subjek minimal 3 karakter.';
    }
    if (form.message.trim().length < 15) {
      nextErrors.message = 'Mohon tuliskan pesan minimal 15 karakter agar konteks jelas.';
    }
    return nextErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitPhase === 'loading') return;

    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setFeedbackMessage(null);
      setSubmitPhase('idle');
      if (!prefersReducedMotion) {
        const shakeAnimation = {
          x: ERROR_SHAKE_KEYFRAMES,
          transition: { duration: 0.42, ease: EASE_LUXURY },
        };
        if (validationErrors.name) void nameShake.start(shakeAnimation);
        if (validationErrors.email) void emailShake.start(shakeAnimation);
        if (validationErrors.subject) void subjectShake.start(shakeAnimation);
        if (validationErrors.message) void messageShake.start(shakeAnimation);
        void submitShake.start(shakeAnimation);
      }
      return;
    }

    if (honey.trim().length > 0) {
      setSubmitPhase('success');
      return;
    }

    setSubmitPhase('loading');
    setFeedbackMessage(null);
    setIsActivationNotice(false);

    if (resetSuccessTimerRef.current !== null) {
      window.clearTimeout(resetSuccessTimerRef.current);
    }

    const trimmedName = values.name.trim();
    const trimmedEmail = values.email.trim();
    const trimmedSubject = values.subject.trim();
    const trimmedMessage = values.message.trim();

    const formData = new FormData();
    formData.append('name', trimmedName);
    formData.append('email', trimmedEmail);
    formData.append('subject', trimmedSubject);
    formData.append('message', trimmedMessage);
    formData.append('_subject', `[AFLAN DOSSIER] Pesan dari ${trimmedName}`);
    formData.append('_replyto', trimmedEmail);
    formData.append('_template', 'table');
    formData.append('_captcha', 'false');
    formData.append('_honey', '');

    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      });

      const data: { success?: boolean | string; message?: string } | null =
        await res.json().catch(() => null);

      const isSuccess =
        res.ok && (data?.success === true || data?.success === 'true');

      if (!isSuccess) {
        const serverMessage = typeof data?.message === 'string' ? data.message : '';
        throw new Error(
          serverMessage || `HTTP ${res.status}: Pengiriman tidak dapat diproses oleh server.`,
        );
      }

      setSubmitPhase('success');
      setIsActivationNotice(false);
      setFeedbackMessage(
        `Terima kasih, ${trimmedName}. Pesan Anda telah terkirim langsung ke inbox Aflan (${contactData.email}) dan akan dibalas ke ${trimmedEmail}.`,
      );
      setValues({
        name: '',
        email: '',
        subject: SUBJECT_PRESETS[0],
        message: '',
      });
      showToast('Pesan Terkirim Langsung', 'Pesan Anda telah masuk ke inbox Aflan.');

      resetSuccessTimerRef.current = window.setTimeout(() => {
        resetSuccessTimerRef.current = null;
        setSubmitPhase('idle');
      }, 4200);
    } catch (err) {
      if (import.meta.env.DEV) {
        console.warn('[ContactPage] Direct email submission error:', err);
      }

      const rawErrorMessage = err instanceof Error ? err.message : '';
      const requiresActivation = /activat(e|ion)/i.test(rawErrorMessage);

      setSubmitPhase('error');
      setIsActivationNotice(requiresActivation);
      setFeedbackMessage(
        requiresActivation
          ? 'Endpoint pengiriman langsung sedang menunggu konfirmasi aktivasi pertama di kotak masuk email tujuan. Sementara aktivasi diselesaikan, silakan salin alamat email Aflan atau hubungi langsung via WhatsApp di bawah ini.'
          : 'Koneksi pengiriman langsung sedang terkendala. Silakan salin alamat email Aflan dalam 1 klik atau hubungi langsung via WhatsApp di bawah ini.',
      );
      if (!prefersReducedMotion) {
        void submitShake.start({
          x: ERROR_SHAKE_KEYFRAMES,
          transition: { duration: 0.42, ease: EASE_LUXURY },
        });
      }
    }
  };

  return (
    <div className="w-full overflow-x-clip">
      <section className="bg-ivory text-espresso pt-24 sm:pt-28 lg:pt-32 pb-16 md:pb-24 px-4 sm:px-6 lg:px-12 border-b border-espresso/15">
        <div className="max-w-[1440px] mx-auto">
          <Reveal
            variant="up"
            className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-espresso/15"
          >
            <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.25em] whitespace-nowrap font-medium text-[#8A6D4B]">
              BAB 09 / KONTAK &amp; KORESPONDENSI
            </span>
            <span className="inline-flex items-center gap-2 text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] whitespace-nowrap font-medium text-[#8A6D4B]">
              <Clock className="size-3.5" aria-hidden="true" />
              PURWOKERTO · {localTime} WIB
            </span>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-10 lg:pt-12 items-end">
            <div className="lg:col-span-7">
              <TextReveal
                as="h1"
                immediate
                className="font-serif text-3xl sm:text-4xl md:text-5xl leading-[1.08] font-light tracking-tight text-espresso/90"
                lines={[
                  <>Mari mulai</>,
                  <>
                    <span className="italic text-[#8A6D4B]">Korespondensi Langsung</span>.
                  </>,
                ]}
              />
            </div>

            <Reveal variant="up" delay={0.12} className="lg:col-span-5">
              <p className="font-sans text-sm md:text-base text-espresso/80 leading-relaxed max-w-prose">
                {contactData.availabilityNote} Kirim pesan langsung ke inbox saya melalui
                formulir tanpa perlu membuka aplikasi email terpisah, atau gunakan kanal
                kontak cepat di samping.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-obsidian text-ivory py-16 md:py-24 px-4 sm:px-6 lg:px-12">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* KOLOM KIRI: KANAL LANGSUNG, KETERSEDIAAN & KONTAK CEPAT */}
          <Reveal variant="up" className="lg:col-span-5 min-w-0 space-y-6">
            {/* Availability & Location Header Card */}
            <div className="w-full max-w-full min-w-0 overflow-hidden p-5 sm:p-6 bg-espresso/75 border border-champagne/25 space-y-4">
              <div className="flex items-center justify-between gap-3 pb-3 border-b border-champagne/15">
                <span className="inline-flex items-center gap-2 text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] whitespace-nowrap text-champagne">
                  <span
                    aria-hidden="true"
                    className="size-2 rounded-full bg-champagne shadow-[0_0_10px_rgba(216,195,165,0.8)]"
                  />
                  STATUS KETERSEDIAAN
                </span>
                <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] whitespace-nowrap text-taupe">
                  {localTime} WIB
                </span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-light tracking-tight text-ivory/95 leading-snug">
                {contactData.availabilityStatus}
              </h2>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono uppercase tracking-[0.14em] text-champagne/85">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-champagne" aria-hidden="true" />
                  Purwokerto, Jawa Tengah
                </span>
                <span className="text-taupe">·</span>
                <span className="text-ivory/80">{personalData.studyProgram}</span>
              </div>
            </div>

            {/* Kontainer Kontak Cepat terpisah secara visual dari Form */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.25em] whitespace-nowrap font-medium text-champagne">
                  KONTAK CEPAT
                </p>
                <span className="text-[10px] font-mono uppercase tracking-[0.15em] whitespace-nowrap text-taupe">
                  SALIN &amp; TAUTAN LANGSUNG
                </span>
              </div>

              {/* Primary Email Copy Card */}
              <div className="w-full max-w-full min-w-0 overflow-hidden p-5 sm:p-6 bg-espresso/55 border border-champagne/20 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <span className="block text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] text-champagne">
                      EMAIL RESMI
                    </span>
                    <p className="font-serif text-lg sm:text-xl text-ivory mt-1 break-all">
                      {contactData.email}
                    </p>
                  </div>
                  <span
                    aria-hidden="true"
                    className="shrink-0 size-9 rounded-full border border-champagne/25 flex items-center justify-center text-champagne"
                  >
                    <Mail className="size-4" />
                  </span>
                </div>

                <div className="pt-3 border-t border-champagne/15 flex flex-wrap items-center justify-between gap-3">
                  <span className="font-sans text-xs text-ivory/70">
                    Respon utama untuk proyek, magang &amp; kolaborasi
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      copyValue(
                        'email',
                        contactData.email,
                        'Email Tersalin',
                        contactData.email,
                      )
                    }
                    aria-label="Salin alamat email resmi Aflan"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-champagne text-obsidian text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] whitespace-nowrap font-medium hover:bg-ivory active:scale-[0.97] transition-all cursor-pointer"
                  >
                    {copiedId === 'email' ? (
                      <>
                        <Check className="size-3.5" aria-hidden="true" />
                        Tersalin
                      </>
                    ) : (
                      <>
                        <Copy className="size-3.5" aria-hidden="true" />
                        Salin Email
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Quick Channel Cards: WhatsApp, Instagram, GitHub */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
                <a
                  href={contactData.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-5 bg-espresso/45 border border-champagne/15 hover:border-champagne/55 transition-colors flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="shrink-0 size-10 rounded-full border border-champagne/25 bg-obsidian/60 flex items-center justify-center text-champagne">
                      <MessageCircle className="size-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <span className="block text-[10px] font-mono uppercase tracking-[0.15em] text-champagne">
                        WHATSAPP
                      </span>
                      <span className="block font-serif text-lg text-ivory group-hover:text-champagne transition-colors truncate">
                        {contactData.whatsappNumber}
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight
                    className="size-4 shrink-0 text-champagne/75 group-hover:text-champagne group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                    aria-hidden="true"
                  />
                </a>

                <a
                  href={contactData.instagramHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-5 bg-espresso/45 border border-champagne/15 hover:border-champagne/55 transition-colors flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="shrink-0 size-10 rounded-full border border-champagne/25 bg-obsidian/60 flex items-center justify-center text-champagne">
                      <Instagram className="size-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <span className="block text-[10px] font-mono uppercase tracking-[0.15em] text-champagne">
                        INSTAGRAM
                      </span>
                      <span className="block font-serif text-lg text-ivory group-hover:text-champagne transition-colors truncate">
                        {contactData.instagramHandle}
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight
                    className="size-4 shrink-0 text-champagne/75 group-hover:text-champagne group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                    aria-hidden="true"
                  />
                </a>

                <a
                  href={contactData.githubHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group sm:col-span-2 lg:col-span-1 p-5 bg-espresso/45 border border-champagne/15 hover:border-champagne/55 transition-colors flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="shrink-0 size-10 rounded-full border border-champagne/25 bg-obsidian/60 flex items-center justify-center text-champagne">
                      <Github className="size-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <span className="block text-[10px] font-mono uppercase tracking-[0.15em] text-champagne">
                        GITHUB
                      </span>
                      <span className="block font-serif text-lg text-ivory group-hover:text-champagne transition-colors truncate">
                        {contactData.githubHandle}
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight
                    className="size-4 shrink-0 text-champagne/75 group-hover:text-champagne group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                    aria-hidden="true"
                  />
                </a>
              </div>

              {/* Portfolio Link Quick Copy */}
              <div className="w-full max-w-full min-w-0 overflow-hidden p-4 sm:p-5 bg-chocolate/55 border border-champagne/15 flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="block text-[10px] font-mono uppercase tracking-[0.15em] text-champagne">
                    TAUTAN RESMI DOSSIER
                  </span>
                  <span className="block font-sans text-xs text-ivory/80 truncate mt-0.5">
                    {personalData.siteDomain}
                  </span>
                </div>
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
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-champagne/30 text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] whitespace-nowrap text-champagne hover:border-champagne hover:text-ivory transition-colors cursor-pointer"
                >
                  {copiedId === 'site-link' ? (
                    <>
                      <Check className="size-3.5" aria-hidden="true" />
                      Tersalin
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
          </Reveal>

          {/* KOLOM KANAN: FORM PESAN LANGSUNG KE INBOX */}
          <Reveal variant="up" delay={0.1} className="lg:col-span-7 min-w-0">
            <div className="w-full max-w-full min-w-0 overflow-hidden bg-ivory text-espresso border border-champagne/25 p-5 sm:p-10 lg:p-12 shadow-2xl">
              <div className="pb-6 mb-8 border-b border-espresso/15 space-y-2">
                <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.25em] whitespace-nowrap font-medium text-[#8A6D4B]">
                  KIRIM PESAN LANGSUNG
                </p>
                <h2 className="font-serif text-3xl md:text-4xl font-light tracking-tight text-espresso/95">
                  Langsung ke Inbox Aflan
                </h2>
                <p className="font-sans text-sm md:text-base text-espresso/80 leading-relaxed max-w-prose">
                  Tulis pesan Anda di bawah ini. Pengiriman dilakukan langsung secara
                  asinkron ke inbox email saya tanpa perlu membuka atau login ke aplikasi
                  Gmail Anda.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {/* Hidden Honeypot Anti-Spam Field */}
                <input
                  type="text"
                  name="_honey"
                  value={honey}
                  onChange={(e) => setHoney(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="hidden"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <motion.div animate={nameShake} className="min-w-0 will-change-transform">
                    <label
                      htmlFor="contact-name"
                      className="block text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] font-medium text-[#8A6D4B] mb-2"
                    >
                      NAMA LENGKAP *
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={values.name}
                      onChange={(e) => {
                        setValues((v) => ({ ...v, name: e.target.value }));
                        if (errors.name) setErrors((err) => ({ ...err, name: undefined }));
                        if (submitPhase === 'success' || submitPhase === 'error') {
                          setSubmitPhase('idle');
                        }
                      }}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? 'contact-name-error' : undefined}
                      placeholder="Nama lengkap Anda"
                      className={`w-full px-4 py-3 bg-offwhite border text-espresso text-sm md:text-base placeholder:text-espresso/45 focus:border-[#8A6D4B] focus:ring-2 focus:ring-champagne/60 focus:outline-hidden transition-all ${
                        errors.name ? 'border-mocha' : 'border-espresso/20'
                      }`}
                    />
                    {errors.name && (
                      <p
                        id="contact-name-error"
                        role="alert"
                        className="mt-1.5 font-sans text-xs font-medium text-mocha border-l-2 border-mocha pl-2.5"
                      >
                        {errors.name}
                      </p>
                    )}
                  </motion.div>

                  <motion.div animate={emailShake} className="min-w-0 will-change-transform">
                    <label
                      htmlFor="contact-email"
                      className="block text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] font-medium text-[#8A6D4B] mb-2"
                    >
                      ALAMAT EMAIL *
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={values.email}
                      onChange={(e) => {
                        setValues((v) => ({ ...v, email: e.target.value }));
                        if (errors.email) setErrors((err) => ({ ...err, email: undefined }));
                        if (submitPhase === 'success' || submitPhase === 'error') {
                          setSubmitPhase('idle');
                        }
                      }}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'contact-email-error' : undefined}
                      placeholder="nama@domain.com"
                      className={`w-full px-4 py-3 bg-offwhite border text-espresso text-sm md:text-base placeholder:text-espresso/45 focus:border-[#8A6D4B] focus:ring-2 focus:ring-champagne/60 focus:outline-hidden transition-all ${
                        errors.email ? 'border-mocha' : 'border-espresso/20'
                      }`}
                    />
                    {errors.email && (
                      <p
                        id="contact-email-error"
                        role="alert"
                        className="mt-1.5 font-sans text-xs font-medium text-mocha border-l-2 border-mocha pl-2.5"
                      >
                        {errors.email}
                      </p>
                    )}
                  </motion.div>
                </div>

                <motion.div
                  animate={subjectShake}
                  className="min-w-0 space-y-3 will-change-transform"
                >
                  <label
                    htmlFor="contact-subject"
                    className="block text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] font-medium text-[#8A6D4B]"
                  >
                    SUBJEK / TOPIK *
                  </label>
                  <div className="w-full max-w-full min-w-0 flex flex-nowrap overflow-x-auto scrollbar-hide gap-2 pb-1">
                    {SUBJECT_PRESETS.map((preset) => {
                      const active = values.subject === preset;
                      return (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => {
                            setValues((v) => ({ ...v, subject: preset }));
                            if (errors.subject) {
                              setErrors((err) => ({ ...err, subject: undefined }));
                            }
                          }}
                          aria-pressed={active}
                          className={`shrink-0 px-3.5 py-2 rounded-full text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] whitespace-nowrap border transition-colors cursor-pointer ${
                            active
                              ? 'bg-espresso text-ivory border-espresso font-medium'
                              : 'bg-offwhite text-espresso/80 border-espresso/20 hover:border-[#8A6D4B]'
                          }`}
                        >
                          {preset}
                        </button>
                      );
                    })}
                  </div>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    value={values.subject}
                    onChange={(e) => {
                      setValues((v) => ({ ...v, subject: e.target.value }));
                      if (errors.subject) {
                        setErrors((err) => ({ ...err, subject: undefined }));
                      }
                    }}
                    aria-invalid={Boolean(errors.subject)}
                    aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
                    placeholder="Tulis subjek atau pilih preset di atas"
                    className={`w-full px-4 py-3 bg-offwhite border text-espresso text-sm md:text-base placeholder:text-espresso/45 focus:border-[#8A6D4B] focus:ring-2 focus:ring-champagne/60 focus:outline-hidden transition-all ${
                      errors.subject ? 'border-mocha' : 'border-espresso/20'
                    }`}
                  />
                  {errors.subject && (
                    <p
                      id="contact-subject-error"
                      role="alert"
                      className="font-sans text-xs font-medium text-mocha border-l-2 border-mocha pl-2.5"
                    >
                      {errors.subject}
                    </p>
                  )}
                </motion.div>

                <motion.div animate={messageShake} className="will-change-transform">
                  <label
                    htmlFor="contact-message"
                    className="block text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] font-medium text-[#8A6D4B] mb-2"
                  >
                    PESAN *
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
                      if (submitPhase === 'success' || submitPhase === 'error') {
                        setSubmitPhase('idle');
                      }
                    }}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={
                      errors.message ? 'contact-message-error' : undefined
                    }
                    placeholder="Ceritakan kebutuhan proyek, ruang lingkup kolaborasi, atau pertanyaan Anda..."
                    className={`w-full px-4 py-3 bg-offwhite border text-espresso text-sm md:text-base placeholder:text-espresso/45 focus:border-[#8A6D4B] focus:ring-2 focus:ring-champagne/60 focus:outline-hidden resize-y transition-all ${
                      errors.message ? 'border-mocha' : 'border-espresso/20'
                    }`}
                  />
                  {errors.message && (
                    <p
                      id="contact-message-error"
                      role="alert"
                      className="mt-1.5 font-sans text-xs font-medium text-mocha border-l-2 border-mocha pl-2.5"
                    >
                      {errors.message}
                    </p>
                  )}
                </motion.div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  <motion.div
                    animate={submitShake}
                    className="w-full sm:w-auto max-w-full will-change-transform"
                  >
                    <button
                      type="submit"
                      disabled={submitPhase === 'loading'}
                      aria-busy={submitPhase === 'loading'}
                      className={`inline-flex items-center justify-center text-center gap-2.5 w-full sm:w-auto max-w-full sm:min-w-[240px] px-5 sm:px-7 py-3.5 rounded-full text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] font-medium active:scale-[0.97] transition-all duration-300 cursor-pointer disabled:opacity-75 disabled:cursor-wait ${
                        submitPhase === 'success'
                          ? 'bg-[#8A6D4B] text-ivory'
                          : 'bg-espresso text-ivory hover:bg-[#8A6D4B]'
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
                            Mengirim...
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
                            Pesan Terkirim
                          </motion.span>
                        )}

                        {(submitPhase === 'idle' || submitPhase === 'error') && (
                          <motion.span
                            key="idle"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.22, ease: EASE_LUXURY }}
                            className="inline-flex items-center gap-2.5"
                          >
                            <Send className="size-4" aria-hidden="true" />
                            Kirim Pesan Langsung
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                  </motion.div>

                  <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-espresso/60">
                    LANGSUNG KE INBOX · TANPA REDIRECT
                  </span>
                </div>
              </form>

              {/* Inline Confirmation / Graceful Fallback Banner */}
              <AnimatePresence>
                {feedbackMessage && submitPhase === 'success' && (
                  <motion.div
                    key="success-banner"
                    initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.4, ease: EASE_LUXURY }}
                    role="status"
                    aria-live="polite"
                    className="mt-8 w-full max-w-full min-w-0 overflow-hidden p-5 sm:p-6 bg-espresso text-ivory border border-champagne/35 space-y-2.5"
                  >
                    <div className="flex items-center gap-2.5 text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] text-champagne">
                      <Check className="size-4 shrink-0" aria-hidden="true" />
                      <span>TERKIRIM LANGSUNG KE INBOX AFLAN</span>
                    </div>
                    <p className="font-sans text-sm md:text-base text-ivory/85 leading-relaxed max-w-prose break-words">
                      {feedbackMessage}
                    </p>
                  </motion.div>
                )}

                {feedbackMessage && submitPhase === 'error' && (
                  <motion.div
                    key="error-banner"
                    initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.4, ease: EASE_LUXURY }}
                    role="alert"
                    className="mt-8 w-full max-w-full min-w-0 overflow-hidden p-5 sm:p-6 bg-espresso text-ivory border border-champagne/35 space-y-4"
                  >
                    <div className="flex items-start sm:items-center gap-2.5 text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] text-champagne">
                      <AlertCircle className="size-4 shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
                      <span>
                        {isActivationNotice
                          ? 'MENUNGGU AKTIVASI INBOX · OPSI KONTAK LANGSUNG'
                          : 'GANGGUAN JARINGAN · OPSI ALTERNATIF CEPAT'}
                      </span>
                    </div>

                    <p className="font-sans text-sm md:text-base text-ivory/85 leading-relaxed max-w-prose">
                      {feedbackMessage}
                    </p>

                    <p className="font-mono text-xs text-champagne break-all opacity-80">
                      {contactData.email}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                      <button
                        type="button"
                        onClick={() =>
                          copyValue(
                            'fallback-email',
                            contactData.email,
                            'Email Tersalin',
                            contactData.email,
                          )
                        }
                        className="inline-flex items-center justify-center text-center gap-2 w-full sm:w-auto max-w-full px-4 py-3 rounded-full bg-champagne text-obsidian text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] font-medium hover:bg-ivory active:scale-[0.98] transition-all cursor-pointer"
                      >
                        {copiedId === 'fallback-email' ? (
                          <>
                            <Check className="size-3.5 shrink-0" aria-hidden="true" />
                            <span>Email Tersalin</span>
                          </>
                        ) : (
                          <>
                            <Copy className="size-3.5 shrink-0" aria-hidden="true" />
                            <span>Salin Alamat Email</span>
                          </>
                        )}
                      </button>

                      <a
                        href={contactData.whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center text-center gap-2 w-full sm:w-auto max-w-full px-4 py-3 rounded-full border border-champagne/40 text-ivory text-[10px] md:text-xs font-mono uppercase tracking-[0.15em] hover:border-champagne active:scale-[0.98] transition-all"
                      >
                        <MessageCircle className="size-3.5 shrink-0" aria-hidden="true" />
                        <span>Hubungi via WhatsApp</span>
                      </a>
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
