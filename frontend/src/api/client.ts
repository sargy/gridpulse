import type { Race, SeriesConfig, NewsItem } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export const api = {
  getRaces: (series?: string): Promise<Race[]> =>
    fetchJson(series ? `/races?series=${series}` : '/races'),

  getRaceById: (id: string): Promise<Race> =>
    fetchJson(`/races/${id}`),

  getSeries: (): Promise<SeriesConfig[]> =>
    fetchJson('/series'),

  getTranslations: (lang: string): Promise<Record<string, string>> =>
    fetchJson(`/translations/${lang}`),

  getNews: (): Promise<NewsItem[]> =>
    fetchJson('/news'),
};
