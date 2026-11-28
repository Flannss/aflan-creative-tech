import { personalData } from '@/data/personal';

export type GalleryCategory = 'Potret' | 'Abstrak Tipografi';

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
  'Abstrak Tipografi',
];

export const galleryItems: GalleryItem[] = [
  {
    id: 'plate-01-portrait-chiaroscuro',
    plateNumber: 'PELAT 01',
    title: 'Potret Studio · Chiaroscuro Asli',
    subtitle: 'Identitas Visual Utama AFLAN',
    category: 'Potret',
    badge: 'Asli',
    kind: 'photo',
    aspectClass: 'aspect-4/5',
    src: personalData.portraitPath,
    objectPosition: '50% 18%',
    meta: {
      medium: 'Potret Studio Personal',
      treatment: 'Nada Asli · Pencahayaan Amber',
      composition: 'Framing 4:5 · Kunci Cahaya Hangat',
      palette: 'Obsidian · Espresso · Champagne',
    },
    caption:
      'Potret studio asli Aflan Mu’afa Dzulfiqar dengan keseimbangan cahaya amber hangat dan bayangan espresso yang menjadi dasar identitas visual portofolio ini.',
    technicalNote: 'Potret Personal · Chiaroscuro Hangat',
  },
  {
    id: 'plate-02-monogram-geometry',
    plateNumber: 'PELAT 02',
    title: 'Monogram AMDZ · Studi Geometri',
    subtitle: 'Komposisi Abstrak Lambang',
    category: 'Abstrak Tipografi',
    badge: 'Geometri',
    kind: 'abstract-monogram',
    aspectClass: 'aspect-square',
    meta: {
      medium: 'Grafis Vektor & Tipografi',
      treatment: 'Garis Hairline Champagne · Rasio 1:1',
      composition: 'Simetri Segitiga & Sumbu Tengah',
      palette: 'Obsidian · Espresso · Champagne',
    },
    caption:
      'Eksplorasi proporsi lambang AMDZ dalam bingkai geometris minimalis yang memadukan sudut tegas arsitektural dengan ruang kosong yang lapang.',
    technicalNote: 'Lambang AMDZ · Komposisi Vektor',
  },
  {
    id: 'plate-03-portrait-monochrome',
    plateNumber: 'PELAT 03',
    title: 'Monokrom Perak · Kontras 125%',
    subtitle: 'Studi Grayscale & Grain 35mm',
    category: 'Potret',
    badge: 'Monokrom',
    kind: 'photo',
    aspectClass: 'aspect-3/4',
    src: personalData.portraitPath,
    objectPosition: '50% 13%',
    imageScaleClass: 'scale-105',
    customFilter: 'grayscale(100%) contrast(1.25) brightness(1.02)',
    meta: {
      medium: 'Olah Tonal Potret Personal',
      treatment: 'Grayscale 100% · Contrast 125% · Grain',
      composition: 'Crop 3:4 · Penekanan Siluet',
      palette: 'Monokrom Perak · Bayangan Pekat',
    },
    caption:
      'Interpretasi hitam-putih berkontras tinggi dari potret personal untuk menonjolkan kontur cahaya samping serta tekstur butiran film halus.',
    technicalNote: 'Studi Grayscale · Kontras 125%',
  },
  {
    id: 'plate-04-portrait-sepia-archive',
    plateNumber: 'PELAT 04',
    title: 'Arsip Sepia · Nada Cetak Hangat',
    subtitle: 'Variasi Sepia Editorial',
    category: 'Potret',
    badge: 'Sepia',
    kind: 'photo',
    aspectClass: 'aspect-4/3',
    src: personalData.portraitPath,
    objectPosition: '50% 21%',
    customFilter: 'sepia(72%) contrast(1.16) brightness(0.95)',
    meta: {
      medium: 'Olah Tonal Potret Personal',
      treatment: 'Sepia 72% · Contrast 116%',
      composition: 'Framing 4:3 · Atmosfer Cetak Arsip',
      palette: 'Espresso · Mocha · Amber Hangat',
    },
    caption:
      'Eksplorasi nada sepia pekat bergaya cetak arsip klasik yang menyatukan rona kulit hangat dengan latar gelap bernuansa kopi.',
    technicalNote: 'Studi Sepia · Nuansa Arsip',
  },
  {
    id: 'plate-05-chromatic-spectrum',
    plateNumber: 'PELAT 05',
    title: 'Spektrum Tonal · Espresso ke Ivory',
    subtitle: 'Sistem Warna & Spesimen Serif',
    category: 'Abstrak Tipografi',
    badge: 'Palet Warna',
    kind: 'abstract-palette',
    aspectClass: 'aspect-4/5',
    meta: {
      medium: 'Sistem Desain & Warna',
      treatment: '5 Nada Inti · Cormorant Garamond',
      composition: 'Kolom Vertikal Proporsional',
      palette: '#211814 · #33241C · #8E6B4B · #DFC8A6 · #F6F1E9',
    },
    caption:
      'Pemetaan lima warna inti AFLAN berdampingan dengan contoh huruf Cormorant Garamond untuk menguji keterbacaan pada latar gelap-hangat.',
    technicalNote: 'Palet Identitas · Gelap-Hangat',
  },
  {
    id: 'plate-06-portrait-sculptural-shadow',
    plateNumber: 'PELAT 06',
    title: 'Bayangan Pahat · Hue Shift & Kontras',
    subtitle: 'Eksplorasi Low-Key Chiaroscuro',
    category: 'Potret',
    badge: 'Low-Key',
    kind: 'photo',
    aspectClass: 'aspect-square',
    src: personalData.portraitPath,
    objectPosition: '50% 16%',
    customFilter: 'contrast(1.32) saturate(0.76) hue-rotate(-10deg) brightness(0.9)',
    meta: {
      medium: 'Olah Tonal Potret Personal',
      treatment: 'Contrast 132% · Hue-Rotate -10°',
      composition: 'Bingkai 1:1 · Dominasi Negative Space',
      palette: 'Obsidian · Warm Umber · Champagne',
    },
    caption:
      'Pendekatan low-key dengan pergeseran rona tipis yang menggelapkan tepi bingkai ke Warm Espresso sambil menjaga fokus cahaya lembut di tengah.',
    technicalNote: 'Studi Low-Key · Kontras 132%',
  },
  {
    id: 'plate-07-editorial-specimen',
    plateNumber: 'PELAT 07',
    title: 'Tipografi Serif · Aflan Mu’afa Dzulfiqar',
    subtitle: 'Kontras Solid Ivory & Garis Outline',
    category: 'Abstrak Tipografi',
    badge: 'Tipografi',
    kind: 'abstract-typography',
    aspectClass: 'aspect-16/10',
    meta: {
      medium: 'Poster Tipografi Editorial',
      treatment: 'Playfair Display & Cormorant Garamond · Solid & Outline',
      composition: 'Format Horizontal 16:10',
      palette: 'Espresso · Champagne · Ivory',
    },
    caption:
      'Komposisi grafis yang memadukan masthead Playfair Display dengan ritme serif italic Cormorant Garamond, garis outline tipis, dan ruang kosong khas portofolio AFLAN.',
    technicalNote: 'Playfair Display · Cormorant Garamond',
  },
];
