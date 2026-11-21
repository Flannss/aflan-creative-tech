import { personalData } from '@/data/personal';

export type GalleryCategory =
  | 'Potret Pribadi'
  | 'Studi Pencahayaan'
  | 'Perspektif Optik'
  | 'Color Grading';

export type GalleryVisualPreset =
  | 'chiaroscuro-portrait'
  | 'soft-direct-flash'
  | 'ultra-wide-perspective'
  | 'gcam-hdr-grading'
  | 'gradient-studio-backdrop';

export interface GalleryItem {
  id: string;
  plateNumber: string;
  title: string;
  subtitle: string;
  category: GalleryCategory;
  techniqueBadge: string;
  aspectClass: 'aspect-4/5' | 'aspect-16/10' | 'aspect-square' | 'aspect-3/4';
  gridSpanClass: string;
  parallaxOffset: number;
  visualPreset: GalleryVisualPreset;
  src: string;
  objectPosition?: string;
  imageScaleClass?: string;
  customFilter?: string;
  exifSpec: string;
  caption: string;
  contextNote: string;
  technicalNote: string;
}

export const galleryCategories: Array<'Semua' | GalleryCategory> = [
  'Semua',
  'Potret Pribadi',
  'Studi Pencahayaan',
  'Perspektif Optik',
  'Color Grading',
];

export const galleryItems: GalleryItem[] = [
  {
    id: 'plate-01-profile-portrait',
    plateNumber: 'PELAT 01',
    title: 'Potret Studio — Warm Chiaroscuro',
    subtitle: 'Foto Identitas Utama & Jangkar Tonal',
    category: 'Potret Pribadi',
    techniqueBadge: 'Warm Chiaroscuro Key',
    aspectClass: 'aspect-4/5',
    gridSpanClass: 'md:col-span-1 lg:col-span-5',
    parallaxOffset: 16,
    visualPreset: 'chiaroscuro-portrait',
    src: personalData.portraitPath,
    objectPosition: '50% 18%',
    exifSpec: '50mm Equiv · f/1.8 · ISO 125 · Warm Key 3200K',
    caption:
      'Potret studio utama Aflan Mu’afa Dzulfiqar. Pencahayaan amber hangat dengan latar bayangan espresso menjadi jangkar visual bagi keseluruhan palet identitas AFLAN.',
    contextNote:
      'Menampilkan kontras chiaroscuro yang terukur antara sorot wajah hangat dan kedalaman bidang gelap.',
    technicalNote: 'Potret Personal Asli · Pencahayaan Espresso & Amber',
  },
  {
    id: 'plate-02-soft-direct-flash',
    plateNumber: 'PELAT 02',
    title: 'Soft Direct Flash — Specular Editorial',
    subtitle: 'Isolasi Subjek & Highlight Kontur',
    category: 'Studi Pencahayaan',
    techniqueBadge: 'Soft Direct Flash',
    aspectClass: 'aspect-16/10',
    gridSpanClass: 'md:col-span-1 lg:col-span-7',
    parallaxOffset: 24,
    visualPreset: 'soft-direct-flash',
    src: personalData.portraitPath,
    objectPosition: '50% 14%',
    imageScaleClass: 'scale-110',
    customFilter: 'contrast(1.16) brightness(1.04) saturate(0.92)',
    exifSpec: '35mm · f/2.8 · 1/160s · Diffused On-Axis Flash',
    caption:
      'Eksplorasi estetika Soft Direct Flash dengan difusi terarah pada sumbu lensa—menghasilkan pantulan spekular lembut pada kulit serta pemisahan tegas antara subjek dan latar gelap.',
    contextNote:
      'Teknik flash langsung yang diperhalus diffuser menjaga ketajaman tekstur mikro tanpa menghilangkan atmosfer hangat editorial.',
    technicalNote: 'Soft Direct Flash · Specular Roll-Off & Edge Falloff',
  },
  {
    id: 'plate-03-ultra-wide-perspective',
    plateNumber: 'PELAT 03',
    title: '0.5x Ultra-Wide Perspective',
    subtitle: 'Geometri Spasial & Sudut Pandang Dramatis',
    category: 'Perspektif Optik',
    techniqueBadge: '0.5x Ultra-Wide Perspective',
    aspectClass: 'aspect-16/10',
    gridSpanClass: 'md:col-span-1 lg:col-span-7',
    parallaxOffset: 20,
    visualPreset: 'ultra-wide-perspective',
    src: personalData.portraitPath,
    objectPosition: '50% 24%',
    imageScaleClass: 'scale-95',
    customFilter: 'contrast(1.08) sepia(12%)',
    exifSpec: '13mm (0.5x Ultra-Wide) · f/2.2 · Low-Angle Framing',
    caption:
      'Studi komposisi 0.5x Ultra-wide perspective yang memanfaatkan konvergensi garis ruang dan ekspansi bidang pandang untuk menciptakan kesan skala arsitektural yang ekspresif.',
    contextNote:
      'Perspektif ultra-lebar memberi dinamika proporsi antara titik fokus tengah dan ruang negatif di sekeliling bingkai.',
    technicalNote: '0.5x Ultra-Wide Optic · Spatial Depth & Framing',
  },
  {
    id: 'plate-04-gcam-hdr-grading',
    plateNumber: 'PELAT 04',
    title: 'GCam HDR+ Color Grading',
    subtitle: 'Rentang Dinamis Multi-Frame & Kurva Tonal',
    category: 'Color Grading',
    techniqueBadge: 'GCam HDR+ Color Grading',
    aspectClass: 'aspect-4/5',
    gridSpanClass: 'md:col-span-1 lg:col-span-5',
    parallaxOffset: 14,
    visualPreset: 'gcam-hdr-grading',
    src: personalData.portraitPath,
    objectPosition: '50% 20%',
    customFilter: 'contrast(1.14) sepia(24%) saturate(1.08) brightness(0.97)',
    exifSpec: 'Computational RAW · HDR+ Enhanced · Split-Tone LUT',
    caption:
      'Pendekatan fotografi komputasional GCam HDR+ Color Grading untuk menjaga detail bayangan dalam pada nada obsidian sekaligus mempertahankan transisi warna champagne-amber yang organik.',
    contextNote:
      'Pemetaan kurva S-tone dan keseimbangan white balance hangat menyatukan tekstur fotografi dengan sistem warna antarmuka web.',
    technicalNote: 'GCam HDR+ Pipeline · Espresso & Champagne Split-Tone',
  },
  {
    id: 'plate-05-gradient-studio-backdrop',
    plateNumber: 'PELAT 05',
    title: 'Gradient Studio Backdrop',
    subtitle: 'Transisi Radial Mocha ke Obsidian',
    category: 'Studi Pencahayaan',
    techniqueBadge: 'Gradient Studio Backdrop',
    aspectClass: 'aspect-16/10',
    gridSpanClass: 'md:col-span-2 lg:col-span-12',
    parallaxOffset: 18,
    visualPreset: 'gradient-studio-backdrop',
    src: personalData.portraitPath,
    objectPosition: '50% 16%',
    customFilter: 'sepia(18%) contrast(1.07)',
    exifSpec: 'Studio Radial Halo · Mocha #765641 → Obsidian #171615',
    caption:
      'Perancangan Gradient Studio Backdrop yang memadukan pendaran cahaya radial di belakang subjek dengan gradasi halus dari mocha hangat menuju tepi obsidian pekat.',
    contextNote:
      'Menjadi inspirasi langsung bagi efek pencahayaan studio-vignette dan studio-warm-halo di seluruh halaman portofolio AFLAN.',
    technicalNote: 'Gradient Studio Backdrop · Radial Luminance Architecture',
  },
];
