import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import type { Race, SeriesConfig } from '../types';
import { api } from '../api/client';
import { useSettings } from './SettingsContext';

interface RaceContextType {
  races: Race[];
  seriesConfigs: SeriesConfig[];
  selectedRace: Race | null;
  activeFilter: string;
  loading: boolean;
  selectRace: (race: Race | null) => void;
  setActiveFilter: (filter: string) => void;
  filteredRaces: Race[];
}

const RaceContext = createContext<RaceContextType>({
  races: [],
  seriesConfigs: [],
  selectedRace: null,
  activeFilter: 'all',
  loading: true,
  selectRace: () => {},
  setActiveFilter: () => {},
  filteredRaces: [],
});

export function RaceProvider({ children }: { children: ReactNode }) {
  const [races, setRaces] = useState<Race[]>([]);
  const [seriesConfigs, setSeriesConfigs] = useState<SeriesConfig[]>([]);
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const { enabledSeries } = useSettings();

  useEffect(() => {
    async function loadData() {
      try {
        const [racesData, seriesData] = await Promise.all([
          api.getRaces(),
          api.getSeries(),
        ]);
        setRaces(racesData);
        setSeriesConfigs(seriesData);
      } catch (err) {
        console.error('Failed to load race data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const selectRace = useCallback((race: Race | null) => {
    setSelectedRace(race);
  }, []);

  // Filter races by both the sidebar activeFilter AND the settings enabledSeries.
  // A race is included if it has at least one series that is enabled in settings.
  // Then the sidebar activeFilter narrows further (or shows 'all' enabled).
  const filteredRaces = useMemo(() => {
    // First, filter to only races that have at least one enabled series
    const enabledRaces = races.filter((r) =>
      r.series.some((s) => enabledSeries.has(s))
    );

    // Then apply the sidebar filter
    if (activeFilter === 'all') return enabledRaces;
    return enabledRaces.filter((r) => r.series.includes(activeFilter));
  }, [races, enabledSeries, activeFilter]);

  return (
    <RaceContext.Provider
      value={{
        races,
        seriesConfigs,
        selectedRace,
        activeFilter,
        loading,
        selectRace,
        setActiveFilter,
        filteredRaces,
      }}
    >
      {children}
    </RaceContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRaces = () => useContext(RaceContext);
