export type SkillTier =
  | 'Hands-on Experience'
  | 'Working Knowledge'
  | 'Currently Learning';

export interface SkillItem {
  name: string;
  tier: SkillTier;
  context: string;
}

export interface SkillDomain {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  description: string;
  items: SkillItem[];
}

export const skillTiers: Array<'All' | SkillTier> = [
  'All',
  'Hands-on Experience',
  'Working Knowledge',
  'Currently Learning',
];

/**
 * Pemetaan kapabilitas teknis berbasis hierarki tipografi editorial.
 */
export const skillDomains: SkillDomain[] = [
  {
    id: 'web-development',
    index: '01',
    title: 'Web Development',
    subtitle: 'Antarmuka frontend, sistem styling & fondasi web server-side',
    description:
      'Membangun aplikasi web yang responsif dan terstruktur menggunakan ekosistem JavaScript modern, sekaligus memahami alur pengembangan server-side berbasis PHP dan Laravel.',
    items: [
      {
        name: 'HTML & CSS',
        tier: 'Hands-on Experience',
        context: 'Struktur markup semantik, CSS Grid, Flexbox, serta komposisi editorial presisi.',
      },
      {
        name: 'JavaScript',
        tier: 'Hands-on Experience',
        context: 'Logika interaktif UI, manipulasi state, dan pengembangan client-side workflow.',
      },
      {
        name: 'React.js',
        tier: 'Hands-on Experience',
        context: 'Pengembangan Component-Based Architecture, hooks, dan routing multi-halaman pada AFLAN DOSSIER.',
      },
      {
        name: 'Tailwind CSS',
        tier: 'Hands-on Experience',
        context: 'Sistem design token yang konsisten, tipografi responsif, dan efisiensi styling.',
      },
      {
        name: 'TypeScript',
        tier: 'Working Knowledge',
        context: 'Penulisan struktur data bertipe aman untuk menjaga maintainability proyek web.',
      },
      {
        name: 'PHP',
        tier: 'Working Knowledge',
        context: 'Membaca, mengevaluasi, dan membangun alur aplikasi web server-rendered.',
      },
      {
        name: 'Laravel',
        tier: 'Working Knowledge',
        context: 'Memahami pola MVC, Blade template, serta mengevaluasi generator berbasis Laravel seperti ASIS Builder.',
      },
      {
        name: 'Next.js',
        tier: 'Currently Learning',
        context: 'Mendalami App Router, server components, dan arsitektur full-stack React modern.',
      },
    ],
  },
  {
    id: 'mobile-development',
    index: '02',
    title: 'Mobile Development',
    subtitle: 'Antarmuka lintas platform & aplikasi mobile terintegrasi cloud',
    description:
      'Mengembangkan aplikasi mobile lintas platform menggunakan Flutter, Dart, dan layanan Firebase, diterapkan langsung pada aplikasi kampus SOMASII.',
    items: [
      {
        name: 'Flutter',
        tier: 'Working Knowledge',
        context: 'Penyusunan widget tree yang modular dan tata letak mobile lintas platform.',
      },
      {
        name: 'Dart',
        tier: 'Working Knowledge',
        context: 'Pengelolaan model data, logika layar, dan alur state pada aplikasi Flutter.',
      },
      {
        name: 'Firebase Auth',
        tier: 'Working Knowledge',
        context: 'Implementasi autentikasi pengguna dan manajemen sesi pada aplikasi mobile.',
      },
      {
        name: 'Cloud Firestore',
        tier: 'Working Knowledge',
        context: 'Struktur koleksi NoSQL dan real-time CRUD pelaporan pada aplikasi SOMASII.',
      },
      {
        name: 'Firebase Storage',
        tier: 'Working Knowledge',
        context: 'Penyimpanan aset media foto barang pada alur pelaporan Lost & Found.',
      },
    ],
  },
  {
    id: 'ui-ux-design',
    index: '03',
    title: 'UI/UX',
    subtitle: 'Hierarki editorial, desain responsif & sistem antarmuka modular',
    description:
      'Merancang antarmuka dengan hierarki tipografi yang tegas, rasio kontras terukur, dan keterbacaan konsisten di desktop, tablet, maupun smartphone.',
    items: [
      {
        name: 'UI Design',
        tier: 'Hands-on Experience',
        context: 'Kontras warna terukur, pairing tipografi editorial, dan komposisi halaman SatuRuangCreative & AFLAN DOSSIER.',
      },
      {
        name: 'Responsive Web Design',
        tier: 'Hands-on Experience',
        context: 'Adaptasi layout, skala huruf, dan interaksi touch-friendly lintas 3 breakpoint utama.',
      },
      {
        name: 'Component-Based Interface',
        tier: 'Hands-on Experience',
        context: 'Memecah tampilan kompleks menjadi komponen reusable yang rapi dan konsisten.',
      },
      {
        name: 'Interaction Design',
        tier: 'Working Knowledge',
        context: 'Merancang mikro-interaksi taktil dan transisi berbasis kurva easing deterministik.',
      },
    ],
  },
  {
    id: 'software-testing-qa',
    index: '04',
    title: 'Software Testing & QA',
    subtitle: 'Evaluasi terstruktur, analisis workflow & dokumentasi kualitas',
    description:
      'Dipraktikkan langsung saat magang di PT Puskomedia Indonesia Kreatif dan evaluasi ASIS Builder, mengubah temuan pengujian menjadi rekomendasi perbaikan nyata.',
    items: [
      {
        name: 'Functional Testing',
        tier: 'Hands-on Experience',
        context: 'Memverifikasi alur fitur, skenario input pengguna, dan konsistensi output sistem.',
      },
      {
        name: 'Bug Identification',
        tier: 'Hands-on Experience',
        context: 'Menemukan anomali, mereproduksi defect secara presisi, dan mencatat bottleneck.',
      },
      {
        name: 'Debugging',
        tier: 'Hands-on Experience',
        context: 'Menelusuri akar masalah pada interaksi frontend, layout, maupun state aplikasi.',
      },
      {
        name: 'Requirement Analysis',
        tier: 'Hands-on Experience',
        context: 'Memetakan kesesuaian sistem terhadap kebutuhan pengguna serta mengusulkan penyempurnaan.',
      },
      {
        name: 'Documentation',
        tier: 'Hands-on Experience',
        context: 'Menyusun catatan pengujian QA, laporan evaluasi, dan dokumentasi teknis yang mudah ditindaklanjuti.',
      },
    ],
  },
  {
    id: 'ai-agent-orchestration',
    index: '05',
    title: 'AI-Assisted Engineering & Agent Orchestration',
    subtitle: 'Orkestrasi ekosistem AI untuk arsitektur, QA & agen otonom produksi',
    description:
      'Mengoptimalkan ekosistem AI secara terstruktur: penalaran arsitektur & spesifikasi teknis, QA menyeluruh, hingga orkestrasi autonomous coding & QC agents melalui prompt presisi tingkat produksi.',
    items: [
      {
        name: 'Gemini & ChatGPT',
        tier: 'Hands-on Experience',
        context: 'Penalaran arsitektur perangkat lunak, perumusan spesifikasi teknis, dan validasi keputusan desain sistem.',
      },
      {
        name: 'Muse.ai',
        tier: 'Hands-on Experience',
        context: 'Quality Assurance (QA) menyeluruh untuk memverifikasi kelengkapan fitur, keandalan UI, dan pengalaman pengguna.',
      },
      {
        name: 'Antigravity',
        tier: 'Hands-on Experience',
        context: 'Orkestrasi autonomous coding agent untuk implementasi fitur, refactoring lintas modul, dan verifikasi build produksi.',
      },
      {
        name: 'Lunyzz',
        tier: 'Hands-on Experience',
        context: 'Orkestrasi autonomous QC agent untuk audit UI/UX mendalam, deteksi regresi responsif, dan validasi aksesibilitas.',
      },
      {
        name: 'Production Prompt Engineering',
        tier: 'Hands-on Experience',
        context: 'Menyusun instruksi deterministik dengan SOP teknis ketat guna menjaga integritas data dan standar produksi.',
      },
    ],
  },
];
