import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { Race, SeriesConfig } from '../types';
import { api } from '../api/client';

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

  const filteredRaces =
    activeFilter === 'all'
      ? races
      : races.filter((r) => r.series.includes(activeFilter));

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

export const useRaces = () => useContext(RaceContext);
