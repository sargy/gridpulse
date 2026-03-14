import { useState, useCallback } from 'react';
import { Header } from './components/header/Header';
import { Sidebar } from './components/sidebar/Sidebar';
import { GlobeCanvas } from './components/globe/GlobeCanvas';
import { TourButton } from './components/globe/TourButton';
import { SessionPanel } from './components/session/SessionPanel';
import { NewsTicker } from './components/news/NewsTicker';
import { InfoPanel } from './components/settings/InfoPanel';
import './App.css';

function App() {
  const [infoPanelOpen, setInfoPanelOpen] = useState(false);
  const [touring, setTouring] = useState(false);

  const handleTourChange = useCallback((value: boolean) => {
    setTouring(value);
  }, []);

  const handleTourToggle = useCallback(() => {
    setTouring((prev) => !prev);
  }, []);

  return (
    <div className="app" data-theme="dark">
      <Header />
      <NewsTicker />
      <div className="main-layout">
        <SessionPanel />
        <div className="globe-wrapper">
          <GlobeCanvas touring={touring} onTourChange={handleTourChange} />
          <TourButton touring={touring} onToggle={handleTourToggle} />
        </div>
        <Sidebar />
      </div>
      <button className="info-btn" onClick={() => setInfoPanelOpen(true)}>ⓘ</button>
      <InfoPanel open={infoPanelOpen} onClose={() => setInfoPanelOpen(false)} />
    </div>
  );
}

export default App;
