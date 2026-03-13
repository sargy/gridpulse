import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useRaces } from '../../context/RaceContext';
import { useSettings } from '../../context/SettingsContext';
import { CountdownTimer } from './CountdownTimer';
import { SERIES_COLORS, type SeriesKey } from '../../types';
import type { Race } from '../../types';

function getNextRaceForSeries(races: Race[], seriesKey: string): Race | null {
  const now = Date.now();
  return (
    races
      .filter((r) => r.series.includes(seriesKey))
      .map((r) => {
        // Find the race session time for the primary series
        const sessionMap = seriesKey === 'f1' ? r.sessions
          : seriesKey === 'f2' ? r.f2Sessions
          : seriesKey === 'f3' ? r.f3Sessions
          : seriesKey === 'f1a' ? r.f1aSessions
          : seriesKey === 'fe' ? r.feSessions
          : seriesKey === 'indy' ? r.indySessions
          : seriesKey === 'wec' ? r.wecSessions
          : seriesKey === 'wrc' ? r.wrcSessions
          : r.sessions;
        const raceTime = sessionMap?.race || sessionMap?.feature || sessionMap?.race1 || Object.values(sessionMap || {}).pop();
        return { race: r, raceTime: raceTime ? new Date(raceTime).getTime() : Infinity };
      })
      .filter(({ raceTime }) => raceTime > now)
      .sort((a, b) => a.raceTime - b.raceTime)[0]?.race || null
  );
}

function getRaceTime(race: Race, seriesKey: string): string | undefined {
  const sessionMap = seriesKey === 'f1' ? race.sessions
    : seriesKey === 'f2' ? race.f2Sessions
    : seriesKey === 'f3' ? race.f3Sessions
    : seriesKey === 'f1a' ? race.f1aSessions
    : seriesKey === 'fe' ? race.feSessions
    : seriesKey === 'indy' ? race.indySessions
    : seriesKey === 'wec' ? race.wecSessions
    : seriesKey === 'wrc' ? race.wrcSessions
    : race.sessions;
  return sessionMap?.race || sessionMap?.feature || sessionMap?.race1 || Object.values(sessionMap || {}).pop();
}

const HEADER_SERIES_KEYS: { key: SeriesKey; tKey: string }[] = [
  { key: 'f1', tKey: 'next_f1' },
  { key: 'f2', tKey: 'next_f2' },
  { key: 'f3', tKey: 'next_f3' },
  { key: 'fe', tKey: 'next_fe' },
  { key: 'indy', tKey: 'next_indy' },
];

export function Header() {
  const { t } = useTranslation();
  const { races } = useRaces();
  const { enabledSeries } = useSettings();

  const nextRaces = useMemo(() =>
    HEADER_SERIES_KEYS
      .filter(({ key }) => enabledSeries.has(key))
      .map(({ key, tKey }) => {
        const race = getNextRaceForSeries(races, key);
        const time = race ? getRaceTime(race, key) : undefined;
        return { key, tKey, race, time };
      }).filter(({ race }) => race !== null),
    [races, enabledSeries]
  );

  return (
    <header className="header">
      <div className="header-logo">GridPulse</div>
      <div className="header-races">
        {nextRaces.map(({ key, tKey, race, time }) => (
          <CountdownTimer
            key={key}
            label={t(tKey)}
            location={`${race!.region} · ${race!.country}`}
            targetUtc={time!}
            accentColor={SERIES_COLORS[key]}
          />
        ))}
      </div>
    </header>
  );
}
