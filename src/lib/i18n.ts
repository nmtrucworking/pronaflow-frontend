import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  'en-US': {
    translation: {
      common: {
        save: 'Save',
        cancel: 'Cancel',
      },
    },
  },
  'vi-VN': {
    translation: {
      common: {
        save: 'Luu',
        cancel: 'Huy',
      },
    },
  },
} as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en-US',
    supportedLngs: ['en-US', 'vi-VN'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'pronaflow-language',
      caches: ['localStorage'],
    },
  });

export default i18n;