'use client';

import { useEffect } from 'react';
import { Polyline, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Route } from '@/types';

interface RouteLayerProps {
  routes: Route[];
  visibleTypes: Set<string>;
}

const STATUS_DASH: Record<string, string> = {
  operational: '',
  under_construction: '10, 8',
  planned: '4, 8',
};

// Animated flow dot that travels along a polyline path using SVG animateMotion
function AnimatedFlowDot({
  route,
  animDelay = 0,
}: {
  route: Route;
  animDelay?: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const points = route.waypoints.map((wp) => {
      const p = map.latLngToLayerPoint(L.latLng(wp[0], wp[1]));
      return p;
    });

    if (points.length < 2) return;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.cssText = 'position:absolute;overflow:visible;left:0;top:0;pointer-events:none;z-index:400;width:100%;height:100%';

    const dotColor = route.type === 'maritime' ? '#0369a1' : '#ea580c';
    const dur = route.type === 'maritime' ? 10 : 7;

    const buildPath = (pts: { x: number; y: number }[]) =>
      pts.map((p, i) => (i === 0 ? 'M ' + p.x + ' ' + p.y : 'L ' + p.x + ' ' + p.y)).join(' ');

    const pathId = 'fp-' + route.id + '-' + animDelay;
    const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathEl.setAttribute('id', pathId);
    pathEl.setAttribute('d', buildPath(points));
    pathEl.setAttribute('fill', 'none');
    pathEl.setAttribute('stroke', 'none');
    svg.appendChild(pathEl);

    const makeAnimDot = (r: number, opacity: number, begin: string) => {
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('r', String(r));
      c.setAttribute('fill', dotColor);
      c.setAttribute('opacity', String(opacity));
      const am = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion');
      am.setAttribute('dur', dur + 's');
      am.setAttribute('repeatCount', 'indefinite');
      am.setAttribute('begin', begin);
      am.setAttribute('calcMode', 'linear');
      const mp = document.createElementNS('http://www.w3.org/2000/svg', 'mpath');
      mp.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#' + pathId);
      am.appendChild(mp);
      c.appendChild(am);
      return c;
    };

    svg.appendChild(makeAnimDot(5, 0.9, animDelay + 's'));
    if (route.type === 'maritime') {
      svg.appendChild(makeAnimDot(3, 0.5, (animDelay + dur / 2) + 's'));
    }

    const pane = map.getPane('overlayPane');
    if (pane) pane.appendChild(svg);

    const updatePos = () => {
      const newPts = route.waypoints.map((wp) => {
        const p = map.latLngToLayerPoint(L.latLng(wp[0], wp[1]));
        return p;
      });
      pathEl.setAttribute('d', buildPath(newPts));
    };

    map.on('zoom move zoomend moveend', updatePos);
    return () => {
      map.off('zoom move zoomend moveend', updatePos);
      if (svg.parentNode) svg.parentNode.removeChild(svg);
    };
  }, [map, route, animDelay]);

  return null;
}

export default function RouteLayer({ routes, visibleTypes }: RouteLayerProps) {
  const visibleRoutes = routes.filter((r) => visibleTypes.has(r.type));

  return (
    <>
      {visibleRoutes.map((route) => (
        <Polyline
          key={route.id}
          positions={route.waypoints}
          pathOptions={{
            color: route.color,
            weight: route.type === 'maritime' ? 3 : 3.5,
            opacity: 0.75,
            dashArray: STATUS_DASH[route.status] || undefined,
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
                      ? '#16a34a'
                      : route.status === 'under_construction'
                      ? '#d97706'
                      : '#64748b',
                  textTransform: 'capitalize',
                }}
              >
                {route.status.replace('_', ' ')}
              </span>
            </div>
          </Tooltip>
        </Polyline>
      ))}
      {visibleRoutes
        .filter((r) => r.status === 'operational')
        .map((route, i) => (
          <AnimatedFlowDot key={'flow-' + route.id} route={route} animDelay={i * 1.5} />
        ))}
    </>
  );
  }
