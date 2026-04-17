import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <div className="theme-toggle-row">
      <button
        className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
        onClick={() => theme !== 'dark' && toggleTheme()}
      >
        {t('settings_theme_dark', 'Dark')}
      </button>
      <button
        className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
        onClick={() => theme !== 'light' && toggleTheme()}
      >
        {t('settings_theme_light', 'Light')}
      </button>
    </div>
  );
}
