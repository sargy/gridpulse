import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useRaces } from '../../context/RaceContext';
import { useCountdown } from '../../hooks/useCountdown';
import { Badge } from '../common/Badge';

interface SessionEntry {
  key: string;
  label: string;
  time: Date;
  series: string;
}

function collectSessions(race: ReturnType<typeof useRaces>['selectedRace'], t: (k: string, d?: string) => string): SessionEntry[] {
  if (!race) return [];
  const entries: SessionEntry[] = [];

  const addSessions = (map: Record<string, string> | undefined, series: string, labels: Record<string, string>) => {
    if (!map) return;
    for (const [key, utc] of Object.entries(map)) {
      if (!utc) continue;
      entries.push({
        key: `${series}-${key}`,
        label: labels[key] || key,
        time: new Date(utc),
        series,
      });
    }
  };

  addSessions(race.sessions, 'f1', {
    fp1: t('s_fp1', 'Practice 1'), fp2: t('s_fp2', 'Practice 2'), fp3: t('s_fp3', 'Practice 3'),
    sq: t('s_sq', 'Sprint Qualifying'), sprint: t('s_sprint', 'Sprint'),
    quali: t('s_quali', 'Qualifying'), race: t('s_race', 'Race'),
  });
  addSessions(race.f2Sessions, 'f2', {
    fp: t('s_f2_fp', 'Practice'), quali: t('s_f2_quali', 'Qualifying'),
    sprint: t('s_f2_sprint', 'Sprint Race'), feature: t('s_f2_feature', 'Feature Race'),
  });
  addSessions(race.f3Sessions, 'f3', {
    fp: t('s_f3_fp', 'Practice'), quali: t('s_f3_quali', 'Qualifying'),
    sprint: t('s_f3_sprint', 'Sprint Race'), feature: t('s_f3_feature', 'Feature Race'),
  });
  addSessions(race.f1aSessions, 'f1a', {
    quali: t('s_f1a_quali', 'Qualifying'), race1: t('s_f1a_r1', 'Race 1'), race2: t('s_f1a_r2', 'Race 2'),
  });
  addSessions(race.feSessions, 'fe', {
    fp: t('s_fe_fp', 'Practice'), quali: t('s_fe_quali', 'Qualifying'),
    race: t('s_fe_race', 'Race'), race2: t('s_fe_race2', 'Race 2'),
  });

  return entries.sort((a, b) => a.time.getTime() - b.time.getTime());
}

function groupByDay(sessions: SessionEntry[]): Map<string, SessionEntry[]> {
  const groups = new Map<string, SessionEntry[]>();
  for (const s of sessions) {
    const dayKey = s.time.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' });
    if (!groups.has(dayKey)) groups.set(dayKey, []);
    groups.get(dayKey)!.push(s);
  }
  return groups;
}

export function SessionPanel() {
  const { t } = useTranslation();
  const { selectedRace, selectRace } = useRaces();
  const raceTime = selectedRace?.sessions?.race || selectedRace?.feSessions?.race;
  const countdown = useCountdown(raceTime);

  const grouped = useMemo(() => {
    if (!selectedRace) return new Map();
    return groupByDay(collectSessions(selectedRace, t));
  }, [selectedRace, t]);

  if (!selectedRace) return null;

  return (
    <div className="session-panel open">
      <div className="sp-header">
        <div>
          <div className="sp-round">Round {selectedRace.round}</div>
          <div className="sp-race-name">{selectedRace.region}</div>
          <div className="sp-race-location">{selectedRace.city} · {selectedRace.country}</div>
          <div className="sp-badges">
            {selectedRace.series.map((s) => <Badge key={s} series={s} />)}
          </div>
        </div>
        <button className="sp-close" onClick={() => selectRace(null)}>✕</button>
      </div>

      <div className="sp-sessions">
        {[...grouped.entries()].map(([day, sessions]) => (
          <div key={day}>
            <div className="sp-day-heading">{day}</div>
            {sessions.map((s) => {
              const isRace = s.key.endsWith('-race') || s.key.endsWith('-feature');
              return (
                <div key={s.key} className={`sp-session-row ${isRace ? 'is-race' : ''}`}>
                  <Badge series={s.series} />
                  <span className={`sp-session-label ${isRace ? 'is-race' : ''}`}>{s.label}</span>
                  <span className="sp-session-time">
                    {s.time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {countdown && (
        <div className="sp-countdown">
          <div className="sp-countdown-label">Race starts in</div>
          <div className="sp-countdown-value">{countdown}</div>
        </div>
      )}
      {raceTime && !countdown && (
        <div className="sp-countdown">
          <div className="sp-countdown-value">{t('race_completed', 'Race completed')}</div>
        </div>
      )}
    </div>
  );
}
