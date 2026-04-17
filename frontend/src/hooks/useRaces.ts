import { useState, useEffect } from 'react';
import type { Race, SeriesConfig } from '../types';
import { api } from '../api/client';

export function useRaces() {
  const [races, setRaces] = useState<Race[]>([]);
  const [series, setSeries] = useState<SeriesConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [racesData, seriesData] = await Promise.all([
          api.getRaces(),
          api.getSeries(),
        ]);
        setRaces(racesData);
        setSeries(seriesData);
      } catch (err) {
        setError('Failed to load race data.');
        console.error('Data fetch failed:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return { races, series, loading, error };
}
