import { create } from 'zustand';
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

const THEME_STORAGE_KEY = 'app.theme';

function getInitialThemeMode(): ThemePreference {
  const stored = storage.getString(THEME_STORAGE_KEY);
  if (stored === 'system' || stored === 'light' || stored === 'dark') {
    return stored;
  }
  return 'system';
}

interface AppState {
  /** Currently active app language. */
  language: Language;
  /** Mirrors I18nManager.isRTL for the active language. */
  isRTL: boolean;
  /** User appearance preference - resolved against the OS scheme. */
  themePreference: ThemePreference;
  /**
   * Changes the app language and persists it.
   * Switching between LTR and RTL requires a full restart
   * so the native layout direction is re-applied.
   */
  changeLanguage: (language: Language) => void;
  setThemePreference: (preference: ThemePreference) => void;
}

export const useAppStore = create<AppState>()((set) => ({
  language: i18next.language as Language,
  isRTL: I18nManager.isRTL,
  themePreference: getInitialThemeMode(),

  changeLanguage: (language) => {
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

  setThemePreference: (preference) => {
    storage.set(THEME_STORAGE_KEY, preference);
    set({ themePreference: preference });
  },
}));
