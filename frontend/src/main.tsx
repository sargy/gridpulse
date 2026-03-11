import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';
import { RaceProvider } from './context/RaceContext';
import App from './App';
import './i18n';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<div className="loading">Loading GridPulse...</div>}>
      <ThemeProvider>
        <SettingsProvider>
          <RaceProvider>
            <App />
          </RaceProvider>
        </SettingsProvider>
      </ThemeProvider>
    </Suspense>
  </StrictMode>,
);
