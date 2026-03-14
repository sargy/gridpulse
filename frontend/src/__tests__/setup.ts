import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

// Global mock for react-i18next so tests don't need to mock it individually
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => fallback || key,
    i18n: { language: 'en', changeLanguage: vi.fn() },
  }),
  initReactI18next: { type: '3rdParty', init: vi.fn() },
}));

// Global mock for i18n module
vi.mock('../i18n', () => ({
  default: {
    use: () => ({ init: vi.fn() }),
    changeLanguage: vi.fn(),
    language: 'en',
  },
}));
