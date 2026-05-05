'use client';

import { Polyline, Tooltip } from 'react-leaflet';
import { Route } from '@/types';

interface RouteLayerProps {
  routes: Route[];
  visibleTypes: Set<string>;
}

const STATUS_DASH: Record<string, string | undefined> = {
  operational: undefined,
  under_construction: '10, 8',
  planned: '4, 8',
};

export default function RouteLayer({ routes, visibleTypes }: RouteLayerProps) {
  return (
    <>
      {routes
        .filter(r => visibleTypes.has(r.type))
        .map(route => (
          <Polyline
            key={route.id}
            positions={route.waypoints}
            pathOptions={{
              color: route.color,
              weight: route.type === 'maritime' ? 3 : 3.5,
              opacity: 0.85,
              dashArray: STATUS_DASH[route.status],
              lineJoin: 'round',
              lineCap: 'round',
            }}
          >
            <Tooltip sticky>
              <div className="route-tooltip">
                <strong>{route.name}</strong>
                <br />
                <span style={{ textTransform: 'capitalize' }}>{route.type}</span>
                {' · '}
                {route.totalLength.toLocaleString()} {route.lengthUnit}
                <br />
                <span
                  style={{
                    color:
                      route.status === 'operational'
                        ? '#22c55e'
                        : route.status === 'under_construction'
                        ? '#f59e0b'
                        : '#94a3b8',
                    textTransform: 'capitalize',
                  }}
                >
                  {route.status.replace('_', ' ')}
                </span>
              </div>
            </Tooltip>
          </Polyline>
        ))}
    </>
  );
}
