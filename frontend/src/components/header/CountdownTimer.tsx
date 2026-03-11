import { useCountdown } from '../../hooks/useCountdown';

interface CountdownTimerProps {
  targetUtc: string;
  label: string;
  location: string;
  accentColor?: string;
}

export function CountdownTimer({ targetUtc, label, location, accentColor = 'var(--accent)' }: CountdownTimerProps) {
  const countdown = useCountdown(targetUtc);

  if (!countdown) return null;

  return (
    <div className="hdr-race-block">
      <div className="next-race-label">{label}</div>
      <div className="next-race-name">{location}</div>
      <div className="countdown-label">Starts in</div>
      <div className="countdown-value" style={{ color: accentColor }}>
        {countdown}
      </div>
    </div>
  );
}
