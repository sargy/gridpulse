import { useTranslation } from 'react-i18next';
import { useRaces } from '../../context/RaceContext';
import { Badge } from '../common/Badge';
import { FilterBar } from './FilterBar';
import { daysUntilRace } from '../../utils/time';
import { langToLocale } from '../../utils/locale';

export function Sidebar() {
  const { t, i18n } = useTranslation();
  const { filteredRaces, selectedRace, selectRace } = useRaces();
  const locale = langToLocale(i18n.language);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span>{t('calendar_title', '2026 Calendar')}</span>
        <span className="sidebar-count">{filteredRaces.length}</span>
      </div>
      <FilterBar />
      <div className="city-list">
        {filteredRaces.map((race) => {
          const raceTime = race.sessions?.race || race.feSessions?.race || race.indySessions?.race;
          const daysText = race.cancelled ? t('race_cancelled', 'CANCELLED') : (raceTime ? daysUntilRace(raceTime, t) : '');
          const isActive = selectedRace?.id === race.id;

          return (
            <div
              key={race.id}
              className={`city-item ${isActive ? 'active' : ''} ${race.cancelled ? 'cancelled' : ''}`}
              onClick={() => selectRace(race)}
            >
              <div className="ci-top">
                <span className="ci-name">{race.region}</span>
                <span className={`ci-time ${race.cancelled ? 'ci-cancelled' : ''}`}>{daysText}</span>
              </div>
              <div className="ci-bottom">
                <span className="ci-round">R{race.round}</span>
                <span className="ci-location">{race.country}</span>
                <span className="ci-date">
                  {raceTime ? new Date(raceTime).toLocaleDateString(locale, { day: 'numeric', month: 'short' }) : ''}
                </span>
              </div>
              <div className="ci-badges">
                {race.series.map((s) => (
                  <Badge key={s} series={s} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
