import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ThemeToggle } from './ThemeToggle';
import { SeriesPrefs } from './SeriesPrefs';

interface InfoPanelProps {
  open: boolean;
  onClose: () => void;
}

type Tab = 'settings' | 'about' | 'contact' | 'terms';

export function InfoPanel({ open, onClose }: InfoPanelProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>('settings');

  if (!open) return null;

  return (
    <div className="info-panel open">
      <div className="info-panel-header">
        <div className="info-tabs">
          {(['settings', 'about', 'contact', 'terms'] as Tab[]).map((tab) => (
            <button
              key={tab}
              className={`info-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'settings' ? 'Settings' :
               tab === 'about' ? t('info_about', 'About') :
               tab === 'contact' ? t('info_contact', 'Contact') :
               t('info_terms', 'Terms')}
            </button>
          ))}
        </div>
        <button className="info-close" onClick={onClose}>✕</button>
      </div>

      <div className="info-content">
        {activeTab === 'settings' && (
          <div className="info-pane">
            <h3>Theme</h3>
            <ThemeToggle />
            <h3>Series</h3>
            <SeriesPrefs />
          </div>
        )}
        {activeTab === 'about' && (
          <div className="info-pane">
            <h2>GridPulse</h2>
            <p>{t('info_h_covered', 'Comprehensive motorsport calendar covering all major series.')}</p>
          </div>
        )}
        {activeTab === 'contact' && (
          <div className="info-pane">
            <p>{t('info_contact_intro', 'Get in touch with the GridPulse team.')}</p>
          </div>
        )}
        {activeTab === 'terms' && (
          <div className="info-pane">
            <p>{t('terms_intro', 'Terms of use for GridPulse.')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
