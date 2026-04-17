import { SERIES_COLORS, type SeriesKey } from '../../types';

interface BadgeProps {
  series: string;
}

export function Badge({ series }: BadgeProps) {
  const color = SERIES_COLORS[series as SeriesKey] || '#888';
  return (
    <span
      className="badge"
      style={{
        background: `${color}22`,
        color,
        border: `1px solid ${color}55`,
        padding: '1px 6px',
        borderRadius: '3px',
        fontSize: '0.65rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      }}
    >
      {series}
    </span>
  );
}
