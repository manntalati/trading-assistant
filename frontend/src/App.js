import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import MarketData from './pages/MarketData';
import TradingSignals from './pages/TradingSignals';
import VoiceAssistant from './pages/VoiceAssistant';
import Settings from './pages/Settings';
import { TradingProvider } from './context/TradingContext';

function App() {
  return (
    <TradingProvider>
      <div className="flex h-screen bg-black text-white">
        <Sidebar />
        <main className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/market-data" element={<MarketData />} />
            <Route path="/signals" element={<TradingSignals />} />
            <Route path="/voice" element={<VoiceAssistant />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </TradingProvider>
  );
}

export default App; 