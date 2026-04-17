import type { Phase } from '../types';

export function getPhase(timezone: string): Phase {
  try {
    const now = new Date();
    const localStr = now.toLocaleTimeString('en-US', {
      timeZone: timezone,
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    });
    const [h] = localStr.split(':').map(Number);
    if (h >= 6 && h < 12) return 'morning';
    if (h >= 12 && h < 18) return 'afternoon';
    if (h >= 18 && h < 22) return 'evening';
    return 'night';
  } catch {
    return 'morning';
  }
}

export function phaseColor(phase: Phase): number {
  switch (phase) {
    case 'morning': return 0xc8ff00;
    case 'afternoon': return 0xffa500;
    case 'evening': return 0xff6060;
    case 'night': return 0x6088ff;
  }
}

export function formatCountdown(ms: number): string | null {
  if (ms <= 0) return null;
  const totalSec = Math.floor(ms / 1000);
  const d = Math.floor(totalSec / 86400);
  const h = Math.floor((totalSec % 86400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;

  if (d > 0) {
    return `${d}d ${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m`;
  }
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function daysUntilRace(utcStr: string, t?: any): string {
  const race = new Date(utcStr);
  const now = new Date();
  const diff = race.getTime() - now.getTime();
  if (diff <= 0) return t ? t('race_done_short', 'Done') : 'Done';
  const days = Math.ceil(diff / 86400000);
  const unit = t
    ? (days === 1 ? t('day_singular', 'day') : t('day_plural', 'days'))
    : (days === 1 ? 'day' : 'days');
  return `${days} ${unit}`;
}

export function timeAgo(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function getTimezoneOffset(timezone: string): string {
  try {
    const now = new Date();
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'shortOffset',
    }).formatToParts(now);
    const offsetPart = parts.find((p) => p.type === 'timeZoneName');
    return offsetPart ? offsetPart.value : '';
  } catch {
    return '';
  }
}
