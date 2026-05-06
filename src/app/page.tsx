'use client';

import dynamic from 'next/dynamic';
import { useState, useCallback } from 'react';
import L from 'leaflet';

import Header from '@/components/Header';
import LeftPanel from '@/components/LeftPanel';
import RightPanel from '@/components/RightPanel';
import TweaksPanel from '@/components/TweaksPanel';
import TickerBar from '@/components/TickerBar';
import TimelineSlider from '@/components/TimelineSlider';

import { CORRIDORS } from '@/data/corridors';
import { MapMarker } from '@/data/mapMarkers';

const BRIMap = dynamic(() => import('@/components/BRIMap'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-[#e8e0d5]">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-orange-500/40 border-t-orange-400 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-[11px] text-[#718096] font-medium">Initializing BRI Atlas…</p>
      </div>
    </div>
  ),
});

const ALL_CORRIDOR_IDS = new Set(CORRIDORS.map(c => c.id));
const ALL_INFRA_IDS = new Set(['ports', 'rail', 'highways', 'airports', 'energy', 'ind_zones', 'digital']);

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCorridors, setActiveCorridors] = useState<Set<string>>(new Set(ALL_CORRIDOR_IDS));
  const [activeInfra, setActiveInfra] = useState<Set<string>>(new Set(ALL_INFRA_IDS));
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [animatedFlows, setAnimatedFlows] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [density, setDensity] = useState<'all' | 'major'>('all');
  const [zoom, setZoom] = useState(4);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [energyMode, setEnergyMode] = useState(false);
  const [riskMode, setRiskMode] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [leafletMap, setLeafletMap] = useState<L.Map | null>(null);

  const handleToggleCorridor = useCallback((id: string) => {
    setActiveCorridors(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const handleToggleInfra = useCallback((id: string) => {
    setActiveInfra(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const handleMarkerClick = useCallback((marker: MapMarker | null) => {
    setSelectedMarker(prev => prev?.id === marker?.id ? null : marker);
  }, []);

  const handleYearChange = useCallback((y: number | ((prev: number) => number)) => {
    setSelectedYear(prev => typeof y === 'function' ? y(prev) : y);
  }, []);

  const handleEnergyToggle = useCallback(() => {
    setEnergyMode(e => !e);
    setRiskMode(false);
  }, []);

  const handleRiskToggle = useCallback(() => {
    setRiskMode(r => !r);
    setEnergyMode(false);
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const zoomPercent = zoom * 50 + 11;

  return (
    <main className="flex flex-col h-screen overflow-hidden bg-[#0a0e1a]">
      {/* Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        energyMode={energyMode}
        riskMode={riskMode}
        onEnergyToggle={handleEnergyToggle}
        onRiskToggle={handleRiskToggle}
      />

      {/* Body: 3 columns */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Left Panel */}
        <LeftPanel
          activeCorridors={activeCorridors}
          activeInfra={activeInfra}
          onToggleCorridor={handleToggleCorridor}
          onToggleInfra={handleToggleInfra}
          searchQuery={searchQuery}
        />

        {/* Center: toolbar + map + timeline */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Toolbar strip */}
          <div className="h-8 bg-[#0d111c] border-b border-[#1a2235] flex items-center justify-between px-3 flex-shrink-0">
            <div className="flex items-center gap-0">
              <ToolbarBtn onClick={() => setActiveCorridors(new Set(ALL_CORRIDOR_IDS))}>
                All routes
              </ToolbarBtn>
              <ToolbarDivider />
              <ToolbarBtn onClick={() => setActiveCorridors(new Set())}>
                None
              </ToolbarBtn>
              <ToolbarDivider />
              <ToolbarBtn onClick={() => setResetTrigger(r => r + 1)}>
                ↺ Reset
              </ToolbarBtn>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-slate-600 font-mono tabular-nums">
                {zoomPercent}%
              </span>
              <div className="w-px h-3 bg-[#1a2235]" />
              <TweaksPanel
                animatedFlows={animatedFlows}
                showLabels={showLabels}
                density={density}
                onToggleAnimated={() => setAnimatedFlows(a => !a)}
                onToggleLabels={() => setShowLabels(s => !s)}
                onSetDensity={setDensity}
              />
            </div>
          </div>

          {/* Map */}
          <div className="flex-1 relative overflow-hidden">
            <BRIMap
              activeCorridors={activeCorridors}
              activeInfra={activeInfra}
              selectedYear={selectedYear}
              animatedFlows={animatedFlows}
              showLabels={showLabels}
              density={density}
              energyMode={energyMode}
              riskMode={riskMode}
              onMarkerClick={handleMarkerClick}
              selectedMarkerId={selectedMarker?.id ?? null}
              resetTrigger={resetTrigger}
              onZoomChange={setZoom}
              onMapReady={setLeafletMap}
            />
          </div>

          {/* Timeline */}
          <TimelineSlider year={selectedYear} onYearChange={handleYearChange} />
        </div>

        {/* Right Panel */}
        <RightPanel
          selectedMarker={selectedMarker}
          onClearSelection={() => setSelectedMarker(null)}
        />
      </div>

      {/* Ticker Bar */}
      <TickerBar date={today} />
    </main>
  );
}

function ToolbarBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-[10px] text-slate-500 hover:text-slate-200 transition-colors px-2 py-1 hover:bg-white/[0.04] rounded"
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <span className="text-[#1a2235] text-xs select-none">|</span>;
}
