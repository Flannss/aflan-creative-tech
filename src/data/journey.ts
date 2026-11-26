export type JourneyCategory =
  | 'Pengalaman Profesional'
  | 'Pendidikan'
  | 'Proyek & Studio'
  | 'Latar Belakang';

export interface JourneyMilestone {
  id: string;
  chapter: string;
  periodLabel: string;
  isActive?: boolean;
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
    periodLabel: 'Sep 2026 – Sedang Berjalan',
    isActive: true,
    category: 'Pengalaman Profesional',
    title: 'Programmer Intern · PT Puskomedia Indonesia Kreatif',
    location: 'Purwokerto, Indonesia',
    summary:
      'Menjalani program magang aktif sebagai Programmer Intern dengan fokus utama pada Software Evaluation, Functional Testing, Bug Identification, dan System Requirement Analysis, termasuk mengevaluasi alur kerja ASIS Builder.',
    highlights: [
      'Peran: Programmer Intern di PT Puskomedia Indonesia Kreatif (Sep 2026 – Sedang Berjalan)',
      'Fokus utama: Software Evaluation, Functional Testing & System Requirement Analysis',
      'Mengevaluasi alur kerja ASIS Builder (Website Template Page Generator) dan menyusun rekomendasi perbaikan berbasis bukti pengujian',
    ],
  },
  {
    id: 'satu-ruang-creative',
    chapter: '02',
    periodLabel: 'Studio Aktif',
    category: 'Proyek & Studio',
    title: 'Co-Founder & Web Developer · SatuRuangCreative',
    location: 'Student-Built Creative & Digital Studio',
    summary:
      'Ikut mendirikan studio kreatif dan digital mahasiswa ("Satu Ruang, Banyak Ide, Satu Cerita") dengan tanggung jawab pada desain UI/UX, tata letak responsif, dan implementasi frontend.',
    highlights: [
      'Peran: Co-Founder & Web Developer untuk kolaborasi desain dan implementasi web',
      'Karya utama: Platform web "RuangHijau Nusantara" (edukasi lingkungan & kalkulator dampak interaktif)',
      'Live showcase studio tersedia di saturuangcreative.framer.website',
    ],
  },
  {
    id: 'somasii-mobile-app',
    chapter: '03',
    periodLabel: 'Academic Final Project',
    category: 'Proyek & Studio',
    title: 'SOMASII · System Online Mahasiswa Sharing Items Information',
    location: 'Mobile Application · Flutter & Firebase',
    summary:
      'Merancang dan mengembangkan aplikasi mobile Lost & Found kampus menggunakan Flutter, Dart, dan Firebase (Authentication, Cloud Firestore, Storage) dengan integrasi kontak WhatsApp serta verifikasi klaim admin.',
    highlights: [
      'Peran & Lingkup: Pengembang Aplikasi Mobile (Academic Final Project) untuk lingkungan kampus',
      'Real-time CRUD pelaporan melalui Cloud Firestore & media barang di Firebase Storage',
      'Integrasi kontak langsung via WhatsApp dan sistem verifikasi klaim kepemilikan oleh admin',
    ],
  },
  {
    id: 'amikom-purwokerto',
    chapter: '04',
    periodLabel: 'Studi Sarjana · TI24A',
    category: 'Pendidikan',
    title: 'S1 Teknologi Informasi (TI24A) · Universitas Amikom Purwokerto',
    location: 'Purwokerto, Indonesia',
    summary:
      'Menempuh pendidikan sarjana S1 Teknologi Informasi (kelas TI24A) di Universitas Amikom Purwokerto, dilengkapi sertifikasi CCNA: Introduction to Networks (Cisco, Jul 2026) serta publikasi Jurnal JPMBA terindeks Garuda (Okt 2026).',
    highlights: [
      'Program Studi: S1 Teknologi Informasi (TI24A), Universitas Amikom Purwokerto',
      'Sertifikasi CCNA: Introduction to Networks · Cisco Networking Academy (Jul 2026)',
      'Publikasi Jurnal Pengabdian Masyarakat Bangsa (JPMBA) · Terindeks Garuda (Okt 2026)',
    ],
  },
  {
    id: 'pkl-gt-computer',
    chapter: '05',
    periodLabel: 'PKL SMK · 3 Bulan (Kelas XI)',
    category: 'Pengalaman Profesional',
    title: 'Technical Support & Hardware Specialist · GT Computer Purwokerto',
    location: 'GT Computer Purwokerto · SMK Wiworotomo Purwokerto',
    summary:
      'Menjalani Praktik Kerja Lapangan (PKL) selama 3 bulan saat kelas XI SMK Wiworotomo Purwokerto di GT Computer Purwokerto, menangani diagnostik serta reparasi hardware/software PC & laptop, manajemen inventaris suku cadang, dan konsultasi pengadaan unit pelanggan.',
    highlights: [
      'Diagnostik serta reparasi hardware & software PC dan laptop secara sistematis',
      'Manajemen inventaris suku cadang (spare parts) dan pencatatan kebutuhan komponen perbaikan',
      'Konsultasi teknis spesifikasi perangkat dan pendampingan pengadaan unit pelanggan',
      'Program PKL SMK (3 Bulan, Kelas XI) · Alumni SMK Wiworotomo Purwokerto',
    ],
  },
  {
    id: 'roots-tangerang',
    chapter: '06',
    periodLabel: '2 Desember 2005',
    category: 'Latar Belakang',
    title: 'Akar Perjalanan · Tangerang ke Purwokerto',
    location: 'Tangerang · Purwokerto, Indonesia',
    summary:
      'Lahir di Tangerang sebelum menyelesaikan pendidikan kejuruan di SMK Wiworotomo Purwokerto dan melanjutkan studi S1 Teknologi Informasi di Universitas Amikom Purwokerto.',
    highlights: [
      'Tempat lahir terverifikasi: Tangerang, Indonesia (2 Desember 2005)',
      'Pendidikan Menengah: Alumni SMK Wiworotomo Purwokerto',
      'Domisili saat ini: Purwokerto, Jawa Tengah, Indonesia',
    ],
  },
];
