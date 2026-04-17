import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import { ThemeToggle } from './ThemeToggle';
import { SeriesPrefs } from './SeriesPrefs';
import { useSettings } from '../../context/SettingsContext';

interface InfoPanelProps {
  open: boolean;
  onClose: () => void;
}

type Tab = 'settings' | 'about' | 'contact' | 'terms';

const LANGUAGES = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'fr', label: 'FR', name: 'Fran\u00e7ais' },
  { code: 'es', label: 'ES', name: 'Espa\u00f1ol' },
  { code: 'de', label: 'DE', name: 'Deutsch' },
  { code: 'pl', label: 'PL', name: 'Polski' },
  { code: 'ja', label: 'JA', name: '\u65e5\u672c\u8a9e' },
  { code: 'ko', label: 'KO', name: '\ud55c\uad6d\uc5b4' },
];

const TERMS_SECTIONS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export function InfoPanel({ open, onClose }: InfoPanelProps) {
  const { t } = useTranslation();
  const { language, setLanguage } = useSettings();
  const [activeTab, setActiveTab] = useState<Tab>('settings');

  // Fixed English translator for bilingual terms display
  const tEn = i18n.getFixedT('en');
  const isNonEnglish = language !== 'en';

  if (!open) return null;

  return (
    <div className="info-overlay" onClick={onClose}>
      <div className="info-panel open" onClick={(e) => e.stopPropagation()}>
        <div className="info-panel-title-row">
          <span className="info-panel-title">GridPulse · <span className="info-panel-title-accent">{t('info_information', 'Information')}</span></span>
          <button className="info-close" onClick={onClose}>{'\u2715'}</button>
        </div>
        <div className="info-panel-header">
          <div className="info-tabs">
            {(['settings', 'about', 'contact', 'terms'] as Tab[]).map((tab) => (
              <button
                key={tab}
                className={`info-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'settings' ? t('settings_tab', 'Settings') :
                 tab === 'about' ? t('info_about', 'About') :
                 tab === 'contact' ? t('info_contact', 'Contact') :
                 t('info_terms', 'Terms of Use')}
              </button>
            ))}
          </div>
        </div>

      <div className="info-content">
        {/* ── Settings Tab ── */}
        {activeTab === 'settings' && (
          <div className="info-pane">
            <h3>{t('settings_theme_section', 'Theme')}</h3>
            <ThemeToggle />

            <h3>{t('settings_language', 'Language')}</h3>
            <div className="lang-grid">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  className={`lang-btn ${language === lang.code ? 'active' : ''}`}
                  onClick={() => setLanguage(lang.code)}
                >
                  <span className="lang-btn-code">{lang.label}</span>
                  <span className="lang-btn-name">{lang.name}</span>
                </button>
              ))}
            </div>

            <h3>{t('settings_series', 'Racing Series')}</h3>
            <SeriesPrefs />
          </div>
        )}

        {/* ── About Tab ── */}
        {activeTab === 'about' && (
          <div className="info-pane">
            <h2><span className="gp-grid">Grid</span><span className="gp-pulse">Pulse</span></h2>
            <p>{t('info_intro1', 'GridPulse is a live motorsport calendar and race tracker built for fans who want to follow the full racing season \u2013 across every series, on a single globe.')}</p>
            <p>{t('info_intro2', 'Spin the globe, explore circuits, and see exactly what is racing where and when. Every round is plotted on an interactive 3D map with real-time countdowns to the next session.')}</p>

            <h3>{t('info_h_covered', 'What is covered')}</h3>
            <ul className="info-list">
              <li>{t('info_li_f1', 'Formula 1 \u2013 full season calendar with practice, qualifying and race sessions')}</li>
              <li>{t('info_li_f2f3', 'Formula 2 & Formula 3 \u2013 sprint and feature race sessions')}</li>
              <li>{t('info_li_f1a', 'F1 Academy \u2013 the all-female development series')}</li>
              <li>{t('info_li_fe', 'Formula E \u2013 electric street racing E-Prix calendar')}</li>
              <li>{t('info_li_indy', 'IndyCar \u2013 oval and road course championship calendar')}</li>
            </ul>

            <h3>{t('info_h_how', 'How to use it')}</h3>
            <ul className="info-list">
              <li>{t('info_how_1', 'Drag the globe to rotate, scroll or pinch to zoom')}</li>
              <li>{t('info_how_2', 'Click any race dot to open the full session schedule')}</li>
              <li>{t('info_how_3', 'Use the series filter to focus on a single championship')}</li>
              <li>{t('info_how_4', 'Press \u25b6 to start the automatic race tour')}</li>
              <li>{t('info_how_5', 'The header rotates through next-up races across all active series')}</li>
            </ul>

            <h3>{t('info_h_data', 'Data & updates')}</h3>
            <p>{t('info_data_p', 'Session times are sourced from official series calendars and displayed in your local time zone. News feeds are pulled live from Autosport and The Race.')}</p>

            <p className="info-disclaimer">{t('info_disclaimer', 'GridPulse is an independent fan project and is not affiliated with Formula One Management, Formula E Operations, IndyCar or any team or driver.')}</p>
          </div>
        )}

        {/* ── Contact Tab ── */}
        {activeTab === 'contact' && (
          <div className="info-pane">
            <h2 dangerouslySetInnerHTML={{ __html: t('info_contact_h2', 'Get in <em>Touch</em>') }} />
            <p>{t('info_contact_intro', 'Have a question, found a bug, or want to suggest a feature? We would love to hear from you.')}</p>

            <div className="contact-list">
              <div className="contact-item">
                <span className="contact-label">{t('info_contact_general', 'General enquiries')}</span>
              </div>
              <div className="contact-item">
                <span className="contact-label">{t('info_email', 'Email')}</span>
                <span className="contact-value">hello@gridpulse.app</span>
              </div>
              <div className="contact-item">
                <span className="contact-label">{t('info_bugs', 'Bug reports')}</span>
                <span className="contact-value">bugs@gridpulse.app</span>
              </div>
              <div className="contact-item">
                <span className="contact-label">{t('info_feedback', 'Feature requests')}</span>
                <span className="contact-value">feedback@gridpulse.app</span>
              </div>
              <div className="contact-item">
                <span className="contact-label">{t('info_response', 'Response time')}</span>
                <span className="contact-value">{t('info_response_val', '2\u20133 business days')}</span>
              </div>
              <div className="contact-item">
                <span className="contact-label">{t('info_follow', 'Follow us')}</span>
                <span className="contact-value">@gridpulse</span>
              </div>
            </div>
          </div>
        )}

        {/* ── Terms Tab ── */}
        {activeTab === 'terms' && (
          <div className="info-pane">
            <h2 dangerouslySetInnerHTML={{ __html: t('info_terms_h2', 'Terms of <em>Use</em>') }} />
            <p>{t('terms_intro', 'By accessing or using GridPulse you agree to these terms.')}</p>

            {isNonEnglish && (
              <div className="terms-bilingual-note">
                {t('terms_bilingual_note', 'These terms are legally binding in English only. The translation below is provided for reference alongside the official English version.')}
              </div>
            )}

            {TERMS_SECTIONS.map((n) => (
              <div key={n} className="terms-section">
                <h3 className="terms-heading">{t(`terms_h${n}`)}</h3>
                <p>{t(`terms_p${n}`)}</p>
                {isNonEnglish && (
                  <div className="terms-en-block">
                    <h4>{tEn(`terms_h${n}`)}</h4>
                    <p>{tEn(`terms_p${n}`)}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
