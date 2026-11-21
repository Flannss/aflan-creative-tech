import { personalData } from '@/data/personal';

export type GalleryCategory = 'Potret Pribadi';

export interface GalleryItem {
  id: string;
  plateNumber: string;
  title: string;
  subtitle: string;
  category: GalleryCategory;
  src: string;
  objectPosition?: string;
  caption: string;
  contextNote: string;
  technicalNote: string;
}

export const galleryItems: GalleryItem[] = [
  {
    id: 'plate-01-profile-portrait',
    plateNumber: 'PELAT 01',
    title: 'Potret Studio — Warm Chiaroscuro',
    subtitle: 'Foto Identitas Utama',
    category: 'Potret Pribadi',
    src: personalData.portraitPath,
    objectPosition: 'center 18%',
    caption:
      'Potret studio asli Aflan Mu’afa Dzulfiqar. Pencahayaan amber hangat dengan latar bayangan espresso menjadi jangkar visual bagi keseluruhan palet identitas AFLAN.',
    contextNote:
      'Potret utama yang menjadi jangkar karakter visual AFLAN—menampilkan permainan kontras pencahayaan studio hangat dan kedalaman bayangan espresso.',
    technicalNote: 'Foto Personal Asli · Pencahayaan Espresso & Amber',
  },
];
