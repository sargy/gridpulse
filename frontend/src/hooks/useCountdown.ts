import { useSyncExternalStore, useCallback, useRef, useEffect } from 'react';
import { formatCountdown } from '../utils/time';

export function useCountdown(targetUtc: string | undefined) {
  const displayRef = useRef<string | null>(null);
  const listenersRef = useRef(new Set<() => void>());

  const subscribe = useCallback((cb: () => void) => {
    listenersRef.current.add(cb);
    return () => { listenersRef.current.delete(cb); };
  }, []);

  const getSnapshot = useCallback(() => displayRef.current, []);

  useEffect(() => {
    if (!targetUtc) {
      displayRef.current = null;
      listenersRef.current.forEach((cb) => cb());
      return;
    }

    function tick() {
      const ms = new Date(targetUtc!).getTime() - Date.now();
      const next = formatCountdown(ms);
      if (next !== displayRef.current) {
        displayRef.current = next;
        listenersRef.current.forEach((cb) => cb());
      }
    }

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetUtc]);

  return useSyncExternalStore(subscribe, getSnapshot);
}
