import { useTranslation } from 'react-i18next';
import { useRaces } from '../../context/RaceContext';
import { useSettings } from '../../context/SettingsContext';
import { SERIES_COLORS, type SeriesKey } from '../../types';

const ALL_SERIES: SeriesKey[] = ['f1', 'f2', 'f3', 'f1a', 'fe', 'indy', 'wec', 'wrc'];

export function FilterBar() {
  const { t } = useTranslation();
  const { activeFilter, setActiveFilter } = useRaces();
  const { enabledSeries } = useSettings();

  const visibleSeries = ALL_SERIES.filter((key) => enabledSeries.has(key));

  return (
    <div className="filter-bar">
      <button
        className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
        onClick={() => setActiveFilter('all')}
      >
        {t('all', 'All')}
      </button>
      {visibleSeries.map((key) => (
        <button
          key={key}
          className={`filter-btn ${activeFilter === key ? 'active' : ''}`}
          style={
            activeFilter === key
              ? { background: SERIES_COLORS[key], color: '#fff', borderColor: SERIES_COLORS[key] }
              : {}
          }
          onClick={() => setActiveFilter(key)}
        >
          {key.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
