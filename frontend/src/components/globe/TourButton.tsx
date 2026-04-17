import { useTranslation } from 'react-i18next';

interface TourButtonProps {
  touring: boolean;
  onToggle: () => void;
}

export function TourButton({ touring, onToggle }: TourButtonProps) {
  const { t } = useTranslation();

  return (
    <button
      className={`tour-btn ${touring ? 'touring' : ''}`}
      onClick={onToggle}
      title={touring ? t('tour_pause', 'Pause Tour') : t('tour_play', 'Auto Tour')}
    >
      {touring ? '⏸' : '▶'}
    </button>
  );
}
