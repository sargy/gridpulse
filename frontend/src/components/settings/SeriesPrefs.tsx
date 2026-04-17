import { useSettings } from '../../context/SettingsContext';
import { SERIES_COLORS, type SeriesKey } from '../../types';

const ALL_SERIES: SeriesKey[] = ['f1', 'f2', 'f3', 'f1a', 'fe', 'indy', 'wec', 'wrc'];

export function SeriesPrefs() {
  const { enabledSeries, toggleSeries } = useSettings();

  return (
    <div className="series-pref-grid">
      {ALL_SERIES.map((key) => {
        const enabled = enabledSeries.has(key);
        const color = SERIES_COLORS[key];
        return (
          <div
            key={key}
            className={`series-toggle ${enabled ? 'enabled' : ''}`}
            style={{ '--series-col': color } as React.CSSProperties}
            onClick={() => toggleSeries(key)}
          >
            <span className="series-toggle-name">{key.toUpperCase()}</span>
            <span className={`series-toggle-check ${enabled ? 'active' : ''}`}>
              {enabled ? '✓' : ''}
            </span>
          </div>
        );
      })}
    </div>
  );
}
