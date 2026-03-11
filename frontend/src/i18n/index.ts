import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'fr', 'es', 'de', 'pl', 'ja', 'ko'],
    interpolation: { escapeValue: false },
    backend: {
      loadPath: `${API_BASE}/translations/{{lng}}`,
    },
  });

export default i18n;
