'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { CORRIDORS } from '@/data/corridors';
import { MAP_MARKERS, MapMarker } from '@/data/mapMarkers';

if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}

function MapController({
  onZoomChange,
  onMapReady,
  resetTrigger,
}: {
  onZoomChange: (z: number) => void;
  onMapReady: (map: L.Map) => void;
  resetTrigger: number;
}) {
  const map = useMap();
  const prevReset = useRef(0);

  useEffect(() => {
    onMapReady(map);
    onZoomChange(map.getZoom());
  }, [map, onMapReady, onZoomChange]);

  useMapEvents({ zoomend: () => onZoomChange(map.getZoom()) });

  useEffect(() => {
    if (resetTrigger !== prevReset.current) {
      prevReset.current = resetTrigger;
      map.flyTo([28, 68], 4, { duration: 1.4 });
    }
  }, [resetTrigger, map]);

  return null;
}

interface BRIMapProps {
  activeCorridors: Set<string>;
  activeInfra: Set<string>;
  selectedYear: number;
  animatedFlows: boolean;
  showLabels: boolean;
  density: 'all' | 'major';
  energyMode: boolean;
  riskMode: boolean;
  onMarkerClick: (marker: MapMarker | null) => void;
  selectedMarkerId: string | null;
  resetTrigger: number;
  onZoomChange: (z: number) => void;
  onMapReady: (map: L.Map) => void;
}

const STATUS_DOT_COLORS: Record<string, string> = {
  'Operational': '#22c55e',
  'Under Construction': '#f59e0b',
  'Planned': '#94a3b8',
  'Suspended': '#ef4444',
  'Partner Node': '#8b5cf6',
  'Coordination Hub': '#ef4444',
};

const INFRA_TYPE_MAP: Record<string, string[]> = {
  ports: ['Port'],
  rail: ['Rail Hub'],
  airports: ['Airport'],
  ind_zones: ['Industrial Zone'],
};

export default function BRIMap({
  activeCorridors,
  activeInfra,
  selectedYear,
  animatedFlows,
  showLabels,
  density,
  energyMode,
  riskMode,
  onMarkerClick,
  selectedMarkerId,
  resetTrigger,
  onZoomChange,
  onMapReady,
}: BRIMapProps) {
  const [zoom, setZoom] = useState(4);
  const mapRef = useRef<L.Map | null>(null);

  const handleZoomChange = useCallback((z: number) => {
    setZoom(z);
    onZoomChange(z);
  }, [onZoomChange]);

  const handleMapReady = useCallback((map: L.Map) => {
    mapRef.current = map;
    onMapReady(map);
  }, [onMapReady]);

  const zoomPercent = zoom * 50 + 11;

  const visibleMarkers = MAP_MARKERS.filter(m => {
    if (m.yearAdded > selectedYear) return false;
    if (density === 'major' && m.size === 'sm') return false;
    if (!activeCorridors.has(m.corridorId)) return false;
    // Infra type filter
    const matched = Object.entries(INFRA_TYPE_MAP).find(([, types]) => types.includes(m.type));
    if (matched && !activeInfra.has(matched[0])) return false;
    return true;
  });

  return (
    <div className="relative h-full w-full bg-[#e8e0d5]">
      <MapContainer
        center={[28, 68]}
        zoom={4}
        minZoom={2}
        maxZoom={14}
        className="h-full w-full"
        zoomControl={false}
        scrollWheelZoom={true}
        worldCopyJump={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          maxZoom={19}
        />

        <MapController
          onZoomChange={handleZoomChange}
          onMapReady={handleMapReady}
          resetTrigger={resetTrigger}
        />

        {/* Corridor polylines */}
        {CORRIDORS.filter(c => activeCorridors.has(c.id)).map(corridor => {
          const isEnergy = energyMode && corridor.id !== 'cpec';
          const isRisk = riskMode;
          return (
            <Polyline
              key={corridor.id}
              positions={corridor.coordinates}
              pathOptions={{
                color: isEnergy ? '#eab308' : isRisk ? '#ef4444' : corridor.color,
                weight: corridor.weight,
                opacity: isEnergy && corridor.id !== 'nelb' ? 0.3 : 0.9,
                dashArray: corridor.dashed ? '10 8' : undefined,
                lineCap: 'round',
                lineJoin: 'round',
                className: corridor.dashed && animatedFlows ? 'animated-dash' : undefined,
              }}
            />
          );
        })}

        {/* Markers */}
        {visibleMarkers.map(marker => {
          const isSelected = marker.id === selectedMarkerId;
          const isEnergy = energyMode && marker.type !== 'Rail Hub';
          const radius = marker.size === 'lg' ? 8 : marker.size === 'md' ? 6 : 4;
          const statusColor = STATUS_DOT_COLORS[marker.status] || '#94a3b8';

          return (
            <CircleMarker
              key={marker.id}
              center={[marker.lat, marker.lng]}
              radius={isSelected ? radius + 3 : radius}
              pathOptions={{
                color: isSelected ? '#fff' : 'rgba(255,255,255,0.9)',
                weight: isSelected ? 2.5 : 1.5,
                fillColor: energyMode ? '#f97316' : riskMode && marker.status !== 'Operational' ? '#ef4444' : marker.color,
                fillOpacity: isEnergy ? 0.4 : isSelected ? 1 : 0.85,
                opacity: 1,
              }}
              eventHandlers={{
                click: (e) => {
                  L.DomEvent.stopPropagation(e);
                  onMarkerClick(marker);
                },
              }}
            >
              <Popup className="bri-popup" closeButton={false} maxWidth={220}>
                <div className="bri-popup-inner">
                  <div className="bri-popup-header">
                    <span className="bri-popup-dot" style={{ backgroundColor: marker.color }} />
                    <strong>{marker.name}</strong>
                    <span className="bri-popup-country">{marker.country}</span>
                  </div>
                  <div className="bri-popup-row">
                    <span>Type</span><span>{marker.type}</span>
                  </div>
                  <div className="bri-popup-row">
                    <span>Investment</span>
                    <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{marker.investment}</span>
                  </div>
                  <div className="bri-popup-row">
                    <span>Status</span>
                    <span style={{ color: statusColor }}>{marker.status}</span>
                  </div>
                  <div className="bri-popup-row" style={{ borderBottom: 'none' }}>
                    <span>Corridor</span>
                    <span style={{ color: marker.color }}>{marker.corridor}</span>
                  </div>
                  {showLabels && (
                    <div className="bri-popup-year">Added {marker.yearAdded}</div>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Map overlay text — top-left */}
      <div className="absolute top-4 left-4 z-[999] pointer-events-none max-w-[260px]">
        <p className="text-[13px] font-bold text-[#2d3748] leading-snug drop-shadow-sm">
          The Belt and Road Initiative, at a glance.
        </p>
        <p className="text-[10px] text-[#718096] mt-1 leading-relaxed">
          Six overland economic corridors and one maritime route link the Chinese mainland
          to Europe, Africa, and the Americas via real-time tracked infrastructure projects.
        </p>
      </div>

      {/* Mode overlay badges */}
      {(energyMode || riskMode) && (
        <div className="absolute top-4 right-4 z-[999] flex flex-col gap-1.5 pointer-events-none">
          {energyMode && (
            <div className="flex items-center gap-1.5 bg-yellow-500/20 border border-yellow-500/40 rounded-lg px-2.5 py-1.5 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
              <span className="text-[9px] font-bold text-yellow-400 tracking-widest">ENERGY OVERLAY ACTIVE</span>
            </div>
          )}
          {riskMode && (
            <div className="flex items-center gap-1.5 bg-red-500/20 border border-red-500/40 rounded-lg px-2.5 py-1.5 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              <span className="text-[9px] font-bold text-red-400 tracking-widest">RISK OVERLAY ACTIVE</span>
            </div>
          )}
        </div>
      )}

      {/* Custom Zoom Controls — top-right (per spec) */}
      <div className="absolute top-4 right-4 z-[999] flex flex-col items-center" style={{ marginTop: energyMode || riskMode ? '64px' : '0' }}>
        <button
          onClick={() => mapRef.current?.zoomIn()}
          className="w-7 h-7 bg-white/95 border border-gray-200 rounded-t-md flex items-center justify-center text-gray-600 hover:bg-white transition-colors shadow-sm text-base leading-none"
        >
          +
        </button>
        <div className="w-10 bg-white/95 border-x border-gray-200 text-center text-[9px] text-gray-500 py-1 font-mono leading-none tabular-nums">
          {zoomPercent}%
        </div>
        <button
          onClick={() => mapRef.current?.zoomOut()}
          className="w-7 h-7 bg-white/95 border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-white transition-colors shadow-sm text-base leading-none"
        >
          −
        </button>
        <button
          onClick={() => mapRef.current?.flyTo([28, 68], 4, { duration: 1.2 })}
          className="mt-0.5 w-7 h-7 bg-white/95 border border-gray-200 rounded-b-md flex items-center justify-center text-gray-500 hover:bg-white transition-colors shadow-sm text-sm"
          title="Reset view"
        >
          ↺
        </button>
      </div>

      {/* Active corridor count — bottom-left */}
      <div className="absolute bottom-4 left-4 z-[999] pointer-events-none">
        <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm border border-gray-200/80 rounded-lg px-2.5 py-1.5 shadow-sm">
          <span className="text-[9px] text-gray-400 font-medium">ACTIVE</span>
          <span className="text-[11px] font-bold text-gray-700">{activeCorridors.size}</span>
          <span className="text-[9px] text-gray-400 font-medium">/ 7 CORRIDORS</span>
          <span className="mx-1 text-gray-300">·</span>
          <span className="text-[9px] text-orange-500 font-mono font-bold">{selectedYear}</span>
        </div>
      </div>
    </div>
  );
}
