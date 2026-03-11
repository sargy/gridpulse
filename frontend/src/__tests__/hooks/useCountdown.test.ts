import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCountdown } from '../../hooks/useCountdown';

describe('useCountdown', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns null when no target provided', () => {
    const { result } = renderHook(() => useCountdown(undefined));
    expect(result.current).toBeNull();
  });

  it('returns null for past dates', () => {
    const { result } = renderHook(() => useCountdown('2020-01-01T00:00:00Z'));
    expect(result.current).toBeNull();
  });

  it('returns formatted countdown for future dates', () => {
    const future = new Date(Date.now() + 3600 * 1000).toISOString(); // 1 hour from now
    const { result } = renderHook(() => useCountdown(future));
    expect(result.current).toBeTruthy();
    expect(result.current).toMatch(/\d{2}:\d{2}:\d{2}/);
  });

  it('updates on interval', () => {
    const future = new Date(Date.now() + 7200 * 1000).toISOString(); // 2 hours from now
    const { result } = renderHook(() => useCountdown(future));
    expect(result.current).toBeTruthy();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // After 1 second, the countdown should still be truthy
    expect(result.current).toBeTruthy();
  });
});
