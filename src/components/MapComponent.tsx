'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, ZoomControl } from 'react-leaflet';
import L from 'leaflet';

import RouteLayer from './RouteLayer';
import { getIcon } from '@/lib/mapIcons';
import { MapFeature, Route, LayerVisibility } from '@/types';

// Fix Leaflet default icon paths in Next.js
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapComponentProps {
    features: MapFeature[];
    routes: Route[];
    layers: LayerVisibility;
    onFeatureClick: (feature: MapFeature) => void;
    selectedFeature: MapFeature | null;
}

const VISIBLE_ROUTE_TYPES = (layers: LayerVisibility): Set<string> => {
    const s = new Set<string>();
    if (layers.maritime) s.add('maritime');
    if (layers.land) s.add('land');
    return s;
};

export default function MapComponent({
    features,
    routes,
    layers,
    onFeatureClick,
    selectedFeature,
}: MapComponentProps) {
    const mapRef = useRef<L.Map | null>(null);

  const visibleFeatures = features.filter((f) => {
        if (f.type === 'port' && !layers.ports) return false;
        if (f.type === 'airport' && !layers.airports) return false;
        if (f.type === 'city' && !layers.cities) return false;
        return true;
  });

  useEffect(() => {
        if (selectedFeature && mapRef.current) {
                mapRef.current.flyTo([selectedFeature.lat, selectedFeature.lng], 6, {
                          duration: 1.2,
                });
        }
  }, [selectedFeature]);

  return (
        <MapContainer
                center={[20, 70]}
                zoom={3}
                minZoom={2}
                maxZoom={12}
                className="h-full w-full"
                zoomControl={false}
                ref={mapRef}
                worldCopyJump={true}
              >
              <ZoomControl position="bottomright" />

          {/* Light beige/cream tile layer */}
                <TileLayer
                          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>a> &copy; <a href="https://carto.com/attributions">CARTO</a>a>'
                  maxZoom={19}
                        />
        
              <RouteLayer routes={routes} visibleTypes={VISIBLE_ROUTE_TYPES(layers)} />
        
          {visibleFeatures.map((feature) => {
                        const isSelected = selectedFeature?.id === feature.id;
                        const icon = getIcon(feature.type);
                        return (
                                    <Marker
                                                  key={feature.id}
                                                  position={[feature.lat, feature.lng]}
                                                  icon={icon}
                                                  zIndexOffset={isSelected ? 1000 : 0}
                                                  eventHandlers={{
                                                                  click: () => onFeatureClick(feature),
                                                  }}
                                                >
                                                <Tooltip direction="top" offset={[0, -12]} opacity={0.9}>
                                                              <span className="font-semibold">{feature.name}</span>span>
                                                              <br />
                                                              <span className="text-xs text-gray-500">{feature.country}</span>span>
                                                </Tooltip>Tooltip>
                                    </Marker>Marker>
                                  );
              })}
        </MapContainer>MapContainer>
      );
}</a>
