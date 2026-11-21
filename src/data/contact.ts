export interface ContactChannel {
  id: 'email' | 'whatsapp' | 'instagram';
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
  githubHref: 'https://github.com/Flannss',
  linkedinHref: 'https://www.linkedin.com/',
  cvHref: '#',
  location: 'Purwokerto, Jawa Tengah, Indonesia',
  availabilityNote:
    'Terbuka untuk kolaborasi Web Development, diskusi pengembangan produk digital, inisiatif akademik, maupun pertukaran ide kreatif.',
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
  ] satisfies ContactChannel[],
} as const;
