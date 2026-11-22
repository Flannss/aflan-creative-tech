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
  currentLocation: 'Purwokerto, Indonesia',
  coordinates: '7.4244° S · 109.2302° E',
  timezone: 'Asia/Jakarta',
  status: 'Mahasiswa Teknologi Informasi',
  positioning: 'Information Technology Student | Web Developer | Software Development Enthusiast',
  positioningParts: [
    'Information Technology Student',
    'Web Developer',
    'Software Development Enthusiast',
  ],
  university: 'Universitas Amikom Purwokerto',
  studyProgram: 'Teknologi Informasi',
  internship: {
    role: 'Programmer Intern',
    company: 'PT Puskomedia Indonesia Kreatif',
    period: 'Sep 2026 – Jan 2027',
    focus: 'Fokus pada Software Evaluation, Functional Testing, dan System Requirement Analysis.',
  },
  portraitPath: '/images/aflan.jpeg',
  headlineDescriptor:
    'Mahasiswa Teknologi Informasi di Universitas Amikom Purwokerto yang berfokus pada Interactive UI Implementation, Web Development, serta evaluasi kualitas perangkat lunak berbasis pengujian.',
  shortBio:
    'Lahir di Tangerang dan kini berbasis di Purwokerto, saya menempuh studi Teknologi Informasi di Universitas Amikom Purwokerto sebagai Web Developer dan Software Development Enthusiast. Selain membangun Component-Based Interface di web dan aplikasi mobile Flutter, pengalaman magang saya di PT Puskomedia Indonesia Kreatif membentuk ketelitian dalam Software Evaluation, Functional Testing, dan System Requirement Analysis.',
  extendedStory: [
    'Perjalanan saya di dunia teknologi bertumpu pada dua kebiasaan yang saling melengkapi: membangun Interactive UI yang bersih sekaligus menguji bagaimana sebuah perangkat lunak bekerja di kondisi nyata. Studi Teknologi Informasi di Universitas Amikom Purwokerto memberi fondasi teknis pengembangan perangkat lunak yang kuat untuk menjalani keduanya secara terukur.',
    'Melalui praktik langsung di Web Development—mulai dari HTML & CSS, JavaScript, React.js, hingga Tailwind CSS—didukung Working Knowledge pada TypeScript, PHP, Laravel, serta Flutter dan Firebase, saya terbiasa menerjemahkan konsep menjadi antarmuka yang responsif, terstruktur, dan nyaman digunakan.',
    'Selama menjalani peran Programmer Intern di PT Puskomedia Indonesia Kreatif (Sep 2026 – Jan 2027), fokus utama saya mencakup Software Evaluation, Functional Testing, Bug Identification, dan System Requirement Analysis, termasuk mengevaluasi alur kerja ASIS Builder. Perspektif pengujian ini membuat setiap proses development saya lebih kritis dan terarah.',
  ],
  traits: [
    'Web Developer',
    'Software QA Mindset',
    'Component-Driven Builder',
    'System Requirement Analyst',
    'Interactive UI Explorer',
    'Structured Problem Solver',
  ],
  philosophyPillars: [
    {
      number: 'I',
      title: 'Kejelasan Lewat Pengujian',
      summary: 'Software yang baik harus tahan diuji, ditelusuri, dan dipertanggungjawabkan.',
      detail:
        'Pengalaman di Functional Testing, Bug Identification, dan Requirement Analysis melatih saya untuk melihat lebih dalam dari sekadar visual—memastikan alur kerja, edge cases, dan dokumentasi berjalan solid.',
    },
    {
      number: 'II',
      title: 'Komposisi yang Disengaja',
      summary: 'Tipografi tajam dan Negative Space berbicara lebih kuat daripada halaman yang penuh sesak.',
      detail:
        'Perpaduan framing yang terukur, kontras warna hangat, tekstur halus, dan motion yang presisi mampu menghadirkan Digital Experience yang berkelas serta berkarakter.',
    },
    {
      number: 'III',
      title: 'Atribusi & Pertumbuhan Jujur',
      summary: 'Kredibilitas dibangun dari ruang lingkup kerja yang transparan dan proses belajar nyata.',
      detail:
        'Saya memegang standar kejujuran teknis: membedakan Hands-on Experience dari teknologi yang sedang dipelajari, menghargai kontribusi rekan tim, dan menghindari klaim yang berlebihan.',
    },
  ] satisfies PhilosophyPillar[],
  marqueeTerms: [
    "AFLAN MU'AFA DZULFIQAR",
    'WEB DEVELOPER',
    'INFORMATION TECHNOLOGY STUDENT',
    'SOFTWARE DEVELOPMENT ENTHUSIAST',
    'PURWOKERTO · INDONESIA',
    'AMDZ',
  ],
} as const;

export const navigationRoutes: NavRoute[] = [
  {
    index: '01',
    label: 'Beranda',
    shortLabel: 'Home',
    path: '/',
    subtitle: 'Pembuka Editorial & Identitas Digital',
  },
  {
    index: '02',
    label: 'Tentang',
    shortLabel: 'About',
    path: '/about',
    subtitle: 'Latar Belakang, Pengalaman Magang & Dossier',
  },
  {
    index: '03',
    label: 'Perjalanan',
    shortLabel: 'Journey',
    path: '/journey',
    subtitle: 'Pendidikan, Magang & Rekam Jejak Terverifikasi',
  },
  {
    index: '04',
    label: 'Keahlian',
    shortLabel: 'Skills',
    path: '/skills',
    subtitle: 'Hierarki Tipografi Kompetensi Teknis',
  },
  {
    index: '05',
    label: 'Proyek',
    shortLabel: 'Projects',
    path: '/projects',
    subtitle: 'ASIS Builder, SOMASII & Karya Terpilih',
  },
  {
    index: '06',
    label: 'Creative Lab',
    shortLabel: 'Lab',
    path: '/lab',
    subtitle: 'Sistem Visual Interaktif & Studi Motion',
  },
  {
    index: '07',
    label: 'Galeri',
    shortLabel: 'Gallery',
    path: '/gallery',
    subtitle: 'Edisi Monograf & Studi Cahaya',
  },
  {
    index: '08',
    label: 'Pencapaian',
    shortLabel: 'Honors',
    path: '/achievements',
    subtitle: 'Sertifikasi CCNA, Publikasi Garuda & Rekam Jejak',
  },
  {
    index: '09',
    label: 'Kontak',
    shortLabel: 'Contact',
    path: '/contact',
    subtitle: 'Kanal Resmi & Korespondensi Langsung',
  },
];
