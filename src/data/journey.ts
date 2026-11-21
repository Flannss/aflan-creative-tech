export type JourneyCategory =
  | 'Pengalaman Profesional'
  | 'Pendidikan'
  | 'Proyek & Studio'
  | 'Latar Belakang';

export interface JourneyMilestone {
  id: string;
  chapter: string;
  periodLabel: string;
  category: JourneyCategory;
  title: string;
  location: string;
  summary: string;
  highlights: string[];
}

export const journeyCategories: Array<'Semua' | JourneyCategory> = [
  'Semua',
  'Pengalaman Profesional',
  'Proyek & Studio',
  'Pendidikan',
  'Latar Belakang',
];

export const journeyMilestones: JourneyMilestone[] = [
  {
    id: 'intern-puskomedia',
    chapter: '01',
    periodLabel: 'Sep 2026 – Jan 2027',
    category: 'Pengalaman Profesional',
    title: 'Programmer Intern — PT Puskomedia Indonesia Kreatif',
    location: 'Indonesia',
    summary:
      'Menjalani program magang sebagai Programmer Intern dengan fokus utama pada Software Evaluation, Functional Testing, Bug Identification, dan System Requirement Analysis—termasuk mengevaluasi alur kerja ASIS Builder.',
    highlights: [
      'Peran: Programmer Intern di PT Puskomedia Indonesia Kreatif (Sep 2026 – Jan 2027)',
      'Fokus utama: Software Evaluation, Functional Testing & System Requirement Analysis',
      'Mengevaluasi alur kerja ASIS Builder (Website Template Page Generator) dan menyusun rekomendasi perbaikan berbasis pengujian',
    ],
  },
  {
    id: 'satu-ruang-creative',
    chapter: '02',
    periodLabel: 'Studio Aktif',
    category: 'Proyek & Studio',
    title: 'Co-Founder & Web Developer — Satu Ruang Creative',
    location: 'Student-Built Creative & Digital Studio',
    summary:
      'Membangun wadah studio kreatif & digital mahasiswa ("Satu Ruang, Banyak Ide, Satu Cerita") dengan tanggung jawab pada perancangan struktur UI/UX, Responsive Web Design, dan Frontend Implementation.',
    highlights: [
      'Peran: Co-Founder & Web Developer untuk kolaborasi desain dan implementasi web',
      'Karya utama: Web prototype "RuangHijau Nusantara" (edukasi lingkungan & simulator dampak)',
      'Live showcase studio tersedia di saturuangcreative.framer.website',
    ],
  },
  {
    id: 'somasii-prototype',
    chapter: '03',
    periodLabel: 'Academic Final Project',
    category: 'Proyek & Studio',
    title: 'SOMASII — System Online MAhasiswa Sharing Items Information',
    location: 'Mobile Application · Flutter & Firebase',
    summary:
      'Merancang dan mengembangkan prototipe fungsional aplikasi mobile Lost & Found kampus menggunakan Flutter, Dart, dan Firebase (Authentication, Cloud Firestore, Storage) dengan integrasi kontak WhatsApp serta verifikasi klaim admin.',
    highlights: [
      'Status: Academic Final Project / Functional Prototype untuk lingkungan kampus',
      'Real-time CRUD pelaporan melalui Cloud Firestore & media barang di Firebase Storage',
      'Integrasi kontak langsung via WhatsApp dan sistem verifikasi klaim kepemilikan oleh admin',
    ],
  },
  {
    id: 'amikom-purwokerto',
    chapter: '04',
    periodLabel: 'Studi Sarjana · 2026',
    category: 'Pendidikan',
    title: 'Teknologi Informasi — Universitas Amikom Purwokerto',
    location: 'Purwokerto, Indonesia',
    summary:
      'Menempuh pendidikan sarjana Program Studi Teknologi Informasi di Universitas Amikom Purwokerto—dilengkapi pencapaian sertifikasi CCNA: Introduction to Networks (Cisco Networking Academy, 2026) serta publikasi Artikel Pengabdian Masyarakat terindeks Garuda (2026).',
    highlights: [
      'Program Studi: Teknologi Informasi, Universitas Amikom Purwokerto',
      'Sertifikasi CCNA: Introduction to Networks — Cisco Networking Academy (2026)',
      'Publikasi Artikel Pengabdian Masyarakat — Jurnal Pengabdian Masyarakat Bangsa (Terindeks Garuda, 2026)',
    ],
  },
  {
    id: 'roots-tangerang',
    chapter: '05',
    periodLabel: '2 Desember 2005',
    category: 'Latar Belakang',
    title: 'Akar Perjalanan di Tangerang, Indonesia',
    location: 'Tangerang, Indonesia',
    summary:
      'Lahir di Tangerang sebelum melanjutkan studi ke Purwokerto—tumbuh dengan rasa ingin tahu tinggi terhadap dunia digital, estetika antarmuka, dan cara membangun karya yang nyata.',
    highlights: [
      'Tempat lahir terverifikasi: Tangerang, Indonesia',
      'Domisili saat ini: Purwokerto, Indonesia',
    ],
  },
];
