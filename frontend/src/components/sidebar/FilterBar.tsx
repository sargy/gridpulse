import { useTranslation } from 'react-i18next';
import { useRaces } from '../../context/RaceContext';
import { SERIES_COLORS, type SeriesKey } from '../../types';

const ALL_SERIES: SeriesKey[] = ['f1', 'f2', 'f3', 'f1a', 'fe', 'indy', 'wec', 'wrc'];

export function FilterBar() {
  const { t } = useTranslation();
  const { activeFilter, setActiveFilter } = useRaces();

  return (
    <div className="filter-bar">
      <button
        className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
        onClick={() => setActiveFilter('all')}
      >
        {t('all', 'All')}
      </button>
      {ALL_SERIES.map((key) => (
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
