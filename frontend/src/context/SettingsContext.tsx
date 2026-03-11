import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';

interface SettingsContextType {
  enabledSeries: Set<string>;
  toggleSeries: (key: string) => void;
  isSeriesEnabled: (key: string) => boolean;
  showNews: boolean;
  toggleNews: () => void;
  language: string;
  setLanguage: (lang: string) => void;
}

const ALL_SERIES = ['f1', 'f2', 'f3', 'f1a', 'fe', 'indy', 'wec', 'wrc'];

function loadSeriesPrefs(): Set<string> {
  try {
    const saved = localStorage.getItem('gridpulse_series_prefs');
    if (saved) {
      const arr = JSON.parse(saved);
      if (Array.isArray(arr) && arr.length > 0) return new Set(arr);
    }
  } catch {}
  return new Set(ALL_SERIES);
}

function loadLanguage(): string {
  try {
    const saved = localStorage.getItem('gridpulse_lang');
    if (saved) return saved;
  } catch {}
  const nav = navigator.languages || [navigator.language || 'en'];
  for (const l of nav) {
    const code = l.slice(0, 2).toLowerCase();
    if (['en', 'fr', 'es', 'de', 'pl', 'ja', 'ko'].includes(code)) return code;
  }
  return 'en';
}

const SettingsContext = createContext<SettingsContextType>({
  enabledSeries: new Set(ALL_SERIES),
  toggleSeries: () => {},
  isSeriesEnabled: () => true,
  showNews: true,
  toggleNews: () => {},
  language: 'en',
  setLanguage: () => {},
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [enabledSeries, setEnabledSeries] = useState(loadSeriesPrefs);
  const [showNews, setShowNews] = useState(true);
  const [language, setLang] = useState(loadLanguage);

  const toggleSeries = useCallback((key: string) => {
    setEnabledSeries((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        if (next.size <= 1) return prev; // Keep at least one
        next.delete(key);
      } else {
        next.add(key);
      }
      try {
        localStorage.setItem('gridpulse_series_prefs', JSON.stringify([...next]));
      } catch {}
      return next;
    });
  }, []);

  const isSeriesEnabled = useCallback(
    (key: string) => enabledSeries.has(key),
    [enabledSeries]
  );

  const toggleNews = useCallback(() => setShowNews((p) => !p), []);

  const setLanguage = useCallback((lang: string) => {
    setLang(lang);
    try {
      localStorage.setItem('gridpulse_lang', lang);
    } catch {}
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        enabledSeries,
        toggleSeries,
        isSeriesEnabled,
        showNews,
        toggleNews,
        language,
        setLanguage,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
