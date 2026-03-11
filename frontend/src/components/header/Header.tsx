import { useMemo } from 'react';
import { useRaces } from '../../context/RaceContext';
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

const HEADER_SERIES: { key: SeriesKey; label: string }[] = [
  { key: 'f1', label: 'Next F1' },
  { key: 'f2', label: 'Next F2' },
  { key: 'f3', label: 'Next F3' },
  { key: 'fe', label: 'Next Formula E' },
  { key: 'indy', label: 'Next IndyCar' },
];

export function Header() {
  const { races } = useRaces();

  const nextRaces = useMemo(() =>
    HEADER_SERIES.map(({ key, label }) => {
      const race = getNextRaceForSeries(races, key);
      const time = race ? getRaceTime(race, key) : undefined;
      return { key, label, race, time };
    }).filter(({ race }) => race !== null),
    [races]
  );

  return (
    <header className="header">
      <div className="header-logo">GridPulse</div>
      <div className="header-races">
        {nextRaces.map(({ key, label, race, time }) => (
          <CountdownTimer
            key={key}
            label={label}
            location={`${race!.region} · ${race!.country}`}
            targetUtc={time!}
            accentColor={SERIES_COLORS[key]}
          />
        ))}
      </div>
    </header>
  );
}
