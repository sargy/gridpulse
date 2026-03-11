import { describe, it, expect } from 'vitest';
import { formatCountdown, daysUntilRace, timeAgo } from '../../utils/time';

describe('formatCountdown', () => {
  it('returns null for zero or negative ms', () => {
    expect(formatCountdown(0)).toBeNull();
    expect(formatCountdown(-1000)).toBeNull();
  });

  it('formats hours:minutes:seconds when less than a day', () => {
    // 2 hours, 30 minutes, 15 seconds = 9015 seconds = 9015000 ms
    expect(formatCountdown(9015000)).toBe('02:30:15');
  });

  it('formats days when >= 1 day', () => {
    // 3 days, 5 hours, 30 minutes
    const ms = (3 * 86400 + 5 * 3600 + 30 * 60) * 1000;
    expect(formatCountdown(ms)).toBe('3d 05h 30m');
  });

  it('formats exactly 1 day', () => {
    const ms = 86400 * 1000;
    expect(formatCountdown(ms)).toBe('1d 00h 00m');
  });
});

describe('daysUntilRace', () => {
  it('returns "Done" for past dates', () => {
    expect(daysUntilRace('2020-01-01T00:00:00Z')).toBe('Done');
  });

  it('returns singular "day" for 1 day', () => {
    const tomorrow = new Date(Date.now() + 86400000 * 0.5);
    expect(daysUntilRace(tomorrow.toISOString())).toBe('1 day');
  });

  it('returns plural "days" for multiple days', () => {
    const future = new Date(Date.now() + 86400000 * 5);
    const result = daysUntilRace(future.toISOString());
    expect(result).toMatch(/\d+ days/);
  });
});

describe('timeAgo', () => {
  it('returns "just now" for recent dates', () => {
    const now = new Date().toISOString();
    expect(timeAgo(now)).toBe('just now');
  });

  it('returns minutes for recent past', () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    expect(timeAgo(fiveMinAgo)).toMatch(/5m? ago/);
  });
});
