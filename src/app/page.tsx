'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState, useCallback } from 'react';

import ControlPanel from '@/components/ControlPanel';
import InfoPanel from '@/components/InfoPanel';
import StatsPanel from '@/components/StatsPanel';

import portsData from '@/data/ports.json';
import airportsData from '@/data/airports.json';
import citiesData from '@/data/cities.json';
import routesData from '@/data/routes.json';
import statsData from '@/data/stats.json';

import { MapFeature, Route, LayerVisibility } from '@/types';

// Dynamically import the map to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-amber-50">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-amber-700 text-sm">Loading map...</p>
      </div>
    </div>
  ),
});

const allFeatures: MapFeature[] = [
  ...(portsData as MapFeature[]),
  ...(airportsData as MapFeature[]),
  ...(citiesData as MapFeature[]),
];

const allRoutes: Route[] = routesData as Route[];

const DEFAULT_LAYERS: LayerVisibility = {
  maritime: true,
  land: true,
  ports: true,
  airports: true,
  cities: true,
};

export default function HomePage() {
  const [layers, setLayers] = useState<LayerVisibility>(DEFAULT_LAYERS);
  const [selectedFeature, setSelectedFeature] = useState<MapFeature | null>(null);
  const [resetKey, setResetKey] = useState(0);

  const handleToggle = useCallback((key: keyof LayerVisibility) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleFeatureClick = useCallback((feature: MapFeature) => {
    setSelectedFeature((prev) => (prev?.id === feature.id ? null : feature));
  }, []);

  const handleClose = useCallback(() => setSelectedFeature(null), []);

  const handleResetView = useCallback(() => {
    setSelectedFeature(null);
    setResetKey((k) => k + 1);
  }, []);

  return (
    <main className="relative h-screen w-screen overflow-hidden" style={{ background: '#faf7f2' }}>
      {/* Map */}
      <div className="absolute inset-0">
        <MapComponent
          key={resetKey}
          features={allFeatures}
          routes={allRoutes}
          layers={layers}
          onFeatureClick={handleFeatureClick}
          selectedFeature={selectedFeature}
        />
      </div>

      {/* UI Overlays */}
      <ControlPanel layers={layers} onToggle={handleToggle} onResetView={handleResetView} />
      <InfoPanel feature={selectedFeature} onClose={handleClose} />
      <StatsPanel overview={statsData.overview as any} regions={statsData.regions as any} />

      {/* Click hint */}
      {!selectedFeature && (
        <div className="absolute bottom-8 right-4 z-[400] pointer-events-none">
          <div className="backdrop-blur-md rounded-xl px-3 py-2" style={{ background: 'rgba(255,252,245,0.9)', border: '1px solid rgba(210,185,150,0.6)' }}>
            <p className="text-xs" style={{ color: '#7c5c3e' }}>Click any marker for details</p>
          </div>
        </div>
      )}

      {/* Schedule nav */}
      <div className="absolute top-4 right-4 z-[500]">
        <Link
          href="/schedule"
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 14px', borderRadius: 10,
            background: 'rgba(255,252,245,0.92)',
            border: '1px solid rgba(210,185,150,0.7)',
            backdropFilter: 'blur(8px)',
            color: '#7c5c3e',
            fontSize: 12, fontWeight: 600,
            textDecoration: 'none',
            boxShadow: '0 2px 12px rgba(100,60,20,0.12)',
          }}
        >
          ✦ Schedule
        </Link>
      </div>
    </main>
  );
  }
