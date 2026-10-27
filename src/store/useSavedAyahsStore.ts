import { create } from 'zustand';
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from 'zustand/middleware';
import { storage } from '@/utils/storage';

export type SavedAyah = {
  key: string;
  surahNumber: number;
  ayahNumber: number;
  page: number;
  arabic: string;
  surahNameArabic: string;
  surahNameEnglish: string;
};

const mmkvStorage: StateStorage = {
  getItem: key => storage.getString(key) ?? null,
  setItem: (key, value) => storage.set(key, value),
  removeItem: key => storage.remove(key),
};

function toggleRecord(
  records: Record<string, SavedAyah>,
  ayah: SavedAyah,
): Record<string, SavedAyah> {
  const updated = { ...records };
  if (updated[ayah.key]) {
    delete updated[ayah.key];
  } else {
    updated[ayah.key] = ayah;
  }
  return updated;
}

type SavedAyahsState = {
  bookmarks: Record<string, SavedAyah>;
  favorites: Record<string, SavedAyah>;
  toggleBookmark: (ayah: SavedAyah) => void;
  toggleFavorite: (ayah: SavedAyah) => void;
  removeBookmark: (key: string) => void;
  removeFavorite: (key: string) => void;
};

export const useSavedAyahsStore = create<SavedAyahsState>()(
  persist(
    set => ({
      bookmarks: {},
      favorites: {},
      toggleBookmark: ayah =>
        set(state => ({ bookmarks: toggleRecord(state.bookmarks, ayah) })),
      toggleFavorite: ayah =>
        set(state => ({ favorites: toggleRecord(state.favorites, ayah) })),
      removeBookmark: key =>
        set(state => {
          const bookmarks = { ...state.bookmarks };
          delete bookmarks[key];
          return { bookmarks };
        }),
      removeFavorite: key =>
        set(state => {
          const favorites = { ...state.favorites };
          delete favorites[key];
          return { favorites };
        }),
    }),
    {
      name: 'quran.saved-ayahs',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: state => ({
        bookmarks: state.bookmarks,
        favorites: state.favorites,
      }),
    },
  ),
);
