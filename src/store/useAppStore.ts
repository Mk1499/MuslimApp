import { create } from 'zustand';
import { I18nManager } from 'react-native';
import Restart from 'react-native-restart';
import i18next, {
  applyLayoutDirection,
  isRTL,
  persistLanguage,
  type Language,
} from '../i18n';

interface AppState {
  /** Currently active app language. */
  language: Language;
  /** Mirrors I18nManager.isRTL for the active language. */
  isRTL: boolean;
  /**
   * Changes the app language and persists it.
   * Switching between LTR and RTL requires a full restart
   * so the native layout direction is re-applied.
   */
  changeLanguage: (language: Language) => void;
}

export const useAppStore = create<AppState>()((set) => ({
  language: i18next.language as Language,
  isRTL: I18nManager.isRTL,

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
}));
