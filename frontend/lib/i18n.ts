import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
    
    detection: {
      order: ['path', 'cookie', 'localStorage', 'navigator'],
      caches: ['cookie', 'localStorage'],
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,
    },
    
    interpolation: {
      escapeValue: false,
    },
    
    react: {
      useSuspense: false,
    },
    
    supportedLngs: ['en', 'es'],
    
    ns: ['translation'],
    defaultNS: 'translation',
  });

export default i18n; 