'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { CORRIDORS } from '@/data/corridors';
import { MAP_MARKERS, MapMarker } from '@/data/mapMarkers';

// Fix Leaflet default icon in Next.js
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}

// Child component: tracks zoom and exposes map instance
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

  useMapEvents({
    zoomend: () => onZoomChange(map.getZoom()),
  });

  useEffect(() => {
    if (resetTrigger !== prevReset.current) {
      prevReset.current = resetTrigger;
      map.flyTo([25, 70], 4, { duration: 1.4 });
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

export default function BRIMap({
  activeCorridors,
  activeInfra,
  selectedYear,
  animatedFlows,
  showLabels,
  density,
  onMarkerClick,
  selectedMarkerId,
  resetTrigger,
  onZoomChange,
  onMapReady,
}: BRIMapProps) {
  const [zoom, setZoom] = useState(4);

  const handleZoomChange = useCallback((z: number) => {
    setZoom(z);
    onZoomChange(z);
  }, [onZoomChange]);

  const zoomPercent = zoom * 50 + 11;

  const mapRef = useRef<L.Map | null>(null);
  const handleMapReady = useCallback((map: L.Map) => {
    mapRef.current = map;
    onMapReady(map);
  }, [onMapReady]);

  // Filter markers by year and density
  const visibleMarkers = MAP_MARKERS.filter(m => {
    if (m.yearAdded > selectedYear) return false;
    if (density === 'major' && m.size === 'sm') return false;
    return true;
  });

  const infraTypeMap: Record<string, string[]> = {
    ports: ['Port'],
    rail: ['Rail Hub'],
    airports: ['Airport'],
    ind_zones: ['Industrial Zone'],
  };

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
        {CORRIDORS.filter(c => activeCorridors.has(c.id)).map(corridor => (
          <Polyline
            key={corridor.id}
            positions={corridor.coordinates}
            pathOptions={{
              color: corridor.color,
              weight: corridor.weight,
              opacity: 0.9,
              dashArray: corridor.dashed
                ? (animatedFlows ? '10 8' : '10 8')
                : undefined,
              lineCap: 'round',
              lineJoin: 'round',
            }}
            className={corridor.dashed && animatedFlows ? 'animated-dash' : ''}
          />
        ))}

        {/* Markers */}
        {visibleMarkers.map(marker => {
          // Check if corridor is active
          const corridorActive = activeCorridors.has(marker.corridorId);
          if (!corridorActive) return null;

          // Check infra type filter
          const markerTypes = Object.entries(infraTypeMap);
          let infraOk = true;
          const matchedInfra = markerTypes.find(([, types]) => types.includes(marker.type));
          if (matchedInfra && !activeInfra.has(matchedInfra[0])) {
            infraOk = false;
          }
          if (!infraOk) return null;

          const isSelected = marker.id === selectedMarkerId;
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
                fillColor: marker.color,
                fillOpacity: isSelected ? 1 : 0.85,
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
                    <span>Type</span>
                    <span>{marker.type}</span>
                  </div>
                  <div className="bri-popup-row">
                    <span>Investment</span>
                    <span className="font-semibold text-white">{marker.investment}</span>
                  </div>
                  <div className="bri-popup-row">
                    <span>Status</span>
                    <span style={{ color: statusColor }}>{marker.status}</span>
                  </div>
                  <div className="bri-popup-row border-0">
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

      {/* Overlay text — top-left of map */}
      <div className="absolute top-4 left-4 z-[999] pointer-events-none max-w-[260px]">
        <p className="text-[13px] font-bold text-[#2d3748] leading-snug drop-shadow-sm">
          The Belt and Road Initiative, at a glance.
        </p>
        <p className="text-[10px] text-[#718096] mt-1 leading-relaxed">
          Six overland economic corridors and one maritime route link the Chinese mainland to Europe, Africa, and the Americas via real-time tracked infrastructure projects.
        </p>
      </div>

      {/* Custom Zoom Controls — bottom-right */}
      <div className="absolute bottom-4 right-3 z-[999] flex flex-col items-center gap-1">
        <button
          onClick={() => mapRef.current?.zoomIn()}
          className="w-7 h-7 bg-white border border-gray-200 rounded-t-md flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors shadow-sm text-lg leading-none font-light"
        >
          +
        </button>
        <div className="w-12 bg-white border-x border-gray-200 text-center text-[9px] text-gray-500 py-1 font-mono leading-none">
          {zoomPercent}%
        </div>
        <button
          onClick={() => mapRef.current?.zoomOut()}
          className="w-7 h-7 bg-white border border-gray-200 rounded-b-md flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors shadow-sm text-lg leading-none font-light"
        >
          −
        </button>
        <button
          onClick={() => mapRef.current?.flyTo([28, 68], 4, { duration: 1.2 })}
          className="mt-0.5 w-7 h-7 bg-white border border-gray-200 rounded-md flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors shadow-sm text-xs"
          title="Reset view"
        >
          ⊙
        </button>
      </div>

      {/* Corridor count badge — bottom-left of map */}
      <div className="absolute bottom-4 left-4 z-[999] pointer-events-none">
        <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-2.5 py-1.5 shadow-sm">
          <span className="text-[9px] text-gray-400 font-medium">ACTIVE</span>
          <span className="text-[11px] font-bold text-gray-700">{activeCorridors.size}</span>
          <span className="text-[9px] text-gray-400 font-medium">/ 7 CORRIDORS</span>
        </div>
      </div>
    </div>
  );
}
