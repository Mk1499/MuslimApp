import { create } from 'zustand';
import {
  persist,
  createJSONStorage,
  type StateStorage,
} from 'zustand/middleware';
import { I18nManager } from 'react-native';
import Restart from 'react-native-restart';
import i18next, {
  applyLayoutDirection,
  isRTL,
  persistLanguage,
  type Language,
} from '../i18n';
import { storage } from '../utils/storage';
import type { ThemePreference } from '../theme';

const APP_STORE_STORAGE_KEY = 'app.store';

/** Adapts the synchronous MMKV instance to zustand's persist storage interface. */
const mmkvStorage: StateStorage = {
  getItem: name => storage.getString(name) ?? null,
  setItem: (name, value) => storage.set(name, value),
  removeItem: name => storage.remove(name),
};

interface AppState {
  language: Language;
  isRTL: boolean;
  themePreference: ThemePreference;
  userLocation: { latitude: number; longitude: number } | null;
  userAddress: any | null;

  setUserAddress: (address: any | null) => void;
  changeLanguage: (language: Language) => void;
  setThemePreference: (preference: ThemePreference) => void;
  setUserLocation: (
    location: { latitude: number; longitude: number } | null,
  ) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    set => ({
      language: i18next.language as Language,
      isRTL: I18nManager.isRTL,
      themePreference: 'system',
      userLocation: null,
      userAddress: null,

      setUserAddress: address => {
        set({ userAddress: address });
      },
      setUserLocation: location => {
        set({ userLocation: location });
      },
      changeLanguage: language => {
        if (language === i18next.language) {
          return;
        }

        persistLanguage(language);
        i18next.changeLanguage(language);

        const rtl = isRTL(language);
        set({ language, isRTL: rtl });

        if (I18nManager.isRTL !== rtl) {
          applyLayoutDirection(language);
          // Layout direction only updates after a full reload.
          Restart.restart();
        }
      },

      setThemePreference: preference => {
        set({ themePreference: preference });
      },
    }),
    {
      name: APP_STORE_STORAGE_KEY,
      storage: createJSONStorage(() => mmkvStorage),
      partialize: state => ({
        language: state.language,
        themePreference: state.themePreference,
        userLocation: state.userLocation,
        userAddress: state.userAddress,
      }),
    },
  ),
);
