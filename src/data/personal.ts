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
    'Mahasiswa S1 Teknologi Informasi (TI24A) Universitas Amikom Purwokerto & Alumni SMK Wiworotomo Purwokerto. Berfokus pada frontend React/TypeScript, Flutter SOMASII, dan evaluasi QA deterministik di PT Puskomedia Indonesia Kreatif.',
  shortBio:
    'Lahir di Tangerang dan berbasis di Purwokerto, saya menempuh S1 Teknologi Informasi (TI24A) di Universitas Amikom Purwokerto setelah lulus dari SMK Wiworotomo Purwokerto. Selain membangun antarmuka web di SatuRuangCreative, aplikasi Flutter & Firebase SOMASII, serta pengalaman PKL teknis di GT Computer Purwokerto, saya tengah menjalani magang Programmer Intern di PT Puskomedia Indonesia Kreatif dengan fokus pengujian fungsional ASIS Builder.',
  extendedStory: [
    'Fondasi teknis saya berawal dari praktik perangkat keras dan dukungan teknis selama PKL 3 bulan di GT Computer Purwokerto saat kelas XI SMK Wiworotomo Purwokerto, lalu berkembang ke rekayasa perangkat lunak di Program Studi S1 Teknologi Informasi (TI24A) Universitas Amikom Purwokerto.',
    'Dalam pengembangan web dan mobile, saya mengerjakan React.js, TypeScript, dan Tailwind CSS (termasuk AFLAN DOSSIER dan inisiatif studio SatuRuangCreative), serta pengembangan aplikasi mobile kampus SOMASII menggunakan Flutter, Dart, Cloud Firestore, dan Firebase Storage.',
    'Sejak September 2026 hingga saat ini, saya menjalani peran Programmer Intern di PT Puskomedia Indonesia Kreatif dengan tanggung jawab Software Evaluation, Functional Testing, Bug Identification, dan System Requirement Analysis pada sistem internal ASIS Builder. Kebiasaan pengujian deterministik ini juga saya padukan dengan orkestrasi ekosistem AI (Gemini, ChatGPT, Muse.ai, Antigravity, dan Lunyzz) untuk menjaga kualitas produksi.',
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
      summary: 'Setiap fitur diverifikasi dengan skenario reproduktif sebelum dirilis.',
      detail:
        'Pengalaman pengujian fungsional pada ASIS Builder di PT Puskomedia Indonesia Kreatif serta audit QC otomatis membentuk disiplin pelacakan edge-case, validasi responsivitas lintas viewport, dan dokumentasi bug yang terukur.',
    },
    {
      number: 'II',
      title: 'Arsitektur Komponen Presisi',
      summary: 'Struktur modular yang ringan, mudah diaudit, dan bebas bloat.',
      detail:
        'Diterapkan pada AFLAN DOSSIER, platform web SatuRuangCreative, dan alur real-time CRUD di SOMASII dengan pemisahan data TypeScript yang rapi, kontras warna terukur, dan transisi GPU-only.',
    },
    {
      number: 'III',
      title: 'Atribusi & Fakta Terverifikasi',
      summary: 'Kredibilitas dibangun dari ruang lingkup kerja yang transparan.',
      detail:
        'Setiap proyek disajikan sesuai kontribusi aktual, termasuk kepatuhan NDA pada ASIS Builder, status Academic Final Project pada SOMASII, serta kredensial resmi CCNA Cisco (Jul 2026) dan publikasi JPMBA Garuda (Okt 2026).',
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
    label: 'Beranda',
    shortLabel: 'Beranda',
    path: '/',
    subtitle: 'Editorial Opening & Digital Identity',
  },
  {
    index: '02',
    label: 'Tentang',
    shortLabel: 'Tentang',
    path: '/about',
    subtitle: 'Personal Dossier, Magang & Background',
  },
  {
    index: '03',
    label: 'Perjalanan',
    shortLabel: 'Perjalanan',
    path: '/journey',
    subtitle: 'Puskomedia, GT Computer, Amikom & Timeline',
  },
  {
    index: '04',
    label: 'Keahlian',
    shortLabel: 'Keahlian',
    path: '/skills',
    subtitle: 'Core Capabilities · Web, Mobile, QA & AI',
  },
  {
    index: '05',
    label: 'Proyek',
    shortLabel: 'Proyek',
    path: '/projects',
    subtitle: 'Selected Works · SatuRuangCreative, SOMASII & ASIS',
  },
  {
    index: '06',
    label: 'Creative Lab',
    shortLabel: 'Lab',
    path: '/lab',
    subtitle: 'Interactive UI Experiments & Motion Workbench',
  },
  {
    index: '07',
    label: 'Galeri',
    shortLabel: 'Galeri',
    path: '/gallery',
    subtitle: 'Visual Archive · Monograph & Tonal Studies',
  },
  {
    index: '08',
    label: 'Pencapaian',
    shortLabel: 'Pencapaian',
    path: '/achievements',
    subtitle: 'Verified Honors · CCNA (Jul 2026) & JPMBA (Okt 2026)',
  },
  {
    index: '09',
    label: 'Kontak',
    shortLabel: 'Kontak',
    path: '/contact',
    subtitle: 'Direct Inbox & Start a Conversation',
  },
];
