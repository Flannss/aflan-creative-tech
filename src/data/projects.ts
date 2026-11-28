export type ProjectCategory =
  | 'QA & Evaluation'
  | 'Mobile Application'
  | 'Web Development';

export type VerificationState =
  | 'Verified Experience · NDA'
  | 'Academic Final Project'
  | 'Live Studio Initiative'
  | 'Verified Live Work';

export interface ProjectEntry {
  slug: string;
  index: string;
  title: string;
  subtitle: string;
  platform: string;
  category: ProjectCategory;
  yearLabel: string;
  verificationState: VerificationState;
  verificationNotice?: string;
  role: string;
  contributionScope: string;
  notableWork?: string;
  summary: string;
  overview: string[];
  stack: string[];
  outcomes: string[];
  previewImage?: string;
  previewImageFit?: 'cover' | 'contain';
  previewObjectPosition?: string;
  previewBg?: string;
  previewCaption: string;
  typographicDisplay?: {
    eyebrow: string;
    primaryWord: string;
    secondaryWord: string;
    footerNote: string;
  };
  featuredOnHome: boolean;
  liveRoute?: string;
  liveUrl?: string;
  liveUrlLabel?: string;
}

export const projectCategories: Array<'All' | ProjectCategory> = [
  'All',
  'Web Development',
  'Mobile Application',
  'QA & Evaluation',
];

export const projectsData: ProjectEntry[] = [
  {
    slug: 'kompresor-media',
    index: '01',
    title: 'Kompresor Media · BY AMDZ',
    subtitle:
      'Studio kompresi dan peningkatan kualitas foto 2K hingga 8K serta video 1080p HD berbasis browser lokal',
    platform: 'Web Application · Media Engineering',
    category: 'Web Development',
    yearLabel: 'Live Production',
    verificationState: 'Verified Live Work',
    role: 'Creator & Frontend Engineer',
    contributionScope:
      'Merancang antarmuka dual mode foto dan video, membangun alur kompresi serta peningkatan kualitas 100% lokal di browser dengan akselerasi perangkat keras, dan menghadirkan pratinjau Before/After interaktif tanpa unggahan server.',
    notableWork:
      'Mode RealPhoto 2K hingga 8K dengan 9 alat perbaikan piksel dan 12 filter warna, serta studio Video 1080p HD BT.709 / Vlog HD 8,5 Mbps untuk berkas 4K 60fps berdurasi 30+ menit langsung di perangkat.',
    summary:
      'Aplikasi web kompresi dan peningkatan kualitas media berbasis browser dengan mode Foto (RealPhoto 2K hingga 8K) dan Video (1080p HD BT.709) yang diproses 100% lokal tanpa unggah server maupun watermark.',
    overview: [
      'Kompresor Media · BY AMDZ (kompresor-media.vercel.app) adalah aplikasi web studio media dual mode yang menggabungkan alur kompresi ukuran berkas dan peningkatan kualitas gambar maupun video langsung di browser.',
      'Pada mode Foto, pengguna dapat mengolah hingga 9 berkas (JPG, PNG, WebP, AVIF) menggunakan preset RealPhoto 2K hingga 8K, 9 alat perbaikan piksel, 12 filter warna, serta komparasi langsung Before/After sebelum menyimpan hasil.',
      'Pada mode Video, pipeline lokal mendukung hingga 5 berkas (MP4, MOV, WebM, MKV) termasuk sumber 4K 60fps dan durasi lebih dari 30 menit ke keluaran 1080p HD BT.709 atau Vlog HD 8,5 Mbps, lengkap dengan 4 model penajaman, color grading, trim, audio, serta subtitle. Seluruh pemrosesan memakai akselerasi perangkat keras browser secara lokal tanpa unggahan server dan tanpa watermark.',
    ],
    stack: [
      'Client-Side Media Processing',
      'Browser Hardware Acceleration',
      'Before/After Studio UI',
      'Color Grading & Filters',
      'Video BT.709 & Audio Pipeline',
      'Vercel',
    ],
    outcomes: [
      'Mode Foto RealPhoto 2K hingga 8K dengan 9 alat perbaikan piksel, 12 filter warna, pratinjau Before/After, dan batch hingga 9 berkas (JPG, PNG, WebP, AVIF).',
      'Mode Video 1080p HD BT.709 dan Vlog HD 8,5 Mbps untuk sumber 4K 60fps berdurasi 30+ menit dengan 4 model penajaman, color grading, trim, audio, subtitle, hingga 5 berkas (MP4, MOV, WebM, MKV).',
      'Berjalan 100% lokal dengan akselerasi perangkat keras browser di kompresor-media.vercel.app tanpa unggahan ke server dan tanpa watermark.',
    ],
    previewImage: '/images/kompresor-media.png',
    previewImageFit: 'cover',
    previewObjectPosition: 'center top',
    previewBg: '#211814',
    previewCaption:
      'Kompresor Media · BY AMDZ · Antarmuka studio kompresi dan peningkatan kualitas foto serta video lokal.',
    featuredOnHome: true,
    liveUrl: 'https://kompresor-media.vercel.app/',
    liveUrlLabel: 'Live App',
  },
  {
    slug: 'satu-ruang-creative',
    index: '02',
    title: 'SatuRuangCreative',
    subtitle: 'Student-Built Creative & Digital Studio · "Satu Ruang, Banyak Ide, Satu Cerita"',
    platform: 'Web & Creative Studio',
    category: 'Web Development',
    yearLabel: 'Studio Aktif',
    verificationState: 'Live Studio Initiative',
    role: 'Co-Founder & Web Developer',
    contributionScope:
      'Merancang struktur UI/UX, tata letak responsif, serta implementasi kode frontend bersama tim kreatif dan teknis studio.',
    notableWork:
      'RuangHijau Nusantara: platform web edukasi lingkungan dan kalkulator dampak interaktif.',
    summary:
      'Studio kreatif dan digital mahasiswa dengan slogan "Satu Ruang, Banyak Ide, Satu Cerita" untuk mengerjakan desain antarmuka, visual, dan kode frontend.',
    overview: [
      'SatuRuangCreative dibentuk bersama tim kecil mahasiswa untuk mengerjakan desain dan produk web secara kolaboratif. Studio ini berpegang pada slogan "Satu Ruang, Banyak Ide, Satu Cerita" dalam menjaga kejelasan struktur produk.',
      'Sebagai Co-Founder & Web Developer, saya menyusun struktur UI/UX, tata letak responsif di desktop maupun ponsel, serta implementasi frontend agar rancangan visual berjalan ringan saat dibuka.',
      'Salah satu proyek utamanya adalah platform web "RuangHijau Nusantara", situs edukasi lingkungan berisi kalkulator dampak interaktif yang disusun ringkas agar mudah dipahami pembaca.',
    ],
    stack: ['UI/UX Architecture', 'Responsive Web Design', 'Frontend Implementation', 'Framer', 'Component-Based UI'],
    outcomes: [
      'Merilis profil resmi dan halaman karya studio secara live di saturuangcreative.framer.website.',
      'Membangun platform web "RuangHijau Nusantara" berisi materi edukasi lingkungan dan kalkulator dampak interaktif.',
      'Menjaga alur kerja desain ke kode frontend di tim mahasiswa dengan standar visual yang konsisten.',
    ],
    previewImage: '/images/satu-ruang-creative.png',
    previewImageFit: 'contain',
    previewObjectPosition: 'center',
    previewBg: '#33241C',
    previewCaption: 'SatuRuangCreative · Emblem visual resmi studio digital mahasiswa.',
    featuredOnHome: true,
    liveUrl: 'https://saturuangcreative.framer.website/',
    liveUrlLabel: 'Live App',
  },
  {
    slug: 'somasii-lost-and-found',
    index: '03',
    title: 'SOMASII (System Online Mahasiswa Sharing Items Information)',
    subtitle: 'Mobile Application Lost & Found berbasis Flutter & Firebase untuk lingkungan kampus',
    platform: 'Mobile Application',
    category: 'Mobile Application',
    yearLabel: 'Academic Final Project',
    verificationState: 'Academic Final Project',
    verificationNotice:
      'Lingkup proyek: Aplikasi mobile kampus (Academic Final Project) yang dikembangkan secara penuh untuk menjawab kebutuhan pencatatan, pencarian, dan verifikasi klaim barang hilang-temuan di lingkungan mahasiswa.',
    role: 'Mobile Application Developer (Academic Final Project)',
    contributionScope:
      'Mengembangkan Mobile Application berbasis Flutter & Dart beserta integrasi Firebase Authentication, Cloud Firestore untuk real-time CRUD pelaporan, Firebase Storage, kontak langsung WhatsApp, dan alur verifikasi klaim oleh admin.',
    summary:
      'Aplikasi mobile Lost & Found kampus dengan real-time CRUD pelaporan melalui Cloud Firestore, integrasi kontak langsung WhatsApp, dan verifikasi klaim kepemilikan oleh admin.',
    overview: [
      'SOMASII (System Online Mahasiswa Sharing Items Information) merupakan aplikasi mobile yang dirancang untuk menjawab permasalahan pelaporan barang hilang dan temuan yang kerap tersebar di lingkungan kampus. Dibangun menggunakan Flutter dan Dart, antarmukanya difokuskan pada alur pelaporan yang ringkas agar mahasiswa dapat mencatat serta menelusuri informasi barang secara terstruktur.',
      'Di sisi backend, SOMASII memakai Firebase Authentication untuk akses akun, Cloud Firestore untuk CRUD pelaporan secara real-time, dan Firebase Storage untuk foto barang. Koordinasi pelapor dan pemilik terhubung langsung ke WhatsApp disertai verifikasi klaim oleh admin agar serah terima barang tepat sasaran.',
    ],
    stack: ['Flutter', 'Dart', 'Firebase Authentication', 'Cloud Firestore', 'Firebase Storage', 'WhatsApp Integration'],
    outcomes: [
      'Real-time CRUD pelaporan barang hilang & temuan terintegrasi langsung dengan Cloud Firestore dan Firebase Storage.',
      'Integrasi kontak langsung via WhatsApp untuk mempercepat koordinasi antara pelapor dan pemilik barang.',
      'Sistem verifikasi klaim kepemilikan oleh admin guna memastikan validitas serah terima barang di lingkungan kampus.',
    ],
    previewImage: '/images/somasii.jpg',
    previewImageFit: 'cover',
    previewObjectPosition: 'center',
    previewBg: '#211814',
    previewCaption: 'SOMASII · Cover identitas visual resmi (System Online Mahasiswa Sharing Items Information).',
    featuredOnHome: true,
  },
  {
    slug: 'asis-builder-page-generator',
    index: '04',
    title: 'ASIS Builder (Website Template Page Generator)',
    subtitle: 'Software QA, Workflow Evaluation & rekomendasi perbaikan berbasis pengujian',
    platform: 'Internal Web System · NDA',
    category: 'QA & Evaluation',
    yearLabel: 'Magang Aktif · NDA',
    verificationState: 'Verified Experience · NDA',
    verificationNotice:
      'Kerahasiaan & Atribusi: Demi mematuhi NDA kerahasiaan sistem internal perusahaan, proyek ini disajikan murni dalam arsitektur tipografi tanpa tangkapan layar internal. Peran saya berfokus pada Software QA, evaluasi fungsional, analisis workflow, dan rekomendasi refinement, bukan pengembang utama seluruh aplikasi.',
    role: 'Software QA, Workflow Analyst & Evaluator',
    contributionScope:
      'Menjalankan Functional Testing pada modul Website Template Page Generator, menganalisis workflow pembuatan halaman, mengidentifikasi bug dan hambatan usability, serta menyusun rekomendasi penyempurnaan berbasis bukti pengujian.',
    summary:
      'Evaluasi fungsional dan analisis alur kerja pada generator template halaman berbasis Laravel, disajikan dengan pelat tipografis demi kerahasiaan NDA internal.',
    overview: [
      'ASIS Builder adalah generator template halaman internal perusahaan berbasis Laravel, PHP, Tailwind CSS, dan Alpine.js. Di proyek ini, tugas saya berpusat pada Software Quality Assurance, pengujian fungsional, dan evaluasi alur kerja.',
      'Saya memeriksa langkah pembuatan template, mencatat celah bug maupun skenario tepi, membandingkan fitur dengan System Requirements, lalu menulis catatan perbaikan untuk tim developer inti.',
    ],
    stack: ['Laravel', 'PHP', 'Tailwind CSS', 'Alpine.js', 'Functional Testing', 'Workflow Analysis'],
    outcomes: [
      'Menyusun laporan Functional Testing dan identifikasi bug yang mudah direproduksi pada alur generator.',
      'Menghasilkan analisis workflow serta rekomendasi refinement berbasis bukti pengujian aktual.',
      'Mematuhi kerahasiaan NDA internal perusahaan serta menjaga transparansi atribusi peran QA dan tim engineering inti.',
    ],
    previewBg: '#33241C',
    previewCaption: 'ASIS Builder · Presentasi tipografi arsitektural (tangkapan layar internal dilindungi NDA).',
    typographicDisplay: {
      eyebrow: 'INTERNAL SYSTEM · CONFIDENTIAL NDA',
      primaryWord: 'ASIS BUILDER',
      secondaryWord: 'QA & Workflow Evaluation',
      footerNote: 'LARAVEL · PHP · TAILWIND CSS · ALPINE.JS',
    },
    featuredOnHome: true,
  },
  {
    slug: 'aflan-digital-identity',
    index: '05',
    title: 'AFLAN DOSSIER · Personal Digital Identity',
    subtitle: 'Portofolio editorial 9 halaman, sistem motion presisi & Creative Lab interaktif',
    platform: 'Web Application',
    category: 'Web Development',
    yearLabel: 'Live Production',
    verificationState: 'Verified Live Work',
    role: 'Web Developer & UI Engineer (Proyek Pribadi)',
    contributionScope:
      'Implementasi React.js + TypeScript secara penuh, perancangan sistem warna Espresso-Champagne-Ivory dengan Tailwind CSS, koreografi motion berbasis easing editorial, serta modul interaktif di Creative Lab.',
    summary:
      'Pengalaman web personal sembilan halaman di aflandossier.vercel.app yang memadukan desain editorial dossier, pengujian QA ketat, dan arsitektur frontend React/TypeScript.',
    overview: [
      'AFLAN DOSSIER disusun sebagai web personal sembilan rute memakai sistem warna Espresso, Champagne, dan Ivory yang diuji di layar desktop, tablet, dan mobile.',
      'Seluruh konten disimpan di modul data TypeScript terpisah, terhubung ke form pesan langsung ke inbox email, Creative Lab interaktif, serta pengecekan responsif.',
    ],
    stack: ['React.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vite', 'HTML & CSS'],
    outcomes: [
      'Sembilan rute aktif terhubung ke data TypeScript terpusat dengan perpindahan halaman tanpa reload.',
      'Catatan keahlian dan pengalaman ditulis apa adanya, mencakup pengujian QA, PKL SMK, dan pemakaian ekosistem AI.',
      'Tampilan responsif di tiga ukuran layar utama dengan dukungan reduced-motion dan tombol ramah sentuh.',
    ],
    previewImage: '/images/aflan.jpeg',
    previewImageFit: 'cover',
    previewObjectPosition: '50% 18%',
    previewBg: '#211814',
    previewCaption: 'AFLAN DOSSIER · Sistem editorial personal di aflandossier.vercel.app.',
    featuredOnHome: false,
    liveUrl: 'https://aflandossier.vercel.app/',
    liveUrlLabel: 'aflandossier.vercel.app',
    liveRoute: '/lab',
  },
];

export function getProjectBySlug(slug: string): ProjectEntry | undefined {
  return projectsData.find((p) => p.slug === slug);
}
