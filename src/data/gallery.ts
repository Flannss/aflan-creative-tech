import { personalData } from '@/data/personal';

export type GalleryCategory = 'Potret Pribadi' | 'Ruang Interior';

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

const rawGalleryItems: GalleryItem[] = [
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
      'Menjadi fokus utama di Homepage Hero dan diolah kembali dengan cropping editorial berbeda pada halaman About—menjaga keaslian identitas tanpa pengulangan berlebihan.',
    technicalNote: 'Foto Personal Asli · Pencahayaan Espresso & Amber',
  },
  {
    id: 'plate-02-interior-space',
    plateNumber: 'PELAT 02',
    title: 'Ruang & Atmosfer Interior',
    subtitle: 'Konteks Spasial Personal',
    category: 'Ruang Interior',
    src: personalData.roomPhotoPath,
    objectPosition: 'center center',
    caption:
      'Foto ruangan/interior pribadi yang berfungsi murni sebagai pendukung suasana editorial—tidak pernah diklaim sebagai hasil proyek atau dokumentasi klien.',
    contextNote:
      'Disandingkan bersama potret utama untuk menyeimbangkan kualitas komposisi, kontras, dan Negative Space.',
    technicalNote: 'Bingkai Interior Personal · Konteks Editorial',
  },
];

/**
 * Zero-Placeholder Policy (v1.0): hanya menampilkan aset fotografi asli yang tersedia di disk.
 * Ketika personalData.roomPhotoPath diisi di masa mendatang, Pelat 02 tampil otomatis.
 */
export const galleryItems: GalleryItem[] = rawGalleryItems.filter(
  (item) => item.src.trim().length > 0,
);
