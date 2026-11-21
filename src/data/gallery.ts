import { personalData } from '@/data/personal';

export type GalleryCategory =
  | 'Portraits'
  | 'Retro Aesthetics'
  | 'Studio Work';

export type GalleryVisualPreset =
  | 'chiaroscuro-portrait'
  | 'korean-photobooth'
  | 'retro-digicam'
  | 'gradient-studio-backdrop'
  | 'ultra-wide-perspective'
  | 'gcam-hdr-grading';

export interface GalleryExifTelemetry {
  technique: string;
  camera: string;
  lens: string;
  exposure: string;
  colorProfile: string;
}

export interface GalleryItem {
  id: string;
  plateNumber: string;
  title: string;
  subtitle: string;
  category: GalleryCategory;
  techniqueBadge: string;
  aspectClass:
    | 'aspect-3/4'
    | 'aspect-4/5'
    | 'aspect-16/10'
    | 'aspect-4/3'
    | 'aspect-square';
  parallaxOffset: number;
  visualPreset: GalleryVisualPreset;
  src: string;
  fallbackSrc: string;
  objectPosition?: string;
  imageScaleClass?: string;
  customFilter?: string;
  exifSpec: string;
  exifTelemetry: GalleryExifTelemetry;
  caption: string;
  contextNote: string;
  technicalNote: string;
}

export const galleryCategories: Array<'All' | GalleryCategory> = [
  'All',
  'Portraits',
  'Retro Aesthetics',
  'Studio Work',
];

export const galleryItems: GalleryItem[] = [
  {
    id: 'plate-01-profile-portrait',
    plateNumber: 'PELAT 01',
    title: 'Warm Chiaroscuro — Soft Direct Flash',
    subtitle: 'Potret Identitas Utama & Isolasi Subjek',
    category: 'Portraits',
    techniqueBadge: 'Soft Direct Flash',
    aspectClass: 'aspect-4/5',
    parallaxOffset: 16,
    visualPreset: 'chiaroscuro-portrait',
    src: personalData.portraitPath,
    fallbackSrc: personalData.portraitPath,
    objectPosition: '50% 18%',
    exifSpec: '50mm · f/1.8 · 1/160s · ISO 125 · Soft Direct Flash',
    exifTelemetry: {
      technique: 'Soft Direct Flash · Chiaroscuro Key',
      camera: 'Studio Mirrorless System',
      lens: '50mm Prime · f/1.8',
      exposure: '1/160s · ISO 125 · +0.3 EV',
      colorProfile: 'Warm Amber 3200K · Espresso Shadow',
    },
    caption:
      'Potret studio utama Aflan Mu’afa Dzulfiqar dengan teknik Soft Direct Flash terarah. Pencahayaan amber hangat dan bayangan espresso membentuk kontras chiaroscuro yang menjadi jangkar visual portofolio AFLAN.',
    contextNote:
      'Difusi flash lembut pada sumbu optik menjaga detail kontur wajah tetap tajam tanpa kehilangan atmosfer sinematik.',
    technicalNote: 'Potret Personal Asli · Soft Direct Flash & Espresso Falloff',
  },
  {
    id: 'plate-02-korean-photobooth',
    plateNumber: 'PELAT 02',
    title: 'Korean Photobooth Aesthetic',
    subtitle: 'Monochrome Contact Strip & High-Key Diffusion',
    category: 'Retro Aesthetics',
    techniqueBadge: 'Korean Photobooth Strip',
    aspectClass: 'aspect-3/4',
    parallaxOffset: 22,
    visualPreset: 'korean-photobooth',
    src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=85',
    fallbackSrc: personalData.portraitPath,
    objectPosition: '50% 22%',
    customFilter: 'grayscale(92%) contrast(1.16) brightness(1.04)',
    exifSpec: 'Booth Beauty Dish · 35mm · f/4.0 · 1/200s · Silver B&W',
    exifTelemetry: {
      technique: 'Korean Photobooth 4-Cut Framing',
      camera: 'Automated Studio Booth Optics',
      lens: '35mm Flat-Field · f/4.0',
      exposure: '1/200s · ISO 100 · Dual Strobe',
      colorProfile: 'High-Key Silver Monochrome',
    },
    caption:
      'Eksplorasi Korean Photobooth Aesthetic yang menonjolkan bingkai strip kontak minimalis, pencahayaan frontal merata (beauty-dish diffusion), serta kurva monokrom perak dengan kontras bersih.',
    contextNote:
      'Memadukan nuansa intim photobooth modern Seoul dengan tata letak bingkai arsip editorial.',
    technicalNote: 'Korean Photobooth Aesthetic · Contact Sheet Framing',
  },
  {
    id: 'plate-03-retro-digicam-cybershot',
    plateNumber: 'PELAT 03',
    title: 'Retro Digicam — Sony Cyber-shot CCD',
    subtitle: 'Nostalgia Sensor CCD, Direct Xenon Flash & Halation',
    category: 'Retro Aesthetics',
    techniqueBadge: 'Sony Cyber-shot CCD',
    aspectClass: 'aspect-4/3',
    parallaxOffset: 14,
    visualPreset: 'retro-digicam',
    src: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1100&q=85',
    fallbackSrc: personalData.portraitPath,
    objectPosition: 'center center',
    customFilter: 'contrast(1.18) saturate(1.14) sepia(18%) brightness(0.98)',
    exifSpec: 'Sony Cyber-shot · Carl Zeiss 38mm · f/3.5 · ISO 400 · CCD',
    exifTelemetry: {
      technique: 'Retro Digicam · Built-in Xenon Flash',
      camera: 'Sony Cyber-shot DSC-T90 (CCD)',
      lens: 'Carl Zeiss Vario-Tessar 38mm',
      exposure: '1/60s · f/3.5 · ISO 400',
      colorProfile: '2000s CCD Warm Halation · Date Stamp',
    },
    caption:
      'Studi karakter visual Retro Digicam berbasis sensor CCD Sony Cyber-shot—menghadirkan tekstur warna khas era 2000-an, sorot lampu kilat xenon langsung, dan pendaran highlight hangat.',
    contextNote:
      'Karakteristik kompresi tonal sensor CCD memberikan keaslian tekstur organik yang kontras dengan kamera modern.',
    technicalNote: 'Sony Cyber-shot Aesthetic · CCD Color Science & Xenon Flash',
  },
  {
    id: 'plate-04-gradient-studio-backdrop',
    plateNumber: 'PELAT 04',
    title: 'Studio Gradient Backdrop',
    subtitle: 'Arsitektur Luminansi Radial Mocha ke Obsidian',
    category: 'Studio Work',
    techniqueBadge: 'Studio Gradient Backdrop',
    aspectClass: 'aspect-4/5',
    parallaxOffset: 20,
    visualPreset: 'gradient-studio-backdrop',
    src: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=85',
    fallbackSrc: personalData.portraitPath,
    objectPosition: 'center center',
    customFilter: 'sepia(28%) contrast(1.12) brightness(0.92)',
    exifSpec: 'Studio Radial Gel · 85mm · f/2.8 · 1/200s · ISO 100',
    exifTelemetry: {
      technique: 'Studio Gradient Backdrop · Radial Halo',
      camera: 'Full-Frame Studio Body',
      lens: '85mm Telephoto · f/2.8',
      exposure: '1/200s · ISO 100 · Honeycomb Grid',
      colorProfile: 'Mocha #765641 → Obsidian #171615',
    },
    caption:
      'Perancangan Studio Gradient Backdrop yang memadukan pendaran cahaya radial di belakang subjek dengan transisi halus dari mocha hangat menuju tepi obsidian pekat.',
    contextNote:
      'Menjadi referensi pencahayaan langsung bagi atmosfer studio-vignette di seluruh antarmuka web AFLAN.',
    technicalNote: 'Studio Gradient Backdrop · Radial Falloff Lighting',
  },
  {
    id: 'plate-05-ultra-wide-perspective',
    plateNumber: 'PELAT 05',
    title: '0.5x Ultra-Wide Perspective',
    subtitle: 'Distorsi Spasial Terukur & Garis Konvergensi',
    category: 'Studio Work',
    techniqueBadge: '0.5x Ultra-wide',
    aspectClass: 'aspect-16/10',
    parallaxOffset: 18,
    visualPreset: 'ultra-wide-perspective',
    src: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85',
    fallbackSrc: personalData.portraitPath,
    objectPosition: 'center center',
    customFilter: 'contrast(1.1) sepia(16%) brightness(0.94)',
    exifSpec: '0.5x Ultra-wide (13mm Equiv.) · f/2.2 · 1/125s · FOV 120°',
    exifTelemetry: {
      technique: '0.5x Ultra-wide Perspective',
      camera: 'Computational Ultra-Wide Module',
      lens: '13mm Equivalent (0.5x) · f/2.2',
      exposure: '1/125s · ISO 160 · Low-Angle',
      colorProfile: 'Architectural Warm Neutral',
    },
    caption:
      'Eksplorasi komposisi 0.5x Ultra-wide perspective (13mm equiv.) yang memanfaatkan sudut pandang 120° dan konvergensi garis ruang untuk menciptakan kesan skala dan kedalaman dramatis.',
    contextNote:
      'Perspektif ultra-lebar dari sudut rendah mengubah proporsi ruang menjadi elemen grafis utama dalam komposisi.',
    technicalNote: '0.5x Ultra-wide Optic · 120° Spatial Convergence',
  },
  {
    id: 'plate-06-gcam-hdr-grading',
    plateNumber: 'PELAT 06',
    title: 'GCam HDR+ Color Grading — Split-Tone Study',
    subtitle: 'Pemetaan Kurva Tonal Multi-Frame & Bayangan Dalam',
    category: 'Portraits',
    techniqueBadge: 'GCam HDR+ Color Grading',
    aspectClass: 'aspect-square',
    parallaxOffset: 15,
    visualPreset: 'gcam-hdr-grading',
    src: personalData.portraitPath,
    fallbackSrc: personalData.portraitPath,
    objectPosition: '50% 15%',
    imageScaleClass: 'scale-105',
    customFilter: 'contrast(1.16) sepia(26%) saturate(1.06) brightness(0.96)',
    exifSpec: 'GCam HDR+ Enhanced · 14-Bit RAW Merge · Split-Tone LUT',
    exifTelemetry: {
      technique: 'GCam HDR+ Color Grading',
      camera: 'Computational RAW Pipeline',
      lens: '50mm Equivalent · f/1.8',
      exposure: 'Multi-Frame Bracketing · ZSL HDR+',
      colorProfile: 'Champagne Highlight / Espresso Shadow LUT',
    },
    caption:
      'Studi pemrosesan warna GCam HDR+ Color Grading untuk mempertahankan detail mikro pada area bayangan gelap sekaligus menjaga highlight kulit tetap lembut dan berkarakter film.',
    contextNote:
      'Menggabungkan ketajaman fotografi komputasional dengan kurva warna split-tone bergaya majalah cetak.',
    technicalNote: 'GCam HDR+ Pipeline · Split-Tone Editorial LUT',
  },
];
