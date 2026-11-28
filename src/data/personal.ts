export interface NavRoute {
  index: string;
  label: string;
  shortLabel: string;
  path: string;
  subtitle: string;
}

export interface PhilosophyPillar {
  number: string;
  title: string;
  summary: string;
  detail: string;
}

export const personalData = {
  fullName: "Aflan Mu'afa Dzulfiqar",
  firstName: 'AFLAN',
  middleName: "Mu'afa",
  lastName: 'DZULFIQAR',
  brandName: 'AFLAN',
  monogram: 'AMDZ',
  siteUrl: 'https://aflandossier.vercel.app/',
  siteDomain: 'aflandossier.vercel.app',
  birthDateISO: '2005-12-02',
  birthplace: 'Tangerang, Indonesia',
  currentLocation: 'Purwokerto, Jawa Tengah, Indonesia',
  coordinates: '7.4244° S · 109.2302° E',
  timezone: 'Asia/Jakarta',
  status: 'Mahasiswa S1 Teknologi Informasi (TI24A)',
  positioning: 'Information Technology Student · Web Developer · Software QA',
  positioningParts: [
    'Information Technology Student',
    'Web Developer',
    'Software QA',
  ],
  university: 'Universitas Amikom Purwokerto',
  studyProgram: 'S1 Teknologi Informasi (TI24A)',
  vocationalSchool: 'SMK Wiworotomo Purwokerto',
  internship: {
    role: 'Programmer Intern',
    company: 'PT Puskomedia Indonesia Kreatif',
    period: 'Sep 2026 – Sedang Berjalan',
    isActive: true,
    focus:
      'Fokus pada Software Evaluation, Functional Testing pada ASIS Builder, dan System Requirement Analysis.',
  },
  vocationalInternship: {
    role: 'Technical Support & Hardware Specialist',
    company: 'GT Computer Purwokerto',
    school: 'SMK Wiworotomo Purwokerto',
    period: 'PKL SMK · 3 Bulan (Kelas XI)',
    focus:
      'Diagnostik dan reparasi hardware/software PC & laptop, manajemen inventaris suku cadang (spare parts), serta konsultasi teknis dan pengadaan unit pelanggan.',
  },
  portraitPath: '/images/aflan.jpeg',
  headlineDescriptor:
    'Mahasiswa S1 Teknologi Informasi (TI24A) Universitas Amikom Purwokerto dan alumni SMK Wiworotomo Purwokerto. Fokus kerja saya meliputi frontend React/TypeScript, Flutter SOMASII, dan pengujian QA di PT Puskomedia Indonesia Kreatif.',
  shortBio:
    'Lahir di Tangerang dan tinggal di Purwokerto, saya menempuh S1 Teknologi Informasi (TI24A) di Universitas Amikom Purwokerto setelah lulus dari SMK Wiworotomo Purwokerto. Saya aktif membangun antarmuka web di SatuRuangCreative, mengembangkan aplikasi Flutter SOMASII, serta menjalani magang Programmer Intern di PT Puskomedia Indonesia Kreatif untuk menguji sistem ASIS Builder.',
  extendedStory: [
    'Saya mulai mengenal perbaikan sistem sejak PKL 3 bulan di GT Computer Purwokerto saat kelas XI SMK Wiworotomo Purwokerto, lalu memperdalam pengembangan perangkat lunak di Program Studi S1 Teknologi Informasi (TI24A) Universitas Amikom Purwokerto.',
    'Di sisi web dan mobile, saya mengerjakan antarmuka dengan React.js, TypeScript, dan Tailwind CSS pada AFLAN DOSSIER serta SatuRuangCreative, dan membangun aplikasi mobile SOMASII menggunakan Flutter, Dart, Cloud Firestore, serta Firebase Storage.',
    'Sejak September 2026 hingga sekarang, saya bekerja sebagai Programmer Intern di PT Puskomedia Indonesia Kreatif untuk menjalankan Software Evaluation, Functional Testing, pelacakan bug, dan System Requirement Analysis pada ASIS Builder. Dalam rutinitas kerja harian, saya memakai alat bantu AI seperti Gemini, ChatGPT, Muse.ai, Antigravity, dan Lunyzz untuk menguji alur produk dan menjaga kualitas rilis.',
  ],
  traits: [
    'Web Developer',
    'Software QA Mindset',
    'AI Agent Orchestration',
    'Flutter & Firebase',
    'Hardware Diagnostics',
    'Requirement Analyst',
  ],
  philosophyPillars: [
    {
      number: 'I',
      title: 'Pengujian Deterministik',
      summary: 'Setiap fitur diuji dengan skenario reproduktif sebelum rilis.',
      detail:
        'Pengalaman pengujian fungsional ASIS Builder di PT Puskomedia Indonesia Kreatif membiasakan saya mencatat kasus tepi, memeriksa layout di tiga ukuran layar, dan menyusun laporan bug yang mudah ditelusuri.',
    },
    {
      number: 'II',
      title: 'Arsitektur Komponen Rapi',
      summary: 'Struktur kode modular yang ringan, jelas, dan mudah dirawat.',
      detail:
        'Saya memisahkan data ke modul TypeScript, menjaga ukuran bundel tetap ringkas, dan memakai animasi berbasis GPU di AFLAN DOSSIER, SatuRuangCreative, maupun CRUD SOMASII.',
    },
    {
      number: 'III',
      title: 'Atribusi Fakta Terbuka',
      summary: 'Setiap proyek dijelaskan sesuai ruang lingkup kerja nyata.',
      detail:
        'Saya mencantumkan peran apa adanya, termasuk batasan NDA pada ASIS Builder, status Academic Final Project pada SOMASII, sertifikasi CCNA Cisco (Jul 2026), dan publikasi JPMBA Garuda (Okt 2026).',
    },
  ] satisfies PhilosophyPillar[],
  marqueeTerms: [
    "AFLAN MU'AFA DZULFIQAR",
    'WEB DEVELOPER',
    'SOFTWARE QA',
    'S1 TEKNOLOGI INFORMASI · TI24A',
    'PURWOKERTO · INDONESIA',
    'AMDZ',
  ],
} as const;

export const navigationRoutes: NavRoute[] = [
  {
    index: '01',
    label: 'Home',
    shortLabel: 'HOME',
    path: '/',
    subtitle: 'Editorial Cover, AMDZ & Works',
  },
  {
    index: '02',
    label: 'About',
    shortLabel: 'ABOUT',
    path: '/about',
    subtitle: 'Personal Dossier & Internship',
  },
  {
    index: '03',
    label: 'Journey',
    shortLabel: 'JOURNEY',
    path: '/journey',
    subtitle: 'Puskomedia, GT Computer & Amikom',
  },
  {
    index: '04',
    label: 'Skills',
    shortLabel: 'SKILLS',
    path: '/skills',
    subtitle: 'Web, Mobile, QA & AI Systems',
  },
  {
    index: '05',
    label: 'Projects',
    shortLabel: 'PROJECTS',
    path: '/projects',
    subtitle: 'Kompresor Media, SatuRuang, SOMASII & ASIS',
  },
  {
    index: '06',
    label: 'Lab',
    shortLabel: 'LAB',
    path: '/lab',
    subtitle: 'Interactive UI & Motion Workbench',
  },
  {
    index: '07',
    label: 'Gallery',
    shortLabel: 'GALLERY',
    path: '/gallery',
    subtitle: 'Portraits & Tonal Archive',
  },
  {
    index: '08',
    label: 'Honors',
    shortLabel: 'HONORS',
    path: '/achievements',
    subtitle: 'CCNA (Jul 2026) & JPMBA (Okt 2026)',
  },
  {
    index: '09',
    label: 'Contact',
    shortLabel: 'CONTACT',
    path: '/contact',
    subtitle: 'Direct Inbox & Collaboration',
  },
];
