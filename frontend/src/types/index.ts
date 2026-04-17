export interface Race {
  id: string;
  city: string;
  country: string;
  region: string;
  round: number | string;
  series: string[];
  timezone: string;
  lat: number;
  lng: number;
  sessions?: Record<string, string>;
  f2Sessions?: Record<string, string>;
  f3Sessions?: Record<string, string>;
  f1aSessions?: Record<string, string>;
  feSessions?: Record<string, string>;
  indySessions?: Record<string, string>;
  wecSessions?: Record<string, string>;
  wrcSessions?: Record<string, string>;
  cancelled?: boolean;
}

export interface SeriesConfig {
  id: string;
  label: string;
  color: string;
  sessionTypes: string[];
}

export interface NewsItem {
  title: string;
  link: string;
  summary: string;
  date: string;
  badge: string;
  label: string;
}

export type Theme = 'dark' | 'light';

export type Phase = 'morning' | 'afternoon' | 'evening' | 'night';

export type SeriesKey = 'f1' | 'f2' | 'f3' | 'f1a' | 'fe' | 'indy' | 'wec' | 'wrc';

export const SERIES_COLORS: Record<SeriesKey, string> = {
  f1: '#ff6060',
  f2: '#60d4ff',
  f3: '#60ffb0',
  f1a: '#ffb060',
  fe: '#bb80ff',
  indy: '#ffe040',
  wec: '#00e8cc',
  wrc: '#ff6644',
};
