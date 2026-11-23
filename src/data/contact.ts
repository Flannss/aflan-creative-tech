export interface ContactChannel {
  id: 'email' | 'whatsapp' | 'instagram' | 'github';
  label: string;
  value: string;
  displayHint: string;
  href: string;
  external: boolean;
}

export const contactData = {
  email: 'aflanmuafazulfiqar02@gmail.com',
  whatsappNumber: '+6283146134546',
  whatsappHref: 'https://wa.me/6283146134546',
  instagramHandle: '@flanssly',
  instagramHref: 'https://www.instagram.com/flanssly/',
  githubHandle: 'Flannss',
  githubHref: 'https://github.com/Flannss',
  location: 'Purwokerto, Jawa Tengah, Indonesia',
  availabilityStatus: 'Terbuka untuk Kolaborasi, Proyek Web & Peluang Magang',
  availabilityNote:
    'Terbuka untuk kolaborasi Web Development, evaluasi Software QA, inisiatif akademik, maupun diskusi pengembangan produk digital.',
  channels: [
    {
      id: 'email',
      label: 'Email Resmi',
      value: 'aflanmuafazulfiqar02@gmail.com',
      displayHint: 'Utama untuk diskusi proyek, magang & korespondensi detail',
      href: 'mailto:aflanmuafazulfiqar02@gmail.com',
      external: false,
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      value: '+6283146134546',
      displayHint: 'Komunikasi langsung dan koordinasi cepat',
      href: 'https://wa.me/6283146134546',
      external: true,
    },
    {
      id: 'instagram',
      label: 'Instagram',
      value: '@flanssly',
      displayHint: 'Jurnal visual pribadi & pembaruan kreatif',
      href: 'https://www.instagram.com/flanssly/',
      external: true,
    },
    {
      id: 'github',
      label: 'GitHub',
      value: 'Flannss',
      displayHint: 'Repositori kode, eksperimen frontend & arsip proyek',
      href: 'https://github.com/Flannss',
      external: true,
    },
  ] satisfies ContactChannel[],
} as const;
