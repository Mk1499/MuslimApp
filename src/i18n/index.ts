import { I18nManager } from 'react-native';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'react-native-localize';
import { storage } from '../utils/storage';
import en from './locales/en.json';
import ar from './locales/ar.json';

export const LANGUAGES = ['en', 'ar'] as const;
export type Language = (typeof LANGUAGES)[number];

const LANGUAGE_STORAGE_KEY = 'app.language';

export function isRTL(language: Language): boolean {
  return language === 'ar';
}

function detectDeviceLanguage(): Language {
  const deviceLocale = Localization.getLocales()[0]?.languageCode;
  return deviceLocale === 'ar' ? 'ar' : 'en';
}

/** Read the saved language, falling back to the device locale. */
export function getInitialLanguage(): Language {
  const stored = storage.getString(LANGUAGE_STORAGE_KEY);
  if (stored === 'en' || stored === 'ar') {
    return stored;
  }
  return detectDeviceLanguage();
}

export function persistLanguage(language: Language): void {
  storage.set(LANGUAGE_STORAGE_KEY, language);
}

/** Apply RTL/LTR layout direction. Takes effect after an app restart. */
export function applyLayoutDirection(language: Language): void {
  const rtl = isRTL(language);
  I18nManager.allowRTL(rtl);
  I18nManager.forceRTL(rtl);
}

const resources = {
  en: { translation: en },
  ar: { translation: ar },
} as const;

i18next.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: 'en',
  supportedLngs: LANGUAGES,
  interpolation: {
    escapeValue: false,
  },
  returnNull: false,
});

applyLayoutDirection(i18next.language as Language);

export default i18next;
