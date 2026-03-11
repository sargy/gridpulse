import { useState } from 'react';
import { Header } from './components/header/Header';
import { Sidebar } from './components/sidebar/Sidebar';
import { GlobeCanvas } from './components/globe/GlobeCanvas';
import { SessionPanel } from './components/session/SessionPanel';
import { NewsTicker } from './components/news/NewsTicker';
import { InfoPanel } from './components/settings/InfoPanel';
import './App.css';

function App() {
  const [infoPanelOpen, setInfoPanelOpen] = useState(false);

  return (
    <div className="app" data-theme="dark">
      <Header />
      <NewsTicker />
      <div className="main-layout">
        <Sidebar />
        <div className="globe-wrapper">
          <GlobeCanvas />
        </div>
        <SessionPanel />
      </div>
      <button className="info-btn" onClick={() => setInfoPanelOpen(true)}>ⓘ</button>
      <InfoPanel open={infoPanelOpen} onClose={() => setInfoPanelOpen(false)} />
    </div>
  );
}

export default App;
