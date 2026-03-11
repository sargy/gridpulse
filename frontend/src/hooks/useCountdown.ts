import { useState, useEffect } from 'react';
import { formatCountdown } from '../utils/time';

export function useCountdown(targetUtc: string | undefined) {
  const [display, setDisplay] = useState<string | null>(null);

  useEffect(() => {
    if (!targetUtc) {
      setDisplay(null);
      return;
    }

    function update() {
      const ms = new Date(targetUtc!).getTime() - Date.now();
      setDisplay(formatCountdown(ms));
    }

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetUtc]);

  return display;
}
