export type AchievementCategory =
  | 'Sertifikasi'
  | 'Publikasi Ilmiah'
  | 'Pengalaman Profesional'
  | 'Akademik';

export interface AchievementEntry {
  id: string;
  code: string;
  category: AchievementCategory;
  title: string;
  issuer: string;
  dateLabel: string;
  status: 'Kredensial Terverifikasi' | 'Publikasi Terindeks' | 'Milestone Terverifikasi';
  summary: string;
  details: string;
}

export const achievementCategories: Array<'Semua' | AchievementCategory> = [
  'Semua',
  'Sertifikasi',
  'Publikasi Ilmiah',
  'Pengalaman Profesional',
  'Akademik',
];

export const achievementsData: AchievementEntry[] = [
  {
    id: 'cisco-ccna-intro-networks',
    code: 'CERT-01',
    category: 'Sertifikasi',
    title: 'CCNA: Introduction to Networks',
    issuer: 'Cisco Networking Academy',
    dateLabel: 'Jul 2026',
    status: 'Kredensial Terverifikasi',
    summary:
      'Menyelesaikan sertifikasi kompetensi jaringan komputer dasar melalui Cisco Networking Academy pada Juli 2026.',
    details:
      'Mencakup pemahaman arsitektur jaringan, protokol komunikasi TCP/IP, pengalamatan IPv4/IPv6, konfigurasi perangkat jaringan dasar, serta prinsip keamanan dan konektivitas infrastruktur.',
  },
  {
    id: 'publikasi-pengabdian-garuda',
    code: 'PUB-01',
    category: 'Publikasi Ilmiah',
    title: 'Publikasi Jurnal JPMBA (Terindeks Garuda)',
    issuer: 'Jurnal Pengabdian Masyarakat Bangsa (JPMBA)',
    dateLabel: 'Okt 2026',
    status: 'Publikasi Terindeks',
    summary:
      'Publikasi artikel ilmiah pengabdian masyarakat yang diterbitkan pada Jurnal Pengabdian Masyarakat Bangsa (JPMBA) dan terindeks Garuda pada Oktober 2026.',
    details:
      'Mendokumentasikan penerapan solusi teknologi dan kontribusi nyata di masyarakat melalui penulisan akademik terstruktur yang lolos publikasi jurnal nasional terindeks Garuda.',
  },
  {
    id: 'puskomedia-internship',
    code: 'EXP-01',
    category: 'Pengalaman Profesional',
    title: 'Programmer Intern · Software Evaluation & Testing',
    issuer: 'PT Puskomedia Indonesia Kreatif',
    dateLabel: 'Sep 2026 – Sedang Berjalan',
    status: 'Milestone Terverifikasi',
    summary:
      'Menjalani magang aktif sebagai Programmer Intern dengan fokus pada Software Evaluation, Functional Testing, Bug Identification, dan System Requirement Analysis.',
    details:
      'Menerapkan disiplin pengujian QA dan evaluasi workflow sistem secara langsung, termasuk pengujian dan rekomendasi refinement pada ASIS Builder dalam batasan NDA perusahaan.',
  },
  {
    id: 'gt-computer-pkl',
    code: 'EXP-02',
    category: 'Pengalaman Profesional',
    title: 'Technical Support & Hardware Specialist (PKL SMK)',
    issuer: 'GT Computer Purwokerto · SMK Wiworotomo Purwokerto',
    dateLabel: 'PKL 3 Bulan · Kelas XI',
    status: 'Milestone Terverifikasi',
    summary:
      'Menyelesaikan Praktik Kerja Lapangan selama 3 bulan pada kelas XI SMK Wiworotomo Purwokerto di GT Computer Purwokerto.',
    details:
      'Menangani diagnostik dan reparasi hardware maupun software PC & laptop, manajemen inventaris suku cadang (spare parts), serta konsultasi teknis dan pengadaan unit pelanggan.',
  },
  {
    id: 'amikom-ti-study',
    code: 'EDU-01',
    category: 'Akademik',
    title: 'Mahasiswa S1 Teknologi Informasi (TI24A)',
    issuer: 'Universitas Amikom Purwokerto · Alumni SMK Wiworotomo Purwokerto',
    dateLabel: 'Studi Aktif',
    status: 'Milestone Terverifikasi',
    summary:
      'Menempuh pendidikan sarjana pada Program Studi S1 Teknologi Informasi (TI24A) di Universitas Amikom Purwokerto sebagai alumni SMK Wiworotomo Purwokerto.',
    details:
      'Membangun fondasi formal di bidang Web Development, Mobile Application Development, UI/UX Design, jaringan komputer, Software Quality Assurance, dan orkestrasi ekosistem AI.',
  },
];
