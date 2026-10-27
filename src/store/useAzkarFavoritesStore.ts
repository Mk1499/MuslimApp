import { create } from 'zustand';
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from 'zustand/middleware';
import type { AzkarItem } from '@/types/azkar';
import { storage } from '@/utils/storage';

const AZKAR_FAVORITES_STORAGE_KEY = 'azkar.favorites';

export type FavoriteAzkar = AzkarItem & { category?: string };

const mmkvStorage: StateStorage = {
  getItem: key => storage.getString(key) ?? null,
  setItem: (key, value) => storage.set(key, value),
  removeItem: key => storage.remove(key),
};

type AzkarFavoritesState = {
  favorites: Record<string, FavoriteAzkar>;
  toggleFavorite: (item: AzkarItem, category?: string) => void;
  removeFavorite: (id: number | string) => void;
  isFavorite: (id: number | string) => boolean;
};

export const useAzkarFavoritesStore = create<AzkarFavoritesState>()(
  persist(
    (set, get) => ({
      favorites: {},
      toggleFavorite: (item, category) => {
        const id = String(item.ID);
        set(state => {
          const favorites = { ...state.favorites };
          if (favorites[id]) {
            delete favorites[id];
          } else {
            favorites[id] = { ...item, category };
          }
          return { favorites };
        });
      },
      removeFavorite: id => {
        set(state => {
          const favorites = { ...state.favorites };
          delete favorites[String(id)];
          return { favorites };
        });
      },
      isFavorite: id => Boolean(get().favorites[String(id)]),
    }),
    {
      name: AZKAR_FAVORITES_STORAGE_KEY,
      storage: createJSONStorage(() => mmkvStorage),
      partialize: state => ({ favorites: state.favorites }),
    },
  ),
);
