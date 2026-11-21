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
    dateLabel: '2026',
    status: 'Kredensial Terverifikasi',
    summary:
      'Menyelesaikan sertifikasi kompetensi jaringan komputer dasar melalui Cisco Networking Academy pada tahun 2026.',
    details:
      'Mencakup pemahaman arsitektur jaringan, protokol komunikasi TCP/IP, pengalamatan IPv4/IPv6, konfigurasi perangkat jaringan dasar, serta prinsip keamanan dan konektivitas infrastruktur.',
  },
  {
    id: 'publikasi-pengabdian-garuda',
    code: 'PUB-01',
    category: 'Publikasi Ilmiah',
    title: 'Publikasi Artikel Pengabdian Masyarakat',
    issuer: 'Jurnal Pengabdian Masyarakat Bangsa (Terindeks Garuda)',
    dateLabel: '2026',
    status: 'Publikasi Terindeks',
    summary:
      'Publikasi artikel ilmiah pengabdian masyarakat yang diterbitkan pada Jurnal Pengabdian Masyarakat Bangsa dan terindeks Garuda (2026).',
    details:
      'Mendokumentasikan penerapan solusi teknologi dan kontribusi nyata di masyarakat melalui penulisan akademik terstruktur yang lolos publikasi jurnal nasional terindeks Garuda.',
  },
  {
    id: 'puskomedia-internship',
    code: 'EXP-01',
    category: 'Pengalaman Profesional',
    title: 'Programmer Intern — Software Evaluation & Testing',
    issuer: 'PT Puskomedia Indonesia Kreatif',
    dateLabel: 'Sep 2026 – Jan 2027',
    status: 'Milestone Terverifikasi',
    summary:
      'Menjalani magang sebagai Programmer Intern dengan fokus pada Software Evaluation, Functional Testing, Bug Identification, dan System Requirement Analysis.',
    details:
      'Menerapkan disiplin pengujian QA dan evaluasi workflow sistem secara langsung—termasuk pengujian dan rekomendasi refinement pada ASIS Builder dalam batasan NDA perusahaan.',
  },
  {
    id: 'amikom-ti-study',
    code: 'EDU-01',
    category: 'Akademik',
    title: 'Mahasiswa Sarjana — Program Studi Teknologi Informasi',
    issuer: 'Universitas Amikom Purwokerto',
    dateLabel: 'Studi Aktif',
    status: 'Milestone Terverifikasi',
    summary:
      'Menempuh pendidikan sarjana pada Program Studi Teknologi Informasi di Universitas Amikom Purwokerto.',
    details:
      'Membangun fondasi formal di bidang Web Development, Mobile Prototyping, UI/UX Design, jaringan komputer, serta Software Quality Assurance.',
  },
];
