import { useTranslation } from 'react-i18next';
import { useCountdown } from '../../hooks/useCountdown';

interface CountdownTimerProps {
  targetUtc: string;
  label: string;
  raceName: string;
  location: string;
  accentColor?: string;
}

export function CountdownTimer({ targetUtc, label, raceName, location, accentColor = 'var(--accent)' }: CountdownTimerProps) {
  const { t } = useTranslation();
  const countdown = useCountdown(targetUtc);

  if (!countdown) return null;

  return (
    <div className="hdr-race-block">
      <div className="hdr-race-info">
        <div className="hdr-series-label" style={{ color: accentColor }}>{label}</div>
        <div className="hdr-race-name">{raceName}</div>
        <div className="hdr-race-location">{location}</div>
      </div>
      <div className="hdr-countdown">
        <div className="hdr-starts-label">{t('starts_in', 'Starts in')}</div>
        <div className="hdr-countdown-value" style={{ color: accentColor }}>
          {countdown}
        </div>
      </div>
    </div>
  );
}
