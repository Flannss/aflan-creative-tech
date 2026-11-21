import { personalData } from '@/data/personal';

export type GalleryCategory = 'Potret' | 'Tipografi' | 'Karya Visual';

export type GalleryPlateKind =
  | 'photo'
  | 'abstract-monogram'
  | 'abstract-palette'
  | 'abstract-typography';

export interface GalleryDetailMeta {
  medium: string;
  treatment: string;
  composition: string;
  palette: string;
}

export interface GalleryItem {
  id: string;
  plateNumber: string;
  title: string;
  subtitle: string;
  category: GalleryCategory;
  badge: string;
  kind: GalleryPlateKind;
  aspectClass:
    | 'aspect-3/4'
    | 'aspect-4/5'
    | 'aspect-16/10'
    | 'aspect-4/3'
    | 'aspect-square';
  src?: string;
  imageFit?: 'cover' | 'contain';
  imageBg?: string;
  objectPosition?: string;
  imageScaleClass?: string;
  customFilter?: string;
  meta: GalleryDetailMeta;
  caption: string;
  technicalNote: string;
}

export const galleryCategories: Array<'Semua' | GalleryCategory> = [
  'Semua',
  'Potret',
  'Tipografi',
  'Karya Visual',
];

export const galleryItems: GalleryItem[] = [
  {
    id: 'plate-01-portrait-chiaroscuro',
    plateNumber: 'PELAT 01',
    title: 'Potret Studio — Chiaroscuro Hangat',
    subtitle: 'Foto Identitas Utama',
    category: 'Potret',
    badge: 'Potret Asli',
    kind: 'photo',
    aspectClass: 'aspect-4/5',
    src: personalData.portraitPath,
    imageFit: 'cover',
    objectPosition: '50% 18%',
    meta: {
      medium: 'Fotografi Studio Personal',
      treatment: 'Nada Warna Asli · Cahaya Amber',
      composition: 'Framing 4:5 · Pusat Wajah Atas',
      palette: 'Obsidian · Espresso · Champagne',
    },
    caption:
      'Potret studio asli Aflan Mu’afa Dzulfiqar. Kontras pencahayaan amber hangat dan bayangan espresso menjadi sumber palet warna utama situs ini.',
    technicalNote: 'Potret Personal · Cahaya Hangat',
  },
  {
    id: 'plate-02-monogram-geometry',
    plateNumber: 'PELAT 02',
    title: 'Monogram AMDZ — Studi Geometri',
    subtitle: 'Komposisi Abstrak Lambang',
    category: 'Tipografi',
    badge: 'Geometri Vektor',
    kind: 'abstract-monogram',
    aspectClass: 'aspect-square',
    meta: {
      medium: 'Grafis Vektor & Tipografi',
      treatment: 'Garis Hairline Champagne · Grid 1:1',
      composition: 'Simetri Segitiga & Sumbu Tengah',
      palette: 'Obsidian · Espresso · Champagne',
    },
    caption:
      'Eksplorasi proporsi lambang AMDZ dalam bingkai geometris minimalis—memadukan sudut tajam arsitektural dengan keseimbangan ruang kosong.',
    technicalNote: 'Lambang AMDZ · Komposisi Vektor',
  },
  {
    id: 'plate-03-portrait-monochrome',
    plateNumber: 'PELAT 03',
    title: 'Monokrom Perak — Studi Kontras',
    subtitle: 'Variasi Grayscale & Grain 35mm',
    category: 'Potret',
    badge: 'Monokrom 35mm',
    kind: 'photo',
    aspectClass: 'aspect-3/4',
    src: personalData.portraitPath,
    imageFit: 'cover',
    objectPosition: '50% 13%',
    imageScaleClass: 'scale-110',
    customFilter: 'grayscale(94%) contrast(1.18) brightness(1.02)',
    meta: {
      medium: 'Variasi Potret Personal',
      treatment: 'Grayscale Kontras Tinggi · Grain 35mm',
      composition: 'Crop Rapat 3:4 · Fokus Siluet',
      palette: 'Monokrom Perak · Bayangan Pekat',
    },
    caption:
      'Olah ulang potret utama dalam spektrum hitam-putih berkontras tajam untuk menonjolkan arah jatuh cahaya, kontur wajah, dan tekstur butiran halus.',
    technicalNote: 'Studi Monokrom · Arah Cahaya & Tekstur',
  },
  {
    id: 'plate-04-satu-ruang-creative',
    plateNumber: 'PELAT 04',
    title: 'Satu Ruang Creative — Emblem Studio',
    subtitle: 'Identitas Visual Studio Mahasiswa',
    category: 'Karya Visual',
    badge: 'Identitas Studio',
    kind: 'photo',
    aspectClass: 'aspect-16/10',
    src: '/images/satu-ruang-creative.png',
    imageFit: 'contain',
    imageBg: '#2B1D17',
    objectPosition: 'center',
    meta: {
      medium: 'Identitas Digital & Grafis',
      treatment: 'Latar Espresso Pekat · Proporsi Lapang',
      composition: 'Bingkai Lanskap 16:10 · Sentris',
      palette: 'Espresso · Ivory · Champagne',
    },
    caption:
      'Emblem resmi Satu Ruang Creative—studio kreatif dan digital mahasiswa tempat kolaborasi perancangan UI/UX, desain responsif, dan implementasi web.',
    technicalNote: 'Satu Ruang Creative · Aset Studio Resmi',
  },
  {
    id: 'plate-05-chromatic-spectrum',
    plateNumber: 'PELAT 05',
    title: 'Spektrum Tonal — Espresso ke Ivory',
    subtitle: 'Sistem Warna & Tipografi Editorial',
    category: 'Tipografi',
    badge: 'Sistem Warna',
    kind: 'abstract-palette',
    aspectClass: 'aspect-4/5',
    meta: {
      medium: 'Studi Sistem Desain & Warna',
      treatment: 'Gradasi 5 Nada Utama · Serif Italic',
      composition: 'Kolom Vertikal Proporsional',
      palette: '#171615 · #2B1D17 · #765641 · #D8C3A5 · #F5F0E8',
    },
    caption:
      'Pemetaan lima nada inti identitas visual AFLAN yang disusun berdampingan dengan spesimen huruf Cormorant Garamond untuk menguji harmoni gelap-hangat.',
    technicalNote: 'Palet Identitas · Harmoni Gelap-Hangat',
  },
  {
    id: 'plate-06-somasii-cover',
    plateNumber: 'PELAT 06',
    title: 'SOMASII — Identitas Aplikasi Kampus',
    subtitle: 'Visual Utama Lost & Found Mahasiswa',
    category: 'Karya Visual',
    badge: 'Identitas Aplikasi',
    kind: 'photo',
    aspectClass: 'aspect-4/3',
    src: '/images/somasii.jpg',
    imageFit: 'cover',
    imageBg: '#171615',
    objectPosition: 'center',
    meta: {
      medium: 'Cover Produk Digital Mobile',
      treatment: 'Framing 4:3 · Warna Autentik',
      composition: 'Tampilan Identitas Aplikasi',
      palette: 'Identitas Visual SOMASII',
    },
    caption:
      'Identitas visual resmi SOMASII (System Online Mahasiswa Sharing Items Information), aplikasi mobile Lost & Found berbasis Flutter dan Firebase untuk lingkungan kampus.',
    technicalNote: 'SOMASII · Aset Visual Proyek Resmi',
  },
  {
    id: 'plate-07-editorial-specimen',
    plateNumber: 'PELAT 07',
    title: 'Tipografi Serif — Komposisi Huruf',
    subtitle: 'Studi Cormorant Garamond & Outline',
    category: 'Tipografi',
    badge: 'Abstrak Tipografi',
    kind: 'abstract-typography',
    aspectClass: 'aspect-square',
    meta: {
      medium: 'Poster Tipografi Editorial',
      treatment: 'Kontras Solid Ivory & Garis Outline',
      composition: 'Hierarki Skala Display',
      palette: 'Espresso · Champagne · Ivory',
    },
    caption:
      'Komposisi grafis murni berbasis kontras huruf serif italic, garis outline tipis, dan ruang negatif yang menjadi fondasi karakter visual seluruh halaman.',
    technicalNote: 'Cormorant Garamond · Studi Skala Display',
  },
];
